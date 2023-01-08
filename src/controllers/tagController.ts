import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import Note from '../models/noteModel';
import Tag from '../models/tagModel';

const tagController = {
    //lấy tất cả thẻ
    getTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const listTag = await Tag.find({ uid }).sort('-createdAt');

            res.status(200).json({
                data: listTag,
                status: 'success',
                msg: 'create tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //tạo thẻ mới
    createTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { name } = req.body;

            if (!name)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'name tag is not defined !',
                });

            const isTag = await Tag.findOne({ uid, name });

            if (isTag)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'tag name already exists !',
                });

            const tag = new Tag({
                uid,
                name,
            });
            await tag.save();
            delete tag._doc.uid;
            const listTag = await Tag.find({ uid }).sort('-createdAt');
            res.status(200).json({
                data: { tag, listTag },
                status: 'success',
                msg: 'create tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //xóa thẻ khỏi ghi chú
    removeTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const id = req.params.id;
            await Note.updateMany({ tags: id, uid }, { $pull: { tags: id } });

            const listNote = await Note.find({ uid }).populate('tags');
            res.status(200).json({
                data: { listNote },
                status: 'success',
                msg: 'delete tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    deleteTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const id = req.params.id;
            await Tag.findOneAndDelete({ _id: id }, { $inc: { quantity: -1 } });
            await Note.updateMany({ tags: id, uid }, { $pull: { tags: id } });
            const listTag = await Tag.find({ uid }).sort('-createdAt');
            const listNote = await Note.find({ uid }).populate('tags');
            res.status(200).json({
                data: { listTag, listNote },
                status: 'success',
                msg: 'delete tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default tagController;
