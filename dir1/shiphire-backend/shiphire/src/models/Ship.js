import mongoose from 'mongoose';
import { type } from 'os';

const shipSchema = new mongoose.Schema({
    shipOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipOwner',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    province: {
        type: String,
    },
    city: {
        type: String,
    },
    desc: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipCategory',
        required: true,
    },
    tags: {
        type: [String],
    },
    size: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    shipDocuments: [
        {
            documentName: {
                type: String,
            },
            documentUrl: {
                type: String,
            },
            documentExpired: {
                type: Date,
            },
        },
    ],
    pricePerMonth: {
        type: Number,
        required: true,
    },
    facilities: [
        {
            type: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'FacilityCategory',
                required: true,
            },
            typeName: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            // desc: [
            //   {
            //     type: String,
            //   },
            // ],
        },
    ],
    specifications: [
        {
            spesificationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ShipSpecification',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            value: {
                type: Number,
            },
        },
    ],
    rating: [
        {
            rate: { type: Number },
            review: { type: String },
            // rentalId: { type: String },
        },
    ],
    averageRate: {
        type: Number
    },
    totalRentalCount: {
        type: Number,
        default: 0,
        required: true,
    },
    rfqDynamicForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DynamicForm',
    },
    shipApproved: {
        type: Boolean,
        default: false,
    },
});

const Ship = mongoose.model('Ship', shipSchema);

export default Ship;
