import { model, Schema } from 'mongoose';
const Types = Schema.Types;

const notebookSchema = new Schema({
    uid: {
        type: Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const Notebook = model('Notebook', notebookSchema);
export default Notebook;
