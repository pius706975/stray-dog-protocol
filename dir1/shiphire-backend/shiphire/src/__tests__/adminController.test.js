import {
    activateCompany,
    activateDynamicInput,
    activateUser,
    activeDynamicFormRFQ,
    activeDynamicInputRFQ,
    addDynamicInputAddShip,
    addDynamicInputDropDownItem,
    addDynamicInputRfqForm,
    approveDeleteShipHistory,
    companyList,
    createTemplateRFQForm,
    deleteItemDropdownDynamicInput,
    deleteSpecificCategories,
    editAddShipInputOrder,
    editDynamicInputAddShip,
    getAddShipDynamicForm,
    getAllTemplateRFQForms,
    getAllUserTransaction,
    getDynamicInputByTemplateName,
    getDynamicInputRFQById,
    getDynamicInputRFQByTemplateType,
    getListUser,
    getSelectDropDownInput,
    getShipSpects,
    rejectCompany,
    shipApproved,
    unapproveShip,
} from '../controller/adminController';
import DynamicForm from '../models/DynamicForm';
import DynamicInput from '../models/DynamicInput';
import Renter from '../models/Renter';
import Ship from '../models/Ship';
import ShipHistory from '../models/ShipHistory';
import ShipOwner from '../models/ShipOwner';
import Transaction from '../models/Transaction';
import User from '../models/User';

jest.mock('../models/Ship');
jest.mock('../models/User');
jest.mock('../models/Transaction');
jest.mock('../models/DynamicForm');
jest.mock('../models/ShipOwner');
jest.mock('../models/Renter');
jest.mock('../models/ShipHistory');
jest.mock('../models/DynamicInput');

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
        isVerified: true,
        isRejected: false,
    },

    ships: [],
};

const expectedRenter = {
    userId: 'mockUserId',
    name: 'John',
    renterPreference: [],
    company: {
        name: 'company name',
        isVerified: true,
        isRejected: false,
    },
};

const expectedUser = [
    {
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
    },
    {
        _id: '65408338cff83b27',
        name: 'Aziz',
        email: 'muhammadNurAzis@mail.com',
        isPhoneVerified: true,
        isCompanySubmitted: true,
        phoneNumber: '081212121',
        firebaseId: 'CTrhPWr1KOl6ETAFz60912',
        roles: 'shipOwnwe',
        isActive: true,
        renterId: '1234',
    },
];

describe('unapproveShip', () => {
    it('should return 200 status and message ship unapproved', async () => {
        const fakeShip = new Ship({
            _id: '1234',
            shipName: 'KMP. Budi Luhur',
            shipApproved: true,
        });

        Ship.findOne = jest.fn().mockResolvedValue(fakeShip);

        const saveSpy = jest
            .spyOn(fakeShip, 'save')
            .mockResolvedValue(fakeShip);

        const req = {
            body: {
                _id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await unapproveShip(req, res);

        expect(Ship.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(fakeShip.shipApproved).toBe(false);
        expect(saveSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Ship has been unapproved',
        });
    });

    it('should return a 404 status when ship not found', async () => {
        Ship.findOne = jest.fn().mockResolvedValue(null);

        const req = {
            body: {
                _id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await unapproveShip(req, res);

        expect(Ship.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Ship.findOne = jest.fn().mockRejectedValue('Some database error');

        const req = {
            body: {
                _id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await unapproveShip(req, res);

        expect(Ship.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('shipApproved', () => {
    it('should return 200 status and message ship approved', async () => {
        const fakeShip = new Ship({
            _id: '1234',
            shipName: 'KMP. Budi Luhur',
            shipApproved: false,
        });

        Ship.findOne = jest.fn().mockResolvedValue(fakeShip);

        const saveSpy = jest
            .spyOn(fakeShip, 'save')
            .mockResolvedValue(fakeShip);

        // Ship.findOne.mockResolvedValue(fakeShip);
        // fakeShip.save = jest.fn().mockResolvedValue(fakeShip);
        const req = {
            body: {
                _id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shipApproved(req, res);

        expect(Ship.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(fakeShip.shipApproved).toBe(true);
        expect(saveSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Ship has been approved',
        });
    });

    it('should return a 404 status when ship not found', async () => {
        Ship.findOne = jest.fn().mockResolvedValue(null);

        const req = {
            body: {
                _id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shipApproved(req, res);

        expect(Ship.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Ship.findOne = jest.fn().mockRejectedValue('Some database error');

        const req = {
            body: {
                _id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shipApproved(req, res);

        expect(Ship.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('activateUser', () => {
    it('should return 200 status and data user', async () => {
        const fakeUser = {
            _id: '1234',
            name: 'John Doe',
            isActive: false,
        };

        const req = {
            body: {
                _id: '1234',
                isActive: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // const findOneAndUpdateSpy = jest
        //     .spyOn(User, 'findOneAndUpdate')
        //     .mockResolvedValue(fakeUser);

        User.findOneAndUpdate.mockResolvedValue(fakeUser);

        await activateUser(req, res);

        // expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        //     { _id: '1234' },
        //     { isActive: true },
        //     {
        //         projection: {
        //             isActive: 1,
        //         },
        //         new: true,
        //     },
        // );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeUser,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        User.findOneAndUpdate.mockRejectedValue('Some database error');

        const req = {
            body: {
                _id: '1234',
                isActive: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await activateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getListUser', () => {
    it('should return 200 status and data user', async () => {
        const fakeUser = [
            {
                _id: '1234',
                isActive: false,
            },
            {
                _id: '12345',
                isActive: false,
            },
        ];

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.find.mockReturnThis();
        User.find().populate.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeUser),
        });

        await getListUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeUser,
        });
    });

    it('should return a 404 status when user not found', async () => {
        User.find.mockReturnThis();
        User.find().populate.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getListUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Form not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        User.find.mockReturnThis();
        User.find().populate.mockReturnValue({
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getListUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getAllUserTransaction', () => {
    it('should return 200 status and data transactions', async () => {
        const fakeTransactions = [
            {
                _id: '1234',
                shipName: 'KMP. Budi Luhur',
                offeredPrice: 1000000,
            },
            {
                _id: '12345',
                shipName: 'KMP. Budi Luhur 2',
                offeredPrice: 2000000,
            },
        ];

        const req = {
            query: {
                page: 1,
                limit: 10,
                query: 'query',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.aggregate.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(fakeTransactions),
        });

        await getAllUserTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeTransactions,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Transaction.aggregate.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {
            query: {
                page: 1,
                limit: 10,
                query: 'query',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllUserTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            error: 'Terjadi kesalahan dalam pencarian transaksi.',
        });
    });
});

describe('getAddShipDynamicForm', () => {
    it('should return 200 status and data dynamic form', async () => {
        const fakeDynamicForm = [
            {
                _id: '1234',
                name: 'Ship Name',
                type: 'text',
                isRequired: true,
            },
            {
                _id: '12345',
                name: 'Ship Name 2',
                type: 'text',
                isRequired: true,
            },
        ];

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicForm.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeDynamicForm),
        });

        await getAddShipDynamicForm(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeDynamicForm,
        });
    });

    it('should return a 404 status when dynamic form not found', async () => {
        DynamicForm.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAddShipDynamicForm(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Form not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        DynamicForm.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAddShipDynamicForm(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('activateCompany', () => {
    it('should verify company when role is shipowner', async () => {
        const req = {
            body: {
                id: 123,
                role: 'shipOwner',
                verified: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        ShipOwner.findOneAndUpdate.mockResolvedValue(expectedShipOwner);
        await activateCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should verify company when role is renter', async () => {
        const req = {
            body: {
                id: 123,
                role: 'renter',
                verified: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Renter.findOneAndUpdate.mockResolvedValue(expectedRenter);
        await activateCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should failed update company when no ship owner found', async () => {
        const req = {
            body: {
                id: 123,
                role: 'shipOwner',
                verified: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        ShipOwner.findOneAndUpdate.mockResolvedValue(null);
        await activateCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Failed verified data',
        });
    });
    it('should handle error when error updating data', async () => {
        const req = {
            body: {
                id: 123,
                role: 'shipOwner',
                verified: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        ShipOwner.findOneAndUpdate.mockRejectedValue({
            message: 'something wrong',
        });
        await activateCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('rejectCompany', () => {
    it('should reject company when role is shipowner', async () => {
        const req = {
            body: {
                id: 123,
                role: 'shipOwner',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        ShipOwner.findOneAndUpdate.mockResolvedValue(expectedShipOwner);
        await rejectCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should reject company when role is renter', async () => {
        const req = {
            body: {
                id: 123,
                role: 'renter',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Renter.findOneAndUpdate.mockResolvedValue(expectedRenter);
        await rejectCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should handle when no company found', async () => {
        const req = {
            body: {
                id: 123,
                role: 'renter',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Renter.findOneAndUpdate.mockResolvedValue(null);
        await rejectCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Failed rejected company',
        });
    });
    it('should handle error when updating company', async () => {
        const req = {
            body: {
                id: 123,
                role: 'renter',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Renter.findOneAndUpdate.mockRejectedValue({
            message: 'something wrong',
        });
        await rejectCompany(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('companyList', () => {
    it('should get all company data', async () => {
        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.find().populate.mockReturnValue({
            populate: jest.fn().mockResolvedValue(expectedUser),
        });
        await companyList(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedUser,
        });
    });
    it('should handle error when get data error', async () => {
        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.find().populate.mockReturnValue({
            populate: jest
                .fn()
                .mockRejectedValue({ message: 'something wrong' }),
        });
        await companyList(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('approveDeleteShipHistory', () => {
    it('should return 200 status and updated ship history when deleteStatus is pending', async () => {
        const fakeShipHistory = {
            _id: '1234',
            deleteStatus: 'pending',
            save: jest.fn().mockResolvedValue({
                _id: '1234',
                deleteStatus: 'approved',
            }),
        };

        ShipHistory.findOne = jest.fn().mockResolvedValue(fakeShipHistory);

        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await approveDeleteShipHistory(req, res);

        expect(ShipHistory.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(fakeShipHistory.deleteStatus).toBe('approved');
        expect(fakeShipHistory.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                _id: '1234',
                deleteStatus: 'approved',
            },
        });
    });

    it('should return a 404 status when ship history not found', async () => {
        ShipHistory.findOne = jest.fn().mockResolvedValue(null);

        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await approveDeleteShipHistory(req, res);

        expect(ShipHistory.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'No ship history found',
        });
    });

    it('should return a 400 status when ship history deleteStatus is not pending', async () => {
        const fakeShipHistory = {
            _id: '1234',
            deleteStatus: 'approved',
        };

        ShipHistory.findOne = jest.fn().mockResolvedValue(fakeShipHistory);

        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await approveDeleteShipHistory(req, res);

        expect(ShipHistory.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship history status is not pending',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        ShipHistory.findOne = jest
            .fn()
            .mockRejectedValue('Some database error');

        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await approveDeleteShipHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getShipSpects', () => {
    it('should return 200 status and data of ship specifications', async () => {
        const fakeShipSpects = ['Spesific1', 'Spesific2'];
        const expectedResponse = [
            { templateType: 'Spesific1', value: 'Spesific 1' },
            { templateType: 'Spesific2', value: 'Spesific 2' },
        ];

        DynamicInput.distinct.mockResolvedValue(fakeShipSpects);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipSpects(req, res);

        expect(DynamicInput.distinct).toHaveBeenCalledWith('templateType', {
            $or: [
                { templateType: /Spesific\b$/i },
                { templateType: 'spesificAddShip' },
            ],
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedResponse,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const errorMessage = 'Some error message';

        DynamicInput.distinct.mockRejectedValue(errorMessage);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getShipSpects(req, res);

        expect(DynamicInput.distinct).toHaveBeenCalledWith('templateType', {
            $or: [
                { templateType: /Spesific\b$/i },
                { templateType: 'spesificAddShip' },
            ],
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: errorMessage,
        });
    });
});

describe('activateDynamicInput', () => {
    it('should update the active status of a dynamic input and return 200 status', async () => {
        const fakeDynamicInput = {
            _id: '1234',
            active: false,
        };

        const req = {
            body: {
                id: '1234',
                isActive: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findOneAndUpdate.mockResolvedValue(fakeDynamicInput);

        await activateDynamicInput(req, res);

        expect(DynamicInput.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            { active: true },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle errors and return a 500 status', async () => {
        DynamicInput.findOneAndUpdate.mockRejectedValue('Some database error');

        const req = {
            body: {
                id: '1234',
                isActive: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await activateDynamicInput(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('deleteSpecificCategories', () => {
    it('should delete specific categories and return 200 status', async () => {
        const req = {
            body: {
                templateType: 'someTemplateType',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const deleteManySpy = jest.spyOn(DynamicInput, 'deleteMany');

        await deleteSpecificCategories(req, res);

        expect(deleteManySpy).toHaveBeenCalledWith({
            templateType: 'someTemplateType',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                templateType: 'someTemplateType',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const deleteManySpy = jest.spyOn(DynamicInput, 'deleteMany');
        deleteManySpy.mockRejectedValue('Some database error');

        await deleteSpecificCategories(req, res);

        expect(deleteManySpy).toHaveBeenCalledWith({
            templateType: 'someTemplateType',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('deleteItemDropdownDynamicInput', () => {
    it('should delete the dynamic input item and return a 200 status', async () => {
        const fakeId = '1234';

        const req = {
            body: {
                id: fakeId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findByIdAndDelete = jest.fn();

        await deleteItemDropdownDynamicInput(req, res);

        expect(DynamicInput.findByIdAndDelete).toHaveBeenCalledWith({
            _id: fakeId,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle errors and return a 500 status', async () => {
        const fakeId = '1234';

        const req = {
            body: {
                id: fakeId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findByIdAndDelete = jest
            .fn()
            .mockRejectedValue('Some database error');

        await deleteItemDropdownDynamicInput(req, res);

        expect(DynamicInput.findByIdAndDelete).toHaveBeenCalledWith({
            _id: fakeId,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('createTemplateRFQForm', () => {
    it('should create a new dynamic form with default dynamic inputs for defaultRfq template type', async () => {
        const req = {
            body: {
                templateType: 'defaultRfq',
            },
        };

        const defaultDynamicInputs = [
            {
                _id: 'input1',
                name: 'Input 1',
                // ...other properties...
            },
            {
                _id: 'input2',
                name: 'Input 2',
                // ...other properties...
            },
        ];

        DynamicInput.find.mockResolvedValue(defaultDynamicInputs);

        const savedDynamicForm = {
            _id: 'dynamicForm1',
            formType: 'rfqForm',
            templateType: 'defaultRfq',
            dynamicForms: [
                {
                    dynamicInput: 'input1',
                    required: true,
                    option: [],
                    validation: {},
                },
                {
                    dynamicInput: 'input2',
                    required: true,
                    option: [],
                    validation: {},
                },
            ],
        };

        DynamicForm.prototype.save.mockResolvedValue(savedDynamicForm);

        const updateManySpy = jest.spyOn(Ship, 'updateMany');

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createTemplateRFQForm(req, res);

        expect(DynamicInput.find).toHaveBeenCalledWith({
            templateType: 'defaultRfq',
        });
        expect(DynamicForm.prototype.save).toHaveBeenCalled();
        expect(updateManySpy).toHaveBeenCalledWith(
            {},
            { $set: { rfqDynamicForm: 'dynamicForm1' } },
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: savedDynamicForm,
        });
    });

    it('should create a new dynamic form with default dynamic forms for non-defaultRfq template type', async () => {
        const req = {
            body: {
                templateType: 'customRfq',
            },
        };

        const defaultDynamicForms = {
            _id: 'defaultForms1',
            dynamicForms: [
                {
                    dynamicInput: 'input1',
                    required: true,
                    option: [],
                    validation: {},
                },
                {
                    dynamicInput: 'input2',
                    required: true,
                    option: [],
                    validation: {},
                },
            ],
        };

        DynamicForm.findOne.mockResolvedValue(defaultDynamicForms);

        const savedDynamicForm = {
            _id: 'dynamicForm2',
            formType: 'rfqForm',
            templateType: 'customRfq',
            dynamicForms: [
                {
                    dynamicInput: 'input1',
                    required: true,
                    option: [],
                    validation: {},
                },
                {
                    dynamicInput: 'input2',
                    required: true,
                    option: [],
                    validation: {},
                },
            ],
        };

        DynamicForm.prototype.save.mockResolvedValue(savedDynamicForm);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createTemplateRFQForm(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            templateType: 'defaultRfq',
        });
        expect(DynamicForm.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: savedDynamicForm,
        });
    });
});

describe('activeDynamicInputRFQ', () => {
    it('should return 404 status and message when dynamic input is not found', async () => {
        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findById.mockResolvedValue(null);

        await activeDynamicInputRFQ(req, res);

        expect(DynamicInput.findById).toHaveBeenCalledWith('1234');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Dynamic input not found',
        });
    });

    it('should toggle the active value and return 200 status', async () => {
        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const dynamicInput = {
            _id: '1234',
            active: true,
        };

        DynamicInput.findById.mockResolvedValue(dynamicInput);
        DynamicInput.findOneAndUpdate.mockResolvedValue();

        await activeDynamicInputRFQ(req, res);

        expect(DynamicInput.findById).toHaveBeenCalledWith('1234');
        expect(DynamicInput.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            { $set: { active: false } },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });
});

describe('getSelectDropDownInput', () => {
    it('should return 200 status and data of drop down input', async () => {
        const req = {
            params: {
                templateType: 'someTemplateType',
            },
        };

        const fakeDropDownInput = [
            { _id: '1', name: 'Option 1' },
            { _id: '2', name: 'Option 2' },
        ];

        DynamicInput.find.mockResolvedValue(fakeDropDownInput);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getSelectDropDownInput(req, res);

        expect(DynamicInput.find).toHaveBeenCalledWith({
            templateType: 'someTemplateTypeSpec',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeDropDownInput,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            params: {
                templateType: 'someTemplateType',
            },
        };

        DynamicInput.find.mockRejectedValue('Some database error');

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getSelectDropDownInput(req, res);

        expect(DynamicInput.find).toHaveBeenCalledWith({
            templateType: 'someTemplateTypeSpec',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('activeDynamicFormRFQ', () => {
    it('should return 404 status and message when dynamic form is not found', async () => {
        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicForm.findById.mockResolvedValue(null);

        await activeDynamicFormRFQ(req, res);

        expect(DynamicForm.findById).toHaveBeenCalledWith('1234');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Dynamic form not found',
        });
    });

    it('should toggle the active value and return 200 status', async () => {
        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const dynamicForm = {
            _id: '1234',
            active: true,
        };

        DynamicForm.findById.mockResolvedValue(dynamicForm);
        DynamicForm.findOneAndUpdate.mockResolvedValue();

        await activeDynamicFormRFQ(req, res);

        expect(DynamicForm.findById).toHaveBeenCalledWith('1234');
        expect(DynamicForm.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            { $set: { active: false } },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                id: '1234',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicForm.findById.mockRejectedValue(
            new Error('Some database error'),
        );

        await activeDynamicFormRFQ(req, res);

        expect(DynamicForm.findById).toHaveBeenCalledWith('1234');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('activateCompany', () => {
    it('should return 200 status and success message for shipOwner role', async () => {
        const fakeShipOwner = {
            _id: '1234',
            company: {
                isVerified: false,
            },
        };

        ShipOwner.findOneAndUpdate.mockResolvedValue(fakeShipOwner);

        const req = {
            body: {
                id: '1234',
                role: 'shipOwner',
                verified: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await activateCompany(req, res);

        expect(ShipOwner.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            {
                $set: { 'company.isVerified': true },
            },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should return 200 status and success message for renter role', async () => {
        const fakeRenter = {
            _id: '1234',
            company: {
                isVerified: false,
            },
        };

        Renter.findOneAndUpdate.mockResolvedValue(fakeRenter);

        const req = {
            body: {
                id: '1234',
                role: 'renter',
                verified: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await activateCompany(req, res);

        expect(Renter.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            {
                $set: { 'company.isVerified': true },
            },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should return 500 status and fail message when company update fails', async () => {
        ShipOwner.findOneAndUpdate.mockResolvedValue(null);

        const req = {
            body: {
                id: '1234',
                role: 'shipOwner',
                verified: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await activateCompany(req, res);

        expect(ShipOwner.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            {
                $set: { 'company.isVerified': true },
            },
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Failed verified data',
        });
    });
});

describe('rejectCompany', () => {
    it('should return 200 status and success message when company is rejected for shipOwner', async () => {
        const fakeShipOwner = {
            _id: '1234',
            company: {
                isVerified: true,
                isRejected: false,
            },
        };

        ShipOwner.findOneAndUpdate.mockResolvedValue(fakeShipOwner);

        const req = {
            body: {
                id: '1234',
                role: 'shipOwner',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await rejectCompany(req, res);

        expect(ShipOwner.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            {
                $set: {
                    'company.isVerified': false,
                    'company.isRejected': true,
                },
            },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should return 200 status and success message when company is rejected for renter', async () => {
        const fakeRenter = {
            _id: '1234',
            company: {
                isVerified: true,
                isRejected: false,
            },
        };

        Renter.findOneAndUpdate.mockResolvedValue(fakeRenter);

        const req = {
            body: {
                id: '1234',
                role: 'renter',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await rejectCompany(req, res);

        expect(Renter.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            {
                $set: {
                    'company.isVerified': false,
                    'company.isRejected': true,
                },
            },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should return a 500 status and fail message when company update fails', async () => {
        ShipOwner.findOneAndUpdate.mockResolvedValue(null);

        const req = {
            body: {
                id: '1234',
                role: 'shipOwner',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await rejectCompany(req, res);

        expect(ShipOwner.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            {
                $set: {
                    'company.isVerified': false,
                    'company.isRejected': true,
                },
            },
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Failed rejected company',
        });
    });

    it('should return a 500 status and error message when an error occurs', async () => {
        const errorMessage = 'Some error message';
        ShipOwner.findOneAndUpdate.mockRejectedValue(new Error(errorMessage));

        const req = {
            body: {
                id: '1234',
                role: 'shipOwner',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await rejectCompany(req, res);

        expect(ShipOwner.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '1234' },
            {
                $set: {
                    'company.isVerified': false,
                    'company.isRejected': true,
                },
            },
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: errorMessage,
        });
    });
});

describe('companyList', () => {
    it('should return 200 status and data of companies', async () => {
        const fakeCompanies = [
            {
                _id: '1234',
                roles: 'renter',
                renterId: {
                    company: {
                        name: 'Company 1',
                    },
                    name: 'John Doe',
                },
                shipOwnerId: {
                    company: {
                        name: 'Company 2',
                    },
                    name: 'Jane Smith',
                },
            },
            {
                _id: '5678',
                roles: 'shipOwner',
                renterId: {
                    company: {
                        name: 'Company 3',
                    },
                    name: 'Bob Johnson',
                },
                shipOwnerId: {
                    company: {
                        name: 'Company 4',
                    },
                    name: 'Alice Brown',
                },
            },
        ];

        User.find().populate.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeCompanies),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await companyList(req, res);

        expect(User.find).toHaveBeenCalledWith({}, { roles: 1 });
        expect(User.find().populate).toHaveBeenCalledWith({
            path: 'renterId',
            strictPopulate: false,
            select: ['company', 'name'],
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeCompanies,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const errorMessage = 'Some database error';
        User.find().populate.mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error(errorMessage)),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await companyList(req, res);

        expect(User.find).toHaveBeenCalledWith({}, { roles: 1 });
        expect(User.find().populate).toHaveBeenCalledWith({
            path: 'renterId',
            strictPopulate: false,
            select: ['company', 'name'],
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: errorMessage,
        });
    });
});

describe('getDynamicInputByTemplateName', () => {
    it('should return 200 status and data of dynamic inputs', async () => {
        const templateName = 'exampleTemplateName';

        const expectedDynamicInputs = [
            {
                _id: 'dynamicInputId1',
                formType: 'addShipForm',
                templateType: templateName,
                inputType: 'text',
                label: 'Example Label 1',
                placeholder: 'Example Placeholder 1',
                expired: false,
                active: true,
                order: 1,
                unit: 'kg',
                required: true,
                option: ['option1', 'option2'],
                validate: 'exampleValidation',
            },
            {
                _id: 'dynamicInputId2',
                formType: 'addShipForm',
                templateType: templateName,
                inputType: 'number',
                label: 'Example Label 2',
                placeholder: 'Example Placeholder 2',
                expired: true,
                active: false,
                order: 2,
                unit: 'm',
                required: false,
                option: ['option3', 'option4'],
                validate: 'exampleValidation',
            },
        ];

        DynamicForm.aggregate = jest
            .fn()
            .mockResolvedValue(expectedDynamicInputs);

        const req = {
            params: {
                templateName,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getDynamicInputByTemplateName(req, res);

        expect(DynamicForm.aggregate).toHaveBeenCalledWith([
            {
                $unwind: {
                    path: '$dynamicForms',
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'dynamicinputs',
                    localField: 'dynamicForms.dynamicInput',
                    foreignField: '_id',
                    as: 'dynamicForms.dynamicInput',
                },
            },
            {
                $unwind: {
                    path: '$dynamicForms.dynamicInput',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    formType: 'addShipForm',
                    'dynamicForms.dynamicInput.templateType': templateName,
                },
            },
            {
                $sort: {
                    'dynamicForms.dynamicInput.order': 1,
                },
            },
            {
                $project: {
                    _id: '$dynamicForms.dynamicInput._id',
                    formType: '$dynamicForms.dynamicInput.formType',
                    templateType: '$dynamicForms.dynamicInput.templateType',
                    inputType: '$dynamicForms.dynamicInput.inputType',
                    label: '$dynamicForms.dynamicInput.label',
                    placeholder: '$dynamicForms.dynamicInput.placeholder',
                    expired: '$dynamicForms.dynamicInput.docExpired',
                    active: '$dynamicForms.dynamicInput.active',
                    order: '$dynamicForms.dynamicInput.order',
                    unit: '$dynamicForms.dynamicInput.unit',
                    required: '$dynamicForms.required',
                    option: '$dynamicForms.option',
                    validate: '$dynamicForms.validation',
                },
            },
        ]);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedDynamicInputs,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const templateName = 'exampleTemplateName';

        DynamicForm.aggregate = jest
            .fn()
            .mockRejectedValue('Some database error');

        const req = {
            params: {
                templateName,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getDynamicInputByTemplateName(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('editDynamicInputAddShip', () => {
    it('should return 200 status and success message', async () => {
        const fakeInput = {
            _id: '1234',
            label: 'Test Label',
            inputType: 'textInput',
            required: true,
            unit: 'kg',
            option: ['Option 1', 'Option 2'],
            min: 0,
            max: 100,
            multiline: false,
            expired: true,
        };

        const req = {
            params: {
                id: '1234',
            },
            body: {
                label: 'Test Label',
                inputType: 'textInput',
                required: true,
                unit: 'kg',
                option: ['Option 1', 'Option 2'],
                min: 0,
                max: 100,
                multiline: false,
                expired: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findOne.mockResolvedValue(fakeInput);
        DynamicInput.findOneAndUpdate.mockResolvedValue(fakeInput);
        DynamicForm.findOneAndUpdate.mockResolvedValue({});

        await editDynamicInputAddShip(req, res);

        expect(DynamicInput.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(DynamicForm.findOneAndUpdate).toHaveBeenCalledWith(
            {
                formType: 'addShipForm',
                dynamicForms: {
                    $elemMatch: {
                        dynamicInput: '1234',
                    },
                },
            },
            {
                $set: {
                    'dynamicForms.$.required': true,
                    'dynamicForms.$.option': ['Option 1', 'Option 2'],
                    'dynamicForms.$.validation': {
                        min: 0,
                        multiline: false,
                        max: 100,
                    },
                },
            },
            { new: true },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should return 400 status and error message when label already exists', async () => {
        const fakeInput = {
            _id: '1234',
            label: 'Test Label',
            inputType: 'textInput',
            required: true,
            unit: 'kg',
            option: ['Option 1', 'Option 2'],
            min: 0,
            max: 100,
            multiline: false,
            expired: true,
        };

        const req = {
            params: {
                id: '1234',
            },
            body: {
                label: 'New Label',
                inputType: 'textInput',
                required: true,
                unit: 'kg',
                option: ['Option 1', 'Option 2'],
                min: 0,
                max: 100,
                multiline: false,
                expired: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findOne.mockResolvedValue(fakeInput);
        DynamicInput.findOne.mockResolvedValue({});

        await editDynamicInputAddShip(req, res);

        expect(DynamicInput.findOne).toHaveBeenCalledWith({ _id: '1234' });
        expect(DynamicInput.findOne).toHaveBeenCalledWith({
            templateType: undefined,
            label: { $regex: /New Label/i },
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Label already exists',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        DynamicInput.findOne.mockRejectedValue('Some database error');

        const req = {
            params: {
                id: '1234',
            },
            body: {
                label: 'Test Label',
                inputType: 'textInput',
                required: true,
                unit: 'kg',
                option: ['Option 1', 'Option 2'],
                min: 0,
                max: 100,
                multiline: false,
                expired: true,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await editDynamicInputAddShip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getDynamicInputRFQByTemplateType', () => {
    it('should return 200 status and dynamic input data', async () => {
        const templateType = 'exampleTemplateType';

        const dynamicInput = {
            _id: '1234',
            formType: 'rfqForm',
            templateType,
            dynamicForms: [
                {
                    dynamicInput: {
                        _id: '5678',
                        name: 'Example Dynamic Input',
                    },
                },
            ],
        };

        DynamicForm.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(dynamicInput),
        });

        const req = {
            params: {
                templateType,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getDynamicInputRFQByTemplateType(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'rfqForm',
            templateType,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: dynamicInput,
        });
    });

    it('should return a 404 status when dynamic input not found', async () => {
        const templateType = 'exampleTemplateType';

        DynamicForm.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        const req = {
            params: {
                templateType,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getDynamicInputRFQByTemplateType(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'rfqForm',
            templateType,
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Dynamic input not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const templateType = 'exampleTemplateType';

        DynamicForm.findOne.mockReturnValue({
            populate: jest.fn().mockRejectedValue('Some database error'),
        });

        const req = {
            params: {
                templateType,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getDynamicInputRFQByTemplateType(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'rfqForm',
            templateType,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getAllTemplateRFQForms', () => {
    it('should return 200 status and empty data when no template RFQ forms are found', async () => {
        DynamicForm.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue([]),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllTemplateRFQForms(req, res);

        expect(DynamicForm.find).toHaveBeenCalledWith({
            formType: { $in: ['rfqForm', 'defaultRfqForm'] },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: [],
        });
    });

    it('should return 200 status and template RFQ forms data', async () => {
        const fakeDynamicInput = {
            _id: '1234',
            name: 'Input 1',
        };

        const fakeDynamicForm = {
            _id: '5678',
            name: 'Form 1',
            dynamicForms: [
                {
                    dynamicInput: fakeDynamicInput,
                },
            ],
        };

        DynamicForm.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue([fakeDynamicForm]),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllTemplateRFQForms(req, res);

        expect(DynamicForm.find).toHaveBeenCalledWith({
            formType: { $in: ['rfqForm', 'defaultRfqForm'] },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: [fakeDynamicForm],
        });
    });

    it('should handle errors and return a 500 status', async () => {
        DynamicForm.find.mockReturnValue({
            populate: jest
                .fn()
                .mockRejectedValue(new Error('Some database error')),
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllTemplateRFQForms(req, res);

        expect(DynamicForm.find).toHaveBeenCalledWith({
            formType: { $in: ['rfqForm', 'defaultRfqForm'] },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('getDynamicInputRFQById', () => {
    it('should return the dynamic input with the given id', async () => {
        const dynamicInputId = '1234';
        const dynamicInput = {
            _id: dynamicInputId,
            formType: 'rfqForm',
            dynamicForms: [
                {
                    dynamicInput: {
                        _id: dynamicInputId,
                        name: 'Input 1',
                    },
                },
            ],
        };

        DynamicForm.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(dynamicInput),
        });

        const req = {
            params: {
                id: dynamicInputId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getDynamicInputRFQById(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'rfqForm',
            'dynamicForms.dynamicInput': dynamicInputId,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: dynamicInput.dynamicForms[0],
        });
    });

    it('should return a 404 status when dynamic input is not found', async () => {
        DynamicForm.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
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

        await getDynamicInputRFQById(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'rfqForm',
            'dynamicForms.dynamicInput': '1234',
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Dynamic input not found',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        DynamicForm.findOne.mockReturnValue({
            populate: jest.fn().mockRejectedValue('Some database error'),
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

        await getDynamicInputRFQById(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'rfqForm',
            'dynamicForms.dynamicInput': '1234',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('editAddShipInputOrder', () => {
    it('should update the order of dynamic inputs and return a success status', async () => {
        const req = {
            body: {
                data: [
                    {
                        _id: 'input1',
                        order: 1,
                    },
                    {
                        _id: 'input2',
                        order: 2,
                    },
                    {
                        _id: 'input3',
                        order: 3,
                    },
                ],
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const getLatestOrder = {
            order: 3,
        };

        DynamicInput.findOne.mockReturnValue({
            sort: jest.fn().mockResolvedValue(getLatestOrder),
        });
        DynamicInput.findOneAndUpdate.mockResolvedValue();

        await editAddShipInputOrder(req, res);

        expect(DynamicInput.findOne).toHaveBeenCalledWith({
            templateType: 'spesificAddShip',
        });
        expect(DynamicInput.findOne).toHaveBeenCalledWith({
            _id: 'input1',
            templateType: expect.any(Object),
        });
        expect(DynamicInput.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'input1' },
            { $set: { order: 4 } },
        );
        expect(DynamicInput.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'input2' },
            { $set: { order: 5 } },
        );
        expect(DynamicInput.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'input3' },
            { $set: { order: 6 } },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                data: [
                    {
                        _id: 'input1',
                        order: 1,
                    },
                ],
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findOne.mockReturnValue({
            sort: jest.fn().mockRejectedValue('Some database error'),
        });

        await editAddShipInputOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('addDynamicInputAddShip', () => {
    it('should add a dynamic input and return success status', async () => {
        const req = {
            body: {
                label: 'Test Label',
                inputType: 'textInput',
                required: true,
                unit: 'kg',
                templateName: 'Test Template',
                option: ['Option 1', 'Option 2'],
                min: 0,
                max: 100,
                multiline: false,
                expired: false,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const fakeDynamicInput = {
            _id: '1234',
            label: 'Test Label',
            fieldName: 'testLabel',
            placeholder: 'Enter your Test Label',
            inputType: 'textInput',
            formType: 'addShipForm',
            fieldType: 'text',
            templateType: 'testTemplate',
            unit: 'kg',
            docExpired: false,
            order: 1,
        };

        const fakeDynamicForm = {
            formType: 'addShipForm',
            addDynamicInput: jest.fn(),
            save: jest.fn(),
        };

        DynamicInput.findOne.mockResolvedValue(null);
        DynamicInput.findOne.mockReturnValue({
            sort: jest.fn().mockResolvedValue(null),
        });
        DynamicInput.findOne.mockResolvedValueOnce(null);

        DynamicInput.prototype.save.mockResolvedValue(fakeDynamicInput);

        DynamicForm.findOne.mockResolvedValue(fakeDynamicForm);

        await addDynamicInputAddShip(req, res);

        expect(fakeDynamicForm.addDynamicInput).toHaveBeenCalledWith(
            '1234',
            true,
            ['Option 1', 'Option 2'],
            { min: 0, multiline: false, max: 100 },
        );
        expect(fakeDynamicForm.save).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { templateType: 'testTemplateSpesific' },
        });
    });

    it('should return a 400 status when label already exists', async () => {
        const req = {
            body: {
                label: 'Test Label',
                inputType: 'textInput',
                required: true,
                unit: 'kg',
                templateName: 'Test Template',
                option: ['Option 1', 'Option 2'],
                min: 0,
                max: 100,
                multiline: false,
                expired: false,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const fakeDynamicInput = {
            _id: '1234',
            label: 'Test Label',
            fieldName: 'testLabel',
            placeholder: 'Enter your Test Label',
            inputType: 'textInput',
            formType: 'addShipForm',
            fieldType: 'text',
            templateType: 'testTemplate',
            unit: 'kg',
            docExpired: false,
            order: 1,
        };

        DynamicInput.findOne.mockReturnValue({
            sort: jest.fn().mockResolvedValue(null),
        });

        await addDynamicInputAddShip(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Label already exists',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                label: 'Test Labeldsadas',
                inputType: 'textInput',
                required: true,
                unit: 'kg',
                templateName: 'Test Templatedsadsadsa',
                option: ['Option 1', 'Option 2'],
                min: 0,
                max: 100,
                multiline: false,
                expired: false,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findOne.mockRejectedValue('Some database error');

        await addDynamicInputAddShip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('addDynamicInputDropDownItem', () => {
    it('should add a dynamic input dropdown item and return 200 status with the saved dynamic input ID', async () => {
        const req = {
            body: {
                label: 'Test Label',
                inputType: 'textInput',
                unit: 'Test Unit',
                templateName: 'Test Template',
            },
        };

        const fakeDynamicInput = new DynamicInput({
            _id: '1234',
            label: 'Test Label',
            fieldName: 'testLabel',
            placeholder: 'Enter your Test Label',
            inputType: 'textInput',
            formType: 'addShipForm',
            fieldType: 'string',
            templateType: 'Test Template',
            unit: 'Test Unit',
            order: 50,
        });

        const saveSpy = jest
            .spyOn(fakeDynamicInput, 'save')
            .mockResolvedValue(fakeDynamicInput);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        DynamicInput.findOne.mockReturnValue({
            sort: jest.fn().mockResolvedValue({
                order: 49,
            }),
        });

        await addDynamicInputDropDownItem(req, res);

        expect(saveSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeDynamicInput._id,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                label: 'Test Label',
                inputType: 'dropdown',
                unit: 'Test Unit',
                templateName: 'Test Template',
            },
        };

        DynamicInput.prototype.save.mockRejectedValue('Some database error');

        DynamicInput.findOne.mockReturnValue({
            sort: jest.fn().mockRejectedValue('Some database error'),
        });
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addDynamicInputDropDownItem(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('addDynamicInputRfqForm', () => {
    it('should add a new dynamic input to the dynamic form and return 200 status', async () => {
        const req = {
            body: {
                formType: 'formType',
                templateType: 'templateType',
                inputType: 'textInput',
                label: 'label',
                unit: 'unit',
                option: 'option',
                min: 'min',
                multiline: 'multiline',
                order: 'order',
                required: 'required',
            },
        };

        const savedDynamicInput = {
            _id: '1234',
            formType: 'formType',
            templateType: 'templateType',
            inputType: 'textInput',
            label: 'label',
            fieldName: 'fieldName',
            fieldType: 'string',
            placeholder: 'placeholder',
            unit: 'unit',
            order: 'order',
        };

        const dynamicForm = {
            _id: '5678',
            formType: 'formType',
            templateType: 'templateType',
            dynamicForms: [],
            save: jest.fn(),
        };

        DynamicInput.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(savedDynamicInput),
        }));
        DynamicForm.findOne.mockResolvedValue(dynamicForm);
        DynamicForm.find.mockResolvedValue([]);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addDynamicInputRfqForm(req, res);

        expect(DynamicForm.findOne).toHaveBeenCalledWith({
            formType: 'formType',
            templateType: 'templateType',
        });
        expect(dynamicForm.dynamicForms).toEqual([
            {
                dynamicInput: '1234',
                required: 'required',
                option: 'option',
                validation: {
                    min: 'min',
                    multiline: 'multiline',
                },
            },
        ]);
        expect(dynamicForm.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: dynamicForm,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                formType: 'formType',
                templateType: 'templateType',
                inputType: 'textInput',
                label: 'label',
                unit: 'unit',
                option: 'option',
                min: 'min',
                multiline: 'multiline',
                order: 'order',
                required: 'required',
            },
        };

        DynamicInput.mockImplementation(() => {
            'Some database error';
        });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addDynamicInputRfqForm(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});
