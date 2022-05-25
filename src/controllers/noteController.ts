import { Request, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import Notebook from '../models/notebookModel';
import Note from '../models/noteModel';
import Todo from '../models/todoModel';

const noteController = {
    getNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const noteId = req.params.id;

            const note = await Note.findOne({ _id: noteId, uid })
                .populate('tag')
                .populate('notebook');
            const todo = await Todo.find({ noteId });
            return res.status(200).json({
                note: { ...note._doc, todo },
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
            const { isDelete, listTagId, notebook } = req.body;

            const notes = await Note.find({ uid });
            return res.json({ notes });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
    createNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { notebookId } = req.body;
            let notebook = notebookId;
            if (!notebookId) {
                const notebookDefault = await Notebook.findOne({ uid, isDefault: true });
                notebook = notebookDefault.id;
            }

            if (!uid) {
                return res.status(400).json({ status: 'failed', msg: 'user id invalid !' });
            }

            const note = new Note({
                uid,
                notebook,
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
            const { title, content, tag, notebook, isDelete, contain } = req.body;

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

            return res.status(200).json({ note, status: 'success', message: 'note is updated' });
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

    deleteMulti: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            await Note.deleteMany({ uid, isDelete: true });
            res.status(200).json({ status: 'success', msg: 'delete multi successfully !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default noteController;
