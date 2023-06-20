import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';

// Determine the file path depending on the environment
const filePath = process.env.NODE_ENV === 'production' ? '/tmp' : 'tmp';

export class DocumentLoader {
  constructor(private path: string = filePath) {}

  async loadDocuments() {
    try {
      // Initialize a new DirectoryLoader with handlers for PDF, DOCX, and TXT files
      const directoryLoader = new DirectoryLoader(this.path, {
        '.pdf': (path: string) => new PDFLoader(path),
        '.docx': (path: string) => new DocxLoader(path),
        '.txt': (path: string) => new TextLoader(path),
      });

      // Load documents using the DirectoryLoader
      const rawDocs = await directoryLoader.load();

      return rawDocs;
    } catch (error) {
      console.log('Failed to load documents: ', error);
      throw error;
    }
  }
}
