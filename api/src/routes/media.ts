import { Router, Request, Response } from 'express';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { uploadToStorage, deleteFromStorage } from '../lib/supabaseStorage';

const router = Router();

// POST /api/v1/media/upload
router.post(
  '/upload',
  verifyToken,
  requireRole('WRITER'),
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    try {
      const id = uuid();
      const sizes = [
        { label: 'large', width: 1600 },
        { label: 'medium', width: 800 },
        { label: 'thumbnail', width: 320 },
      ];

      // Upload all three sizes; return the large URL as primary
      let primaryUrl = '';
      let primaryPath = '';

      for (const size of sizes) {
        const webpBuffer = await sharp(req.file.buffer)
          .resize({ width: size.width, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        const metadata = await sharp(webpBuffer).metadata();
        const storagePath = `uploads/${id}/${size.label}.webp`;
        const url = await uploadToStorage(webpBuffer, storagePath, 'image/webp');

        if (size.label === 'large') {
          primaryUrl = url;
          primaryPath = storagePath;
          // Save to Media table
          await prisma.media.create({
            data: {
              url,
              storagePath,
              width: metadata.width,
              height: metadata.height,
              sizeBytes: webpBuffer.length,
              uploadedBy: req.user!.id,
            },
          });
        }
      }

      res.json({ url: primaryUrl, storagePath: primaryPath });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Upload failed' });
    }
  }
);

// DELETE /api/v1/media/:storagePath (base64-encoded path)
router.delete(
  '/:encodedPath',
  verifyToken,
  requireRole('EDITOR'),
  async (req: AuthRequest, res: Response) => {
    const storagePath = Buffer.from(req.params.encodedPath, 'base64').toString('utf-8');
    try {
      await deleteFromStorage(storagePath);
      await prisma.media.deleteMany({ where: { storagePath } });
      res.json({ message: 'Deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/v1/media  (media library)
router.get('/', verifyToken, requireRole('WRITER'), async (_req, res: Response) => {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  res.json(media);
});

export default router;
