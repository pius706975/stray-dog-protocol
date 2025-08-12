import mongoose from 'mongoose';

const notifScheme = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        shipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ship',
        },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
        rentalId: {
            type: String,
        },
        notifType: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        isReaded: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Notification = mongoose.model('Notification', notifScheme);

export default Notification;
