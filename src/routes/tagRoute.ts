import express from 'express';
import tagController from '../controllers/tagController';
const router = express.Router();

router.post('/', tagController.createTag);
router.put('/', tagController.addTag);
router.delete('/', tagController.removeTag);
router.delete('/:id', tagController.deleteTag);

export default router;
