import { Schema, model } from 'mongoose';

const Types = Schema.Types;

interface INote extends Document {
    uid: string;
    title: string;
    content: string;
    tag: string[];
    isTrash: boolean;
    isShortcut: boolean;
}

const NoteSchema: Schema = new Schema(
    {
        uid: {
            type: Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '[{"children":[{"text":""}]}]',
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
    },
    {
        timestamps: true,
    }
);

const Note = model<INote>('Note', NoteSchema);

export default Note;
