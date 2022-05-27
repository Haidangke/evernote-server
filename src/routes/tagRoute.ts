import express from 'express';
import tagController from '../controllers/tagController';
const router = express.Router();

router.post('/', tagController.createTag);
router.put('/note', tagController.addTag);
router.delete('/:id', tagController.deleteTag);
router.post('/note', tagController.removeTag);

export default router;
