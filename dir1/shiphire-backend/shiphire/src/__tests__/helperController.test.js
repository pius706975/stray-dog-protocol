import ShipCategory from '../models/ShipCategory';
import Status from '../models/Status';
import ShipFacility from '../models/ShipFacility'
import ShipFacilityCategory from '../models/ShipFacilityCategory';
import ShipSpecification from '../models/ShipSpecification';
import { submitStatus, addFacilityCategory, addFacility, addShipSpesification, getShipFacilityByShipType, getShipSpesificationByShipType } from '../controller/helperController'

jest.mock('../models/Status')
jest.mock('../models/ShipCategory')
jest.mock('../models/ShipFacilityCategory')
jest.mock('../models/ShipFacility')
jest.mock('../models/ShipSpecification')

describe('addStatus', () => {
    it('should add status', async () => {
        const req = {
            body: {
                name: 'Test Status',
                desc: 'This is a test status',
                _id: "6541d4ab52f66cdd2385f527",
                __v: 0
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const statusInstance = new Status(req.body); // Creating an instance of Status with the request body

        statusInstance.save = jest.fn(); // Mocking the save function for the instance

        Status.mockReturnValueOnce(statusInstance); // Mocking the Status model to return the instance

        await submitStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: statusInstance });
    });

    it('should error', async () => {
        const req = {
            body: {
                name: 'Test Status',
                desc: 'This is a test status',
                _id: "1872129dadsasdas80d80",
                __v: 0
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const statusInstance = new Status(req.body); // Creating an instance of Status with the request body

        statusInstance.save = jest.fn().mockRejectedValue('something wrong'); // Mocking the save function for the instance

        Status.mockReturnValueOnce(statusInstance); // Mocking the Status model to return the instance

        await submitStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500); // Check the status code for error
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'something wrong' });
    })
});

describe('should add facility category', () => {
    it('should adding facility category', async () => {
        const req = {
            body: {
                name: 'Testing Category',
                _id: '6541e9a5205fad4c91c302e2',
                __v: 0
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const instance = new ShipFacilityCategory(req.body);

        instance.save = jest.fn();

        ShipFacilityCategory.mockReturnValueOnce(instance);

        await addFacilityCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: instance })
    })

    it('should error adding facility category', async () => {
        const req = {
            body: {
                name: 'Testing Category',
                _id: '6541e9a5205fad4c91c302e2',
                __v: 0
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const instance = new ShipFacilityCategory(req.body);

        instance.save = jest.fn().mockRejectedValue('something wrong');

        ShipFacilityCategory.mockReturnValueOnce(instance);

        await addFacilityCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'something wrong' })
    })
})

/* Still Error (addFacility) */
describe('addFacility', () => {
    it('should add a facility', async () => {
        const req = {
            body: {
                name: "Office",
                facilityCategory: {
                    _id: "6540a931a4e3fa55f0ff1fec"
                },
                shipCategory: [
                    "6540a930a4e3fa55f0ff1fd8"
                ],
                _id: "6543156fe3a9fcb0245628f3",
                __v: 0
            },
        };

        // ShipFacilityCategory.findOne = jest.fn().mockResolvedValue({ _id: '6540a931a4e3fa55f0ff1fec' });
        ShipFacilityCategory.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({ _id: '6540a931a4e3fa55f0ff1fec' })
        })

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({ _id: '6540a930a4e3fa55f0ff1fd8' })
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const facilityAdded = new ShipFacility({
            name: req.body.name,
            shipCategory: req.body.shipCategory,
            facilityCategory: req.body.facilityCategory._id,
        });

        facilityAdded.save = jest.fn();

        ShipFacility.mockReturnValueOnce(facilityAdded);

        await addFacility(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: facilityAdded })
    });

    it('should error adding facility', async () => {
        const req = {
            body: {
                name: "Office",
                facilityCategory: {
                    _id: "6540a931a4e3fa55f0ff1fec"
                },
                shipCategory: [
                    "6540a930a4e3fa55f0ff1fd8"
                ],
                _id: "6543156fe3a9fcb0245628f3",
                __v: 0
            },
        };

        ShipFacilityCategory.findOne.mockReturnValue({
            select: jest.fn().mockRejectedValue('Ship Facility Category doesnt exist')
        })

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockRejectedValue('Ship Category doesnt exist')
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addFacility(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'Ship Facility Category doesnt exist' })
    });
})

describe('addShipSpecification', () => {
    it('should adding ship specification', async () => {
        const req = {
            body: {
                shipCategory: {
                    _id: "6540a930a4e3fa55f0ff1fd8"
                },
                name: "Tarikan",
                units: "meter",
                _id: "654322d2adcfa32f2eb11208",
                __v: 0
            },
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({ _id: '6540a930a4e3fa55f0ff1fd8' })
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const shipSpec = new ShipSpecification({
            name: req.body.name,
            units: req.body.units,
            shipCategory: req.body.shipCategory._id,
        });

        shipSpec.save = jest.fn();

        ShipSpecification.mockReturnValueOnce(shipSpec);

        await addShipSpesification(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: shipSpec });
    });

    it('should error adding ship specification', async () => {
        const req = {
            body: {
                shipCategory: {
                    _id: "6540a930a4e3fa55f0ff1fd8"
                },
                name: "Tarikan",
                units: "meter",
                _id: "654322d2adcfa32f2eb11208",
                __v: 0
            },
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockRejectedValue('Error adding ship specification')
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addShipSpesification(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'Error adding ship specification' });
    });
})

describe('getShipFacilityByShipType', () => {
    it('should return 404 and fail category not found', async () => {
        const fakeShipFacilities = {
            _id: '6540a931a4e3fa55f0ff2069',
            name: "Entertainment",
            facilityCategory: '6540a931a4e3fa55f0ff1fec',
            shipCategory: '6540a947fhg776575xghbfd8',
            __v: 0
        }

        const req = {
            params: {
                shipType: 'Entertainment'
            }
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await getShipFacilityByShipType(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'Ship Category not found' });
    })

    it('should return ship facility by type', async () => {
        const fakeShipFacilities = {
            _id: '6540a931a4e3fa55f0ff2069',
            name: "Entertainment",
            facilityCategory: '6540a931a4e3fa55f0ff1fec',
            shipCategory: '6540a947fhg776575xghbfd8',
            __v: 0
        }

        const req = {
            params: {
                shipType: 'Entertainment'
            }
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(fakeShipFacilities.shipCategory)
        })

        ShipFacility.find.mockReturnValue({
            select: jest.fn().mockResolvedValue(fakeShipFacilities.name)
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await getShipFacilityByShipType(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: fakeShipFacilities.name });
    })

    it('should error returning ship facility by type', async () => {
        const req = {
            params: {
                shipType: 'Entertainment'
            }
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockRejectedValue('Error')
        })

        ShipFacility.find.mockReturnValue({
            select: jest.fn().mockRejectedValue('Error')
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await getShipFacilityByShipType(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'Error' });
    })
})

describe('getShipSpecificationByShipType', () => {
    it('should return 404 and fail category not found', async () => {
        const fakeShipFacilities = {
            _id: '6540a931a4e3fa55f0ff2069',
            name: "Entertainment",
            facilityCategory: '6540a931a4e3fa55f0ff1fec',
            shipCategory: '6540a947fhg776575xghbfd8',
            __v: 0
        }

        const req = {
            params: {
                shipType: 'Entertainment'
            }
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await getShipSpesificationByShipType(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'Ship Category not found' });
    })

    it('should return ship specification by type', async () => {
        const fakeShipSpecifications =
        {
            _id: "6540a931a4e3fa55f0ff2029",
            shipCategory: 'Ferry',
            name: "Vehicle Capacity",
            units: "Units"
        };

        const req = {
            params: {
                shipType: 'Ferry'
            }
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({ shipCategory: 'Ferry' })
        })

        ShipSpecification.find.mockReturnValue({
            select: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({ name: 'Vehicle Capacity', units: 'Units' }),
            }),
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await getShipSpesificationByShipType(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { name: fakeShipSpecifications.name, units: fakeShipSpecifications.units } });
    })

    it('should error return ship specification by type', async () => {
        const req = {
            params: {
                shipType: 'Tugboat'
            }
        };

        ShipCategory.findOne.mockReturnValue({
            select: jest.fn().mockRejectedValue('Error')
        })

        ShipSpecification.find.mockReturnValue({
            select: jest.fn().mockRejectedValue('Error'),
            select: jest.fn().mockRejectedValue('Error')
        })

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await getShipSpesificationByShipType(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'Error' });
    })
})

