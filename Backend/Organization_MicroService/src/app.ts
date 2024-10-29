import express from 'express';
import cors from 'cors';
import orgRoutes from './routes/orgRoutes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api',orgRoutes);

export default app;
