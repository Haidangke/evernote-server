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

            await tag.save();
            res.status(200).json({
                tag,
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
            const { noteId, listTagId } = req.body;
            const note = await Note.findById(noteId);
            const curTag = listTagId
                .concat(note.tag)
                .filter((item, pos) => listTagId.concat(note.tag).indexOf(item) == pos);

            const newNote = await Note.findOneAndUpdate(
                { uid, noteId },
                {
                    tag: curTag,
                },
                { new: true }
            );

            res.status(200).json({
                note: newNote,
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

            await Note.updateMany({ tag: id, uid }, { $pull: { tag: id } });
            res.status(200).json({ status: 'success', msg: 'delete tag successfully !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //loại bỏ thẻ
    removeTag: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { noteId, tagId } = req.body;
            console.log({ noteId });
            const note = await Note.findById(noteId);
            console.log({ note });
            const tag = note.tag;

            const newTag = note.tag.map((tag) => tag._id);
            tag.splice(newTag.indexOf(tagId), 1);

            await Note.findOneAndUpdate(
                { uid, noteId },
                {
                    ...note,
                    tag,
                }
            );
            res.status(200).json({ status: 'success', msg: 'remove tag from note successfully !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default tagController;
