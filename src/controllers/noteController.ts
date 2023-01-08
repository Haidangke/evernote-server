import { Request, Response } from 'express';
import noteAPIfeatures from '../lib/note';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';

import { Note, Notebook, Todo } from '../models';

const noteController = {
    getNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const noteId = req.params.id;

            const note = await Note.findOne({ _id: noteId, uid }).populate('tags');
            const todo = await Todo.find({ noteId });
            return res.status(200).json({
                data: { ...note._doc, todo },
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

            const query = req.query;
            const features = new noteAPIfeatures(Note.find({ uid }).populate('tags'), query)
                .pagination()
                .sort()
                .search()
                .filterKey(['_sort', '_limit', '_page', '_search'])
                .filterNote()
                .filterKey(['tags'])
                .filter();

            const notes = await features.query;
            for (const note of notes) {
                note.uid = undefined;
            }

            return res.json({ data: notes, status: 'success', msg: 'get notes successfully !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
    createNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            let { notebookId, contain, content, createdAt, isTrash, tags, title } = req.body;

            console.log({ contain, content, createdAt, isTrash, tags, title });

            if (!notebookId) {
                const notebookDefault = await Notebook.findOne({ uid, isDefault: true });
                notebookId = notebookDefault.id;
            }

            if (!uid) {
                return res.status(400).json({ status: 'failed', msg: 'user id invalid !' });
            }

            const note = new Note({
                uid,
                notebook: notebookId,
                contain,
                content,
                createdAt,
                isTrash,
                tags,
                title,
            });

            await note.save();
            delete note._doc.uid;

            return res.status(200).json({
                data: note,
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
            const { title, content, tags, notebook, isDelete, contain, isTrash, isShortcut } =
                req.body;

            const note = await Note.findByIdAndUpdate(
                noteId,
                {
                    title,
                    content,
                    tags,
                    notebook,
                    isDelete,
                    contain,
                    isTrash,
                    isShortcut,
                },
                { new: true }
            ).populate('tags');

            return res
                .status(200)
                .json({ data: note, status: 'success', message: 'note is updated' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    deleteNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        const uid = req.user.uid;
        try {
            const noteId = req.params.id;
            await Note.findOneAndDelete({ _id: noteId, uid });

            res.status(200).json({
                status: 'success',
                msg: 'note is deleted !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    deleteManyNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            await Note.deleteMany({ uid, isTrash: true });
            res.status(200).json({ status: 'success', msg: 'Đã dọn sạch thùng rác !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default noteController;
