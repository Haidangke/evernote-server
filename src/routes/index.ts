import express from 'express';
import validUser from '../middleware/validUser';
import verifyToken from '../middleware/verifyToken';

import noteRoute from '../routes/noteRoute';
import tagRoute from '../routes/tagRoute';
import authRoute from './authRoute';

const router = express.Router();

router.use('/note', verifyToken, validUser, noteRoute);
router.use('/tag', verifyToken, validUser, tagRoute);
router.use('/auth', authRoute);

export default router;
