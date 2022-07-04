import { Router } from 'express';
import notebookController from '../controllers/notebookController';

const router = Router();

router.get('/', notebookController.getNotebook);
router.post('/', notebookController.createNotebook);
router.put('/:id', notebookController.updateNotebook);
router.delete('/:id', notebookController.deleteNotebook);

export default router;
