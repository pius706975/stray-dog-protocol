import mongoose from 'mongoose';

const shipCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const ShipCategory = mongoose.model('ShipCategory', shipCategorySchema);

export default ShipCategory;
