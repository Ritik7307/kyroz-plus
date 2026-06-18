import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Ensure uploads directory exists
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage to process image before saving
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  }
});

router.post('/', authenticateToken, upload.single('image'), async (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = req.file.fieldname + '-' + uniqueSuffix + '.webp';
    const filePath = path.join(uploadDir, filename);

    // Compress, resize, and convert to WebP
    await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true }) // Max width 800px
      .webp({ quality: 80 }) // Compress to 80% quality WebP
      .toFile(filePath);

    // Construct the URL to the uploaded file
    const fileUrl = `${process.env.BACKEND_URL || ''}/public/uploads/${filename}`;
    
    res.status(200).json({ 
      message: 'File uploaded and optimized successfully', 
      url: fileUrl 
    });
  } catch (error) {
    console.error('Image upload/compression error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

export default router;
