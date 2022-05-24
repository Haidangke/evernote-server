import { model, Schema } from 'mongoose';

const Types = Schema.Types;

const todoSchema = new Schema(
    {
        uid: {
            type: Types.ObjectId,
            required: true,
        },
        note_id: {
            type: Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
        },
        expiration_date: {
            type: Types.Date,
        },
        isComplete: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Todo = model('Todo', todoSchema);
export default Todo;
