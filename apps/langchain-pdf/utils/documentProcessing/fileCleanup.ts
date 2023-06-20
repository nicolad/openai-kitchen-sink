import fs from 'fs';
import path from 'path';

export const fileCleanup = (filePath: string) => {
  const filesToDelete = fs
    .readdirSync(filePath)
    .filter(
      (file) =>
        file.endsWith('.pdf') ||
        file.endsWith('.docx') ||
        file.endsWith('.txt'),
    );

  for (const file of filesToDelete) {
    fs.unlinkSync(path.join(filePath, file));
  }
};
