import express from 'express';
import cors from 'cors';
import dealRoutes from './routes/dealRoutes';
import { initializeProducer } from './kafka/producer';

const app = express();

// Enable CORS (uncomment if required) 
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

initializeProducer().catch(console.error);

// Routes
app.use('/api', dealRoutes); // Mount leads router at /api/leads

export default app;