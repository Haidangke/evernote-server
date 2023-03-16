import { Document, model, Schema } from 'mongoose';

interface ISchedule extends Document {
    uid: string;
    noteId: string;
    title: string;
    body: string;
    link: string;
    date: Date;
}

const ScheduledSchema = new Schema({
    uid: {
        type: String,
    },
    noteId: {
        type: String,
    },

    title: {
        type: Date,
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
