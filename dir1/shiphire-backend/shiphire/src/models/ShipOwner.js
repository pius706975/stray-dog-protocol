import mongoose from 'mongoose';

const shipOwnerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        ref: 'User',
        required: true,
    },
    ships: [
        {
            shipId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ship',
                required: true,
            },
            shipName: {
                type: String,
                ref: 'Ship',
                required: true,
            },
        },
    ],
    company: {
        name: {
            type: String,
        },
        companyType: {
            type: String,
        },
        address: {
            type: String,
        },
        bankName: {
            type: String,
        },
        bankAccountName: {
            type: String,
        },
        bankAccountNumber: {
            type: Number,
        },
        documentCompany: [
            {
                documentName: {
                    type: String,
                },
                documentUrl: {
                    type: String,
                },
            },
        ],
        imageUrl: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isRejected: {
            type: Boolean,
            default: false,
        },
    },
});

const ShipOwner = mongoose.model('ShipOwner', shipOwnerSchema);

export default ShipOwner;
