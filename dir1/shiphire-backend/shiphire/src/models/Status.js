import mongoose from 'mongoose';

export const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        requered: true,
    },
    desc: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    isOpened: {
        type: Boolean,
    },
});

const Status = mongoose.model('Status', statusSchema);

export default Status;
