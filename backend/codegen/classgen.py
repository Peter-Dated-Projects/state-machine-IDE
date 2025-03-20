import re
import ast
import dataclasses
import typing

from ollama import chat
from ollama import ChatResponse
from typing import List, Tuple, Any

# --------------------------------------------------- #
# constants
# --------------------------------------------------- #

MODEL = "deepseek-r1:1.5B"
PARENT_CLASS_SIGNAL_LINE = "__!!__parent_class_super__!!__"

# --------------------------------------------------- #
# class definition objects
# --------------------------------------------------- #


@dataclasses.dataclass
class Variable:
    _name: str
    _type: str
    _default_value: str


@dataclasses.dataclass
class Function:
    _name: str
    _return_type: str
    _parameters: List[Variable]
    _body: str = None

    def __init__(self, name, return_type, parameters, body=None):
        self._name = name
        self._return_type = return_type
        self._parameters = parameters
        self._body = body

        if not body:
            self._body = "\t\t# TODO -- edit function body\n\t\tpass\n"

    def generate_code(self):
        if self._name == "__init__":
            return self.generate_init_function_code()

        # isn't init function!
        _body = "\n"
        _input_params = ", ".join(
            f"{variable._name}: {variable._type} = {variable._default_value}"
            for variable in self._parameters
        )
        _body += f"\t def {self._name}({_input_params}) -> {self._return_type}:\n"
        _body += self._body
        # return
        return _body

    def generate_init_function_code(self) -> str:
        _body = "\n"
        _init_args = ", ".join(
            [
                f"{variable._name}: {variable._type} = {variable._default_value}"
                for variable in self._parameters
            ]
        )
        _body += f"\tdef __init__(self, {_init_args}):\n"
        _body += f"\t\t{PARENT_CLASS_SIGNAL_LINE}\n"
        # add warnings
        _body += "\t\t# TODO -- edit super (if existent) and variables\n"

        # add variables
        for variable in self._parameters:
            # add a `_` before the variable name and set to default variable value
            _body += f"\t\tself._{variable._name} = {variable._name}\n"
        _body += "\t\n"

        return _body


class BasicClassSkeleton:

    def __init__(
        self,
        name: str,
        variables: list,
        functions: list,
        parent_class: "BasicClassSkeleton" = None,
    ):
        self._name = name
        self._variables = variables
        self._functions = functions
        self._parent_class = parent_class

    # --------------------------------------------------- #
    # logic
    # --------------------------------------------------- #

    def generate_instance_creation_command(self, **kwargs):
        _code = f"{self._name}({self.generate_instance_args(**kwargs)})"
        return _code

    def generate_instance_args(self, **kwargs):
        _args = ", ".join(f"{var} = {val}" for var, val in kwargs.items())
        return _args

    def generate_code(self) -> str:
        _body = "\n"
        _parent_class_def = (
            f"({self._parent_class._name})" if self._parent_class else ""
        )
        _body += f"class {self._name}{_parent_class_def}:\n"

        # add other functions
        for function in self._functions:
            _code = function.generate_code()
            if function._name == "__init__":
                if not self._parent_class:
                    _code = re.sub(f"\n\s*{PARENT_CLASS_SIGNAL_LINE}\n", "\n", _code)
                else:
                    # inject some code
                    __kwargs = {}
                    for variable in self._parent_class._variables:
                        __kwargs[variable._name] = variable._default_value
                    _parent_args = self._parent_class.generate_instance_args(**__kwargs)
                    _code = re.sub(
                        PARENT_CLASS_SIGNAL_LINE,
                        f"super().__init__({_parent_args})",
                        _code,
                    )
            # add to body
            _body += _code
        # replace all \t with 4 spaces
        _body = re.sub(r"\t", "    ", _body)
        return _body

    # --------------------------------------------------- #
    # getters + setters
    # --------------------------------------------------- #

    def add_function(self, function: Function):
        self._functions.append(function)

    def add_variable(self, variable: Variable):
        self._variables.append(variable)

    def set_parent_class(self, parent_class: str):
        self._parent_class = parent_class


# --------------------------------------------------- #
# parsing
# --------------------------------------------------- #

# --------------------------------------------------- #
# CodeParser implementation
# --------------------------------------------------- #


class CodeParser:
    """
    CodeParser is designed to analyze a Python source string that contains one or more class definitions.
    It uses Python’s ast module to extract class names, parent classes (if any), functions, and class variables.

    The parsing is done in two phases:
      1. The first pass walks through the AST to create BasicClassSkeleton instances for each class,
         extracting function definitions (with their parameters, return types, and bodies) and class variables.
      2. The second pass links classes that extend other classes (if the parent is defined in the same source).

    The result is a list of BasicClassSkeleton objects that fully capture the structure of the classes in the source.
    """

    @classmethod
    def parse(cls, source: str) -> List[BasicClassSkeleton]:
        """
        Parse the provided source string (which contains one or more Python class definitions)
        and return a list of BasicClassSkeleton objects representing these classes.

        :param source: Python source code containing one or more class definitions.
        :return: List of BasicClassSkeleton objects.
        """
        # Parse the source code into an AST
        module = ast.parse(source)

        # Temporary dictionary to hold class skeletons keyed by class name.
        classes_dict = {}
        # Map class name to a list of parent class names (as strings) for later linking.
        inheritance_map = {}

        # Walk through the top-level nodes in the module.
        for node in module.body:
            if isinstance(node, ast.ClassDef):
                class_name = node.name
                variables: List[Variable] = []
                functions: List[Function] = []
                bases: List[str] = []

                # Extract parent classes (if any) from the bases list.
                for base in node.bases:
                    # Try to get the base class name from the AST node.
                    if isinstance(base, ast.Name):
                        bases.append(base.id)
                    else:
                        try:
                            # For more complex base expressions, unparse the AST node.
                            bases.append(ast.unparse(base))
                        except Exception:
                            pass
                inheritance_map[class_name] = bases

                # Process the body of the class to extract functions and variables.
                for item in node.body:
                    # -------------------------- #
                    # Function definitions
                    # -------------------------- #
                    if isinstance(item, ast.FunctionDef):
                        func_name = item.name

                        # Process function parameters: skip the first parameter if it is 'self'.
                        parameters: List[Variable] = []
                        args = item.args.args
                        num_args = len(args)
                        num_defaults = len(item.args.defaults)
                        # Calculate the starting index for parameters with default values.
                        default_start = num_args - num_defaults

                        for idx, arg in enumerate(args):
                            # Skip the 'self' parameter
                            if idx == 0 and arg.arg == "self":
                                continue

                            param_name = arg.arg
                            # Extract the type annotation if available; otherwise default to "Any"
                            if arg.annotation:
                                try:
                                    param_type = ast.unparse(arg.annotation)
                                except Exception:
                                    param_type = "Any"
                            else:
                                param_type = "Any"

                            # Determine the default value if one exists.
                            if idx >= default_start:
                                default_expr = item.args.defaults[idx - default_start]
                                try:
                                    default_value = ast.unparse(default_expr)
                                except Exception:
                                    default_value = "None"
                            else:
                                default_value = "None"

                            # Create a Variable object for this parameter.
                            parameters.append(
                                Variable(param_name, param_type, default_value)
                            )

                        # Process function return type.
                        if item.returns:
                            try:
                                return_type = ast.unparse(item.returns)
                            except Exception:
                                return_type = "Any"
                        else:
                            return_type = "Any"

                        # -------------------------- #
                        # Extract function body
                        # -------------------------- #
                        # We reconstruct the body by unparsing each statement and reindenting it with two tab stops.
                        body_lines = []
                        for stmt in item.body:
                            try:
                                stmt_code = ast.unparse(stmt)
                            except Exception:
                                stmt_code = ""
                            # Reindent each line in the statement.
                            indented_code = "\n".join(
                                "\t\t" + line for line in stmt_code.splitlines()
                            )
                            body_lines.append(indented_code)
                        body_code = "\n".join(body_lines)
                        # If no body is found, let the Function class supply its default.
                        if not body_code.strip():
                            body_code = None

                        # Create a Function object and add it to the list.
                        function_obj = Function(
                            func_name, return_type, parameters, body_code
                        )
                        functions.append(function_obj)

                    # -------------------------- #
                    # Class variable assignments
                    # -------------------------- #
                    elif isinstance(item, ast.Assign):
                        # Process each target in an assignment (e.g., x = 10, y = 20)
                        for target in item.targets:
                            if isinstance(target, ast.Name):
                                var_name = target.id
                                var_type = "Any"  # No type annotation available here.
                                try:
                                    default_value = ast.unparse(item.value)
                                except Exception:
                                    default_value = "None"
                                variable_obj = Variable(
                                    var_name, var_type, default_value
                                )
                                variables.append(variable_obj)
                    elif isinstance(item, ast.AnnAssign):
                        # Process annotated assignments (e.g., x: int = 10)
                        if isinstance(item.target, ast.Name):
                            var_name = item.target.id
                            if item.annotation:
                                try:
                                    var_type = ast.unparse(item.annotation)
                                except Exception:
                                    var_type = "Any"
                            else:
                                var_type = "Any"
                            if item.value:
                                try:
                                    default_value = ast.unparse(item.value)
                                except Exception:
                                    default_value = "None"
                            else:
                                default_value = "None"
                            variable_obj = Variable(var_name, var_type, default_value)
                            variables.append(variable_obj)

                # Create a BasicClassSkeleton for this class with the extracted variables and functions.
                skeleton = BasicClassSkeleton(class_name, variables, functions)
                classes_dict[class_name] = skeleton

        # --------------------------------------------------- #
        # Second pass: Link parent classes if defined in the same source.
        # --------------------------------------------------- #
        for class_name, bases in inheritance_map.items():
            # If any base class is present in our dictionary, set the parent class (choose the first match).
            for base_name in bases:
                if base_name in classes_dict:
                    classes_dict[class_name]._parent_class = classes_dict[base_name]
                    break  # Only one parent is set per BasicClassSkeleton

        # Return the list of class skeletons.
        return list(classes_dict.values())
