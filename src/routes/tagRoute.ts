import express from 'express';
import tagController from '../controllers/tagController';
const router = express.Router();

router.post('/', tagController.createTag);
router.put('/', tagController.addTag);
router.delete('/:id', tagController.deleteTag);
router.delete('/', tagController.removeTag);

export default router;
