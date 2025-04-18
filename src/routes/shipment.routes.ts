import { Router } from 'express';
import shipmentController from '../controllers/shipment.controller';
import { validateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', validateToken, shipmentController.getShipments);
router.get('/:id', validateToken, shipmentController.getShipmentById);
router.get('/order/:orderId', validateToken, shipmentController.getShipmentsByOrderId);
router.post('/', validateToken, shipmentController.createShipment);
router.put('/:id', validateToken, shipmentController.updateShipment);
router.delete('/:id', validateToken, shipmentController.deleteShipment);

export default router;