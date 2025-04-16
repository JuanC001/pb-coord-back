import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send('GET /API/ -> API de Coordinadora funcionando correctamente');
});

export default router;