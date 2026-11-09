import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import { requestLogger } from './middleware/logger.middleware';
import { authRouter } from './controllers/auth.controller';
import { itemsRouter } from './controllers/items.controller';
import { pickupsRouter } from './controllers/pickups.controller';
import { returnsRouter } from './controllers/returns.controller';
import { warehouseRouter } from './controllers/warehouse.controller';
import { driverRouter } from './controllers/driver.controller';
import { paymentsRouter } from './controllers/payments.controller';
import { pricingRouter } from './controllers/pricing.controller';
import { adminRouter } from './controllers/admin.controller';
import { ticketsRouter } from './controllers/tickets.controller';

export const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(requestLogger);

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check
app.get('/health', (req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    service: 'lootupspace-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// API v1 Routes
const v1 = express.Router();
v1.use('/auth', authRouter);
v1.use('/items', itemsRouter);
v1.use('/pickups', pickupsRouter);
v1.use('/returns', returnsRouter);
v1.use('/warehouse', warehouseRouter);
v1.use('/driver', driverRouter);
v1.use('/payments', paymentsRouter);
v1.use('/pricing', pricingRouter);
v1.use('/admin', adminRouter);
v1.use('/tickets', ticketsRouter);

app.use('/api/v1', v1);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

