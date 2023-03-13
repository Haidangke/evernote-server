import admin from 'firebase-admin';

interface MessageProps {
    notification: {
        title: string;
        body: string;
    };
    token: string;
}

const serviceAccount = require('../configs/firebase.config.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const message = {
    notification: {
        title: 'n',
        body: 'Body of the Notification',
    },
    token: 'fGp3HO0gjBZenMz8BGonT6:APA91bGJTrZbisy281j-gQAbrl5ptzwGIauLOW9Q44vkvoB6--KORn04qYsMaRBQlWBUNhu7qug-S7qcfL_iyyR7q6RsNlIomEeFEgIctWZ-lu5LjQBhjZ2ZcRfvAMMiu48dbsq-ZCnn',
};

function sendMessage(message: MessageProps) {
    admin.messaging().send(message);
}
export default sendMessage;
