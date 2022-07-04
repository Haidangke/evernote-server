import { Request, Response } from 'express';
import noteAPIfeatures from '../lib/note';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';

import { Note, Notebook, Todo } from '../models';

const noteController = {
    getNote: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const noteId = req.params.id;

            const note = await Note.findOne({ _id: noteId, uid })
                .populate('tags')
                .populate('notebook');
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
            const features = new noteAPIfeatures(Note.find({ uid }), query)
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
            const { title, content, tags, notebook, isDelete, contain } = req.body;

            const note = await Note.findByIdAndUpdate(
                noteId,
                {
                    title,
                    content,
                    tags,
                    notebook,
                    isDelete,
                    contain,
                },
                { new: true }
            );

            return res
                .status(200)
                .json({ data: note, status: 'success', message: 'note is updated' });
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

    cleanTrash: async (req: IGetUserAuthInfoRequest, res: Response) => {
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
