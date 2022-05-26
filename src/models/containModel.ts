import { Schema, model } from 'mongoose';

const containSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const Contain = model('Contain', containSchema);

export default Contain;
