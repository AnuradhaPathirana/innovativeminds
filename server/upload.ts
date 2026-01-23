import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Request } from 'express';

// Image dimensions configuration
export const IMAGE_CONFIG = {
    width: 800,
    height: 450,
    quality: 85,
    format: 'jpeg' as const, // Convert all to JPEG for consistency
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads', 'programs');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage - use memory storage for processing with sharp
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
};

// Configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size (before processing)
    }
});

// Process and save image with fixed dimensions
export async function processAndSaveImage(file: Express.Multer.File): Promise<string> {
    try {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const nameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const filename = `${sanitizedName}-${uniqueSuffix}.jpg`; // Always save as .jpg
        const filepath = path.join(uploadsDir, filename);

        // Process image with sharp - resize and optimize
        await sharp(file.buffer)
            .resize(IMAGE_CONFIG.width, IMAGE_CONFIG.height, {
                fit: 'cover', // Cover the entire area, cropping if necessary
                position: 'center', // Center the image
            })
            .jpeg({
                quality: IMAGE_CONFIG.quality,
                progressive: true, // Progressive JPEG for better loading
            })
            .toFile(filepath);

        console.log(`✅ Image processed and saved: ${filename} (${IMAGE_CONFIG.width}x${IMAGE_CONFIG.height})`);

        // Return relative path
        return `/uploads/programs/${filename}`;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
}

// Helper function to delete old image file
export function deleteImageFile(imagePath: string | null) {
    if (!imagePath) return;

    try {
        // Remove leading slash if present
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        const fullPath = path.join(process.cwd(), cleanPath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`🗑️  Deleted old image: ${fullPath}`);
        }
    } catch (error) {
        console.error('Error deleting image file:', error);
    }
}

// Helper function to get image URL from file (deprecated - use processAndSaveImage instead)
export function getImageUrl(file: Express.Multer.File): string {
    // This is now handled by processAndSaveImage
    return `/uploads/programs/${file.filename}`;
}
