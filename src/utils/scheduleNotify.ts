import { scheduleJob } from 'node-schedule';
import sendMessage from './sendMessage';

import NoteModel from '../models/noteModel';
import UserModel from '../models/userModel';

async function scheduleNotify() {
    try {
        const jobs = {};
        const notes = await NoteModel.find({ reminder: { $gt: new Date() } }).populate('uid');

        notes.forEach((note) => {
            const id = note._id.toString();

            jobs[id] = scheduleJob(note.reminder, function () {
                if (typeof note.uid.deviceToken === 'string') {
                    sendMessage({
                        notification: {
                            title: note.title,
                            body: 'Bạn đã đặt lời nhắc cho ghi chú vào giờ này',
                        },
                        token: note.uid.deviceToken,
                    });
                }
            });
        });

        NoteModel.watch().on('change', async (data) => {
            const note = data.fullDocument;
            const reminder = note.reminder;
            const _id = note._id;
            const title = note.title;

            const user = await UserModel.findById(data.fullDocument.uid);
            const id = _id.toString();

            const message = {
                notification: {
                    title: title,
                    body: 'Bạn đã đặt lời nhắc cho ghi chú vào giờ này',
                },
                token: user.deviceToken,
            };

            switch (data.operationType) {
                case 'insert': {
                    if (reminder) {
                        console.log('aaaaa');
                        jobs[id] = scheduleJob(new Date(2023, 2, 13, 16, 18, 0), function () {
                            console.log('schedule');
                            sendMessage(message);
                        });
                    }
                }
                case 'update': {
                    if (reminder) {
                        jobs[id] = scheduleJob(reminder, function () {
                            sendMessage(message);
                        });
                    } else {
                        if (jobs[id]) {
                            jobs[id].cancel();
                        }
                    }
                }
                case 'delete': {
                    if (jobs[id]) {
                        jobs[id].cancel();
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export default scheduleNotify;
