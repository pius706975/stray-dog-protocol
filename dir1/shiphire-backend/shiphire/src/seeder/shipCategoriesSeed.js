import ShipCategory from '../models/ShipCategory';

const shipCategories = [
    {
        name: 'Barge',
    },
    {
        name: 'Tugboat',
    },
    {
        name: 'Ferry',
    },
    {
        name: 'Self Propelled Oil Barge',
    },
    {
        name: 'Landing Craft Tank',
    },
];

export const seedShipCategories = async () => {
    try {
        for (const shipCategoryObj of shipCategories) {
            const shipCategory = new ShipCategory(shipCategoryObj);
            await shipCategory.save();
        }
        console.log('Seeding ship categories completed');
    } catch (error) {
        console.log(error);
    }
};
