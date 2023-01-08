import express from 'express';
import validUser from '../middleware/validUser';
import verifyToken from '../middleware/verifyToken';

import noteRoute from './noteRoute';
import tagRoute from './tagRoute';
import userRoute from './userRoute';
import authRoute from './authRoute';
import todoRoute from './todoRoute';
import notebookRoute from './notebookRoute';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', verifyToken, validUser, userRoute);
router.use('/note', verifyToken, validUser, noteRoute);
router.use('/tag', verifyToken, validUser, tagRoute);
router.use('/todo', verifyToken, validUser, todoRoute);
router.use('/notebook', verifyToken, validUser, notebookRoute);

export default router;
