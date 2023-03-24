import { Document, model, Schema } from 'mongoose';

interface ISchedule extends Document {
    uid: string;
    noteId: string;
    title: string;
    body: string;
    link: string;
    token: string;
    date: Date;
}

const ScheduledSchema = new Schema({
    uid: {
        type: String,
        required: true,
    },
    noteId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },

    title: {
        type: String,
    },
    body: {
        type: String,
    },
    link: {
        type: String,
    },
    date: {
        type: Date,
    },
});

const ScheduledModel = model<ISchedule>('scheduled', ScheduledSchema);
export default ScheduledModel;
