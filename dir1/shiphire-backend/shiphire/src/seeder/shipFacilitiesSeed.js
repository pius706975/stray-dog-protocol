import ShipFacility from '../models/ShipFacility';
import ShipCategory from '../models/ShipCategory';
import ShipFacilityCategory from '../models/ShipFacilityCategory';

const shipFacilities = [
    {
        name: 'Cranes',
        facilityCategory: 'Cargo Handling Equipment',
        shipCategory: ['Barge'],
    },
    {
        name: 'Pumps',
        facilityCategory: 'Cargo Handling Equipment',
        shipCategory: ['Barge'],
    },
    {
        name: 'Conveyor Belt',
        facilityCategory: 'Cargo Handling Equipment',
        shipCategory: ['Barge'],
    },
    {
        name: 'Telescopic Cranes',
        facilityCategory: 'Deck Cranes',
        shipCategory: ['Barge'],
    },
    {
        name: 'Hydraulic Winches',
        facilityCategory: 'Deck Cranes',
        shipCategory: ['Barge'],
    },
    {
        name: 'Open Deck Storage',
        facilityCategory: 'Storage',
        shipCategory: ['Barge'],
    },
    {
        name: 'Covered Storage',
        facilityCategory: 'Storage',
        shipCategory: ['Barge'],
    },
    {
        name: 'Electric Towing Winches',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'Hydraulic Towing Winches',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'Towing Hooks',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'GPS',
        facilityCategory: 'Navigation Aids',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'Radar',
        facilityCategory: 'Navigation Aids',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'Sonar',
        facilityCategory: 'Navigation Aids',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'VHF Radio',
        facilityCategory: 'Communication',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'Satellite Communication',
        facilityCategory: 'Communication',
        shipCategory: ['Tugboat'],
    },
    {
        name: 'Economy Class',
        facilityCategory: 'Passenger Seating',
        shipCategory: ['Ferry'],
    },
    {
        name: 'Business Class',
        facilityCategory: 'Passenger Seating',
        shipCategory: ['Ferry'],
    },
    {
        name: 'Car Deck',
        facilityCategory: 'Vehicle Deck',
        shipCategory: ['Ferry'],
    },
    {
        name: 'Truck Deck',
        facilityCategory: 'Vehicle Deck',
        shipCategory: ['Ferry'],
    },
    {
        name: 'First Class Lounge',
        facilityCategory: 'Passenger Lounge',
        shipCategory: ['Ferry'],
    },
    {
        name: 'Cafetaria',
        facilityCategory: 'Passenger Lounge',
        shipCategory: ['Ferry'],
    },
    {
        name: 'Wi-Fi',
        facilityCategory: 'Entertainment',
        shipCategory: ['Ferry'],
    },
    {
        name: 'TV Screens',
        facilityCategory: 'Entertainment',
        shipCategory: ['Ferry'],
    },
    {
        name: 'Music System',
        facilityCategory: 'Entertainment',
        shipCategory: ['Ferry'],
    },
    {
        name: 'Radar',
        facilityCategory: 'Communication',
        shipCategory: ['Self Propelled Oil Barge'],
    },
    {
        name: 'GPS',
        facilityCategory: 'Navigation Aids',
        shipCategory: ['Self Propelled Oil Barge'],
    },
    {
        name: 'Siren',
        facilityCategory: 'Communication',
        shipCategory: ['Self Propelled Oil Barge'],
    },
    {
        name: 'Magnetic Compass',
        facilityCategory: 'Navigation Aids',
        shipCategory: ['Self Propelled Oil Barge'],
    },
    {
        name: 'Deck',
        facilityCategory: 'Entertainment',
        shipCategory: ['Self Propelled Oil Barge'],
    },
    {
        name: 'Radio SSB',
        facilityCategory: 'Communication',
        shipCategory: ['Self Propelled Oil Barge'],
    },
    {
        name: 'Radio VHF',
        facilityCategory: 'Communication',
        shipCategory: ['Self Propelled Oil Barge'],
    },
    {
        name: 'Bulldozer Machine',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Landing Craft Tank'],
    },
    {
        name: 'Heavy Cargo',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Landing Craft Tank'],
    },
    {
        name: 'Dump Truck',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Landing Craft Tank'],
    },
    {
        name: 'Excavator',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Landing Craft Tank'],
    },
    {
        name: 'Loader',
        facilityCategory: 'Towing Equipment',
        shipCategory: ['Landing Craft Tank'],
    },
];

export const seedShipFacilities = async () => {
    try {
        shipFacilities.map(async shipFacility => {
            const facilityCategory = await ShipFacilityCategory.findOne({
                name: shipFacility.facilityCategory,
            });
            const shipCategory = await ShipCategory.findOne({
                name: shipFacility.shipCategory,
            });
            const shipFacilityAdded = new ShipFacility({
                name: shipFacility.name,
                facilityCategory: facilityCategory._id,
                shipCategory: shipCategory._id,
            });
            await shipFacilityAdded.save();
            console.log(`Ship Facility ${shipFacility.name} added`);
        });
    } catch (error) {
        console.log(error);
    }
};
