import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';

import healthRoutes from './routes/health.routes';
import trackingRoutes from './routes/tracking.routes';
import parcelRoutes from './routes/parcel.routes';

export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/parcels', parcelRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ParcelX Express API',
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});
