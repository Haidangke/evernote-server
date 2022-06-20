import { model, Schema } from 'mongoose';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Please enter a valid email',
            },
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
    },
    { timestamps: true }
);

const User = model('User', userSchema);
export default User;
