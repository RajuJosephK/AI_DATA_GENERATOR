import os
import json
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

API_KEY = os.getenv("API_KEY")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY
)

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt")
    output_format = data.get("output_format", "text")

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "Return clean structured data only."},
                {"role": "user", "content": prompt}
            ]
        )

        content = response.choices[0].message.content

        # Format response
        if output_format == "json":
            return jsonify({"result": content})

        elif output_format == "text":
            return jsonify({"result": content})

        elif output_format == "csv":
            return jsonify({"result": content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
