import { Document, model, Schema } from 'mongoose';

interface INotebook extends Document {
    uid: string;
    name: string;
    isDefault: boolean;
    creator: string;
    isShortcut: boolean;
}

const NotebookSchema: Schema = new Schema(
    {
        uid: {
            type: Schema.Types.ObjectId,
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
        creator: {
            type: String,
            required: true,
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

const Notebook = model<INotebook>('Notebook', NotebookSchema);
export default Notebook;
