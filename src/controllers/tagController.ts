import { Request, Response } from 'express';
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
            delete tag._doc._id;
            res.status(200).json({
                data: tag,
                status: 'success',
                msg: 'create tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //thêm thẻ vào ghi chú
    addTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { noteId, tags } = req.body;
            const note = await Note.findOne({ _id: noteId, uid });

            if (!note)
                return res.status(400).json({ status: 'failed', msg: 'this note was not found !' });
            const curTags = [...note.tags];

            tags.forEach((tag: any) => {
                if (!curTags.map((x) => x.toString()).includes(tag)) {
                    (async function () {
                        await Tag.findOneAndUpdate(
                            { _id: tag },
                            { $inc: { quantity: 1 } },
                            { new: true }
                        );
                    })();
                    curTags.push(tag);
                }
            });

            await Note.findOneAndUpdate(
                { uid, _id: noteId },
                {
                    tags: curTags,
                },
                { new: true }
            );

            res.status(200).json({
                status: 'success',
                message: 'add tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //xóa thẻ khỏi một ghi chú
    deleteTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const id = req.params.id;
            await Tag.findOneAndDelete({ _id: id }, { $inc: { quantity: -1 } });
            await Note.updateMany({ tags: id, uid }, { $pull: { tags: id } });
            res.status(200).json({ status: 'success', msg: 'delete tag successfully !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //loại bỏ thẻ
    removeTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { noteId, tag } = req.body;
            const note = await Note.findById(noteId);
            const curTag = [...note.tags];

            const newTag = curTag.map((tag) => tag._id);
            curTag.splice(newTag.indexOf(tag), 1);

            await Note.findOneAndUpdate(
                { uid, noteId },
                {
                    ...note,
                    tags: curTag,
                }
            );
            res.status(200).json({ status: 'success', msg: 'remove tag from note successfully !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default tagController;
