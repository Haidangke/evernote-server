import { NextFunction, Request, Response } from 'express';
import { IGetUserAuthInfoRequest } from './verifyToken';
import User from '../models/userModel';

const validUser = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req.user.uid;
    if (!id)
        return res
            .status(400)
            .json({ status: 'failed', msg: 'user id invalid !' });

    const user = await User.findById(id);
    if (!user)
        return res
            .status(401)
            .json({ status: 'failed', msg: 'user already exists' });

    next();
};

export default validUser;
