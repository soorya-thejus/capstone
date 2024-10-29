import express from 'express';
import cors from 'cors';
import accountRoutes from './routes/accountRoutes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api',accountRoutes);

export default app;


