import mongoose from 'mongoose';

const shipFacilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    facilityCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipFacilityCategory',
        required: true,
    },
    shipCategory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShipCategory',
            required: true,
        },
    ],
});

const ShipFacility = mongoose.model('ShipFacility', shipFacilitySchema);

export default ShipFacility;
