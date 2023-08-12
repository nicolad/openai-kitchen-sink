import os
import logging
from flask import Flask, request, jsonify
from subprocess import run, PIPE
from langchain.document_loaders import GitLoader
from embed import process_and_embed
from question import ask_question

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)  # Set the logging level to INFO
logger = logging.getLogger(__name__)


@app.route("/api/python", methods=["POST"])
def process_data():
    if request.method == "POST":
        data = request.json.get(
            "data"
        )  # Assuming the request body contains a JSON object with the "data" key

        # Log the incoming request and data
        logger.info("Received a POST request to /api/python")
        logger.info("Request data: %s", data)

        GitLoader(
            clone_url=data,
            repo_path="./temp_repo",
            branch="main",
        )

        # Log the successful completion of loading documents
        logger.info("Documents loaded successfully.")

        process_and_embed()

        return (
            jsonify({"message": "Documents loaded and embedded successfully."}),
            200,
        )


@app.route("/api/question", methods=["GET"])  # Use GET method for questions
def ask_questions():
    question = request.args.get("question")  # Access question from query parameters

    response = ask_question(question)

    return jsonify({"response": response}), 200


if __name__ == "__main__":
    app.run()
