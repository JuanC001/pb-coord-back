import { Router } from 'express';
import shipmentController from '../controllers/shipment.controller';
import { UserRole } from '../utils/enums';
import { validateToken, hasRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', validateToken, hasRole(UserRole.ADMIN), shipmentController.getShipments);
router.get('/:id', validateToken, hasRole(UserRole.ADMIN), shipmentController.getShipmentById);
router.get('/order/:orderId', validateToken, hasRole(UserRole.ADMIN), shipmentController.getShipmentsByOrderId);
router.post('/', validateToken, hasRole(UserRole.ADMIN), shipmentController.createShipment);
router.put('/:id', validateToken, hasRole(UserRole.ADMIN), shipmentController.updateShipment);
router.delete('/:id', validateToken, hasRole(UserRole.ADMIN), shipmentController.deleteShipment);

export default router;