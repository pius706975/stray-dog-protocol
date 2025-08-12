import moment from 'moment';
import mongoose from 'mongoose';
import { statusSchema } from './Status';
import { timeStamp } from 'console';

const transactionSchema = new mongoose.Schema(
    {
        rentalId: {
            type: String,
            required: true,
        },
        renterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Renter',
            required: true,
        },
        offeredPrice: {
            type: Number,
        },
        rentalDuration: {
            type: Number,
            required: true,
        },
        rentalStartDate: {
            type: Date,
            required: true,
        },
        rentalEndDate: {
            type: Date,
            required: true,
        },
        needs: {
            type: String,
        },
        locationDestination: {
            type: String,
        },
        locationDeparture: {
            type: String,
        },
        ship: {
            shipId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ship',
            },
            shipOwnerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ShipOwner',
            },
            name: {
                type: String,
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ShipCategory',
            },
            imageUrl: {
                type: String,
            },
            size: {
                length: { type: Number },
                width: { type: Number },
                height: { type: Number },
            },
            shipDocument: [
                {
                    documentName: { type: String },
                    documentUrl: { type: String },
                    documentExpired: {
                        type: Date,
                    },
                },
            ],
        },
        rfq: {
            rfqId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            rfqUrl: {
                type: String,
                required: true,
            },
        },
        proposal: [
            {
                proposalId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Proposal',
                },
                proposalUrl: {
                    type: String,
                },
                notes: {
                    type: String,
                },
                additionalImage: [
                    {
                        imageUrl: { type: String },
                        imageDescription: { type: String },
                    },
                ],
                offeredPrice: {
                    type: Number,
                },
            },
        ],
        contract: {
            contractId: {
                type: mongoose.Schema.Types.ObjectId,
            },
            contractUrl: {
                type: String,
            },
        },
        status: [
            {
                type: statusSchema,
                required: true,
            },
        ],
        // paymentExpireDate: {
        //     type: Date,
        // },
        // receiptUrl: {
        //     type: String,
        // },
        // paymentAprroved: {
        //     type: Boolean,
        // },
        payment: [
            {
                paymentId: {
                    type: String,
                },
                receiptUrl: {
                    type: String,
                },
                paymentApproved: {
                    type: Boolean,
                },
                paymentExpiredDate: {
                    type: Date,
                },
                paymentReminded: [
                    {
                        reminderDate: {
                            type: Date,
                        },
                    },
                ],
                createdAt: {
                    type: Date,
                },
            },
        ],
        shipRentType: {
            type: String,
            enum: ['One Time Rent', 'Monthly Rent'],
            required: true,
        },
        sailingStatus: [
            {
                status: {
                    type: String,
                    enum: [
                        'beforeSailing',
                        'sailing',
                        'returning',
                        'afterSailing',
                    ],
                    default: 'beforeSailing',
                },
                desc: {
                    type: String,
                },
                image: [
                    {
                        imageName: {
                            type: String,
                        },
                        imageUrl: {
                            type: String,
                        },
                    },
                ],
                trackedBy: {
                    name: {
                        type: String,
                    },
                    role: {
                        type: String,
                    },
                },
                date: {
                    type: Date,
                },
            },
        ],
        beforeSailingPictures: [
            {
                documentName: { type: String },
                documentUrl: { type: String },
                description: { type: String },
            },
        ],
        afterSailingPictures: [
            {
                documentName: { type: String },
                documentUrl: { type: String },
                beforeSailingPictureId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Transaction.beforeSailingPictures',
                },
            },
        ],
        isReviewed: {
            type: Boolean,
        }
        // trackingHistory: [
        //     trackingSchema
        // ]
    },
    { timestamps: true },
);

transactionSchema.methods.addStatus = function (name, desc, isOpened = false) {
    const currentDate = moment(Date.now());
    this.status.push({ name, desc, date: currentDate, isOpened });
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
