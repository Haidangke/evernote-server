import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import Note from '../models/noteModel';
import Todo from '../models/todoModel';

const todoController = {
    createTodo: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { noteId } = req.body;

            const note = await Note.findById(noteId);
            if (!note)
                return res
                    .status(400)
                    .json({ status: 'failed', msg: 'this note does not exist !' });

            const todo = new Todo({
                uid,
                noteId,
            });

            await todo.save();
            res.status(200).json({ status: 'sucess', msg: 'create todo success !', todo });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    updateTodo: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const todoId = req.params.id;
            const uid = req.user.uid;
            const { noteId, name, expiration_date, isComplete } = req.body;
            const note = await Note.findById(noteId);
            if (!note)
                return res
                    .status(400)
                    .json({ status: 'failed', msg: 'this note does not exist !' });
            const todo = await Todo.findOneAndUpdate(
                { _id: todoId, uid, noteId },
                {
                    name,
                    expiration_date,
                    isComplete,
                },
                { new: true }
            );

            res.status(200).json({ status: 'sucess', msg: 'create todo success !', todo });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
    deleteTodo: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const todoId = req.params.id;
            const uid = req.user.uid;
            const { noteId } = req.body;
            const note = await Note.findById(noteId);
            if (!note)
                return res
                    .status(400)
                    .json({ status: 'failed', msg: 'this note does not exist !' });

            await Todo.findOneAndDelete({ uid, noteId, _id: todoId });
            res.status(200).json({ status: 'sucess', msg: 'delete todo success !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default todoController;
