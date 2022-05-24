import { Request, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import Note from '../models/noteModel';

const noteController = {
    getNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const noteId = req.params.id;

            const note = await Note.findOne({ _id: noteId, uid });
            return res.status(200).json({
                note,
                status: 'success',
                message: 'get note successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
    getAllNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;

            const notes = await Note.find({ uid });
            return res.json({ notes });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
    createNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;

            if (!uid) {
                return res
                    .status(400)
                    .json({ status: 'failed', msg: 'user id invalid !' });
            }

            const note = new Note({
                uid,
            });

            await note.save();
            return res.status(200).json({
                note: note,
                status: 'success',
                msg: 'create note successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    updateNote: async (req: Request, res: Response) => {
        try {
            const noteId = req.params.id;
            const { title, content, tag, notebook, isDelete, contain } =
                req.body;

            const note = await Note.findByIdAndUpdate(
                noteId,
                {
                    title,
                    content,
                    tag,
                    notebook,
                    isDelete,
                    contain,
                },
                { new: true }
            );

            return res
                .status(200)
                .json({ note, status: 'success', message: 'note is updated' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    deleteNote: async (req: Request, res: Response) => {
        try {
            const noteId = req.params.id;
            await Note.findByIdAndRemove(noteId);

            res.status(200).json({
                status: 'success',
                msg: 'note is deleted !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default noteController;
