import express from 'express';
import shortcutController from '../controllers/shortcutController';
const router = express.Router();

router.get('/', shortcutController.getShortcut);
router.post('/', shortcutController.createShortcut);
router.delete('/:id', shortcutController.deleteShortcut);

export default router;
