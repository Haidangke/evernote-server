import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import UserModel from '../models/userModel';

const userController = {
    getInfoUser: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const user = await UserModel.findById(uid);

            delete user._doc.password;
            delete user._doc._id;
            res.status(200).json({
                status: 'success',
                msg: 'get info user successfully',
                data: user,
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    updateScratch: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { content } = req.body;

            await UserModel.findByIdAndUpdate(uid, {
                scratch: content,
            });

            res.status(200).json({
                status: 'success',
                msg: 'update scratch successfully',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default userController;
