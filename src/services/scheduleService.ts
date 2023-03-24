import scheduleLib from 'node-schedule';

import firebaseAdmin from '../firebase/firebaseAdmin';
import scheduleModel from '../models/scheduleModel';

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

    updateSchedule: async (data: Schedule, token: string) => {
        const { date, title, body, noteId, link, uid } = data;
        try {
            const scheduleExisting = await scheduleModel.findOne({ noteId });

            const jobPayload = { date, title, body, link, token };
            if (scheduleExisting) {
                const scheduleId = scheduleExisting._id.toString();
                await scheduleModel.findOneAndUpdate({ noteId }, jobPayload);
                scheduleService.updateJob(scheduleId, jobPayload);
            } else {
                const schedule = await scheduleModel.create({
                    noteId,
                    uid,
                    date,
                    title,
                    body,
                    token,
                    link,
                });
                scheduleService.createJob(schedule._id.toString(), jobPayload);
            }
        } catch (error) {
            throw error;
        }
    },

    reSchedules: async function () {
        try {
            const schedules = await scheduleModel.find({});
            schedules.forEach(async (schedule) => {
                console.log({ schedule });
                const scheduleId = schedule._id.toString();
                const scheduleTimeout = schedule.date;
                const token = schedule.token;
                const link = schedule.link;

                if (scheduleTimeout > new Date()) {
                    scheduleLib.scheduleJob(scheduleId, scheduleTimeout, () => {
                        const payload = {
                            token,
                            title: schedule.title,
                            body: schedule.body,
                            link,
                        };
                        return firebaseAdmin.sendNotification(payload);
                    });
                } else {
                    scheduleService.deleteJob(scheduleId);
                    await scheduleModel.findByIdAndRemove(scheduleId);
                }
            });
        } catch (e) {
            throw e;
        }
    },

    deleteSchedule: async (noteId: string) => {
        try {
            const schedule = await scheduleModel.findOneAndDelete({ noteId });
            scheduleService.deleteJob(schedule._id.toStrings());
        } catch (e) {
            throw e;
        }
    },
};

export default scheduleService;
