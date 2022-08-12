import { model, Schema } from 'mongoose';
const Types = Schema.Types;

const shortcutModel = new Schema(
    {
        uid: {
            type: Types.ObjectId,
            required: true,
        },

        type: {
            _id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                enum: ['note', 'notebook'],
                required: true,
            },
            value: {
                type: String,
                enum: ['n', 'b'],
                required: true,
            },
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
