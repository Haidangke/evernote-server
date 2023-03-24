import admin from 'firebase-admin';

export interface FirebaseAdminPayload {
    title: string;
    body: string;
    token: string;
    link: string;
}

interface FirebaseAdmin {
    sendNotification: (payload: FirebaseAdminPayload) => void;
}

const serviceAccount = require('./firebase.config.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firebaseAdmin = {} as FirebaseAdmin;

firebaseAdmin.sendNotification = function (payload) {
    const message = {
        notification: {
            title: payload.title,
            body: payload.body,
        },
        token: payload.token,
        webpush: {
            fcmOptions: {
                link: payload.link,
            },
        },
    };
    return admin.messaging().send(message);
};

export default firebaseAdmin;
