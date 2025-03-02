from flask import Flask
from flask_cors import CORS

from api import code_parser_bp


# --------------------------------------------------- #
cors_config = {
    "origins": "*",
    # "origins": ["http://localhost:3000"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allow_headers": ["Content-Type",],# "Authorization"],
    "support_credentials": True,
}

app = Flask(__name__)
CORS(app, resources={r"/api/*": cors_config})

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
