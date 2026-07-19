import app from './app';
import config from './config/env';
import { connectDB } from './config/database';

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

let server: any;

async function bootstrap() {
  try {
    await connectDB();
    server = app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode.`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
