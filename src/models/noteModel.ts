import { Schema, model } from 'mongoose';
import { tagSchema } from './tagModel';

const Types = Schema.Types;

const noteSchema = new Schema(
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
            default: '',
        },
        tag: { type: [{ type: Types.ObjectId, ref: 'Tag' }], default: [] },
        notebook: {
            type: Types.ObjectId,
            ref: 'Notebook',
            required: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
        contain: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Note = model('Note', noteSchema);
export default Note;
