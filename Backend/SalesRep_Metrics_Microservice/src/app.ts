
import express from 'express';
import cors from 'cors';
import metricsRoutes from './routes/metricsRoutes';
import { runConsumer } from './kafka/consumer';

const app = express();

// Enable CORS (uncomment if required)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api', metricsRoutes);

// Start the Kafka consumer
runConsumer().catch((error) => {
  console.error('Error starting Kafka consumer:', error);
  process.exit(1); // Exit process with failure
});

export default app; // Export the app for use in server.ts
