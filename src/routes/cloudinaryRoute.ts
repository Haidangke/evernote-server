import { Router } from 'express';
import cloudinaryController from '../controllers/cloudinaryController';

const router = Router();

router.post('/upload', cloudinaryController.upload);

export default router;
