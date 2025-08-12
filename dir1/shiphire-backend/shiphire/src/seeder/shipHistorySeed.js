/* eslint-disable no-console */
import ShipHistory from '../models/ShipHistory';
import Ship from '../models/Ship';
import moment from 'moment';

const todayDate = moment(Date.now());
const shipHistory = [
    {
        shipName: 'MV Seaside Voyager',
        //subtract 2 tahun
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(2, 'years').toDate(),
        rentEndDate: moment(todayDate)
            .subtract(2, 'years')
            .add(2, 'days')
            .toDate(),
        locationDestination: 'Thriller Bark',
        locationDeparture: 'Water 7',
        source: 'automatic',
    },
    {
        shipName: 'MV Seaside Voyager',
        //subtract 2 tahun
        price: '50000000',
        rentStartDate: moment(todayDate)
            .subtract(2, 'years')
            .add(4, 'days')
            .toDate(),
        rentEndDate: moment(todayDate)
            .subtract(2, 'years')
            .add(7, 'days')
            .toDate(),
        locationDestination: 'Sabaody Archipelago',
        locationDeparture: 'Thriller Bark',
        source: 'automatic',
    },
    //timeskip 2 tahun
    {
        shipName: 'MV Seaside Voyager',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(36, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(35, 'days').toDate(),
        locationDestination: 'Fishman Island',
        locationDeparture: 'Sabaody Archipelago',
        source: 'automatic',
    },
    {
        shipName: 'MV Seaside Voyager',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(31, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(29, 'days').toDate(),
        locationDestination: 'Punk Hazard',
        locationDeparture: 'Fishman Island',
        source: 'automatic',
    },
    {
        shipName: 'MV Seaside Voyager',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(28, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(21, 'days').toDate(),
        locationDestination: 'Dressrosa',
        locationDeparture: 'Punk Hazard',
        source: 'automatic',
    },
    {
        shipName: 'MV Seaside Voyager',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(19, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(13, 'days').toDate(),
        locationDestination: 'Zou',
        locationDeparture: 'Dressrosa',
        source: 'automatic',
    },
    {
        shipName: 'MV Seaside Voyager',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(10, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(6, 'days').toDate(),
        locationDestination: 'Whole Cake Island',
        locationDeparture: 'Zou',
        source: 'automatic',
    },
    {
        shipName: 'MV Seaside Voyager',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(4, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(1, 'days').toDate(),
        locationDestination: 'Wano Country',
        locationDeparture: 'Whole Cake Island',
        source: 'automatic',
    },
    {
        shipName: 'MV Seaside Voyager',
        price: '50000000',
        rentStartDate: moment(todayDate).toDate(),
        rentEndDate: moment(todayDate).add(3, 'days').toDate(),
        locationDestination: 'Egg Head',
        locationDeparture: 'Wano Country',
        source: 'automatic',
    },
    {
        shipName: 'Barge Hauler',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(40, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(35, 'days').toDate(),
        locationDestination: 'Samarinda',
        locationDeparture: 'Balikpapan',
        source: 'automatic',
    },
    {
        shipName: 'Barge Hauler',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(30, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(25, 'days').toDate(),
        locationDestination: 'Samarinda',
        locationDeparture: 'Balikpapan',
        source: 'automatic',
    },
    // {
    //     shipName: 'Barge Hauler',
    //     price: '50000000',
    //     rentStartDate: moment(todayDate).subtract(3, 'days').toDate(),
    //     rentEndDate: moment(todayDate).add(3, 'days').toDate(),
    //     locationDestination: 'Egg Head',
    //     locationDeparture: 'Wano Country',
    //     source: 'automatic',
    // },
    {
        shipName: 'Barge Hauler',
        price: '50000000',
        rentStartDate: moment(todayDate).subtract(20, 'days').toDate(),
        rentEndDate: moment(todayDate).subtract(15, 'days').toDate(),
        locationDestination: 'Kutai Timur',
        locationDeparture: 'Kutai Barat',
        source: 'automatic',
    },
];

export const seedShipHistory = async () => {
    try {
        shipHistory.forEach(async (ship, index) => {
            const shipExist = await Ship.findOne({ name: ship.shipName });
            if (!shipExist) {
                throw new Error('Ship does not exist');
            } else {
                // for (let i = 0; i < shipHistory.length; i++) {
                const newShipHistory = new ShipHistory({
                    shipId: shipExist._id,
                    price: ship.price,
                    rentStartDate: ship.rentStartDate,
                    rentEndDate: ship.rentEndDate,
                    locationDestination: ship.locationDestination,
                    locationDeparture: ship.locationDeparture,
                    source: ship.source,
                });
                console.log(`Ship history ${index + 1} added`);
                await newShipHistory.save();
                // }
            }
        });
    } catch (error) {
        console.error('Error seeding ship history: ', error.message || error);
    }
};
