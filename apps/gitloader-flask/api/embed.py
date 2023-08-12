def process_and_embed():
    import os
    import logging
    from dotenv import load_dotenv
    from supabase.client import Client, create_client
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.text_splitter import CharacterTextSplitter
    from langchain.vectorstores import SupabaseVectorStore
    from langchain.document_loaders import TextLoader

    # Load environment variables from the .env file in the parent directory
    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(dotenv_path)

    # Configure logger
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    try:
        logger.info("Starting document loading...")

        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

        logger.info("SUPABASE_URL: %s", supabase_url)
        logger.info("SUPABASE_SERVICE_KEY: %s", supabase_key)

        supabase: Client = create_client(supabase_url, supabase_key)

        exclude_dir = [".git", "node_modules", "public", "assets"]
        exclude_files = ["package-lock.json", ".DS_Store"]
        exclude_extensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".bmp",
            ".tiff",
            ".ico",
            ".svg",
            ".webp",
            ".mp3",
            ".wav",
        ]

        documents = []

        for dirpath, dirnames, filenames in os.walk("temp_repo"):
            dirnames[:] = [d for d in dirnames if d not in exclude_dir]

            for file in filenames:
                _, file_extension = os.path.splitext(file)

                if (
                    file not in exclude_files
                    and file_extension not in exclude_extensions
                ):
                    file_path = os.path.join(dirpath, file)
                    logger.info("Loading document: %s", file_path)
                    loader = TextLoader(file_path, encoding="ISO-8859-1")
                    documents.extend(loader.load())

        logger.info("Total documents loaded: %d", len(documents))

        logger.info("Splitting and cleaning text...")
        text_splitter = CharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
        docs = text_splitter.split_documents(documents)

        logger.info("Total document chunks: %d", len(docs))

        for doc in docs:
            source = doc.metadata["source"]
            cleaned_source = "/".join(source.split("/")[1:])
            doc.page_content = (
                "FILE NAME: "
                + cleaned_source
                + "\n###\n"
                + doc.page_content.replace("\u0000", "")
            )

        logger.info("Text splitting and cleaning done.")

        logger.info("Embedding vectors...")
        embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get("OPENAI_API_KEY"))
        vector_store = SupabaseVectorStore.from_documents(
            docs,
            embeddings,
            client=supabase,
            table_name=os.environ.get("TABLE_NAME"),
            content_column_name="actual_content_column_name",
        )

        logger.info("Vector embedding and storage complete.")

    except Exception as e:
        # Log the error details
        logger.error(
            "An unexpected error occurred in process_and_embed:", exc_info=True
        )
        logger.error(str(e))
