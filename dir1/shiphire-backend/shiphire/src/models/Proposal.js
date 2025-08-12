import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
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
        draftContract: {
            type: String,
            required: true,
        },
        isAccepted: {
            type: Boolean,
            required: true,
        },
        signProposalOTP: {
            type: Number,
        },
        otherDoc: [
            {
                documentName: {
                    type: String,
                },
                documentUrl: {
                    type: String,
                },
            },
        ],
    },
    { timestamps: true },
);

const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;
