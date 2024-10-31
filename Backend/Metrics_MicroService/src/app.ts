import express from 'express';
import cors from 'cors';
//import leadRoutes from './routes/leadRoutes'; // Import the leads router (adjust path as needed)
import metricsRoutes from './routes/metricsRoutes';

const app = express();

// Enable CORS (uncomment if required)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api', metricsRoutes); 

export default app;
