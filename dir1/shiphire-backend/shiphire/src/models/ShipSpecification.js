import mongoose from 'mongoose';

const shipSpecificationSchema = new mongoose.Schema({
    shipCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipCategory',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    units: {
        type: String,
        required: true,
    },
});

const ShipSpecification = mongoose.model(
    'ShipSpecification',
    shipSpecificationSchema,
);

export default ShipSpecification;
