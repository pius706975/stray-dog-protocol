import ShipSpecification from '../models/ShipSpecification';
import ShipCategory from '../models/ShipCategory';

const shipSpecifications = [
    {
        shipCategory: 'Barge',
        name: 'Capacity',
        units: 'Tons',
    },
    {
        shipCategory: 'Tugboat',
        name: 'Towing Capacity',
        units: 'GVWR',
    },
    {
        shipCategory: 'Ferry',
        name: 'Vehicle Capacity',
        units: 'Units',
    },
    {
        shipCategory: 'Ferry',
        name: 'Passenger Capacity',
        units: 'Person',
    },
    {
        shipCategory: 'Ferry',
        name: 'Crew Capacity',
        units: 'Person',
    },
    {
        shipCategory: 'Tugboat',
        name: 'Draft',
        units: 'Meter',
    },
    {
        shipCategory: 'Tugboat',
        name: 'Fuel Capacity',
        units: 'Liter',
    },
    {
        shipCategory: 'Tugboat',
        name: 'Traction',
        units: 'HP',
    },
    {
        shipCategory: 'Tugboat',
        name: 'Capacity',
        units: 'Tons',
    },
    {
        shipCategory: 'Ferry',
        name: 'Max Speed',
        units: 'Knot',
    },
    {
        shipCategory: 'Ferry',
        name: 'Fuel Capacity',
        units: 'Liter',
    },
    {
        shipCategory: 'Self Propelled Oil Barge',
        name: 'Design Speed',
        units: 'Liters/Hour',
    },
    {
        shipCategory: 'Self Propelled Oil Barge',
        name: 'Accomodation',
        units: 'Person',
    },
    {
        shipCategory: 'Self Propelled Oil Barge',
        name: 'Cargo Tank Capacity',
        units: 'm3',
    },
    {
        shipCategory: 'Self Propelled Oil Barge',
        name: 'Cargo Tank Capacity',
        units: 'm3',
    },
    {
        shipCategory: 'Self Propelled Oil Barge',
        name: 'Fuel Oil Tank',
        units: 'm3',
    },
    {
        shipCategory: 'Self Propelled Oil Barge',
        name: 'Fresh Water Tank',
        units: 'm3',
    },
    {
        shipCategory: 'Self Propelled Oil Barge',
        name: 'Slope Tank',
        units: 'm3',
    },
    {
        shipCategory: 'Landing Craft Tank',
        name: 'Capacity',
        units: 'Tons',
    },
];

export const seedShipSpecifications = async () => {
    try {
        shipSpecifications.map(async shipSpecification => {
            const shipCategory = await ShipCategory.findOne({
                name: shipSpecification.shipCategory,
            });
            const shipSpecificationAdded = new ShipSpecification({
                name: shipSpecification.name,
                units: shipSpecification.units,
                shipCategory: shipCategory._id,
            });
            await shipSpecificationAdded.save();
            console.log(`Ship Specification ${shipSpecification.name} added`);
        });
    } catch (error) {
        console.log(error);
    }
};
