import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { slugify } from '../utils/helpers';

const router = Router();

const TeamSchema = z.object({
  name: z.string().min(2),
  sportId: z.string().cuid(),
  logoUrl: z.string().url().optional(),
  homeGround: z.string().optional(),
  district: z.string().optional(),
  bio: z.string().optional(),
  foundedYear: z.number().int().optional(),
});

// GET /api/v1/teams
router.get('/', async (req: Request, res: Response) => {
  const { sport } = req.query as Record<string, string>;
  const where: any = {};
  if (sport) where.sport = { slug: sport };

  const teams = await prisma.team.findMany({
    where,
    include: { sport: { select: { name: true, slug: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(teams);
});

// GET /api/v1/teams/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  const team = await prisma.team.findUnique({
    where: { slug: req.params.slug },
    include: {
      sport: { select: { name: true, slug: true } },
      homeFixtures: { include: { awayTeam: true, competition: true }, orderBy: { kickoffTime: 'desc' }, take: 10 },
      awayFixtures: { include: { homeTeam: true, competition: true }, orderBy: { kickoffTime: 'desc' }, take: 10 },
    },
  });
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(team);
});

// POST /api/v1/teams
router.post('/', verifyToken, requireRole('EDITOR'), async (req: AuthRequest, res: Response) => {
  const parsed = TeamSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const slug = slugify(parsed.data.name);
  const team = await prisma.team.create({ data: { ...parsed.data, slug } });
  res.status(201).json(team);
});

// PUT /api/v1/teams/:id
router.put('/:id', verifyToken, requireRole('EDITOR'), async (req: AuthRequest, res: Response) => {
  const parsed = TeamSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const team = await prisma.team.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(team);
});

export default router;
