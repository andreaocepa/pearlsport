import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { slugify } from '../utils/helpers';

const router = Router();

const CompSchema = z.object({
  name: z.string().min(2),
  sportId: z.string().cuid(),
  season: z.string(),
  type: z.enum(['LEAGUE', 'CUP', 'FRIENDLY', 'TOURNAMENT']),
  region: z.string().optional(),
  logoUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/v1/competitions
router.get('/', async (req: Request, res: Response) => {
  const { sport, isActive } = req.query as Record<string, string>;
  const where: any = {};
  if (sport) where.sport = { slug: sport };
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const comps = await prisma.competition.findMany({
    where,
    include: { sport: { select: { name: true, slug: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(comps);
});

// POST /api/v1/competitions
router.post('/', verifyToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = CompSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const slug = slugify(parsed.data.name + '-' + parsed.data.season);
  const comp = await prisma.competition.create({ data: { ...parsed.data, slug } });
  res.status(201).json(comp);
});

// PUT /api/v1/competitions/:id
router.put('/:id', verifyToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = CompSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const comp = await prisma.competition.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(comp);
});

export default router;
