import { Schema, model } from 'mongoose';

const Types = Schema.Types;

interface INote extends Document {
    uid: any;
    title: string;
    content: string;
    tag: string[];
    isTrash: boolean;
    isShortcut: boolean;
    reminder: string;
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
const NoteModel = model<INote>('Note', NoteSchema);

export default NoteModel;
