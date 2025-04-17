import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';

export const app = express();
import OrderRouter from './routes/order.routes'

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenido a la API de Coordinadora');
});

app.use('/api/orders', OrderRouter);


