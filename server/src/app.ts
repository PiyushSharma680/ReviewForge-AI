import 'dotenv/config';

import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { logger } from './utils/logger.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { validateRuntimeEnvironment } from './config/env.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import repoRoutes from './routes/repoRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middleware Imports
import { globalErrorHandler } from './middleware/errorHandler.js';

// Define custom property on Request interface using declarations
declare global {
  namespace Express {
    interface Request {
      id: string;
      correlationId: string;
    }
  }
}

const app: Application = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

// Store io instance on app to make it accessible in controllers
app.set('io', io);

// Socket.IO event handler
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  
  socket.on('join_repo', (repoId: string) => {
    socket.join(`repo_${repoId}`);
    logger.info(`Socket ${socket.id} joined channel repo_${repoId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Request ID and Correlation ID Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  const correlationId = (req.headers['x-correlation-id'] as string) || requestId;
  
  req.id = requestId;
  req.correlationId = correlationId;
  
  res.setHeader('x-request-id', requestId);
  res.setHeader('x-correlation-id', correlationId);
  next();
});

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-correlation-id'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Morgan logger format with Request & Correlation IDs
morgan.token('id', (req: any) => req.id);
morgan.token('correlationId', (req: any) => req.correlationId);

app.use(
  morgan(
    '[:id] [:correlationId] :method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }
  )
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ReviewForge AI Backend API Service is running perfectly.',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    connections: {
      socketIO: io.engine.clientsCount,
    },
  });
});

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: [${req.method}] ${req.path}`,
  });
});

// Centralized error handling middleware
app.use(globalErrorHandler);

// Start server after connecting to databases
const startServer = async () => {
  try {
    validateRuntimeEnvironment();
    await connectDB();
    await connectRedis();
    
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      logger.info(`Server successfully listening on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server due to startup error', error);
    process.exit(1);
  }
};

startServer();
