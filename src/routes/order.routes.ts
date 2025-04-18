import { Router } from 'express';
import OrderController from '../controllers/order.controller';

const router = Router();

router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.get('/user/:userId', OrderController.getOrdersByUserId);

router.put('/:id', OrderController.updateOrder);
router.post('/', OrderController.createOrder);
router.patch('/status/:id', OrderController.updateOrderStatus);
router.delete('/:id', OrderController.deleteOrder);

export default router;