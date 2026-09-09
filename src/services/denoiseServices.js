import sharp from 'sharp'
import fs from 'fs/promises'
import path from "path";

export const denoiseImage = async (inputPath) => {
    const denoiseDir = path.resolve(process.cwd(), "processed", "denoised");

    await fs.mkdir(denoiseDir, { recursive: true });

    const fileName = path.basename(inputPath);
    const outputPath = path.join(denoiseDir, fileName);

    await sharp(inputPath)
        .median(3)
        .toFile(outputPath);

    const relativePath = `denoised/${fileName}`;
    const imageUrl = `http://localhost:3000/processed/${relativePath}`;
    const downloadUrl = `http://localhost:3000/api/download?path=${encodeURIComponent(relativePath)}`;

    return { outputPath, imageUrl, downloadUrl, fileName };
}
