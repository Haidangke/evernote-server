import { model, Schema } from 'mongoose';
const Types = Schema.Types;

const shortcutModel = new Schema(
    {
        uid: {
            type: Types.ObjectId,
            required: true,
        },

        type: {
            type: String,
            enum: ['note', 'notebook'],
            required: true,
        },

        typeId: {
            type: String,
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

const Shortcut = model('Shortcut', shortcutModel);
export default Shortcut;
