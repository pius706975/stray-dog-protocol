import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import * as rfs from 'rotating-file-stream';
import Notification from './models/Notification';
import Ship from './models/Ship';
import adminRouter from './routes/adminRoute';
import authRouter from './routes/authRoute';
import docUploadRouter from './routes/docUploadRouter';
import helperRoute from './routes/helperRoute';
import renterRoute from './routes/renterRoute';
import shipOwnerRoute from './routes/shipOwnerRoute';
import shipRoute from './routes/shipRoute';
import userRouter from './routes/userRoute';
import firebaseAdmin from './utils/firebaseAdmin';
import agenda from './utils/agenda';
import Transaction from './models/Transaction';
import moment from 'moment';
import momenttz from 'moment-timezone'
import { healthRouter } from './healthCheck';

const app = express();
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const port = process.env.PORT;
const db = process.env.DATABASE_URL;

const logDirectory = path.join(__dirname, 'logs');

const swaggerDocs = require('./utils/swagger');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory,
});

app.use(express.json());

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(cors());
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));

agenda.define('sendShipReminder', async job => {
    const { token, shipId, userId } = job.attrs.data;

    try {
        const ship = await Ship.findOne({ _id: shipId });

        await firebaseAdmin.messaging().send({
            notification: {
                title: 'Ship availability reminder',
                body: `${ship.name} is available today!`,
            },
            token,
            android: {
                priority: 'high',
            },
        });

        const newNotification = new Notification({
            userId: userId,
            shipId: ship.id,
            notifType: 'shipReminder',
            title: 'Ship availability reminder',
            body: `${ship.name} is available today!`,
            isReaded: false,
        });

        await newNotification.save();
    } catch (error) {
        console.log('agenda error', error);
    }
});

agenda.define('sendPaymentReminder', async job => {
    const { token, rentalId, userId } = job.attrs.data;
    console.log('sendPaymentReminder', rentalId);
    try {
        const transaction = await Transaction.findOne({ rentalId: rentalId });

        await firebaseAdmin.messaging().send({
            notification: {
                title: 'Payment reminder',
                body: `Don't forget to pay your rental for ${transaction.rentalId} in 2 days!`,
            },
            token,
            android: {
                priority: 'high',
            },
        });

        const newNotification = new Notification({
            userId: userId,
            transactionId: transaction._id,
            rentalId: transaction.rentalId,
            notifType: 'paymentReminder',
            title: 'Payment reminder',
            body: `Don't forget to pay your rental for ${transaction.rentalId} in 2 days!`,
            isReaded: false,
        });

        await newNotification.save();

        transaction.addStatus('payment 1', 'Waiting for payment');
        const currentDateNewReceipt = moment(Date.now());
        const expireDateNewReceipt = currentDateNewReceipt.add(7, 'days');

        const newPayment = {
            paymentExpiredDate: expireDateNewReceipt,
            createdAt: new Date(),
        };

        await Transaction.findOneAndUpdate(
            { rentalId },
            {
                $push: {
                    payment: newPayment,
                },
            },
            { new: true },
        );

        transaction.save();
    } catch (error) {
        console.log('agenda error', error);
    }
});

agenda.define('autoUpdateReturningStatus', async job => {
    const transactionId = job.attrs.data;

    const tr = await Transaction.findById(transactionId);

    if (tr) {
        const latestSailingStatus = transaction.sailingStatus.length > 0 ? transaction.sailingStatus[transaction.sailingStatus.length -1].status : null

        if (latestSailingStatus !== 'returning') {
            const autoFillDesc = `${tr.ship.name} sedang kembali dari pelayaran`

            tr.sailingStatus.push({
                status: 'returning',
                desc: autoFillDesc,
                date: new Date(),
                trackedBy: {
                    name: 'System',
                    role: 'System'
                }
            });

            await tr.save()
        }
    }
});

agenda.on('ready', () => {
    agenda.start();
});

agenda.on('fail', (err, job) => {
    console.error(`Job failed with error: ${err.message}`);
});

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/renter', renterRoute);
app.use('/api/ship-owner', shipOwnerRoute);
app.use('/api/document-upload', docUploadRouter);
app.use('/api/ship', shipRoute);
app.use('/api/admin', adminRouter);
app.use('/api/helper', helperRoute);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    if (process.env.APP_ENV === 'LOCAL') {
        swaggerDocs(app);
    } else if (process.env.APP_ENV === 'STAGING') {
        swaggerDocs(app);
    }
});
