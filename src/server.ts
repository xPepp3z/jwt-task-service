import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

const app = express();
app.use(express.json());

const main = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/tasks_jwt');
    console.log('Database avviato con successo');
  } catch (error) {
    console.log('Errore, database non avviato correttamente', error);
  }
};

main();

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);

app.use('/tasks', taskRoutes);

app.use((err: Error, _req: Request, res: Response) => {
  console.error('Errore globale:', err.message);
  res.status(500).json({ message: 'Errore interno del server' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Nessuna rotta trovata' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Server avviato con successo');
});
