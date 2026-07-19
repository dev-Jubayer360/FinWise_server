import app from '../src/app';
import { connectDB } from '../src/config/database';

// Establish MongoDB connection for Serverless execution
connectDB()
  .then(() => console.log('MongoDB Connected via Vercel Serverless'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

export default app;
