import { beforeEach } from 'node:test';
import {
    deleteShipById,
    getShipById,
    approvePayment,
    getShipOwnerData,
    submitContract,
    submitProposal,
    submitShip,
    submitCompanyProfile,
    editShipById,
    editShipImageById,
    editShipDocumentById,
    getTopRatedShips,
    getTopRentedShips,
    getAllTransaction,
    acceptRFQById,
    getRenterDataById,
    getTransactionById,
    addShipHistory,
    getRenterUserDataById,
    getTemplateShipRFQFormsByShipCategory,
    addDynamicInputRfqFormOwner,
    getDynamicInputRFQByTemplateTypeOwner,
    createTemplateDefaultRFQForm,
    createTemplateCustomRFQForm,
    editDynamicInputOwnerRfqForm,
    getDynamicInputRFQOwnerById,
    activateDynamicInput,
    sendNegotiateContact,
    submitShipPicturesBeforeSailing,
    submitShipPicturesAfterSailing,
    getTransactionNegoById,
    updateTracking,
    getTrackingHistory,
} from '../controller/shipOwnerController';
import Contract from '../models/Contract';
import DynamicForm from '../models/DynamicForm';
import DynamicInput from '../models/DynamicInput';
import Proposal from '../models/Proposal';
import Renter from '../models/Renter';
import Ship from '../models/Ship';
import ShipCategory from '../models/ShipCategory';
import ShipFacility from '../models/ShipFacility';
import ShipHistory from '../models/ShipHistory';
import ShipOwner from '../models/ShipOwner';
import ShipSpecification from '../models/ShipSpecification';
import Transaction from '../models/Transaction';
import User from '../models/User';
import firebaseAdmin from '../utils/firebaseAdmin';
import { populate } from 'dotenv';
import { before } from 'lodash';

jest.mock('../utils/firebaseAdmin', () => ({
    storage: jest.fn().mockReturnThis(),
    bucket: jest.fn().mockReturnThis(),
    file: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    getSignedUrl: jest.fn().mockReturnThis(),
    metadata: {
        mediaLink: 'https://example.com/media/link',
    },
    delete: jest.fn(),
    uploadFile: jest.fn(),
}));
jest.mock('../models/User');
jest.mock('../models/ShipOwner');
jest.mock('../models/ShipCategory');
jest.mock('../models/ShipFacility');
jest.mock('../models/DynamicForm');
jest.mock('../models/ShipSpecification');
jest.mock('../models/Ship');
jest.mock('../models/Renter');
jest.mock('../models/Transaction');
jest.mock('../models/Proposal');
jest.mock('../models/Contract');
jest.mock('../models/ShipHistory');
jest.mock('../models/DynamicInput');

const expectedUser = {
    _id: '65408338cff83b27',
    name: 'Fauzan',
    email: 'mfauzan@mail.com',
    isPhoneVerified: true,
    isCompanySubmitted: true,
    phoneNumber: '081212121',
    firebaseId: 'CTrhPWr1KOl6ETAFz60912',
    roles: 'renter',
    isActive: true,
    renterId: '1234',
};
const expectedRenter = {
    userId: 'mockUserId',
    name: 'John',
    renterPreference: [],
    company: {
        name: 'company name',
    },
};
const expectedShipOwner = {
    _id: '654300b1aa36f059c',
    userId: '654300a3aa36f0583',
    name: 'Fauzan',
    company: {
        name: 'Fauzan Company',
        companyType: 'PT',
        address: 'Jl. Raudah',
        bankName: 'BRI',
        bankAccountName: 'Fauzan Corp',
        bankAccountNumber: 123456789,
        documentCompany: [],
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test…',
    },

    ships: [],
};

const expectShipCategories = {
    _id: '654300b1696f05b5',
    name: 'Barge',
};

const expectShipFacility = {
    _id: '65430c3696f0621',
    name: 'Pumps',
    facilityCategory: '654300b1aa696f05bb',
    shipCategory: ['654300b1aa396f05b5'],
};

const expectDynamicForm = {
    _id: '654300b1aa3f30e3b',
    formType: 'addShipForm',
    dynamicForms: [
        {
            dynamicInput: '654300b1aa3f307ac',
            required: true,
            _id: '654300b1aa696f076d',

            option: [],
        },
        {
            dynamicInput: '6543003TDb1aa3f307ac',
            required: true,
            _id: '654300er5y6aa6076d',
            option: [],
        },
    ],
};

const expectShipSpesification = {
    _id: '654300b3cc3696f0609',
    shipCategory: '654300b1aac3696f05b5',
    name: 'Capacity',
    units: 'Tons',
};

const expectedTransation = {
    _id: '654846b814e935417cccdcac',
    rentalId: 'SH-09212023-1f5a3e42',
    renterId: '654846b714e935417cccd0e8',
    offeredPrice: 1234009000,
    rentalDuration: 127,
    rentalStartDate: '2023-11-06T01:51:47.216+00:00',
    rentalEndDate: '2023-11-16T01:51:47.216+00:00',
    // sailingStatus: 'beforeSailing',
    sailingStatus: [
        {
            status: 'beforeSailing',
            desc: 'Ready to sail',
            image: [
                {
                    imageName: 'www.imagetest.com',
                    imageUrl: 'www.imageurl.com',
                },
            ],
            trackedBy: {
                name: 'Fauzan',
                role: 'shipOwner',
            },
        },
    ],
    ship: {
        shipId: '654846b814e935417cccd28e',
        shipOwnerId: '654846b714e935417cccd0df',
    },

    rfq: {
        rfqId: '654846b814e935417cccdc1c',
        rfqUrl: 'https://rfq-url',
    },

    proposal: [
        {
            proposalId: '654846b814e935417cccdc39',
            proposalUrl: 'http://proposal-url',
            notes: 'notes',
            additionalImage: [],
            offeredPrice: 1234009000,
        },
    ],
    status: [
        {
            name: 'rfq 1',
            desc: 'RFQ sent',
            date: '2023-11-06T01:51:47.216+00:00',
            isOpened: true,
            _id: '654846b814e935417cccdcad',
        },
    ],
    receiptUrl: 'https://receipt-url/SH-09212023-',
    payment: [
        {
            paymentId: 'PY-01112024-8eae38a6',
            receiptUrl: 'https://payment-receipt-url',
            paymentApproved: true,
            paymentReminded: [],
        },
    ],
    contract: {
        contractUrl: 'https://contract-url',
    },
};

const expextedContract = {
    ship: 'Island Hopper',
    renter: 'Azis',
    shipOwner: 'Fauzan',
    contractUrl: 'https://contract-url',
};

describe('getShipOwnerData', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });
    it('should return ship owner data', async () => {
        const req = {
            user: {
                firebaseId: '223243456',
                googleId: '3445',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        await getShipOwnerData(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedShipOwner,
        });
    });
    it('should return a user not found', async () => {
        const req = {
            user: {
                firebaseId: '23234454556',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(null);
        await getShipOwnerData(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should return a shipowner not found', async () => {
        const req = {
            user: {
                firebaseId: '23234454556',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(null);
        await getShipOwnerData(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });
    it('should handle error and return a 500 status ', async () => {
        const req = {
            user: {
                firebaseId: '23234454556',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockRejectedValue('something wrong');
        ShipOwner.findOne.mockRejectedValue('something wrong');
        await getShipOwnerData(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('submitShip', () => {
    const body = {
        name: 'MV Coastal Voyager',
        location: 'Albany - New york',
        desc: 'MV Coastal Voyager is a modern passenger ferry designed to provide a comfortable and safe journey along coastal routes. Equipped with advanced navigation systems and luxurious amenities, it offers a delightful travel experience for passengers.',
        category: 'Ferry',
        pricePerMonth: 1800000000,
        length: 75,
        width: 25,
        height: 8,
        facilities: [
            {
                name: 'Passenger Lounge',
            },
            {
                name: 'Entertainment',
            },
        ],
        specifications: [
            {
                name: 'passenger_capacity',
                value: 300,
            },
            {
                name: 'crew_capacity',
                value: 50,
            },
        ],
    };
    it('should save ship', async () => {
        const expectShip = {
            name: 'ship name',
            province: 'ship province',
            city: 'ship city',
            desc: 'ship desc',
            category: 'categoryid',
            size: {},
            shipOwnerId: 'shipownerid',
            rating: 5,
            pricePerMonth: '5000000000',
            totalRentalCount: 0,
            facilities: [],
            specifications: [],
            rfqDynamicForm: 'rfq-id',
        };
        const req = {
            body,
            user: {
                firebaseId: '12121212',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(expectShipCategories);
        ShipFacility.findOne.mockResolvedValue(expectShipFacility);
        ShipSpecification.findOne.mockResolvedValue(expectShipSpesification);
        DynamicForm.findOne.mockResolvedValue(expectDynamicForm);

        expectedShipOwner.ships.push({
            shipId: '64he74465757rt45d',
            shipName: 'MV Coastal Voyage',
        });
        const shipSpy = await jest
            .spyOn(Ship.prototype, 'save')
            .mockReturnValue({ id: expectedShipOwner.ships[0].shipId });

        ShipOwner.findOneAndUpdate.mockResolvedValue(expectShip);
        await submitShip(req, res);
        expect(shipSpy).toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { shipId: expectedShipOwner.ships[0].shipId },
        });
    });
    it('should handle error when ship owner not found ', async () => {
        const req = {
            body,
            user: {
                firebaseId: '12121212',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        ShipOwner.findOne.mockResolvedValue(null);
        await submitShip(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });
    it('should handle error when user not found ', async () => {
        const req = {
            body,
            user: {
                firebaseId: '12121212',
                googleId: '12123445',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(null);
        await submitShip(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should handle error when ship category not found ', async () => {
        const req = {
            body,
            user: {
                firebaseId: '12121212',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedShipOwner);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(null);
        await submitShip(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Category not found',
        });
    });
    it('should handle error when ship facility not found ', async () => {
        const req = {
            body,
            user: {
                firebaseId: '12121212',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedShipOwner);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(expectShipCategories);
        ShipFacility.findOne.mockResolvedValue(null);
        await submitShip(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Facility not found',
        });
    });
    it('should handle error when ship specification not found ', async () => {
        const req = {
            body,
            user: {
                firebaseId: '12121212',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedShipOwner);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(expectShipCategories);
        ShipFacility.findOne.mockResolvedValue(expectShipFacility);
        ShipSpecification.findOne.mockResolvedValue(null);
        await submitShip(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Specification not found',
        });
    });
    it('should handle error and return response 500 ', async () => {
        const req = {
            body,
            user: {
                firebaseId: '12121212',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockRejectedValue('something wrong');
        await submitShip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('submitProposal', () => {
    it('should submit proposal', async () => {
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const fakeShips = { name: 'Ship 1' };
        const proposal = {
            id: '1213',
            renter: '55532',
            draftContract: 'https://proposalurl.com',
            isAccepted: false,
            notes: 'notes',
        };
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);

        Ship.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeShips),
        });
        firebaseAdmin.storage().bucket.mockReturnThis();

        firebaseAdmin
            .storage()
            .bucket()
            .getSignedUrl.mockResolvedValue([
                {
                    draftContract: 'https://url-file-upload.com',
                },
            ]);
        await jest
            .spyOn(Proposal.prototype, 'save')
            .mockResolvedValue(proposal);

        Transaction.findOneAndUpdate.mockResolvedValue({
            proposal: {
                proposalId: proposal.id,
                proposalUrl: proposal.draftContract,
                notes: proposal.notes,
            },
            offeredPrice: 5000000,
            addStatus: jest.fn(),
            save: jest.fn(),
        });

        await submitProposal(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            newProposal: expect.any(Object), // Adjust this based on your data structure
        });
    });
    it('should handle error when file not found', async () => {
        const request = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
            },
            files: null,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await submitProposal(request, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No file found',
        });
    });
    it('should handle error when bucket not found', async () => {
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        await submitProposal(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });
    it('should handle error when user not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(null);
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '123435654',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitProposal(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should handle error when renter not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(null);
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '123435654',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitProposal(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });
    it('should handle error when ship owner not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(null);
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '123435654',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitProposal(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship owner not found',
        });
    });
    it('should handle error when ship not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        Ship.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '123435654',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitProposal(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });
    it('should handle error when transaction not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);

        const fakeShips = { name: 'Ship 1' };
        Ship.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeShips),
        });
        Transaction.findOneAndUpdate.mockResolvedValue(null);
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '123435654',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitProposal(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });
    it('should handle error and return a 500 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockRejectedValue('something wrong');

        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '123435654',
            },
            files: {
                draftContract: [
                    // Wrap the file in an array
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitProposal(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('approvePayment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should approve payment', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTransaction = {
            sailingStatus: [{ status: 'beforeSailing' }],
            payment: [{ paymentApproved: false }],
            addStatus: jest.fn().mockReturnThis(),
            save: jest.fn().mockReturnThis(),
            renterId: 'renter123',
            contract: { contractUrl: 'url123' },
            rentalEndDate: new Date(),
            rentalStartDate: new Date(),
            needs: 'needs',
            locationDeparture: 'locationA',
            locationDestination: 'locationB',
            ship: { shipId: 'ship123' },
            offeredPrice: 1000,
        };

        // Transaction.findOneAndUpdate.mockResolvedValue({
        //     expectedTransation,
        //     addStatus: jest.fn().mockReturnThis(),
        //     save: jest.fn().mockReturnThis(),
        // });

        Transaction.findOneAndUpdate.mockResolvedValue(mockTransaction);
        Contract.findOne.mockResolvedValue({ renterCompanyName: 'Renter' });
        ShipHistory.prototype.save.mockResolvedValue({});
        Ship.findOneAndUpdate.mockResolvedValue({});

        await approvePayment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle error when rentalId not found', async () => {
        const req = {
            body: {
                rentalId: null,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await approvePayment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No rentalId found',
        });
    });

    it('should handle error when transaction not found', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Transaction.findOneAndUpdate.mockResolvedValue(null);

        await approvePayment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should handle error and return a 500 status', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOneAndUpdate.mockRejectedValue('something wrong');

        await approvePayment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });

    it('should handle undefined sailingStatus', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTransaction = {
            payment: [{ paymentApproved: false }],
            addStatus: jest.fn().mockReturnThis(),
            save: jest.fn().mockReturnThis(),
            renterId: 'renter123',
            contract: { contractUrl: 'url123' },
            rentalEndDate: new Date(),
            rentalStartDate: new Date(),
            needs: 'needs',
            locationDeparture: 'locationA',
            locationDestination: 'locationB',
            ship: { shipId: 'ship123' },
            offeredPrice: 1000,
        };

        Transaction.findOneAndUpdate.mockResolvedValue(mockTransaction);
        Contract.findOne.mockResolvedValue({ renterCompanyName: 'Renter' });
        ShipHistory.prototype.save.mockResolvedValue({});
        Ship.findOneAndUpdate.mockResolvedValue({});

        await approvePayment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle undefined payment', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTransaction = {
            sailingStatus: [],
            addStatus: jest.fn().mockReturnThis(),
            save: jest.fn().mockReturnThis(),
            renterId: 'renter123',
            contract: { contractUrl: 'url123' },
            rentalEndDate: new Date(),
            rentalStartDate: new Date(),
            needs: 'needs',
            locationDeparture: 'locationA',
            locationDestination: 'locationB',
            ship: { shipId: 'ship123' },
            offeredPrice: 1000,
        };

        Transaction.findOneAndUpdate.mockResolvedValue(mockTransaction);
        Contract.findOne.mockResolvedValue({});
        ShipHistory.prototype.save.mockResolvedValue({});
        Ship.findOneAndUpdate.mockResolvedValue({});

        await approvePayment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });
});

describe('submitContract', () => {
    it('should submit contract', async () => {
        const fakeShips = { name: 'Ship 1' };
        firebaseAdmin.storage().bucket.mockReturnThis();

        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        Ship.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeShips),
        });
        firebaseAdmin.storage().bucket.mockReturnThis();
        firebaseAdmin
            .storage()
            .bucket()
            .getSignedUrl.mockResolvedValue([
                {
                    contractUrl: 'https://url-file-upload.com',
                },
            ]);
        const contract = {
            id: '654846b814e935417cccdc8a',
            ship: '654846b714e935417cccd1d3',
            renter: '654846b714e935417cccd0e8',
            shipOwner: '654846b714e935417cccd0df',
            contractUrl: 'https://contract-url',
            isAccepted: true,
        };
        await jest
            .spyOn(Contract.prototype, 'save')
            .mockResolvedValue(contract);
        Transaction.findOneAndUpdate.mockResolvedValue({
            expectedTransation,
            addStatus: jest.fn(),
            save: jest.fn(),
        });
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should handle error when no file found', async () => {
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: null,
        };
        firebaseAdmin.storage().bucket.mockResolvedValue(null);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No file found',
        });
    });
    it('should handle error when bucket not found', async () => {
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });
    it('should handle error when user not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();

        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(null);
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should handle error when renter not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();

        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(null);
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });
    it('should handle error when ship owner not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();

        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(null);
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship owner not found',
        });
    });
    it('should handle error when ship  not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();

        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        Ship.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });
    it('should handle error when transaction not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();

        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                renterCompanyName: 'company name',
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '12121',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        const ship = [{ name: 'ship 1' }];
        Ship.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(ship),
        });
        Transaction.findOneAndUpdate.mockResolvedValue(null);

        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });
    it('should handle error and return a 500 status', async () => {
        const req = {
            body: {
                shipId: '232445423',
                renterId: '3434565683674',
                offeredPrice: 500000000,
                rentalId: '45746273928',
            },
            user: {
                firebaseId: '3474569',
                googleId: '123435654',
            },
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockRejectedValue('something wrong');
        await submitContract(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('submitCompanyProfile', () => {
    it('should save company profile', async () => {
        const req = {
            body: {
                companyName: 'test company name',
                typeOfCompany: 'PT',
                companyAddress: 'jalan suryanata',
                bankName: 'BCA',
                bankAccountName: 'James',
                bankAccountNumber: '42424242424242',
            },
            user: {
                firebaseId: '123',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
                {
                    fieldname: 'file2',
                    originalname: 'example2.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
                {
                    fieldname: 'file4',
                    originalname: 'example4.pdf',
                    encoding: '7bit',
                    mimetype: 'application/pdf',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mock bucket methods
        const mockBucket = {
            file: jest.fn().mockReturnThis(),
            getSignedUrl: jest.fn().mockResolvedValue(['https://example.com']),
            save: jest.fn().mockReturnThis(),
            metadata: {
                mediaLink: 'https://example.com/media/link',
            },
        };

        // Mock the storage method to return the mockBucket
        firebaseAdmin.storage.mockReturnValue({
            bucket: jest.fn().mockReturnValue(mockBucket),
        });
        User.findOneAndUpdate.mockResolvedValue(expectedUser);
        ShipOwner.findOneAndUpdate.mockResolvedValue(expectedShipOwner);
        await submitCompanyProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should handle error when no files found ', async () => {
        const req = {
            body: {
                companyName: 'test company name',
                typeOfCompany: 'PT',
                companyAddress: 'jalan suryanata',
                bankName: 'BCA',
                bankAccountName: 'James',
                bankAccountNumber: '42424242424242',
            },
            user: {
                firebaseId: '123',
            },
            files: null,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await submitCompanyProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No files found',
        });
    });
    it('should handle error when bucket not found ', async () => {
        const req = {
            body: {
                companyName: 'test company name',
                typeOfCompany: 'PT',
                companyAddress: 'jalan suryanata',
                bankName: 'BCA',
                bankAccountName: 'James',
                bankAccountNumber: '42424242424242',
            },
            user: {
                firebaseId: '123',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        await submitCompanyProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });
    it('should handle error when ship owner not found ', async () => {
        const req = {
            body: {
                companyName: 'test company name',
                typeOfCompany: 'PT',
                companyAddress: 'jalan suryanata',
                bankName: 'BCA',
                bankAccountName: 'James',
                bankAccountNumber: '42424242424242',
            },
            user: {
                firebaseId: '123',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mock bucket methods
        const mockBucket = {
            file: jest.fn().mockReturnThis(),
            getSignedUrl: jest.fn().mockResolvedValue(['https://example.com']),
            save: jest.fn().mockReturnThis(),
            metadata: {
                mediaLink: 'https://example.com/media/link',
            },
        };

        // Mock the storage method to return the mockBucket
        firebaseAdmin.storage.mockReturnValue({
            bucket: jest.fn().mockReturnValue(mockBucket),
        });
        User.findOneAndUpdate.mockResolvedValue(null);
        ShipOwner.findOneAndUpdate.mockResolvedValue(null);
        await submitCompanyProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });
    it('should handle error and return a 500 status', async () => {
        const req = {
            body: {
                companyName: 'test company name',
                typeOfCompany: 'PT',
                companyAddress: 'jalan suryanata',
                bankName: 'BCA',
                bankAccountName: 'James',
                bankAccountNumber: '42424242424242',
            },
            user: {
                firebaseId: '123',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mock bucket methods
        const mockBucket = {
            file: jest.fn().mockReturnThis(),
            getSignedUrl: jest.fn().mockResolvedValue(['https://example.com']),
            save: jest.fn().mockReturnThis(),
            metadata: {
                mediaLink: 'https://example.com/media/link',
            },
        };

        // Mock the storage method to return the mockBucket
        firebaseAdmin.storage.mockReturnValue({
            bucket: jest.fn().mockReturnValue(mockBucket),
        });
        User.findOneAndUpdate.mockResolvedValue(expectedUser);
        ShipOwner.findOneAndUpdate.mockRejectedValue('something wrong');
        await submitCompanyProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('editShipById', () => {
    const body = {
        name: 'MV Coastal Voyager',
        location: 'Samarinda - Kalimantan Timur',
        desc: 'MV Coastal Voyager is a modern passenger ferry designed to provide a comfortable and safe journey along coastal routes. Equipped with advanced navigation systems and luxurious amenities, it offers a delightful travel experience for passengers.',
        category: 'Ferry',
        pricePerMonth: 1800000000,
        length: 75,
        width: 25,
        height: 8,
        facilities: [
            {
                name: 'Passenger Lounge',
            },
            {
                name: 'Entertainment',
            },
        ],
        specifications: [
            {
                name: 'passenger_capacity',
                value: 300,
            },
            {
                name: 'crew_capacity',
                value: 50,
            },
        ],
    };
    it('should update ship by id', async () => {
        const req = {
            body,
            user: {
                firebaseId: '123',
                googleId: '456',
            },
            params: {
                shipId: '4545672',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship1', id: '123' };
        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(expectShipCategories);
        ShipFacility.findOne.mockResolvedValue(expectShipFacility);
        ShipSpecification.findOne.mockResolvedValue(expectShipSpesification);
        Ship.findOneAndUpdate.mockResolvedValue(ship);

        ShipOwner.findOneAndUpdate.mockResolvedValue(expectedShipOwner);
        await editShipById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                shipId: '123',
            },
        });
    });
    it('should handle error user not found', async () => {
        const req = {
            body,
            user: {
                firebaseId: '123',
                googleId: '456',
            },
            params: {
                shipId: '4545672',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(null);

        await editShipById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should handle error when ship owner not found', async () => {
        const req = {
            body,
            user: {
                firebaseId: '123',
                googleId: '456',
            },
            params: {
                shipId: '4545672',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship1', id: '123' };
        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(null);

        await editShipById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });
    it('should handle error when ship category not found', async () => {
        const req = {
            body,
            user: {
                firebaseId: '123',
                googleId: '456',
            },
            params: {
                shipId: '4545672',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship1', id: '123' };
        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(null);

        await editShipById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Category not found',
        });
    });
    it('should handle error when ship facility not found', async () => {
        const req = {
            body,
            user: {
                firebaseId: '123',
                googleId: '456',
            },
            params: {
                shipId: '4545672',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship1', id: '123' };
        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(expectShipCategories);
        ShipFacility.findOne.mockResolvedValue(null);

        await editShipById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Facility not found',
        });
    });
    it('should handle error when ship specification not found', async () => {
        const req = {
            body,
            user: {
                firebaseId: '123',
                googleId: '456',
            },
            params: {
                shipId: '4545672',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship1', id: '123' };
        User.findOne.mockResolvedValue(expectedUser);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
        ShipCategory.findOne.mockResolvedValue(expectShipCategories);
        ShipFacility.findOne.mockResolvedValue(expectShipFacility);
        ShipSpecification.findOne.mockResolvedValue(null);

        await editShipById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Specification not found',
        });
    });
    it('should handle error and return a 500 status', async () => {
        const req = {
            body,
            user: {
                firebaseId: '123',
                googleId: '456',
            },
            params: {
                shipId: '4545672',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship1', id: '123' };
        User.findOne.mockRejectedValue('something wrong');

        await editShipById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('editShipImageById', () => {
    it('should update ship image by id', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = {
            name: 'test ship',
            id: '345',
            imageUrl: 'http://test-image.com',
        };
        Ship.findOne.mockResolvedValue(ship);
        // console.log(firebaseAdmin.prototype);
        firebaseAdmin.storage().bucket.mockReturnThis();
        jest.spyOn(firebaseAdmin, 'delete').mockReturnThis();

        Ship.findOneAndUpdate.mockResolvedValue(ship);

        await editShipImageById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                shipId: '345',
            },
        });
    });
    it('should handle error when ship image not found', async () => {
        const req = {
            file: null,
            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await editShipImageById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No image found',
        });
    });
    it('should handle error when ship not found', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Ship.findOne.mockResolvedValue(null);
        await editShipImageById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });

    it('should handle error when uploading file failed', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = {
            name: 'test ship',
            id: '345',
            imageUrl: 'http://test-image.com',
        };

        // Mock successful deletion of the image
        firebaseAdmin.delete.mockRejectedValue('Error deleting file');
        firebaseAdmin.uploadFile.mockRejectedValue('Error uploading file');

        Ship.findOne.mockResolvedValue(ship);

        await editShipImageById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Error uploading file on firebase',
        });
    });

    it('should handle error and return a 500 status', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'example.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Ship.findOne.mockRejectedValue('something wrong');

        await editShipImageById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('editShipDocumentById', () => {
    it('should update ship document by id', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'Owner Document 1.pdf',
                encoding: '7bit',
                mimetype: 'application/pdf',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },
            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = {
            name: 'test ship',
            id: '123',
            shipDocuments: [
                {
                    documentUrl: 'https://document-url.com',
                    documentName: 'test document 1',
                },
                {
                    documentUrl: 'https://document-url2.com',
                    documentName: 'test document 2',
                },
            ],
        };
        Ship.findOne.mockResolvedValue(ship);
        firebaseAdmin.storage().bucket.mockReturnThis();
        firebaseAdmin.delete.mockResolvedValue({ message: 'success' });
        Ship.findOneAndUpdate.mockResolvedValue(ship);

        await editShipDocumentById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                shipId: '123',
            },
        });
    });
    it('should update ship document by id with original name Owner Document 2', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'Owner Document 2.pdf',
                encoding: '7bit',
                mimetype: 'application/pdf',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },

            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = {
            name: 'test ship',
            id: '123',
            shipDocuments: [
                {
                    documentUrl: 'https://document-url.com',
                    documentName: 'test document 1',
                },
                {
                    documentUrl: 'https://document-url2.com',
                    documentName: 'test document 2',
                },
            ],
        };
        Ship.findOne.mockResolvedValue(ship);
        firebaseAdmin.storage().bucket.mockReturnThis();
        firebaseAdmin.delete.mockResolvedValue({ message: 'success' });
        Ship.findOneAndUpdate.mockResolvedValue(ship);

        await editShipDocumentById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                shipId: '123',
            },
        });
    });
    it('should handle error when files not found', async () => {
        const req = {
            file: null,

            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await editShipDocumentById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No Document found',
        });
    });
    it('should handle error when user not found', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'Owner Document 1.pdf',
                encoding: '7bit',
                mimetype: 'application/pdf',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },

            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Ship.findOne.mockResolvedValue(null);
        await editShipDocumentById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });
    it('should handle error and return a 500 status', async () => {
        const req = {
            file: {
                fieldname: 'file',
                originalname: 'Owner Document 1.pdf',
                encoding: '7bit',
                mimetype: 'application/pdf',
                buffer: Buffer.from([0x1, 0x2, 0x3]),
            },

            params: {
                shipId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Ship.findOne.mockRejectedValue('something wrong');

        await editShipDocumentById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('deleteShipById', () => {
    it('should delete a ship by id', async () => {
        const req = {
            user: {
                _id: '4567',
            },
            params: {
                id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = {
            name: 'test ships',
            imageUrl: 'https://ship-url.com',
            shipDocuments: [
                { documentUrl: 'https://ship-document-url.com' },
                { documentUrl: 'https://ship-document2-url.com' },
            ],
        };
        Ship.findOne.mockResolvedValue(ship);
        firebaseAdmin.storage().bucket.mockReturnThis();
        firebaseAdmin.delete.mockResolvedValue('success');
        Ship.findOneAndDelete.mockResolvedValue(ship);
        ShipOwner.findOneAndUpdate.mockResolvedValue(expectedShipOwner);

        await deleteShipById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should handle error when fail deleting file in firebase', async () => {
        const req = {
            user: {
                _id: '4567',
            },
            params: {
                id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = {
            name: 'test ships',
            imageUrl: 'https://ship-url.com',
            shipDocuments: [
                { documentUrl: 'https://ship-document-url.com' },
                { documentUrl: 'https://ship-document2-url.com' },
            ],
        };
        Ship.findOne.mockResolvedValue(ship);
        firebaseAdmin.storage().bucket.mockReturnThis();
        firebaseAdmin.delete.mockRejectedValue({ code: 500 });

        await deleteShipById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Error deleting file on firebase',
        });
    });
    it('should handle error and return 500 status', async () => {
        const req = {
            user: {
                _id: '4567',
            },
            params: {
                id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Ship.findOne.mockRejectedValue('something wrong');

        await deleteShipById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('getTopRentedShips', () => {
    it('should get top rented ships', async () => {
        const req = {
            user: {
                shipOwnerId: '12345',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = [{ name: 'ship 1' }, { name: 'ship 2' }];
        User.findOne.mockResolvedValue(expectedUser);
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(ship),
        });

        await getTopRentedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: ship,
        });
    });
    it('should handle error when ship owner id not found', async () => {
        const req = {
            user: {
                shipOwnerId: null,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTopRentedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Unprocessable data',
        });
    });
    it('should handle error when user not found', async () => {
        const req = {
            user: {
                shipOwnerId: '12345',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const ship = [{ name: 'ship 1' }, { name: 'ship 2' }];
        User.findOne.mockResolvedValue(null);
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(ship),
        });

        await getTopRentedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should handle error when no top rented ship data', async () => {
        const req = {
            user: {
                shipOwnerId: '12345',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const ship = [{ name: 'ship 1' }, { name: 'ship 2' }];
        User.findOne.mockResolvedValue(expectedUser);
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue([]),
        });

        await getTopRentedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No top-rented ships found by owner',
        });
    });
    it('should handle error when no top rented ship data', async () => {
        const req = {
            user: {
                shipOwnerId: '12345',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockRejectedValue('something wrong');

        await getTopRentedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('getTopRatedShips', () => {
    it('should get top rated ship list', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const fakeShips = [
            { name: 'ship 1' },
            { name: 'ship 2' },
            { name: 'ship 3' },
        ];
        User.findOne.mockResolvedValue(expectedUser);
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(fakeShips),
        });

        await getTopRatedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeShips,
        });
    });
    it('should handle when ship owner id not found', async () => {
        const req = {
            user: {
                shipOwnerId: null,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTopRatedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Unprocessable data',
        });
    });
    it('should get top rated ship list', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const fakeShips = [
            { name: 'ship 1' },
            { name: 'ship 2' },
            { name: 'ship 3' },
        ];
        User.findOne.mockResolvedValue(null);
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(fakeShips),
        });

        await getTopRatedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should handle error when no top rated ship shows', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        Ship.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue([]),
        });

        await getTopRatedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No top-rated ships found by owner',
        });
    });
    it('should handle error and return 500 status', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockRejectedValue('something wrong');

        await getTopRatedShips(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('getShipById', () => {
    it('should get ship by ship owner id', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const ship = [{ name: 'ship 1' }, { name: 'ship 2' }];
        ShipOwner.findById.mockResolvedValue(expectedShipOwner);
        Ship.find.mockResolvedValue(ship);

        await getShipById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: ship,
        });
    });
    it('should handle error when ship owner data not found', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ShipOwner.findById.mockResolvedValue(null);

        await getShipById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });
    it('should handle error when ship not found', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ShipOwner.findById.mockResolvedValue(expectedShipOwner);
        Ship.find.mockResolvedValue(null);
        await getShipById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });
    it('should handle error and return response 500', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ShipOwner.findById.mockRejectedValue('something wrong');

        await getShipById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('getAllTransaction', () => {
    it('should get all transaction', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.aggregate.mockResolvedValue(expectedTransation);
        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedTransation,
        });
    });
    it('should handle error when transaction not found', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.aggregate.mockResolvedValue(null);
        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });
    it('should handle error and return response 500', async () => {
        const req = {
            user: {
                shipOwnerId: '3456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.aggregate.mockRejectedValue('something wrong');
        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('acceptRFQById', () => {
    it('should accept RFQ by rental id', async () => {
        const req = {
            body: {
                rentalId: '7890',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Transaction.findOne.mockResolvedValue({
            expectedTransation,
            addStatus: jest.fn().mockReturnThis(),
            save: jest.fn().mockReturnThis(),
        });

        await acceptRFQById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should handle error when failed accept RFQ', async () => {
        const req = {
            body: {
                rentalId: '7890',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Transaction.findOne.mockRejectedValue('something wrong');

        await acceptRFQById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

// describe('getTransactionNegoById', () => {
//     it('should get transaction by id', async () => {
//         const req = {
//             params: {
//                 id: 'SH-9986547',
//             },
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//         };

//         Transaction.findOne.mockResolvedValue(expectedTransation);

//         await getTransactionById(req, res);

//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({
//             status: 'success',
//             data: expectedTransation,
//         });
//     });
//     it('should handle error when no transaction found', async () => {
//         const req = {
//             params: {
//                 id: 'SH-9986547',
//             },
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//         };

//         Transaction.findOne.mockResolvedValue(null);

//         await getTransactionById(req, res);

//         expect(res.status).toHaveBeenCalledWith(404);
//         expect(res.json).toHaveBeenCalledWith({
//             status: 'fail',
//             message: 'Transaction not found',
//         });
//     });
//     it('should handle error and return response 500', async () => {
//         const req = {
//             params: {
//                 id: 'SH-9986547',
//             },
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//         };

//         Transaction.findOne.mockRejectedValue('something wrong');

//         await getTransactionById(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({
//             status: 'fail',
//             message: 'something wrong',
//         });
//     });
// });

describe('getRenterDataById', () => {
    it('should get renter data by renter id', async () => {
        const req = {
            params: {
                id: '67890',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockResolvedValue(expectedRenter);

        await getRenterDataById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedRenter,
        });
    });
    it('should handle error when renter not found', async () => {
        const req = {
            params: {
                id: '67890',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockResolvedValue(null);

        await getRenterDataById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });
    it('should handle error and return response 500', async () => {
        const req = {
            params: {
                id: '67890',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockRejectedValue({ message: 'something wrong' });

        await getRenterDataById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('addShipHistory', () => {
    it('should save ship history', async () => {
        const req = {
            body: {
                shipId: '123',
                price: 50000000,
                rentStartDate: '2023-11-09T02:54:07.476Z',
                rentEndDate: '2023-11-20T02:54:07.476Z',
                locationDestination: 'Surabaya',
                locationDeparture: 'Samarinda',
            },
            user: {
                firebaseId: '11123',
                googleId: '98776543',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship 1' };
        const expectShipHistory = {
            _id: '654846b8cccdb05',
            shipId: '654846cccd28e',
            price: 50000000,
            rentStartDate: '2021-11-06T01:51:46.446+00:00',
            rentEndDate: '2021-11-08T01:51:46.446+00:00',
            locationDestination: 'Thriller Bark',
            locationDeparture: 'Water 7',
            source: 'manual',
        };
        const mockBucket = {
            file: jest.fn().mockReturnThis(),
            getSignedUrl: jest.fn().mockResolvedValue(['https://example.com']),
            save: jest.fn().mockReturnThis(),
            metadata: {
                mediaLink: 'https://example.com/media/link',
            },
        };

        // Mock the storage method to return the mockBucket
        firebaseAdmin.storage.mockReturnValue({
            bucket: jest.fn().mockReturnValue(mockBucket),
        });
        User.findOne.mockResolvedValue(expectedUser);
        Ship.findOne.mockResolvedValue(ship);
        jest.spyOn(ShipHistory.prototype, 'save').mockResolvedValue(
            expectShipHistory,
        );

        await addShipHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectShipHistory,
        });
    });
    it('should handle error when user not found', async () => {
        const req = {
            body: {
                shipId: '123',
                price: 50000000,
                rentStartDate: '2023-11-09T02:54:07.476Z',
                rentEndDate: '2023-11-20T02:54:07.476Z',
                locationDestination: 'Surabaya',
                locationDeparture: 'Samarinda',
            },
            user: {
                firebaseId: '11123',
                googleId: '98776543',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(null);

        await addShipHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });
    it('should handle error when user not found', async () => {
        const req = {
            body: {
                shipId: '123',
                price: 50000000,
                rentStartDate: '2023-11-09T02:54:07.476Z',
                rentEndDate: '2023-11-20T02:54:07.476Z',
                locationDestination: 'Surabaya',
                locationDeparture: 'Samarinda',
            },
            user: {
                firebaseId: '11123',
                googleId: '98776543',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOne.mockResolvedValue(expectedUser);
        Ship.findOne.mockResolvedValue(null);
        await addShipHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });
    it('should handle error when user not found', async () => {
        const req = {
            body: {
                shipId: '123',
                price: 50000000,
                rentStartDate: '2023-11-09T02:54:07.476Z',
                rentEndDate: '2023-11-20T02:54:07.476Z',
                locationDestination: 'Surabaya',
                locationDeparture: 'Samarinda',
            },
            user: {
                firebaseId: '11123',
                googleId: '98776543',
            },
            files: [
                {
                    fieldname: 'file',
                    originalname: 'example.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from([0x1, 0x2, 0x3]),
                },
            ],
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const ship = { name: 'ship 1' };
        User.findOne.mockResolvedValue(expectedUser);
        Ship.findOne.mockResolvedValue(ship);
        jest.spyOn(ShipHistory.prototype, 'save').mockRejectedValue({
            message: 'failed save ship history',
        });
        await addShipHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'failed save ship history',
        });
    });
});

describe('getRenterUserDataById', () => {
    it('should get renter user data by renter id', async () => {
        const req = {
            params: {
                id: '456778',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockResolvedValue(expectedRenter);
        User.findById.mockResolvedValue(expectedUser);

        await getRenterUserDataById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedUser,
        });
    });
    it('should handle error when renter not found', async () => {
        const req = {
            params: {
                id: '456778',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockResolvedValue(null);

        await getRenterUserDataById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });
    it('should handle error and return response 500', async () => {
        const req = {
            params: {
                id: '456778',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockResolvedValue(expectedRenter);
        User.findById.mockRejectedValue({ message: 'something wrong' });
        await getRenterUserDataById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('getTemplateShipRFQFormsByShipCategory', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                shipCategory: 'Ferry',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 400 if shipCategory is not provided', async () => {
        req.params.shipCategory = '';

        await getTemplateShipRFQFormsByShipCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship category not provided.',
        });
    });

    it('should return 400 if shipCategory does not exist', async () => {
        ShipCategory.findOne.mockResolvedValue(null);

        await getTemplateShipRFQFormsByShipCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship category does not exist.',
        });
    });

    it('should return 200 with empty data if no dynamic forms exist', async () => {
        ShipCategory.findOne.mockResolvedValue({ name: 'Ferry' });
        DynamicForm.findOne.mockResolvedValue(null);

        await getTemplateShipRFQFormsByShipCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: {} });
    });

    it('should return 200 with dynamic forms data if forms exist', async () => {
        const mockDynamicForms = {
            _id: 'mockId',
            templateType: 'FerryRfq',
            shipId: null,
            active: true,
            dynamicForms: [
                {
                    dynamicInput: 'mockInputId',
                    formType: 'addShipForm',
                    templateType: 'generalAddShip',
                    inputType: 'textInput',
                    label: 'Ship Name',
                    fieldName: 'shipName',
                    fieldType: 'string',
                    placeholder: 'Enter your ship name',
                    required: true,
                    order: 1,
                },
            ],
        };

        ShipCategory.findOne.mockResolvedValue({ name: 'Ferry' });
        DynamicForm.findOne.mockResolvedValue(mockDynamicForms);

        await getTemplateShipRFQFormsByShipCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockDynamicForms,
        });
    });

    it('should return 500 if there is a server error', async () => {
        ShipCategory.findOne.mockRejectedValue(
            new Error('Internal server error'),
        );

        await getTemplateShipRFQFormsByShipCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('addDynamicInputRfqFormOwner', async () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                formType: 'formType',
                templateType: 'templateType',
                inputType: 'inputType',
                label: 'label',
                unit: 'unit',
                option: ['option1', 'option2'],
                min: 1,
                multiline: true,
                order: 1,
                required: true,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 400 if label is not unique', async () => {
        DynamicInput.findOne.mockResolvedValue(true);

        await addDynamicInputRfqFormOwner(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Label already exists',
        });
    });

    it('should return 200 and save dynamic input if label is unique', async () => {
        DynamicInput.findOne.mockResolvedValue(null);
        const mockSavedDynamicInput = { _id: 'newId' };
        DynamicInput.prototype.save = jest
            .fn()
            .mockResolvedValue(mockSavedDynamicInput);

        const mockDynamicForms = {
            dynamicForms: [
                {
                    dynamicInput: 'mockInputId',
                    formType: 'addShipForm',
                    templateType: 'generalAddShip',
                    inputType: 'textInput',
                    label: 'Ship Name',
                    fieldName: 'shipName',
                    fieldType: 'string',
                    placeholder: 'Enter your ship name',
                    required: true,
                    order: 1,
                },
            ],
            save: jest.fn().mockResolvedValue(true),
        };

        DynamicForm.findOne.mockResolvedValue(mockDynamicForms);

        await addDynamicInputRfqFormOwner(req, res);

        expect(DynamicInput.prototype.save).toHaveBeenCalled();
        expect(mockDynamicForms.dynamicForms).toHaveLength(1);
        expect(mockDynamicForms.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockDynamicForms,
        });
    });

    it('should return 500 if there is a server error', async () => {
        DynamicInput.findOne.mockRejectedValue(
            new Error('Internal server error'),
        );

        await addDynamicInputRfqFormOwner(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('getDynamicInputRFQByTemplateTypeOwner', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { shipId: 'shipId' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 404 if dynamic input is not found', async () => {
        DynamicForm.findOne.mockResolvedValue(null);

        await getDynamicInputRFQByTemplateTypeOwner(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Dynamic input not found',
        });
    });

    it('should return 200 and dynamic input data if found', async () => {
        const mockDynamicInput = {
            formType: 'rfqForm',
            templateType: 'shipIdCustomRfq',
            dynamicForms: [
                {
                    dynamicInput: 'mockInputId',
                    formType: 'addShipForm',
                    templateType: 'generalAddShip',
                    inputType: 'textInput',
                    label: 'Ship Name',
                    fieldName: 'shipName',
                    fieldType: 'string',
                    placeholder: 'Enter your ship name',
                    required: true,
                    order: 1,
                },
            ],
        };

        DynamicForm.findOne.mockResolvedValue(mockDynamicInput);

        await getDynamicInputRFQByTemplateTypeOwner(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockDynamicInput,
        });
    });

    it('should return 500 if there is a server error', async () => {
        DynamicForm.findOne.mockRejectedValue(
            new Error('Internal server error'),
        );

        await getDynamicInputRFQByTemplateTypeOwner(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('createTemplateDefaultRFQForm', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { templateType: 'customRfq' },
            params: { shipId: 'shipId' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 201 and update ship with new RFQ dynamic form', async () => {
        const mockDynamicInput = [
            {
                _id: 'dynamicInput1',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Needs',
                fieldName: 'needs',
                fieldType: 'string',
                placeholder: 'Ex: for transporting',
            },
            {
                _id: 'dynamicInput1',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Needs',
                fieldName: 'needs',
                fieldType: 'string',
                placeholder: 'Ex: for transporting',
            },
        ];

        const mockDynamicForms = {
            dynamicInput: '651f92405fd4d4e45576c7e0',
            formType: 'addShipForm',
            templateType: 'generalAddShip',
            inputType: 'textInput',
            label: 'Ship Name',
            fieldName: 'shipName',
            fieldType: 'string',
            placeholder: 'Enter your ship name',
            required: true,
            order: 1,
        };

        const mockShip = {
            _id: '12345',
            rfqDynamicForm: 'dynamicForm1',
        };

        DynamicInput.find.mockResolvedValue(mockDynamicInput);
        DynamicForm.findOne.mockResolvedValue(mockDynamicForms);
        Ship.findByIdAndUpdate.mockResolvedValue(mockShip);

        await createTemplateDefaultRFQForm(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockShip,
        });
    });

    it('should return 500 if there is a server error', async () => {
        const errorMessage = 'Internal server error';
        DynamicInput.find.mockRejectedValue(new Error(errorMessage));

        await createTemplateDefaultRFQForm(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: errorMessage,
        });
    });
});

describe('editDynamicInputOwnerRfqForm', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 'id' },
            body: {
                formType: 'rfqForm',
                templateType: 'customRfq',
                inputType: 'inputType',
                label: 'label',
                unit: 'unit',
                option: ['option1', 'option2'],
                min: 1,
                multiline: true,
                order: 1,
                required: true,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 200 and update dynamic input and form successfully', async () => {
        const mockOldInput = {
            _id: 'id',
            label: 'Old label',
            templateType: 'customRfq',
        };
        const mockUpdatedDynamicInput = { ...mockOldInput, label: 'New label' };
        const mockDynamicForm = {
            formType: 'rfqForm',
            templateType: 'customRfq',
            dynamicForms: [{ dynamicInput: 'dynamicInputId' }],
            save: jest.fn(),
        };

        DynamicInput.findOne.mockResolvedValueOnce(mockOldInput);
        DynamicInput.findOne.mockResolvedValueOnce(null);
        DynamicInput.findByIdAndUpdate.mockResolvedValue(
            mockUpdatedDynamicInput,
        );
        DynamicForm.findOne.mockResolvedValue(mockDynamicForm);

        await editDynamicInputOwnerRfqForm(req, res);

        expect(DynamicInput.findOne).toHaveBeenCalledWith({ _id: 'id' });
        expect(DynamicInput.findOne).toHaveBeenCalledWith({
            templateType: 'customRfq',
            label: { $regex: new RegExp('^New label$', 'i') },
        });
        expect(DynamicInput.findByIdAndUpdate).toHaveBeenCalledWith(
            { _id: 'id' },
            {
                formType: 'rfqForm',
                templateType: 'customRfq',
                inputType: 'textInput',
                label: 'New Label',
                unit: 'unit',
                order: 1,
                fieldName: _.camelCase('New Label'),
                fieldType: 'string',
                placeholder: 'Enter your New Label',
                validation: { min: 1, multiline: true },
            },
            { new: true },
        );
        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'rfqForm',
            templateType: 'customRfq',
        });
        expect(mockDynamicForm.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockDynamicForm,
        });
    });

    it('should return 400 if label already exists', async () => {
        const mockOldInput = {
            _id: 'id',
            label: 'Old label',
            templateType: 'customRfq',
        };
        const mockLabelNotUnique = {
            _id: 'id',
            label: 'New label',
            templateType: 'customRfq',
        };

        DynamicInput.findOne.mockResolvedValueOnce(mockOldInput);
        DynamicInput.findOne.mockResolvedValueOnce(mockLabelNotUnique);

        await editDynamicInputOwnerRfqForm(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Label already exists',
        });
    });

    it('should return 500 if there is a server error', async () => {
        DynamicInput.findOne.mockRejectedValue(
            new Error('Internal server error'),
        );

        await editDynamicInputOwnerRfqForm(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('createTemplateCustomRFQForm', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { templateType: 'customRfq' },
            params: { shipId: 'shipId' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 201 and create a default form if templateType is defaultRfq', async () => {
        req.body.templateType = 'defaultRfq';

        const mockDynamicInput = [
            {
                _id: 'dynamicInput1',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Needs',
                fieldName: 'needs',
                fieldType: 'string',
                placeholder: 'Ex: for transporting',
            },
            {
                _id: 'dynamicInput1',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Needs',
                fieldName: 'needs',
                fieldType: 'string',
                placeholder: 'Ex: for transporting',
            },
        ];

        const mockSavedDynamicForm = {
            _id: 'dynamicFormId',
            formType: 'rfqForm',
            templateType: 'defaultRfq',
            dynamicForms: mockDynamicInput,
        };

        DynamicInput.find.mockResolvedValue(mockDynamicInput);
        DynamicForm.prototype.save = jest
            .fn()
            .mockResolvedValue(mockSavedDynamicForm);
        Ship.updateMany.mockResolvedValue({});

        await createTemplateCustomRFQForm(req, res);

        expect(DynamicInput.find).toHaveBeenCalledWith({
            templateType: 'defaultRfq',
        });
        expect(DynamicForm.prototype.save).toHaveBeenCalled();
        expect(Ship.updateMany).toHaveBeenCalledWith(
            {},
            { $set: { rfqDynamicForm: mockSavedDynamicForm._id } },
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockSavedDynamicForm,
        });
    });

    it('should return 201 and create a custom RFQ form if templateType is not defaultRfq', async () => {
        const mockDefaultDynamicForms = {
            dynamicForms: [
                {
                    dynamicInput: 'dynamicInput1',
                    option: [],
                    validation: {},
                },
            ],
        };

        const mockSavedDynamicForm = {
            _id: 'dynamicFormId',
            formType: 'rfqForm',
            templateType: 'defaultRfq',
            dynamicForms: mockDefaultDynamicForms.dynamicForms,
        };

        DynamicForm.findOne.mockResolvedValue(mockDefaultDynamicForms);
        DynamicForm.prototype.save = jest
            .fn()
            .mockResolvedValue(mockSavedDynamicForm);
        Ship.findByIdAndUpdate.mockResolvedValue({});

        await createTemplateCustomRFQForm(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            templateType: 'defaultRfq',
        });
        expect(DynamicForm.prototype.save).toHaveBeenCalled();
        expect(Ship.findByIdAndUpdate).toHaveBeenCalledWith('shipId', {
            $set: { rfqDynamicForm: mockSavedDynamicForm._id },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockSavedDynamicForm,
        });
    });

    it('should return 500 if there is a server error', async () => {
        DynamicInput.find.mockRejectedValue(new Error('Internal server error'));

        await createTemplateCustomRFQForm(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('sendNegotiateContact', () => {
    it('should success 200 and made a new proposal', async () => {
        const fakeShips = { name: 'Ship 1' };
        const req = {
            body: {
                shipId: '12345',
                renterId: '67890',
                rentalId: 'ahsda',
                note: 'agsdad',
                offeredPrice: 10000000,
            },
            user: {
                firebaseId: '12345',
            },
            file: {
                draftContract: [
                    {
                        fieldname: 'draftContract',
                        originalname: 'example.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        buffer: Buffer.from([0x1, 0x2, 0x3]),
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const proposal = {
            id: '1231231',
            ship: '1213',
            renter: '55532',
            shipOwner: '12345',
            draftContract: 'https://proposalurl.com',
            isAccepted: false,
        };
        User.findOne.mockResolvedValue(expectedUser);
        Renter.findOne.mockResolvedValue(expectedRenter);
        ShipOwner.findOne.mockResolvedValue(expectedShipOwner);

        Ship.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeShips),
        });
        firebaseAdmin.storage().bucket.mockReturnThis();
        firebaseAdmin.storage.mockReturnValueOnce({
            bucket: jest.fn().mockReturnThis(),
            file: jest.fn().mockReturnThis(),
            save: jest.fn().mockReturnThis(),
            getSignedUrl: jest
                .fn()
                .mockResolvedValueOnce(['https://example.com']),
            metadata: {
                mediaLink: 'https://example.com/media/link',
            },
        });
        await jest
            .spyOn(Proposal.prototype, 'save')
            .mockResolvedValue(proposal);

        Transaction.findOneAndUpdate.mockResolvedValue({
            proposal: {
                proposalId: proposal.id,
                proposalUrl: proposal.draftContract,
                notes: proposal.notes,
                offeredPrice: 10000000,
            },
            offeredPrice: 10000000,
            addStatus: jest.fn(),
            save: jest.fn(),
        });
        await sendNegotiateContact(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            newProposal: expect.any(Object),
        });
    }),
        it('should check file 400 no file found', async () => {
            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '12345',
                    googleId: '67890',
                },
                file: null,
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'No file found',
            });
        }),
        it('should check bucket 404 not found', async () => {
            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '12345',
                },
                file: {
                    draftContract: [
                        {
                            fieldname: 'draftContract',
                            originalname: 'example.pdf',
                            encoding: '7bit',
                            mimetype: 'application/pdf',
                            buffer: Buffer.from([0x1, 0x2, 0x3]),
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            firebaseAdmin.storage().bucket.mockReturnValue(null);
            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Bucket not found',
            });
        }),
        it('should check 404 user not found', async () => {
            firebaseAdmin.storage().bucket.mockReturnThis();
            User.findOne.mockResolvedValue(null);
            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '3474569',
                    googleId: '123435654',
                },
                file: {
                    draftContract: [
                        {
                            fieldname: 'draftContract',
                            originalname: 'example.pdf',
                            encoding: '7bit',
                            mimetype: 'application/pdf',
                            buffer: Buffer.from([0x1, 0x2, 0x3]),
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'User not found',
            });
        }),
        it('should check 404 renter not found', async () => {
            firebaseAdmin.storage().bucket.mockReturnThis();

            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '3474569',
                    googleId: '123435654',
                },
                file: {
                    draftContract: [
                        {
                            fieldname: 'draftContract',
                            originalname: 'example.pdf',
                            encoding: '7bit',
                            mimetype: 'application/pdf',
                            buffer: Buffer.from([0x1, 0x2, 0x3]),
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const fakeShips = { name: 'Ship 1' };

            User.findOne.mockResolvedValue(expectedUser);
            Renter.findOne.mockResolvedValue(null);
            ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
            Ship.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(fakeShips),
            });

            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Renter not found',
            });
        }),
        it('should check 404 shipOwner not found', async () => {
            firebaseAdmin.storage().bucket.mockReturnThis();
            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '3474569',
                    googleId: '123435654',
                },
                file: {
                    draftContract: [
                        {
                            fieldname: 'draftContract',
                            originalname: 'example.pdf',
                            encoding: '7bit',
                            mimetype: 'application/pdf',
                            buffer: Buffer.from([0x1, 0x2, 0x3]),
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const fakeShips = { name: 'Ship 1' };

            User.findOne.mockResolvedValue(expectedUser);
            Renter.findOne.mockResolvedValue(expectedRenter);
            ShipOwner.findOne.mockResolvedValue(null);
            Ship.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(fakeShips),
            });
            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Ship owner not found',
            });
        }),
        it('should check 404 ship not found', async () => {
            firebaseAdmin.storage().bucket.mockReturnThis();
            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '3474569',
                    googleId: '123435654',
                },
                file: {
                    draftContract: [
                        {
                            fieldname: 'draftContract',
                            originalname: 'example.pdf',
                            encoding: '7bit',
                            mimetype: 'application/pdf',
                            buffer: Buffer.from([0x1, 0x2, 0x3]),
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValue(expectedUser);
            Renter.findOne.mockResolvedValue(expectedRenter);
            ShipOwner.findOne.mockResolvedValue(expectedShipOwner);
            Ship.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });

            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Ship not found',
            });
        }),
        it('should check 404 transaction not found', async () => {
            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '3474569',
                    googleId: '123435654',
                },
                file: {
                    draftContract: [
                        {
                            fieldname: 'draftContract',
                            originalname: 'example.pdf',
                            encoding: '7bit',
                            mimetype: 'application/pdf',
                            buffer: Buffer.from([0x1, 0x2, 0x3]),
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const ship = [{ name: 'ship 1' }];
            User.findOne.mockResolvedValue(expectedUser);
            Renter.findOne.mockResolvedValue(expectedRenter);
            ShipOwner.findOne.mockResolvedValue(expectedShipOwner);

            Ship.findOne.mockReturnThis();
            Ship.findOne().populate.mockResolvedValue({ ship });

            firebaseAdmin.storage.mockReturnValueOnce({
                bucket: jest.fn().mockReturnThis(),
                file: jest.fn().mockReturnThis(),
                save: jest.fn().mockReturnThis(),
                getSignedUrl: jest
                    .fn()
                    .mockResolvedValueOnce(['https://example.com']),
                metadata: {
                    mediaLink: 'https://example.com/media/link',
                },
            });

            Transaction.findOneAndUpdate.mockResolvedValue(null);

            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Transaction not found',
            });
        }),
        it('should error 500 fail ', async () => {
            firebaseAdmin.storage().bucket.mockReturnThis();
            User.findOne.mockRejectedValue('something wrong');

            const req = {
                body: {
                    shipId: '12345',
                    renterId: '67890',
                    rentalId: 'ahsda',
                    note: 'agsdad',
                    offeredPrice: 10000000,
                },
                user: {
                    firebaseId: '3474569',
                    googleId: '123435654',
                },
                file: {
                    draftContract: [
                        {
                            fieldname: 'draftContract',
                            originalname: 'example.pdf',
                            encoding: '7bit',
                            mimetype: 'application/pdf',
                            buffer: Buffer.from([0x1, 0x2, 0x3]),
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await sendNegotiateContact(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'something wrong',
            });
        });
});

describe('getTransactionNegoById', () => {
    it('should success 200 and get transaction by id', async () => {
        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(expectedTransation),
                }),
            }),
        });
        const req = {
            params: {
                id: '1234',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTransactionNegoById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedTransation,
        });
    });
    it('should handle 400 error when no transaction found', async () => {
        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null),
                }),
            }),
        });
        const req = {
            params: {
                id: '2132313',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTransactionNegoById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    }),
        describe('getTransactionById', () => {
            it('should return the transaction data', async () => {
                const req = {
                    params: {
                        id: 'transactionId',
                    },
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                const mockTransaction = {
                    _id: 'transactionId',
                    rentalId: 'rentalId',
                    renterId: 'renterId',
                    rentalDuration: 7,
                    rentalStartDate: '2023-01-01',
                    rentalEndDate: '2023-01-08',
                    locationDeparture: 'Departure',
                    locationDestination: 'Destination',
                    status: 'completed',
                    rfq: {
                        rfqId: 'rfqId',
                        rfqUrl: 'https://example.com/rfq',
                    },
                    proposal: {
                        proposalId: 'proposalId',
                        proposalUrl: 'https://example.com/proposal',
                    },
                    offeredPrice: 1000,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-02T00:00:00.000Z',
                    paymentExpireDate: '2023-01-03T00:00:00.000Z',
                    contract: {
                        contractId: 'contractId',
                        contractUrl: 'https://example.com/contract',
                    },
                    sailingStatus: [
                        {
                            status: 'beforeSailing',
                            desc: 'Ready to sail',
                            image: [
                                {
                                    imageName: 'www.imagetest.com',
                                    imageUrl: 'www.imageurl.com',
                                },
                            ],
                            trackedBy: {
                                name: 'Fauzan',
                                role: 'shipOwner',
                            },
                        },
                    ],
                    beforeSailingPictures: [
                        'https://example.com/picture1',
                        'https://example.com/picture2',
                    ],
                    afterSailingPictures: [
                        'https://example.com/picture3',
                        'https://example.com/picture4',
                    ],
                    ship: {
                        shipId: {
                            shipOwnerId: 'shipOwnerId',
                            name: 'shipName',
                            imageUrl: 'https://example.com/shipImage',
                            category: 'shipCategory',
                            size: 'shipSize',
                            companyName: 'companyName',
                            companyType: 'companyType'
                        },
                    },
                };

                Transaction.findOne.mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockTransaction),
                });
                ShipCategory.findOne.mockResolvedValue({
                    name: 'shipCategory',
                });

                await getTransactionById(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    status: 'success',
                    data: {
                        _id: 'transactionId',
                        rentalId: 'rentalId',
                        renterId: 'renterId',
                        rentalDuration: 7,
                        rentalStartDate: '2023-01-01',
                        rentalEndDate: '2023-01-08',
                        locationDeparture: 'Departure',
                        locationDestination: 'Destination',
                        ship: {
                            shipOwnerId: 'shipOwnerId',
                            name: 'shipName',
                            imageUrl: 'https://example.com/shipImage',
                            category: 'shipCategory',
                            size: 'shipSize',
                            companyName: 'companyName',
                            companyType: 'companyType'
                        },
                        status: 'completed',
                        rfq: {
                            rfqId: 'rfqId',
                            rfqUrl: 'https://example.com/rfq',
                        },
                        proposal: {
                            proposalId: 'proposalId',
                            proposalUrl: 'https://example.com/proposal',
                        },
                        offeredPrice: 1000,
                        createdAt: '2023-01-01T00:00:00.000Z',
                        updatedAt: '2023-01-02T00:00:00.000Z',
                        paymentExpireDate: '2023-01-03T00:00:00.000Z',
                        contract: {
                            contractId: 'contractId',
                            contractUrl: 'https://example.com/contract',
                        },
                        sailingStatus: [
                            {
                                status: 'beforeSailing',
                                desc: 'Ready to sail',
                                image: [
                                    {
                                        imageName: 'www.imagetest.com',
                                        imageUrl: 'www.imageurl.com',
                                    },
                                ],
                                trackedBy: {
                                    name: 'Fauzan',
                                    role: 'shipOwner',
                                },
                            },
                        ],
                        beforeSailingPictures: [
                            'https://example.com/picture1',
                            'https://example.com/picture2',
                        ],
                        afterSailingPictures: [
                            'https://example.com/picture3',
                            'https://example.com/picture4',
                        ],
                    },
                });
            });

            it('should return a 404 status if transaction is not found', async () => {
                const req = {
                    params: {
                        id: 'nonExistentTransactionId',
                    },
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                await getTransactionNegoById(req, res);

                expect(res.status).toHaveBeenCalledWith(404);
                Transaction.findOne.mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null),
                });

                await getTransactionById(req, res);

                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({
                    status: 'fail',
                    message: 'Transaction not found',
                });
            }),
                it('should handle error and return response 500', async () => {
                    Transaction.findOne.mockReturnThis();
                    Transaction.findOne().populate.mockReturnValue({
                        populate: jest.fn().mockReturnValue({
                            populate: jest.fn().mockReturnValue({
                                populate: jest
                                    .fn()
                                    .mockRejectedValue('Something wrong'),
                            }),
                        }),
                    });
                    const req = {
                        params: {
                            id: '123',
                        },
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn(),
                    };

                    await getTransactionNegoById(req, res);

                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({
                        status: 'fail',
                        message: 'Something wrong',
                    });
                });
        });

    it('should return a 404 status if ship is not found in the transaction', async () => {
        const req = {
            params: {
                id: 'transactionId',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTransaction = {
            _id: 'transactionId',
            rentalId: 'rentalId',
            renterId: 'renterId',
            rentalDuration: 7,
            rentalStartDate: '2023-01-01',
            rentalEndDate: '2023-01-08',
            locationDeparture: 'Departure',
            locationDestination: 'Destination',
            status: 'completed',
            rfq: {
                rfqId: 'rfqId',
                rfqUrl: 'https://example.com/rfq',
            },
            proposal: {
                proposalId: 'proposalId',
                proposalUrl: 'https://example.com/proposal',
            },
            offeredPrice: 1000,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
            paymentExpireDate: '2023-01-03T00:00:00.000Z',
            contract: {
                contractId: 'contractId',
                contractUrl: 'https://example.com/contract',
            },
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            beforeSailingPictures: [
                'https://example.com/picture1',
                'https://example.com/picture2',
            ],
            afterSailingPictures: [
                'https://example.com/picture3',
                'https://example.com/picture4',
            ],
            ship: null,
        };

        Transaction.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockTransaction),
        });

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found in the transaction',
        });
    });

    it('should return a 404 status if shipId is not found in the transaction', async () => {
        const req = {
            params: {
                id: 'transactionId',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTransaction = {
            _id: 'transactionId',
            rentalId: 'rentalId',
            renterId: 'renterId',
            rentalDuration: 7,
            rentalStartDate: '2023-01-01',
            rentalEndDate: '2023-01-08',
            locationDeparture: 'Departure',
            locationDestination: 'Destination',
            status: 'completed',
            rfq: {
                rfqId: 'rfqId',
                rfqUrl: 'https://example.com/rfq',
            },
            proposal: {
                proposalId: 'proposalId',
                proposalUrl: 'https://example.com/proposal',
            },
            offeredPrice: 1000,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
            paymentExpireDate: '2023-01-03T00:00:00.000Z',
            contract: {
                contractId: 'contractId',
                contractUrl: 'https://example.com/contract',
            },
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            beforeSailingPictures: [
                'https://example.com/picture1',
                'https://example.com/picture2',
            ],
            afterSailingPictures: [
                'https://example.com/picture3',
                'https://example.com/picture4',
            ],
            ship: {
                shipId: null,
            },
        };

        Transaction.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockTransaction),
        });

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'ShipId not found in the transaction',
        });
    });

    it('should return a 404 status if ship category is not found', async () => {
        const req = {
            params: {
                id: 'transactionId',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTransaction = {
            _id: 'transactionId',
            rentalId: 'rentalId',
            renterId: 'renterId',
            rentalDuration: 7,
            rentalStartDate: '2023-01-01',
            rentalEndDate: '2023-01-08',
            locationDeparture: 'Departure',
            locationDestination: 'Destination',
            status: 'completed',
            rfq: {
                rfqId: 'rfqId',
                rfqUrl: 'https://example.com/rfq',
            },
            proposal: {
                proposalId: 'proposalId',
                proposalUrl: 'https://example.com/proposal',
            },
            offeredPrice: 1000,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
            paymentExpireDate: '2023-01-03T00:00:00.000Z',
            contract: {
                contractId: 'contractId',
                contractUrl: 'https://example.com/contract',
            },
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            beforeSailingPictures: [
                'https://example.com/picture1',
                'https://example.com/picture2',
            ],
            afterSailingPictures: [
                'https://example.com/picture3',
                'https://example.com/picture4',
            ],
            ship: {
                shipId: {
                    category: 'nonExistentCategoryId',
                },
            },
        };

        Transaction.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockTransaction),
        });
        ShipCategory.findOne.mockResolvedValue(null);

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship category not found',
        });
    });
});
describe('submitShipPicturesBeforeSailing', () => {
    it('should upload ship pictures before sailing', async () => {
        const req = {
            files: [
                {
                    originalname: 'image1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image1'),
                },
                {
                    originalname: 'image2.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image2'),
                },
            ],
            body: {
                transactionId: '123456789',
                descriptions: ['Description 1', 'Description 2'],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            _id: '123456789',
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            save: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(transaction);

        await submitShipPicturesBeforeSailing(req, res);

        expect(Transaction.findOne).toHaveBeenCalledWith({ _id: '123456789' });
        expect(transaction.beforeSailingPictures).toHaveLength(2);
        expect(transaction.beforeSailingPictures[0].documentName).toBe(
            'image1.jpg',
        );
        expect(transaction.beforeSailingPictures[0].documentUrl).toBe(
            'https://example.com/media/link',
        );
        expect(transaction.beforeSailingPictures[0].description).toBe(
            'Description 1',
        );
        expect(transaction.beforeSailingPictures[1].documentName).toBe(
            'image2.jpg',
        );
        expect(transaction.beforeSailingPictures[1].documentUrl).toBe(
            'https://example.com/media/link',
        );
        expect(transaction.beforeSailingPictures[1].description).toBe(
            'Description 2',
        );
        expect(transaction.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: transaction,
        });
    });

    it('should return an error if no files are found', async () => {
        const req = {
            files: [],
            body: {
                transactionId: '123456789',
                descriptions: ['Description 1', 'Description 2'],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipPicturesBeforeSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No files found' });
    });

    it('should return an error if bucket is not found', async () => {
        const req = {
            files: [
                {
                    originalname: 'image1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image1'),
                },
            ],
            body: {
                transactionId: '123456789',
                descriptions: 'Description 1',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        firebaseAdmin.storage().bucket.mockReturnValue(null);

        await submitShipPicturesBeforeSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Bucket not found' });
    });
});

describe('submitShipPicturesAfterSailing', () => {
    it('should upload ship pictures after sailing', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue({
            file: jest.fn().mockReturnValue({
                getSignedUrl: jest
                    .fn()
                    .mockResolvedValue(['https://example.com/media/link']),
                save: jest.fn().mockReturnThis(),
                metadata: {
                    mediaLink: 'https://example.com/media/link',
                },
            }),
        });
        const req = {
            files: [
                {
                    originalname: 'ship1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
                {
                    originalname: 'ship2.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
            ],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            _id: '123456789',
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            beforeSailingPictures: [
                {
                    _id: 'picture1',
                },
                {
                    _id: 'picture2',
                },
            ],
            afterSailingPictures: [],
            save: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(transaction);

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: transaction,
        });
        expect(transaction.afterSailingPictures.length).toBe(2);
        expect(transaction.afterSailingPictures[0].beforeSailingPictureId).toBe(
            'picture1',
        );
        expect(transaction.afterSailingPictures[1].beforeSailingPictureId).toBe(
            'picture2',
        );
        expect(transaction.save).toHaveBeenCalled();
    });

    it('should return error if no files found', async () => {
        const req = {
            files: [],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No files found',
        });
    });

    it('should return error if file is not an image', async () => {
        const req = {
            files: [
                {
                    originalname: 'ship1.pdf',
                    mimetype: 'application/pdf',
                    buffer: Buffer.from('pdf data'),
                },
            ],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Only image files are allowed',
        });
    });

    it('should return error if transaction not found', async () => {
        const req = {
            files: [
                {
                    originalname: 'ship1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
            ],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(null);

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should return error if sailing status is not afterSailing', async () => {
        const req = {
            files: [
                {
                    originalname: 'ship1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
            ],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            _id: '123456789',
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            beforeSailingPictures: [
                {
                    _id: 'picture1',
                },
            ],
        };

        Transaction.findOne.mockResolvedValue(transaction);

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Cannot upload before sailing',
        });
    });

    it('should return error if no corresponding beforeSailing pictures', async () => {
        const req = {
            files: [
                {
                    originalname: 'ship1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
            ],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            _id: '123456789',
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            beforeSailingPictures: [],
        };

        Transaction.findOne.mockResolvedValue(transaction);

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message:
                'Cannot upload "afterSailing" pictures without corresponding "beforeSailing" pictures',
        });
    });

    it('should return error if number of afterSailing pictures does not match number of beforeSailing pictures', async () => {
        const req = {
            files: [
                {
                    originalname: 'ship1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
                {
                    originalname: 'ship2.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
            ],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            _id: '123456789',
            sailingStatus: [
                {
                    status: 'beforeSailing',
                    desc: 'Ready to sail',
                    image: [
                        {
                            imageName: 'www.imagetest.com',
                            imageUrl: 'www.imageurl.com',
                        },
                    ],
                    trackedBy: {
                        name: 'Fauzan',
                        role: 'shipOwner',
                    },
                },
            ],
            beforeSailingPictures: [
                {
                    _id: 'picture1',
                },
            ],
        };

        Transaction.findOne.mockResolvedValue(transaction);

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message:
                'Number of "afterSailing" pictures must match the number of "beforeSailing" pictures',
        });
    });

    it('should handle error and return 500 status', async () => {
        const req = {
            files: [
                {
                    originalname: 'ship1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('image data'),
                },
            ],
            body: {
                transactionId: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockRejectedValue(new Error('Database error'));

        await submitShipPicturesAfterSailing(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Database error',
        });
    });
});

describe('updateTracking', () => {
    const req = {
        params: { id: 'transactionId' },
        body: {
            status: 'beforeSailing',
            imgDesc: 'image description',
            desc: 'description',
            date: '17-05-2023',
            time: '14:30',
        },
        user: {
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
        },
        files: [
            {
                originalname: 'image.jpg',
                buffer: Buffer.from('file content'),
                mimetype: 'image/jpeg',
            },
        ],
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if no bucket is found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue();

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No bucket found',
        });
    });

    it('should return 404 if user is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue({});

        User.findOne.mockResolvedValue(null);

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 400 if required fields are missing', async () => {
        const reqWithMissingFields = {
            ...req,
            body: {
                desc: '',
                date: '',
                time: '',
            },
        };

        firebaseAdmin.storage().bucket.mockReturnValue({});

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users',
        });

        await updateTracking(reqWithMissingFields, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: `fields can't be empty`,
        });
    });

    it('should return 404 if transaction is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue({});

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users',
        });

        Transaction.findOne.mockResolvedValue(null);

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No transaction found',
        });
    });

    it('should return 200 and update tracking successfully', async () => {
        firebaseAdmin.storage().bucket.mockResolvedValue({
            file: jest.fn().mockReturnValue({
                save: jest.fn().mockResolvedValue({}),
                getSignedUrl: jest
                    .fn()
                    .mockResolvedValue(['https://example.com/image.jpg']),
            }),
        });

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users',
        });

        const mockTransaction = {
            rentalId: 'transactionId',
            sailingStatus: [],
            status: [],
            ship: { shipId: 'ship123' },
            locationDeparture: 'Departure',
            locationDestination: 'Destination',
            save: jest.fn().mockResolvedValue({}),
        };

        Transaction.findOne.mockResolvedValue(mockTransaction);

        const mockShip = {
            name: 'Ship name',
        };

        Ship.findOne.mockResolvedValue(mockShip);

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    // it('should return 500 if there is an internal server error', async () => {
    //     firebaseAdmin.storage().bucket.mockResolvedValue({
    //         file: jest.fn().mockReturnValue({
    //             save: jest
    //                 .fn()
    //                 .mockRejectedValue(new Error('Internal server error')),
    //         }),
    //     });

    //     User.findOne.mockResolvedValue({
    //         rentalId: 'transactionId',
    //         sailingStatus: [],
    //         status: [],
    //         ship: { shipId: 'ship123' },
    //         locationDeparture: 'Departure',
    //         locationDestination: 'Destination',
    //         save: jest.fn().mockResolvedValue({}),
    //     });

    //     const mockTransaction = {
    //         rentalId: 'transactionId',
    //         sailingStatus: [],
    //         status: [],
    //         ship: { shipId: 'ship123' },
    //         locationDeparture: 'Departure',
    //         locationDestination: 'Destination',
    //         save: jest.fn().mockResolvedValue({}),
    //     };

    //     Transaction.findOne.mockResolvedValue(mockTransaction);

    //     await updateTracking(req, res);

    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.json).toHaveBeenCalledWith({
    //         status: 'fail'
    //     });
    // });
});

describe('getTrackingHistory', () => {
    const req = {
        params: { id: 'transactionId' },
        user: {
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if user is not found', async () => {
        User.findOne.mockResolvedValue(null);

        await getTrackingHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 404 if no tracking data is found', async () => {
        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'Name',
        });

        Transaction.aggregate.mockResolvedValue([]);

        await getTrackingHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No tracking data found',
        });
    });

    it('should return 200 and tracking history is successfully found', async () => {
        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'Name',
        });

        const mockTrackingHistory = [
            {
                _id: 'transactionId',
                ship: { _id: 'shipId', name: 'Ship Name' },
                company: {
                    company: { name: 'Company Name', companyType: 'Type' },
                },
                locationDeparture: 'Location A',
                locationDestination: 'Location B',
                trackingHistory: [
                    {
                        date: '2023-05-17',
                        status: 'beforeSailing',
                        desc: 'description',
                    },
                ],
            },
        ];

        Transaction.aggregate.mockResolvedValue(mockTrackingHistory);

        await getTrackingHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockTrackingHistory,
        });
    });

    it('should return 500 if there is an internal server error', async () => {
        User.findOne.mockRejectedValue(new Error('Internal server error'));

        await getTrackingHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});
