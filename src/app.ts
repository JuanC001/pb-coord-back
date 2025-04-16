import express, { Request, Response } from 'express';
import apiRoutes from './routes';

export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenido a la API de Coordinadora');
});

app.use('/api', apiRoutes);


