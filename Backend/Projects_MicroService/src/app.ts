import express from 'express';
import cors from 'cors';
import prjctRoutes from './routes/prjctRoutes'

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api',prjctRoutes);

export default app;


