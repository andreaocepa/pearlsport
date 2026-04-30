import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRouter from './routes/auth';
import articlesRouter from './routes/articles';
import fixturesRouter from './routes/fixtures';
import sportsRouter from './routes/sports';
import teamsRouter from './routes/teams';
import competitionsRouter from './routes/competitions';
import mediaRouter from './routes/media';
import searchRouter from './routes/search';
import usersRouter from './routes/users';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Cookie parsing (for httpOnly refresh token)
app.use(cookieParser());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/articles', articlesRouter);
app.use('/api/v1/fixtures', fixturesRouter);
app.use('/api/v1/sports', sportsRouter);
app.use('/api/v1/teams', teamsRouter);
app.use('/api/v1/competitions', competitionsRouter);
app.use('/api/v1/media', mediaRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/users', usersRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '4000', 10);
app.listen(PORT, () => {
  console.log(`🚀 Pearlsport API running on http://localhost:${PORT}`);
});

export default app;
