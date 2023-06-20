// Importing necessary modules from their respective locations
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'; // For splitting text into smaller chunks
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'; // For creating document embeddings using OpenAI
import { PineconeStore } from 'langchain/vectorstores/pinecone'; // For storing document vectors in Pinecone
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'; // For loading PDF documents
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'; // For loading documents from a directory
import { DocxLoader } from 'langchain/document_loaders/fs/docx'; // For loading DOCX documents
import { TextLoader } from 'langchain/document_loaders/fs/text'; // For loading text documents
import { NextApiRequest, NextApiResponse } from 'next'; // Next.js API route support
import fs from 'fs'; // Node.js file system module
import { initPinecone } from '@/utils/pinecone-client'; // Function to initialize Pinecone client

// Determine the file path depending on the environment
const filePath = process.env.NODE_ENV === 'production' ? '/tmp' : 'tmp'; // Path for storing files

// Define the async function to handle the request and response of the Next.js API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Extract API keys and other necessary headers from the request
  const openAIapiKey = req.headers['x-openai-key'];
  const pineconeApiKey = req.headers['x-pinecone-key'];
  const targetIndex = req.headers['x-index-name'] as string;
  const pineconeEnvironment = req.headers['x-environment'];

  // Initialize the Pinecone client
  const pinecone = await initPinecone(
    pineconeApiKey as string,
    pineconeEnvironment as string,
  );

  // Extract necessary parameters from the query string of the request
  const { namespaceName, chunkSize, overlapSize } = req.query;

  try {
    // Initialize a new DirectoryLoader with handlers for PDF, DOCX, and TXT files
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
      '.docx': (path) => new DocxLoader(path),
      '.txt': (path) => new TextLoader(path),
    });

    // Load documents using the DirectoryLoader
    const rawDocs = await directoryLoader.load();

    // Initialize a new RecursiveCharacterTextSplitter with given parameters
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: Number(chunkSize),
      chunkOverlap: Number(overlapSize),
    });

    // Split documents into smaller chunks
    const docs = await textSplitter.splitDocuments(rawDocs);

    // Initialize a new OpenAIEmbeddings with the OpenAI API key
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAIapiKey as string,
    });

    // Get the Pinecone index with the given name
    const index = pinecone.Index(targetIndex);

    // Store the document chunks in Pinecone with their embeddings
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespaceName as string,
      textKey: 'text',
    });

    // Read the file directory and filter out PDF, DOCX, and TXT files
    const filesToDelete = fs
      .readdirSync(filePath)
      .filter(
        (file) =>
          file.endsWith('.pdf') ||
          file.endsWith('.docx') ||
          file.endsWith('.txt'),
      );

    // Delete the PDF, DOCX and TXT files
    filesToDelete.forEach((file) => {
      fs.unlinkSync(`${filePath}/${file}`);
    });

    // Send a successful response with a message
    res.status(200).json({ message: 'Data ingestion complete' });
  } catch (error) {
    // Log the error and send a failure response if something goes wrong
    console.log('error', error);
    res.status(500).json({ error: 'Failed to ingest your data' });
  }
}
