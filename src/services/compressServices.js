import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export const compressImage = async (inputPath) => {
    const compressedDir = "processed/compressed";

    // Create the output directory if it doesn't exist
    await fs.mkdir(compressedDir, { recursive: true });

    // Get the original filename
    const fileName = path.basename(inputPath);

    // Create the output path
    const outputPath = path.join(compressedDir, fileName);

    // Compress the image
    await sharp(inputPath)
        .jpeg({
            quality: 100,
        })
        .toFile(outputPath);

    return outputPath;
};