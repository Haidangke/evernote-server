import express from 'express';
import tagController from '../controllers/tagController';
const router = express.Router();

router.get('/', tagController.getTag);
router.post('/', tagController.createTag);
router.post('/:id', tagController.removeTag);
router.delete('/:id', tagController.deleteTag);

export default router;
