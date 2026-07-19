import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import routes from './routes';
import { getAuth } from './config/better-auth';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 mins

app.use('/api/auth', async (req, res, next) => {
    try {
        const { toNodeHandler } = await new Function('return import("better-auth/node")')();
        const auth = await getAuth();
        return toNodeHandler(auth)(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Application Routes
app.use('/api', routes);

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('AI-powered Personal Finance Tracker API is running.');
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
