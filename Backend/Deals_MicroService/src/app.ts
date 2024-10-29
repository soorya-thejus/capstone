import express from 'express';
import cors from 'cors';
import dealRoutes from './routes/dealRoutes';

const app = express();

// Enable CORS (uncomment if required) 
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api', dealRoutes); // Mount leads router at /api/leads

export default app;