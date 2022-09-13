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
        contain: {
            type: [String],
            enum: ['nothing', 'code', 'image', 'url', 'email', 'date'],
            default: ['nothing'],
        },
    },
    {
        timestamps: true,
    }
);

noteSchema.index({ title: 'text' });
const Note = model('Note', noteSchema);

Note.createIndexes({ title: 'text' });
export default Note;
