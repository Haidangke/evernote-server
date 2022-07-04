import { Router } from 'express';
import userController from '../controllers/userController';
const router = Router();

router.get('/info', userController.getInfoUser);
router.put('/scratch', userController.updateScratch);

export default router;
