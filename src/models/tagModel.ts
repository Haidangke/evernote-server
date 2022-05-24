import { Schema, model } from 'mongoose';
const Types = Schema.Types;

export const tagSchema = new Schema(
    {
        uid: {
            type: Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Tag = model('Tag', tagSchema);
export default Tag;
