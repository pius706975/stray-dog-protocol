import mongoose from 'mongoose';

const shipHistorySchema = new mongoose.Schema({
    shipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ship',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rentStartDate: {
        type: Date,
        required: true,
    },
    rentEndDate: {
        type: Date,
        required: true,
    },
    // renterId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
    locationDestination: {
        type: String,
        required: true,
    },
    locationDeparture: {
        type: String,
        required: true,
    },
    source: {
        enum: ['manual', 'automatic'],
        type: String,
        required: true,
    },
    needs: {
        type: String,
    },
    renterCompanyName: {
        type: String,
    },
    genericDocument: [
        {
            fileName: { type: String },
            fileUrl: { type: String },
        },
    ],
    deleteStatus: {
        type: String,
        enum: ['undefined', 'pending', 'approved', 'rejected'],
        default: 'undefined',
    },
});

const ShipHistory = mongoose.model('ShipHistory', shipHistorySchema);

export default ShipHistory;
