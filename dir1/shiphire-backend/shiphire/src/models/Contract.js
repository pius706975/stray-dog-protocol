import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
    {
        ship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ship',
            required: true,
        },
        renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Renter',
            required: true,
        },
        shipOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShipOwner',
            required: true,
        },
        contractUrl: {
            type: String,
            required: true,
        },
        isAccepted: {
            type: Boolean,
            required: true,
        },
        signContractOTP: {
            type: Number,
        },
        renterCompanyName: {
            type: String,
        },
    },
    { timestamps: true },
);

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
