import { app } from './app';
import { ENV } from './config/env';
import { QueueService } from './services/queue.service';

const server = app.listen(ENV.PORT, () => {
  console.log(`
🚀 Lootupspace Core API Server online!
📡 Listening on: http://localhost:${ENV.PORT}
📚 Swagger API Docs: http://localhost:${ENV.PORT}/docs
✨ Environment: ${ENV.NODE_ENV}
  `);

  // Initialize initial background scheduler jobs
  QueueService.scheduleJob('SEND_SCHEDULED_REMINDERS');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

