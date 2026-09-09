import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export const compressImage = async (inputPath) => {
    const compressedDir = path.resolve(process.cwd(), "processed", "compressed");

    // Create the output directory if it doesn't exist
    await fs.mkdir(compressedDir, { recursive: true });

    // Get the original filename
    const fileName = path.basename(inputPath);

    // Create the output path
    const outputPath = path.join(compressedDir, fileName);

    // Compress the image
    const ext = path.extname(fileName).toLowerCase();
    const sharpInstance = sharp(inputPath);

    if (ext === '.png') {
        await sharpInstance.png({ quality: 80, compressionLevel: 8 }).toFile(outputPath);
    } else if (ext === '.webp') {
        await sharpInstance.webp({ quality: 80 }).toFile(outputPath);
    } else if (ext === '.avif') {
        await sharpInstance.avif({ quality: 80 }).toFile(outputPath);
    } else {
        await sharpInstance.jpeg({ quality: 80 }).toFile(outputPath);
    }

    const relativePath = `compressed/${fileName}`;
    const imageUrl = `http://localhost:3000/processed/${relativePath}`;
    const downloadUrl = `http://localhost:3000/api/download?path=${encodeURIComponent(relativePath)}`;

    return { outputPath, imageUrl, downloadUrl, fileName };
};