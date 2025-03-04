from flask import Blueprint, request, jsonify
import ast

# Create a Blueprint for the code parser
code_parser_bp = Blueprint("code_parser", __name__, url_prefix="/api")


# --------------------------------------------------- #
# constants
# --------------------------------------------------- #

BASE_STATE_CLASSNAME = "BaseState"


# --------------------------------------------------- #
# routes
# --------------------------------------------------- #


@code_parser_bp.route("/code-parser", methods=["POST"])
def code_parser():

    data = request.get_json()
    language = data.get("language")
    code = data.get("code")

    print(code)
    print(language)
    print(data)

    if not language or not code:
        return jsonify({"error": "Missing language or code parameter"}), 400

    if language.lower() == "python":
        try:
            tree = ast.parse(code)

            # Find the BaseState class
            base_class_node = None
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef) and node.name == BASE_STATE_CLASSNAME:
                    base_class_node = node
                    break

            if not base_class_node:
                return jsonify({"error": "BaseState class not found in module"}), 400

            # Find the __init__ method in the BaseState class
            init_func = None
            for item in base_class_node.body:
                if isinstance(item, ast.FunctionDef) and item.name == "__init__":
                    init_func = item
                    break

            if not init_func:
                return (
                    jsonify({"error": "__init__ method not found in BaseState class"}),
                    400,
                )

            # Extract only instance variable definitions in __init__
            variables = []
            for node in ast.walk(init_func):
                if isinstance(node, ast.Assign):
                    # Handle each assignment target
                    for target in node.targets:
                        # Check if the target is of the form self.<var>
                        if (
                            isinstance(target, ast.Attribute)
                            and isinstance(target.value, ast.Name)
                            and target.value.id == "self"
                        ):
                            varname = target.attr
                            try:
                                varvalue = ast.unparse(node.value)
                            except AttributeError:
                                # Fallback for Python versions < 3.9
                                import astor

                                varvalue = astor.to_source(node.value).strip()
                            variables.append({"name": varname, "value": varvalue})

            print("Extracted variables:", variables)
            return jsonify({"variables": variables}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 400
    else:
        return jsonify({"error": "Unsupported language"}), 400
