import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { validateToken, hasRole } from '../middlewares/auth.middleware';
import { UserRole } from '../utils/enums';

const router = Router();

router.get('/', validateToken, hasRole(UserRole.ADMIN), OrderController.getOrders);

router.get('/:id', validateToken, OrderController.getOrderById);
router.get('/user/:userId', validateToken, OrderController.getOrdersByUserId);

router.put('/:id', validateToken, hasRole(UserRole.CUSTOMER, UserRole.ADMIN), OrderController.updateOrder);
router.post('/', validateToken, hasRole(UserRole.CUSTOMER, UserRole.ADMIN), OrderController.createOrder);

router.patch('/status/:id', validateToken, hasRole(UserRole.ADMIN), OrderController.updateOrderStatus);
router.delete('/:id', validateToken, hasRole(UserRole.ADMIN), OrderController.deleteOrder);

export default router;