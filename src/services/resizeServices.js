import sharp from 'sharp'

import fs from 'fs/promises'

import path from "path";

// these three libraries or packages are the core of file processing 
// sharp is specially used for image processing

export const resizeImage = async(inputPath) => {
    const resizedDir = path.resolve(process.cwd(), "processed", "resized");

    await fs.mkdir(resizedDir, { recursive: true });

    const fileName = path.basename(inputPath);

    const outputPath = path.join(resizedDir, fileName);

    await sharp(inputPath)
        .resize({
            width: 1024,
            withoutEnlargement: true
        })
        .toFile(outputPath); // final path of the file

    const relativePath = `resized/${fileName}`;
    const imageUrl = `http://localhost:3000/processed/${relativePath}`;
    const downloadUrl = `http://localhost:3000/api/download?path=${encodeURIComponent(relativePath)}`;

    return { outputPath, imageUrl, downloadUrl, fileName };
}

