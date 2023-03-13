import { Schema, model } from 'mongoose';

const Types = Schema.Types;

interface INote extends Document {
    uid: any;
    title: string;
    content: string;
    tag: string[];
    isTrash: boolean;
    isShortcut: boolean;
    reminder: {
        date: string;
    };
}

const NoteSchema: Schema = new Schema(
    {
        uid: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
        },
        tags: { type: [{ type: Types.ObjectId, ref: 'Tag' }], default: [] },
        notebook: {
            type: Types.ObjectId,
            ref: 'Notebook',
            required: true,
        },
        isTrash: {
            required: true,
            type: Boolean,
            default: false,
        },
        isShortcut: {
            default: false,
            type: Boolean,
        },
        reminder: Date,
    },
    {
        timestamps: true,
    }
);
const Note = model<INote>('Note', NoteSchema);

export default Note;
