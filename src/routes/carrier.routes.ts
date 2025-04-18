import { Router } from 'express';
import carrierController from '../controllers/carrier.controller';
import { validateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', validateToken, carrierController.getCarriers);
router.get('/:id', validateToken, carrierController.getCarrierById);
router.post('/', validateToken, carrierController.createCarrier);
router.put('/:id', validateToken, carrierController.updateCarrier);
router.delete('/:id', validateToken, carrierController.deleteCarrier);

export default router;