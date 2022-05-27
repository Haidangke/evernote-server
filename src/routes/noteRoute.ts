import express from 'express';
import noteController from '../controllers/noteController';
import validUser from '../middleware/validUser';
const router = express.Router();

router.get('/', noteController.getAllNote);
router.get('/:id', noteController.getNote);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.delete('/', noteController.cleanTrash);

export default router;
