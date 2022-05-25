import { Router } from 'express';
import todoController from '../controllers/todoController';
const router = Router();

router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
