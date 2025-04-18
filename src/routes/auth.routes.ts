import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/renew', validateToken, authController.renewToken);

export default router;