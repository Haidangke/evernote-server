import express from 'express';
import noteController from '../controllers/noteController';
const router = express.Router();

router.get('/', noteController.getAllNote);
router.get('/:id', noteController.getNote);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.delete('/', noteController.deleteManyNote);

export default router;
