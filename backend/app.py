from flask import Flask

from api import code_parser_bp


# --------------------------------------------------- #


app = Flask(__name__)

# --------------------------------------------------- #
# register blueprints
# --------------------------------------------------- #

app.register_blueprint(code_parser_bp.code_parser_bp)


# --------------------------------------------------- #
# routes
# --------------------------------------------------- #


@app.route("/")
def home():
    return "Hello, World!\nThis is the backend server!\nYou can't do anything here lol idk why you're here. No offfense of course."


# --------------------------------------------------- #
# start server
# --------------------------------------------------- #

if __name__ == "__main__":
    app.run(debug=True)
