import scheduleLib from 'node-schedule';

import firebaseAdmin from '../firebase/firebaseAdmin';
import ScheduledModel from '../models/scheduledModel';

interface Schedule {
    date: any;
    title: any;
    body: any;
    noteId: any;
    link: any;
    uid: any;
}

interface JobPayload {
    date: any;
    title: any;
    body: any;
    link: any;
    token: any;
}

const scheduleService = {
    getJobs() {
        return scheduleLib.scheduledJobs;
    },
    deleteJob(jobId: string) {
        const jobs = this.getJobs();
        const currentJob = jobs[jobId];
        if (currentJob) {
            currentJob.cancel();
        }
    },
    createJob(jobId: string, payload: JobPayload) {
        const { date, title, body, link, token } = payload;
        scheduleLib.scheduleJob(jobId, date, async () => {
            console.log('log scheduled');
            const payload = {
                token,
                title,
                body,
                link,
            };
            return firebaseAdmin.sendNotification(payload);
        });
    },

    updateJob(jobId: string, payload: JobPayload) {
        this.deleteJob(jobId);
        this.createJob(jobId, payload);
    },

    updateScheduled: async (data: Schedule, token: string) => {
        const { date, title, body, noteId, link, uid } = data;
        try {
            const scheduledExisting = await ScheduledModel.findOne({ noteId });

            const jobPayload = { date, title, body, link, token };
            if (scheduledExisting) {
                const scheduledId = scheduledExisting._id.toString();
                await ScheduledModel.findOneAndUpdate({ noteId }, { date, title, body, link });
                scheduleService.updateJob(scheduledId, jobPayload);
            } else {
                const scheduled = await ScheduledModel.create({
                    noteId,
                    uid,
                    date,
                    title,
                    body,
                });
                scheduleService.createJob(scheduled._id.toString(), jobPayload);
            }
        } catch (error) {
            throw error;
        }
    },

    reScheduleds: async function () {
        try {
            const schedules = await ScheduledModel.find({});
            schedules.forEach(async (schedule) => {
                const scheduleId = schedule._id.toString();
                const scheduleTimeout = schedule.date;

                if (scheduleTimeout > new Date()) {
                    scheduleLib.scheduleJob(scheduleId, scheduleTimeout, () => {
                        const payload = {
                            token: '',
                            title: schedule.title,
                            body: schedule.body,
                            link: '',
                        };
                        return firebaseAdmin.sendNotification(payload);
                    });
                } else {
                    await ScheduledModel.findByIdAndRemove(scheduleId);
                }
            });
        } catch (e) {
            throw e;
        }
    },

    deleteScheduled: async (noteId: string) => {
        try {
            const scheduled = await ScheduledModel.findOneAndDelete({ noteId });
            scheduleService.deleteJob(scheduled._id.toStrings());
        } catch (e) {
            throw e;
        }
    },

    updateScheduleds: async (uid: string, token?: string) => {
        const scheduleds = await ScheduledModel.find({ uid });

        scheduleds.forEach((scheduled) => {
            const scheduledId = scheduled._id.toString();
            const { date, title, body, link } = scheduled;
            if (token) {
                scheduleService.updateJob(scheduledId, {
                    date,
                    title,
                    body,
                    link,
                    token,
                });
            } else {
                scheduleService.deleteJob(scheduledId);
            }
        });
    },
};

export default scheduleService;
