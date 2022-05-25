import { Router } from 'express';
import notebookController from '../controllers/notebookController';

const router = Router();

router.post('/', notebookController.createNotebook);
router.put('/:id', notebookController.updateNotebook);

export default router;
