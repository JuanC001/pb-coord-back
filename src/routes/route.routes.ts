import { Router } from 'express';
import routeController from '../controllers/route.controller';
import { validateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', validateToken, routeController.getRoutes);
router.get('/:id', validateToken, routeController.getRouteById);
router.post('/', validateToken, routeController.createRoute);
router.put('/:id', validateToken, routeController.updateRoute);
router.delete('/:id', validateToken, routeController.deleteRoute);

export default router;