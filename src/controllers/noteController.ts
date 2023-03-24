import { Response } from 'express';
import asyncHandler from 'express-async-handler';

import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import { NoteModel, NotebookModel } from '../models';
import scheduleService from '../services/scheduleService';

const noteController = {
    getAllNote: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        const uid = req.user.uid;
        const notes = await NoteModel.find({ uid }).populate('tags');

        return res.json({ data: notes, status: 'success', msg: 'get notes successfully !' });
    }),
    createNote: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        const uid = req.user.uid;
        const body = req.body;
        const notebookDefault = await NotebookModel.findOne({ uid, isDefault: true });

        const note = new NoteModel({
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

    updateNote: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        const uid = req.user.uid;
        const noteId = req.params.id;
        const body = req.body;
        const { reminder, token } = req.body;
        const note = await NoteModel.findByIdAndUpdate(noteId, { ...body }, { new: true }).populate(
            'tags'
        );
        if (reminder) {
            await scheduleService.updateSchedule(
                {
                    date: reminder,
                    title: 'Noteke',
                    body: `Có thông báo mới từ ghi chú ${note.title || 'Chưa có tiêu đề'}`,
                    noteId,
                    link: `/note?n=${noteId}`,
                    uid,
                },
                token
            );
        }

        return res.status(200).json({ data: note, status: 'success', message: 'note is updated' });
    }),

    deleteNote: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        const uid = req.user.uid;
        const noteId = req.params.id;
        await NoteModel.findOneAndDelete({ _id: noteId, uid });
        await scheduleService.deleteSchedule(noteId);
        res.status(200).json({
            status: 'success',
            msg: 'note is deleted !',
        });
    }),

    deleteManyNote: asyncHandler(
        async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
            const uid = req.user.uid;
            await NoteModel.deleteMany({ uid, isTrash: true });
            res.status(200).json({ status: 'success', msg: 'all note is deleted !' });
        }
    ),
};

export default noteController;
