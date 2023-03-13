import { model, Schema, Document } from 'mongoose';
import NotebookModel from './notebookModel';

interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    avatar: string;
    role: string;
    scratch: string;
    refreshTokens: string[];
    deviceToken: string;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            required: true,
            default: 'user',
        },
        scratch: {
            type: String,
            default: '',
        },
        refreshTokens: [
            {
                type: String,
            },
        ],
        deviceToken: String,
    },
    { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
    try {
        const notebook = new NotebookModel({
            creator: this.email,
            uid: this._id,
            name: 'Sổ tay Đầu tiên',
            isDefault: true,
        });

        await notebook.save();
    } catch (error) {
        next(error);
    }
});

const User = model<IUser>('User', UserSchema);
export default User;
