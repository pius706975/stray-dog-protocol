import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || "STAGING";
dotenv.config({ path: path.join(__dirname, "..", "..", `.env.${env}`) });

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
            /\n/gm,
            '\n',
        ),
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        project_id: process.env.FIREBASE_PROJECT_ID,
    }),
    storageBucket: process.env.FIREBASE_PROJECT_STORAGE_BUCKET,
});

export default firebaseAdmin;
