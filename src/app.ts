import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import orderRouter from './routes/order.routes'
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';

export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenido a la API de Coordinadora');
});

app.use('/api/orders', orderRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);


