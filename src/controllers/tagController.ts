import { Request, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import Note from '../models/noteModel';
import Tag from '../models/tagModel';

const tagController = {
    createTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { name } = req.body;

            if (!name)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'name tag is not defined !',
                });

            const tag = new Tag({
                uid,
                name,
            });
            delete tag._doc._id;
            await tag.save();
            res.status(200).json({
                data: tag,
                status: 'success',
                msg: 'create tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //thêm thẻ
    addTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { noteId, tags } = req.body;
            const note = await Note.findOne({ _id: noteId, uid });

            if (!note)
                return res.status(400).json({ status: 'failed', msg: 'this note was not found !' });
            const curTags = [...note.tags];
            tags.forEach((tag) => {
                if (!curTags.map((x) => x.toString()).includes(tag)) curTags.push(tag);
            });

            await Note.findOneAndUpdate(
                { uid, _id: noteId },
                {
                    tags,
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

    //xóa thẻ
    deleteTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const id = req.params.id;

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
