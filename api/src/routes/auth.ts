import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Map to store refresh tokens (in production use a DB table)
const refreshTokenStore = new Map<string, string>(); // token → userId

function signAccess(userId: string, role: string, email: string) {
  return jwt.sign({ userId, role, email }, process.env.JWT_SECRET!, { expiresIn: '15m' });
}

function signRefresh(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
}

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email, isActive: true } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = signAccess(user.id, user.role, user.email);
  const refreshToken = signRefresh(user.id);
  refreshTokenStore.set(refreshToken, user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
  });
});

// POST /api/v1/auth/refresh
router.post('/refresh', (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    if (!refreshTokenStore.has(refreshToken)) {
      return res.status(401).json({ error: 'Refresh token revoked' });
    }

    // Look up user
    prisma.user.findUnique({ where: { id: decoded.userId, isActive: true } }).then((user) => {
      if (!user) return res.status(401).json({ error: 'User not found' });
      const accessToken = signAccess(user.id, user.role, user.email);
      res.json({ accessToken });
    });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', verifyToken, (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) refreshTokenStore.delete(refreshToken);
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

export default router;
