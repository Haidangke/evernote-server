import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import { NoteModel, UserModel, NotebookModel } from '../models';

const notebookController = {
    getNotebook: async (req: IGetUserAuthInfoRequest, res: Response) => {
        const uid = req.user.uid;

        try {
            const data = await NotebookModel.find({ uid }).sort('-createdAt');
            const notebooks = [...data];
            for (let i = 0; i < notebooks.length; i++) {
                notebooks[i].uid = null;
            }
            res.status(200).json({
                data: notebooks,
                status: 'success',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    createNotebook: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { name, creator } = req.body;

            if (!name || !creator)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'thông tin của sổ tay không hợp lệ.',
                });
            const notebook = await NotebookModel.findOne({ name, uid });
            if (notebook)
                return res.status(400).json({ status: 'failed', msg: 'sổ tay này đã tồn tại.' });

            const newNotebook = new NotebookModel({ uid, name, creator });
            await newNotebook.save();

            const notebookRes = newNotebook.toObject();
            delete notebookRes.uid;

            res.status(200).json({
                data: notebookRes,
                status: 'success',
                msg: 'tạo sổ tay thành công.',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    updateNotebook: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const id = req.params.id;
            const uid = req.user.uid;
            const { name, isDefault, isShortcut } = req.body;

            if (isDefault) {
                await NotebookModel.updateMany(
                    { uid, isDefault: true },
                    {
                        isDefault: false,
                    }
                );
            }

            const newNotebook = await NotebookModel.findOneAndUpdate(
                { _id: id, uid },
                {
                    name,
                    isDefault,
                    isShortcut,
                },
                { new: true }
            );
            res.status(200).json({
                data: newNotebook,
                status: 'success',
                msg: 'update name notebook successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    deleteNotebook: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const id = req.params.id;

            const notebook = await NotebookModel.findOne({ _id: id, uid });
            const isDefault = notebook.isDefault;

            if (isDefault) {
                return res
                    .status(400)
                    .json({ status: 'failed', msg: 'you cannot delete the default notebook !' });
            }
            await NotebookModel.findOneAndRemove({ _id: id, uid });
            await NoteModel.deleteMany({ notebook: id });

            res.status(200).json({ status: 'success', msg: 'delete notebook successfully !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default notebookController;
