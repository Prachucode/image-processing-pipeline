import sharp from "sharp";
import path from "path";
import fs from "fs/promises";


export const convertImage = async (inputPath, outputFormat) => {
    const convertDir = path.resolve(process.cwd(), 'processed', 'converted');

    await fs.mkdir(convertDir, { recursive: true });

    const filename = path.basename(inputPath, path.extname(inputPath));
    const outputFileName = `${filename}.${outputFormat}`;

    const outputPath = path.join(convertDir, outputFileName);

    await sharp(inputPath).toFormat(outputFormat).toFile(outputPath);

    const relativePath = `converted/${outputFileName}`;
    const imageUrl = `http://localhost:3000/processed/${relativePath}`;
    const downloadUrl = `http://localhost:3000/api/download?path=${encodeURIComponent(relativePath)}`;

    return { outputPath, imageUrl, downloadUrl, fileName: outputFileName };
}