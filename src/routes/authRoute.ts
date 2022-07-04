import cookieParser from 'cookie-parser';
import { Router } from 'express';
import authController from '../controllers/authController';
const router = Router();

router.use(cookieParser());
router.post('/email', authController.checkEmail);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.requestRefreshToken);
router.post('/logout', authController.logout);

export default router;
