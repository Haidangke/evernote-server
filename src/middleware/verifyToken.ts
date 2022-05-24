import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface User {
    uid: string;
    role: string;
}
export interface IGetUserAuthInfoRequest extends Request {
    user: User;
}

const verifyToken = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];

        jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_KEY,
            (err, user: User) => {
                if (err)
                    return res.status(403).json({
                        status: 'failed',
                        msg: 'Token is not valid !',
                    });
                req.user = user;
                next();
            }
        );
    } catch (error) {
        res.status(401).json({
            status: 'failed',
            msg: 'You are not authenticated !',
        });
    }
};

export default verifyToken;
