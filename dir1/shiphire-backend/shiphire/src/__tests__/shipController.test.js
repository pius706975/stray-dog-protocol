import {
    addShipRFQForm,
    deleteShipHistory,
    editShipHistory,
    getAllShip,
    getAllShipHistoryPending,
    getPopularShips,
    getSearchShip,
    getShipCategories,
    getShipRFQForm,
    getShipbyId,
    getShipByLocation,
    getTopRatedShips,
} from '../controller/shipController';
import DynamicForm from '../models/DynamicForm';
import Ship from '../models/Ship';
import ShipCategory from '../models/ShipCategory';
import ShipHistory from '../models/ShipHistory';
import firebaseAdmin from '../utils/firebaseAdmin';

jest.mock('../models/ShipCategory');
jest.mock('../models/Ship');
jest.mock('../models/ShipHistory');
jest.mock('../models/DynamicForm');

jest.mock('../utils/firebaseAdmin', () => ({
    storage: jest.fn().mockReturnThis(),
    bucket: jest.fn().mockReturnThis(),
}));

describe('getShipCategories', () => {
    it('should return all ship categories', async () => {
        const fakeShipCategories = [
            {
                _id: '653f53804b82b784422aa4c4',
                name: 'Barge',
            },
            {
                _id: '653f53804b82b784422aa4c6',
                name: 'Tugboat',
            },
            {
                _id: '653f53804b82b784422aa4c8',
                name: 'Ferry',
            },
        ];

        ShipCategory.find.mockResolvedValue(fakeShipCategories);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeShipCategories,
        });
    });

    it('should return a 404 status when no categories are found', async () => {
        ShipCategory.find.mockResolvedValue([]);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No categories found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        ShipCategory.find.mockRejectedValue('Some database error');

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getAllShip', () => {
    it('should return all ships', async () => {
        const fakeShips = [{ name: 'Ship 1' }, { name: 'Ship 2' }];
        const fakeCategories = [{ name: 'Category 1' }, { name: 'Category 2' }];
        const fakeShipOwnerId = { company: 'Company 1' };
        // Ship.find.mockReturnThis();
        // Ship.find().populate.mockReturnValue({
        //     populate: jest.fn().mockResolvedValue(fakeShips),
        // });
        const populateMock = jest.fn();
        Ship.find.mockReturnThis();
        Ship.find().populate = jest.fn(field => {
            if (field === 'category') {
                return {
                    populate: jest.fn().mockResolvedValue(fakeShips),
                };
            }
            if (field === 'shipOwnerId') {
                return {
                    populate: jest.fn().mockResolvedValue(fakeShips),
                };
            }
            return {
                populate: populateMock,
            };
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllShip(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeShips,
        });
    });

    it('should return a 404 status when no ships are found', async () => {
        Ship.find.mockReturnThis();
        Ship.find().populate.mockReturnValue({
            populate: jest.fn().mockResolvedValue([]),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllShip(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Ship.find.mockReturnThis();
        Ship.find().populate.mockReturnValue({
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllShip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getPopularShips', () => {
    it('should return all popular ships', async () => {
        const fakeShips = [{ name: 'Ship 1' }, { name: 'Ship 2' }];

        // Mock the initial find method
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(fakeShips),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getPopularShips(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeShips,
        });
    });

    it('should return a 404 status when no ships are found', async () => {
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue([]),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getPopularShips(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No popular ships found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getPopularShips(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getTopRatedShips', () => {
    it('should return all top rated ships', async () => {
        const fakeShips = [{ name: 'Ship 1' }, { name: 'Ship 2' }];

        // Mock the initial find method
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(fakeShips),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTopRatedShips(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeShips,
        });
    });

    it('should return a 404 status when no ships are found', async () => {
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue([]),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTopRatedShips(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No top-rated ships found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTopRatedShips(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getShipbyId', () => {
    it('should return a ship by ID with populated fields', async () => {
        // Mock the find and populate methods of the Ship model
        const fakeShip = {
            _id: 'fakeId',
            name: 'Ship 1',
            facilities: [{ name: 'Facility 1' }],
            specifications: [{ name: 'Spec 1' }],
            category: 'Category 1',
            shipOwnerId: { company: 'Company 1' },
        };

        const fakeShipHistory = [{ rentStartDate: '2023-01-01' }];

        Ship.findOne.mockReturnThis();
        Ship.findOne().populate.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockReturnValue({
                            populate: jest.fn().mockResolvedValue(fakeShip),
                        }),
                    }),
                }),
            }),
        });

        // Ship.findOne()
        //     .populate()
        //     .populate()
        //     .populate()
        //     .populate.mockResolvedValue(fakeShip);

        // Mock the ShipHistory model
        ShipHistory.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(fakeShipHistory),
        });

        const req = {
            params: { id: '1234' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const shipWithHistory = {
            ...fakeShip._doc,
            shipHistory: fakeShipHistory,
        };

        await getShipbyId(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: shipWithHistory,
        });
    });

    it('should return a 404 status when no ship is found', async () => {
        Ship.findOne.mockReturnThis();
        Ship.findOne().populate.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockResolvedValue(null),
                    }),
                }),
            }),
        });

        const req = {
            params: { id: '1234' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipbyId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No ship found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Ship.findOne.mockReturnThis();
        Ship.findOne().populate.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest
                            .fn()
                            .mockRejectedValue('Some database error'),
                    }),
                }),
            }),
        });

        const req = {
            params: { id: '1234' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipbyId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getSearchShip', () => {
    it('should return filtered ships', async () => {
        // Define fake data for the request query
        const req = {
            query: {
                searchTerm: 'searchTermValue',
                category: 'categoryValue',
                province: 'provinceValue',
                city: 'cityValue',
                inputRentEndDate: 'endDateValue',
                inputRentStartDate: 'startDateValue',
            },
        };

        // Define the expected result
        const expectedData = [
            {
                _id: '653f53814b82b784422aa567',
                imageUrl:
                    'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Barge%20Hauler?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=BmuSrc1ujivUWLEr4nH6YW%2BDrF5AAYBC5ILuijc3IZLecUPbajy6p8BF4KbtCJi9n7Ud0UjRvYrW%2FdNXN2S%2Bg2ie1vNu9XOAG0QFRwx03WKcyJ4X4oODpwgiI1j9RLCX2c4vFXAMjvlsqGMoZqLkEEn7pMnLu0lX8RxnZgE5Iv5JH%2FjiRG3LfpcDTmOgf9LECum01nS%2BW%2Bcto7Vs3g2YpanAWCvaq5vvwU3G765WhumhBPRNoQwMAAlqgXdZAEzQ4hqfrF3Fc8V9GmcGQVm2YwL2eNdZmR0djWWGU5gZx6opiCjwJlirmgJfAy4Q%2BB3LRoi7Zhh9xtZdOZm2Tz4j0g%3D%3D',
                name: 'Barge Hauler',
                companyName: 'Fauzan Company',
                categories: 'Barge',
                province: 'Kalimantan Timur',
                city: 'Samarinda',
                pricePerMonth: 900000000,
                rating: 5,
                rentStartDate: '2023-09-20T06:55:57.250Z',
                rentEndDate: '2023-09-25T06:55:57.250Z',
            },
            {
                _id: '653f53814b82b784422aa580',
                imageUrl:
                    'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Swift%20Tow?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=fAR%2FBvTTGbnZSdgIBWl0QKJAmfX5YuY99zgQNuDLngxOWPlMkWptx7L171j0REuFrlylqZ%2F1uIrxm9NvRnDfNiGpg7CnaGsbwD6iXb3syF%2F8rFJROSYWJmAD%2B2sKqWDaRptZzJ3zXCiLK6hrgMruuf9N9pifLx4xX%2FRJy%2Fu2WBsaOMb0GcfFoEh7u9lRZ2vaX4QRjVuTlOMlYB669IIhXvLHSB651nHWZ6Nl0ceTgfHEEkOJb9nCMRWtt7Z2YU5YP98QK4416twCTHhe24UGjlX3Az18V7%2FbU6%2BJf85A3Jy2H%2BzUc3SlhTGS4sxh5BIaoM6b6%2FCq92TfiVLL2r5PWA%3D%3D',
                name: 'Swift Tow',
                companyName: 'Fauzan Company',
                categories: 'Tugboat',
                province: 'Kalimantan Timur',
                city: 'Balikpapan',
                pricePerMonth: 110000000,
                rating: 5,
                rentStartDate: null,
                rentEndDate: null,
            },
        ];

        // Mock the Ship model methods and query result
        Ship.aggregate = jest.fn().mockReturnValue(expectedData);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getSearchShip(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedData,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Ship.aggregate = jest.fn().mockRejectedValue('Some database error');

        const req = {
            query: {
                searchTerm: 'searchTermValue',
                category: 'categoryValue',
                province: 'provinceValue',
                city: 'cityValue',
                inputRentEndDate: 'endDateValue',
                inputRentStartDate: 'startDateValue',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getSearchShip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getShipRFQForm', () => {
    it('should return a dynamic form with populated fields', async () => {
        const fakeDynamicForm = {
            ship: {
                name: 'Ship 1',
                facilities: [{ name: 'Facility 1' }],
                specifications: [{ name: 'Spec 1' }],
                category: 'Category 1',
                shipOwnerId: { company: 'Company 1' },
            },
        };

        // Mock the findOne method
        DynamicForm.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeDynamicForm),
        });

        const req = {
            params: { id: 'yourDynamicFormId' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipRFQForm(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeDynamicForm,
        });
    });

    it('should return a 404 status when no dynamic form is found', async () => {
        DynamicForm.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        const req = {
            params: { id: 'yourDynamicFormId' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipRFQForm(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No dynamic form found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        DynamicForm.findOne.mockReturnValue({
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {
            params: { id: 'yourDynamicFormId' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipRFQForm(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('deleteShipHistory', () => {
    it('should delete a ship history', async () => {
        const fakeShipHistory = {
            _id: 'fakeId',
            deleteStatus: 'undefined',
            save: jest.fn(),
        };

        ShipHistory.findOne.mockResolvedValue(fakeShipHistory);

        const req = {
            body: { id: 'fakeId' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await deleteShipHistory(req, res);

        expect(ShipHistory.findOne).toHaveBeenCalledWith({ _id: 'fakeId' });
        expect(fakeShipHistory.deleteStatus).toBe('pending');
        expect(fakeShipHistory.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeShipHistory,
        });
    });

    it('should return a 404 status when no ship history is found', async () => {
        ShipHistory.findOne.mockResolvedValue(null);

        const req = {
            body: { id: 'fakeId' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await deleteShipHistory(req, res);

        expect(ShipHistory.findOne).toHaveBeenCalledWith({ _id: 'fakeId' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No ship history found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const errorMessage = 'Some error message';
        ShipHistory.findOne.mockRejectedValue(errorMessage);

        const req = {
            body: { id: 'fakeId' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await deleteShipHistory(req, res);

        expect(ShipHistory.findOne).toHaveBeenCalledWith({ _id: 'fakeId' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: errorMessage,
        });
    });
});

describe('getAllShipHistoryPending', () => {
    it('should return all ship history with deleteStatus set to "pending"', async () => {
        const fakeShipHistory = [
            {
                _id: 'fakeId1',
                shipId: {
                    name: 'Ship 1',
                },
                deleteStatus: 'pending',
            },
            {
                _id: 'fakeId2',
                shipId: {
                    name: 'Ship 2',
                },
                deleteStatus: 'pending',
            },
        ];

        ShipHistory.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeShipHistory),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllShipHistoryPending(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeShipHistory,
        });
    });

    it('should return a 404 status when no ship history is found', async () => {
        ShipHistory.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllShipHistoryPending(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No ship history found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        ShipHistory.find.mockReturnValue({
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllShipHistoryPending(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('editShipHistory', () => {
    it('should edit ship history and return updated ship histories', async () => {
        const req = {
            body: {
                price: 1000,
                rentStartDate: '2023-01-01',
                rentEndDate: '2023-01-10',
                locationDestination: 'Destination',
                locationDeparture: 'Departure',
                shipId: 'shipId',
            },
            params: {
                id: 'shipHistoryId',
            },
            files: [
                {
                    originalname: 'file1.pdf',
                    buffer: Buffer.from('file1 content'),
                    mimetype: 'application/pdf',
                },
                {
                    originalname: 'file2.pdf',
                    buffer: Buffer.from('file2 content'),
                    mimetype: 'application/pdf',
                },
            ],
        };

        const bucketMock = {
            file: jest.fn().mockReturnThis(),
            save: jest.fn().mockResolvedValue(),
            getSignedUrl: jest.fn().mockResolvedValue(['signedUrl']),
        };

        const findOneMock = jest.fn().mockResolvedValue({
            _id: 'shipHistoryId',
            genericDocument: [
                {
                    fileUrl: 'oldFileUrl',
                },
            ],
        });

        const findOneAndUpdateMock = jest.fn().mockResolvedValue({
            _id: 'shipHistoryId',
            price: 1000,
            rentStartDate: new Date('2023-01-02'),
            rentEndDate: new Date('2023-01-11'),
            locationDestination: 'Destination',
            locationDeparture: 'Departure',
            genericDocument: [
                {
                    fileName: 'file1.pdf',
                    fileUrl: 'signedUrl',
                },
                {
                    fileName: 'file2.pdf',
                    fileUrl: 'signedUrl',
                },
            ],
        });

        const findMock = jest.fn().mockResolvedValue([
            {
                _id: 'shipHistoryId',
                price: 1000,
                rentStartDate: new Date('2023-01-02'),
                rentEndDate: new Date('2023-01-11'),
                locationDestination: 'Destination',
                locationDeparture: 'Departure',
                genericDocument: [
                    {
                        fileName: 'file1.pdf',
                        fileUrl: 'signedUrl',
                    },
                    {
                        fileName: 'file2.pdf',
                        fileUrl: 'signedUrl',
                    },
                ],
            },
        ]);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ShipHistory.findOne = findOneMock;
        ShipHistory.findOneAndUpdate = findOneAndUpdateMock;
        ShipHistory.find = findMock;

        firebaseAdmin.storage.mockReturnValue({
            bucket: jest.fn().mockReturnValue(bucketMock),
        });

        await editShipHistory(req, res);

        expect(findOneMock).toHaveBeenCalledWith({ _id: 'shipHistoryId' });
        expect(bucketMock.file).toHaveBeenCalledTimes(2);
        expect(bucketMock.save).toHaveBeenCalledTimes(2);
        expect(bucketMock.getSignedUrl).toHaveBeenCalledTimes(2);
        expect(findOneAndUpdateMock).toHaveBeenCalledWith(
            { _id: 'shipHistoryId' },
            {
                price: 1000,
                rentStartDate: expect.any(Date),
                rentEndDate: expect.any(Date),
                locationDestination: 'Destination',
                locationDeparture: 'Departure',
                genericDocument: [
                    {
                        fileName: 'file1.pdf',
                        fileUrl: 'signedUrl',
                    },
                    {
                        fileName: 'file2.pdf',
                        fileUrl: 'signedUrl',
                    },
                ],
            },
            { new: true },
        );
        expect(findMock).toHaveBeenCalledWith({ shipId: 'shipId' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: [
                {
                    _id: 'shipHistoryId',
                    price: 1000,
                    rentStartDate: new Date('2023-01-02'),
                    rentEndDate: new Date('2023-01-11'),
                    locationDestination: 'Destination',
                    locationDeparture: 'Departure',
                    genericDocument: [
                        {
                            fileName: 'file1.pdf',
                            fileUrl: 'signedUrl',
                        },
                        {
                            fileName: 'file2.pdf',
                            fileUrl: 'signedUrl',
                        },
                    ],
                },
            ],
        });
    });

    it('should return a 404 status when no ship history is found', async () => {
        const req = {
            body: {},
            params: {
                id: 'shipHistoryId',
            },
            files: [],
        };

        const findOneMock = jest.fn().mockResolvedValue(null);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ShipHistory.findOne = findOneMock;

        await editShipHistory(req, res);

        expect(findOneMock).toHaveBeenCalledWith({ _id: 'shipHistoryId' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No ship history found',
        });
    });

    it('should return a 404 status when no bucket is found', async () => {
        const req = {
            body: {},
            params: {
                id: 'shipHistoryId',
            },
            files: [],
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        firebaseAdmin.storage.mockReturnValue({
            bucket: jest.fn().mockReturnValue(null),
        });

        await editShipHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Bucket not found',
        });
    });
});

describe('addShipRFQForm', () => {
    it('should add RFQ form to a ship and return the updated ship', async () => {
        const fakeDynamicFormId = '653f53804b82b784422aa4c4';
        const fakeShipId = '653f53804b82b784422aa4c6';
        const fakeDynamicForm = {
            _id: fakeDynamicFormId,
            name: 'RFQ Form',
        };
        const fakeUpdatedShip = {
            _id: fakeShipId,
            name: 'Ship 1',
            rfqDynamicForm: fakeDynamicFormId,
        };

        DynamicForm.findOne.mockResolvedValue(fakeDynamicForm);
        Ship.findOneAndUpdate.mockResolvedValue(fakeUpdatedShip);

        const req = {
            body: {
                shipId: fakeShipId,
                dynamicFormId: fakeDynamicFormId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addShipRFQForm(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            _id: fakeDynamicFormId,
        });
        expect(Ship.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: fakeShipId },
            { rfqDynamicForm: fakeDynamicFormId },
            { new: true },
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeUpdatedShip,
        });
    });

    it('should return a 404 status when the dynamic form is not found', async () => {
        const fakeDynamicFormId = '653f53804b82b784422aa4c4';
        const fakeShipId = '653f53804b82b784422aa4c6';

        DynamicForm.findOne.mockResolvedValue(null);

        const req = {
            body: {
                shipId: fakeShipId,
                dynamicFormId: fakeDynamicFormId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addShipRFQForm(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            _id: fakeDynamicFormId,
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Dynamic form not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const fakeDynamicFormId = '653f53804b82b784422aa4c4';
        const fakeShipId = '653f53804b82b784422aa4c6';
        const fakeError = new Error('Some error message');

        DynamicForm.findOne.mockRejectedValue(fakeError);

        const req = {
            body: {
                shipId: fakeShipId,
                dynamicFormId: fakeDynamicFormId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addShipRFQForm(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            _id: fakeDynamicFormId,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: fakeError.message,
        });
    });
});
