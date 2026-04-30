import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const UserCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['WRITER', 'EDITOR', 'ADMIN']).default('WRITER'),
});

// GET /api/v1/users/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, bio: true, createdAt: true },
  });
  res.json(user);
});

// GET /api/v1/users (admin)
router.get('/', verifyToken, requireRole('ADMIN'), async (_req, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

// POST /api/v1/users (admin creates writer/editor)
router.post('/', verifyToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = UserCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash, role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true },
  });
  res.status(201).json(user);
});

// PUT /api/v1/users/:id
router.put('/:id', verifyToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const { name, bio, avatarUrl } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { name, bio, avatarUrl },
    select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true },
  });
  res.json(user);
});

// PATCH /api/v1/users/:id/role
router.patch('/:id/role', verifyToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const { role } = req.body;
  if (!['WRITER', 'EDITOR', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: { id: true, name: true, role: true },
  });
  res.json(user);
});

// PATCH /api/v1/users/:id/deactivate
router.patch('/:id/deactivate', verifyToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: false },
    select: { id: true, name: true, isActive: true },
  });
  res.json(user);
});

export default router;
