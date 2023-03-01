import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import { Note, Notebook } from '../models';

const noteController = {
    getAllNote: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        const uid = req.user.uid;
        const notes = await Note.find({ uid });

        return res.json({ data: notes, status: 'success', msg: 'get notes successfully !' });
    }),
    createNote: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        const uid = req.user.uid;
        const body = req.body;
        const notebookDefault = await Notebook.findOne({ uid, isDefault: true });

        const note = new Note({
            uid,
            notebook: body.notebookId || notebookDefault._id,
            ...body,
        });

        await note.save();
        note.uid = undefined;

        return res.status(200).json({
            data: note,
            status: 'success',
            msg: 'create note successfully !',
        });
    }),

    updateNote: asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const noteId = req.params.id;
        const body = req.body;

        const note = await Note.findByIdAndUpdate(noteId, { ...body }, { new: true }).populate(
            'tags'
        );

        return res.status(200).json({ data: note, status: 'success', message: 'note is updated' });
    }),

    deleteNote: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        const uid = req.user.uid;
        const noteId = req.params.id;
        await Note.findOneAndDelete({ _id: noteId, uid });

        res.status(200).json({
            status: 'success',
            msg: 'note is deleted !',
        });
    }),

    deleteManyNote: asyncHandler(
        async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
            const uid = req.user.uid;
            await Note.deleteMany({ uid, isTrash: true });
            res.status(200).json({ status: 'success', msg: 'all note is deleted !' });
        }
    ),
};

export default noteController;
