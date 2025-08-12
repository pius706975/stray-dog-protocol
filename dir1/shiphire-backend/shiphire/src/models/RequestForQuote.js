import mongoose from 'mongoose';

const requestForQuoteSchema = new mongoose.Schema(
    {
        ship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ship',
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShipCategory',
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
        rfqUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const RequestForQuote = mongoose.model(
    'RequestForQuote',
    requestForQuoteSchema,
);

export default RequestForQuote;
