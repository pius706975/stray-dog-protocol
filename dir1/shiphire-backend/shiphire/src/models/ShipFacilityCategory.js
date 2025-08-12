import mongoose from 'mongoose';

const shipFacilityCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ShipFacilityCategory = mongoose.model(
    'ShipFacilityCategory',
    shipFacilityCategorySchema,
);

export default ShipFacilityCategory;
