import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'AsyncFunctionRejectedError') {
        res.status(500).send({ message: 'Something went wrong' });
    } else {
        next(err);
    }
};

export default errorHandler;
