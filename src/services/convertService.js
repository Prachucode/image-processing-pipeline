import sharp from "sharp";
import path from "path";
import fs from "fs/promises";


export const convertImage = async (inputPath, outputFormat) => {
    const convertDir = 'processed/converted'

    await fs.mkdir(convertDir, { recursive: true })

    const filename = path.basename(inputPath, path.extname(inputPath))

    const outputPath = path.join(convertDir, filename + '.' + outputFormat)

    await sharp(inputPath).toFormat(outputFormat).toFile(outputPath)

    return outputPath
}