from codegen import classgen


parent_class = classgen.BasicClassSkeleton(
    "Object",
    [classgen.Variable("name", "str", r'""')],
    [classgen.Function("__init__", "str", [classgen.Variable("name", "str", r'""')])],
)


# define variables
_v_name = classgen.Variable("name", "str", r'""')

# define functions
_f_init = classgen.Function("__init__", "str", [_v_name])
_f_update = classgen.Function("update", "None", [])

# create class skeleton
_class = classgen.BasicClassSkeleton(
    "Person", [_v_name], [_f_init, _f_update], parent_class
)

# generate code
print(_class.generate_code())


sample_source = """
class Animal:
    species = "Unknown"

    def __init__(self, name: str = "NoName", age: int = 0):
        self.name = name
        self.age = age

    def speak(self) -> str:
        return "..."

class Dog(Animal):
    breed = "Mixed"

    def __init__(self, name: str = "Doggo", age: int = 0, breed: str = "Mixed"):
        super().__init__(name, age)
        self.breed = breed

    def speak(self) -> str:
        return "Woof!"
"""

skeletons = classgen.CodeParser.parse(sample_source)
for sk in skeletons:
    print("Class:", sk._name)
    if sk._parent_class:
        print("  Inherits from:", sk._parent_class._name)
    print("  Variables:")
    for var in sk._variables:
        print(f"    {var._name}: {var._type} = {var._default_value}")
    print("  Functions:")
    for func in sk._functions:
        print(
            f"    {func._name}({', '.join(p._name for p in func._parameters)}) -> {func._return_type}"
        )
    print("\nGenerated Code:")
    print(sk.generate_code())
    print("=" * 40)
