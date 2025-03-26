import os
from flask import Blueprint, request, jsonify

import pydantic

import ollama
from llm import gemini


code_generator_bp = Blueprint("code_generator", __name__, url_prefix="/api")

# --------------------------------------------------- #
# constants
# --------------------------------------------------- #

class BaseResultFormat(pydantic.BaseModel):
    statename: str
    code: str
    language: str


# --------------------------------------------------- #
# routes
# --------------------------------------------------- #

@code_generator_bp.route("/code-generator", methods=["POST"])
def code_generator():
    data = request.get_json()
    current_node_code = data.get("currentNodeCode")
    current_node_name = data.get("currentNodeName")
    user_prompt = data.get("userPrompt")
    language = data.get("language")
    model = data.get("model", "ollama")

    # check for valid paramters
    if not current_node_code:
        return jsonify({"error": "Missing currentNodeCode parameter"}), 400
    elif not current_node_name:
        return jsonify({"error": "Missing currentNodeName parameter"}), 400
    elif not user_prompt:
        return jsonify({"error": "Missing userPrompt parameter"}), 400
    elif not language:
        return jsonify({"error": "Missing language parameter"}), 400

    prompt = f"""
You're a professional coding wizard who is amazing at creating statemachines.

Currently, the user is writing code in: {language}
The current node is: {current_node_name}

The user has written the following code:
{current_node_code}

The user has prompted the following:
{user_prompt}

Your reasoning process should not mention any similar strings at all.
Your response should include the modified code block that the user has written such that the user can simply copy and paste your response back into their editor and have it function as normal.

VERY IMPORATNT: your entire response should consist of the following format:
```{language}
code
```
    """

    print(prompt)

    if model == "gemini":
        # send prompt to gemini
        gemini_client = gemini.Gemini()
        response = gemini_client.query(query=prompt, files=[], model=gemini.GEMINI_MODEL)

        split = response.text.split("\n")
        while split[0] == "" or split[0].startswith("```"):
            split.pop(0)
        split = split[:-1]

        print(split)
        final_result = "\n".join(split)
    elif model == "ollama":
        # send prompt to ollama
        response = ollama.chat(
            model="deepseek-coder-v2:16b",
            format=BaseResultFormat.model_json_schema(),
            messages=[
                {"role": "user", "content": prompt},
            ]
        )
        response = BaseResultFormat.model_validate_json(response.message.content)
        final_result = response.code

    
    print(final_result)

    

    return jsonify({"response": final_result}), 200

