import mongoose from 'mongoose';

const renterSchema = new mongoose.Schema({
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
    renterPreference: {
        type: [String],
    },
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
    shipReminded: [
        {
            ship: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Ship',
                },
                reminderDate: {
                    type: Date,
                },
            },
        },
        { timestamps: true },
    ],
});

const Renter = mongoose.model('Renter', renterSchema);

export default Renter;
