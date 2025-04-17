import { Router } from 'express';
import { OrderStatus } from '../utils/enums';
import OrderController from '../controllers/order.controller';

const router = Router();

// Obtener todas las órdenes
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.get('/user/:userId', OrderController.getOrdersByUserId);

router.post('/', OrderController.createOrder);
router.patch('/:id/status', OrderController.updateOrderStatus);
router.delete('/:id', OrderController.deleteOrder);

export default router;