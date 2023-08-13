from flask import Flask, request, jsonify
from langchain.document_loaders import YoutubeLoader

from langchain.chat_models import ChatOpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains.mapreduce import MapReduceDocumentsChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.prompts import PromptTemplate
from langchain.chains import StuffDocumentsChain, LLMChain, ReduceDocumentsChain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

llm = ChatOpenAI(temperature=0)

# Map
map_template = """The following is a set of documents
{docs}
Based on this list of docs, please identify the main themes 
Helpful Answer:"""
map_prompt = PromptTemplate.from_template(map_template)
map_chain = LLMChain(llm=llm, prompt=map_prompt)

# Reduce
reduce_template = """The following is set of summaries:
{doc_summaries}
Take these and distill it into a final, consolidated summary of the main themes. 
Helpful Answer:"""
reduce_prompt = PromptTemplate.from_template(reduce_template)
reduce_chain = LLMChain(llm=llm, prompt=reduce_prompt)

# Combine documents chain
combine_documents_chain = StuffDocumentsChain(
    llm_chain=reduce_chain, document_variable_name="doc_summaries"
)

# Reduce documents chain
reduce_documents_chain = ReduceDocumentsChain(
    combine_documents_chain=combine_documents_chain,
    collapse_documents_chain=combine_documents_chain,
    token_max=4000,
)

# Map-Reduce documents chain
map_reduce_chain = MapReduceDocumentsChain(
    llm_chain=map_chain,
    reduce_documents_chain=reduce_documents_chain,
    document_variable_name="docs",
    return_intermediate_steps=False,
)

text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=1000, chunk_overlap=0
)


def get_transcript(video_url):
    logger.info(f"Loading video from URL: {video_url}")
    loader = YoutubeLoader.from_youtube_url(video_url, add_video_info=True)
    documents = loader.load()
    logger.info(f"Documents loaded: {documents}")

    # Assuming that the documents list contains a single Document object
    document = documents[0]

    split_docs = text_splitter.split_documents([document])

    # Process documents using map-reduce chain
    summary = map_reduce_chain.run(split_docs)

    logger.info(f"Summary obtained: {summary}")

    # Create a dictionary containing the necessary information from the Document object
    transcript = {
        "summary": summary,
        "page_content": document.page_content,
        "source": document.metadata["source"],
        "title": document.metadata["title"],
        "view_count": document.metadata["view_count"],
        "thumbnail_url": document.metadata["thumbnail_url"]
        if document.metadata["publish_date"]
        else None,
        "length": document.metadata["length"],
        "author": document.metadata["author"],
    }

    return transcript


@app.route("/api/transcript", methods=["POST"])
def retrieve_transcript():
    video_url = request.json.get("video_url")
    logger.info(f"Received video URL: {video_url}")

    if not video_url:
        return jsonify({"error": "Video URL is required"}), 400

    try:
        transcript = get_transcript(video_url)
        return jsonify(transcript), 200

    except Exception as e:
        error_message = str(e)
        if "This model's maximum context length is 4097 tokens." in error_message:
            error_message = (
                "Error processing video URL: This model's maximum context length is 4097 tokens. "
                "Please reduce the length of the messages."
            )
        logger.error(f"Error processing video URL {video_url}: {error_message}")
        return jsonify({"error": error_message}), 500


if __name__ == "__main__":
    app.run()
