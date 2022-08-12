import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import Shortcut from '../models/shortcutModel';

const shortcutMiddleware = {
    getShortcut: async (req: IGetUserAuthInfoRequest, res: Response) => {
        const uid = req.user.uid;
        try {
            const shortcuts = await Shortcut.find({ uid });
            res.status(200).json({ status: 'success', data: shortcuts });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    createShortcut: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { type, name } = req.body;
            if (!type || !name) {
                return res.status(400).json({ status: 'failed', msg: 'dữ liệu không hợp lệ' });
            }

            const shortcut = new Shortcut({
                type: { _id: type._id, name: type.name, value: type.value },
                name,
                uid,
            });
            await shortcut.save();

            res.status(200).json({
                status: 'success',
                msg: 'tạo lỗi tắt thành công',
                data: shortcut,
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    deleteShortcut: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const _id = req.params.id;

            await Shortcut.findOneAndRemove({ _id, uid });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default shortcutMiddleware;
