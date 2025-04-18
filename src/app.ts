import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import orderRouter from './routes/order.routes'
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import carrierRouter from './routes/carrier.routes';
import shipmentRouter from './routes/shipment.routes';
import routeRouter from './routes/route.routes';

export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenido a la API de Coordinadora');
});

app.use('/api/orders', orderRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use('/api/carriers', carrierRouter);
app.use('/api/shipments', shipmentRouter);
app.use('/api/routes', routeRouter);

