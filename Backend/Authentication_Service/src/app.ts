import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

// Enable CORS (uncomment if required) 
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use('/', authRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('API is running');
});

export default app;