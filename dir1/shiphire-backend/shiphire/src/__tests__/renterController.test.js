import {
    getRenterData,
    getRenterById,
    submitRenterPreference,
    submitRequestForQuote,
    getAllTransaction,
    getTransactionById,
    submitCompanyProfile,
    sendOTPVerifEmail,
    VerifyEmailOTP,
    sendOTPSignContract,
    sendOTPSignProposal,
    VerifySignProposalOTP,
    uploadPaymentReceipt,
    renterOpenTransaction,
    verifySignContractOTP,
    sendOTPVerifyPhoneNumber,
    VerifyPhoneOTP,
    sendNotification,
    setShipReminderNotif,
    completeNegotiate,
    getShipOwnerPaymentAccount,
    getAllPayment,
    updateTracking,
    getTrackingHistory
} from '../controller/renterController';
import Renter from '../models/Renter';
import User from '../models/User';
import ShipOwner from '../models/ShipOwner';
import Ship from '../models/Ship';
import RequestForQuote from '../models/RequestForQuote';
import Transaction from '../models/Transaction';
import ShipCategory from '../models/ShipCategory';
import Proposal from '../models/Proposal';
import Contract from '../models/Contract';
import ShipHistory from '../models/ShipHistory';
import agenda from '../utils/agenda';
import firebaseAdmin from '../utils/firebaseAdmin';
import sendGrid from '@sendgrid/mail';
import { generateOTP } from '../utils/generateOTP';
import { sendEmail } from '../utils/sendEmail';

jest.mock('../models/Renter');
jest.mock('../models/User');
jest.mock('../models/ShipOwner');
jest.mock('../models/Ship');
jest.mock('../models/RequestForQuote');
jest.mock('../models/Transaction');
jest.mock('../models/ShipCategory');
jest.mock('../models/Proposal');
jest.mock('../models/Contract');
jest.mock('../models/ShipHistory');
jest.mock('../utils/generateOTP');
jest.mock('../utils/agenda', () => {
    return {
        define: jest.fn(),
        on: jest.fn(),
        start: jest.fn(),
        close: jest.fn(),
        schedule: jest.fn(),
    };
});
jest.mock('../utils/firebaseAdmin', () => ({
    storage: jest.fn().mockReturnThis(),
    bucket: jest.fn().mockReturnThis(),
    file: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    getSignedUrl: jest.fn(),
    metadata: {
        mediaLink: 'https://example.com/media/link',
    },
    messaging: jest.fn().mockReturnThis(),
    send: jest.fn(),
}));
jest.mock('@sendgrid/mail');

const expectedRenter = {
    company: {
        name: 'Azis Company',
        companyType: 'CV',
        address: 'Jl. Pramuka 6',
        documentCompany: [
            {
                documentName: 'Azis Corp Business License',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
                _id: '653f53804b82b784422aa4ba',
            },
            {
                documentName: 'Azis Corp Deed of Establishment',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
                _id: '653f53804b82b784422aa4bb',
            },
        ],
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
    },
    _id: '653f53804b82b784422aa4b4',
    userId: '653f537d4b82b784422aa493',
    name: 'Azis',
    renterPreference: [
        'Reputation and Track Record',
        'Cargo Capacity',
        'Experience',
    ],
    shipReminded: [],
};

describe('getRenterData', () => {
    it('should return 404 if renter is not found', async () => {
        const req = {
            user: {
                _id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findOne.mockReturnThis();
        Renter.findOne.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            }),
        });

        await getRenterData(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });

    it('should return 200 if renter is found', async () => {
        const req = {
            user: {
                _id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findOne.mockReturnThis();
        Renter.findOne.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(expectedRenter),
            }),
        });

        await getRenterData(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedRenter,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            user: {
                _id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findOne.mockReturnThis();
        Renter.findOne.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockRejectedValue('Internal server error'),
            }),
        });

        await getRenterData(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('getRenterById', () => {
    it('should return 404 if renter is not found', async () => {
        const req = {
            params: {
                id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockResolvedValue(null);

        await getRenterById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });

    it('should return 200 if renter is found', async () => {
        const req = {
            params: {
                id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockResolvedValue(expectedRenter);

        await getRenterById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedRenter,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            params: {
                id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findById.mockRejectedValue('Internal server error');

        await getRenterById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('submitRenterPreference', () => {
    it('should return 404 if renter is not found', async () => {
        const req = {
            body: {
                renterPreference: ['Reputation and Track Record'],
            },
            user: {
                _id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findOneAndUpdate.mockResolvedValue(null);

        await submitRenterPreference(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });

    it('should return 200 if renter is found', async () => {
        const req = {
            body: {
                renterPreference: ['Reputation and Track Record'],
            },
            user: {
                _id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findOneAndUpdate.mockResolvedValue(expectedRenter);

        await submitRenterPreference(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedRenter,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                renterPreference: ['Reputation and Track Record'],
            },
            user: {
                _id: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Renter.findOneAndUpdate.mockRejectedValue('Internal server error');

        await submitRenterPreference(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('submitRequestForQuote', () => {
    it('should return 400 if file is not found', async () => {
        const req = {
            file: undefined,
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No file found',
        });
    });

    it('should return 404 if bucket is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });

    it('should return 404 if user is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(null);

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 404 if renter is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue(null);

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });

    it('should return 404 if ship owner is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4b4',
        });
        ShipOwner.findOne.mockResolvedValue(null);

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship owner not found',
        });
    });

    it('should return 404 if ship is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4b4',
        });
        ShipOwner.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4ab',
        });
        Ship.findOne.mockReturnThis();
        Ship.findOne().populate.mockResolvedValue(null);

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });

    it('should submit rfq', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const rfq = {
            ship: '653f53814b82b784422aa567',
            renter: '653f53804b82b784422aa4b4',
            category: '653f53814b82b784422aa567',
            shipOwner: '653f53804b82b784422aa4ab',
            rfqUrl: 'https://example.com/rfq/link',
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4b4',
        });
        ShipOwner.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4ab',
        });
        Ship.findOne.mockReturnThis();
        Ship.findOne().populate.mockResolvedValue({
            id: '653f53814b82b784422aa567',
        });

        firebaseAdmin
            .storage()
            .bucket()
            .getSignedUrl.mockResolvedValue([
                {
                    rfqUrl: 'https://example.com/rfq/link',
                },
            ]);

        await jest
            .spyOn(RequestForQuote.prototype, 'save')
            .mockResolvedValue(rfq);

        const transaction = {
            rentalId: '653f53814b82b784422aa567',
            renterId: '653f53804b82b784422aa4b4',
            rentalStartDate: '21 September 2023',
            rentalEndDate: '10 November 2023',
            rentalDuration: 30,
            ship: {
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
            },
            rfq: {
                rfqId: '653f53814b82b784422aa567',
                rfqUrl: 'https://example.com/rfq/link',
            },
            status: [],
            needs: 'Transportation',
            locationDeparture: 'Jakarta',
            locationDestination: 'Surabaya',
            addStatus: jest.fn(),
            save: jest.fn(),
        };

        await jest
            .spyOn(Transaction.prototype, 'save')
            .mockResolvedValue(transaction);

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                categoryId: '653f53814b82b784422aa567',
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
                rentalDuration: 30,
                rentalDate: '21 September 2023 to 10 November 2023',
                needs: 'Transportation',
                locationDeparture: 'Jakarta',
                locationDestination: 'Surabaya',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4b4',
        });
        ShipOwner.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4ab',
        });

        Ship.findOne.mockReturnThis();
        Ship.findOne().populate.mockResolvedValue({
            id: '653f53814b82b784422aa567',
        });

        firebaseAdmin
            .storage()
            .bucket()
            .getSignedUrl.mockRejectedValue('Internal server error');

        await submitRequestForQuote(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('getAllTransaction', () => {
    it('should return 404 if user is not found', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '653f537d4b82b784422aa493',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(null);

        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 404 if renter is not found', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '653f537d4b82b784422aa493',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue(null);

        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });

    it('should return 404 if transaction is not found', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '653f537d4b82b784422aa493',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4b4',
        });
        Transaction.aggregate.mockResolvedValue(null);

        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should return 200 and return transaction', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '653f537d4b82b784422aa493',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            _id: '653f53814b82b784422aa567',
            rentalId: '653f53814b82b784422aa567',
            renterId: '653f53804b82b784422aa4b4',
            rentalStartDate: '21 September 2023',
            rentalEndDate: '10 November 2023',
            rentalDuration: 30,
            ship: {
                shipId: '653f53814b82b784422aa567',
                shipOwnerId: '653f53804b82b784422aa4ab',
            },
            rfq: {
                rfqId: '653f53814b82b784422aa567',
                rfqUrl: 'https://example.com/rfq/link',
            },
            status: [],
            needs: 'Transportation',
            locationDeparture: 'Jakarta',
            locationDestination: 'Surabaya',
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4b4',
        });
        Transaction.aggregate.mockResolvedValue([transaction]);

        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: [transaction],
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '653f537d4b82b784422aa493',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            id: '653f537d4b82b784422aa493',
        });
        Renter.findOne.mockResolvedValue({
            id: '653f53804b82b784422aa4b4',
        });
        Transaction.aggregate.mockRejectedValue('Internal server error');

        await getAllTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('getTransactionById', () => {
    it('should return 404 if transaction is not found', async () => {
        const req = {
            params: {
                id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockResolvedValue(null);

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should return 404 if ship not found in the transaction', async () => {
        const req = {
            params: {
                id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockResolvedValue({
            ship: null,
        });

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found in the transaction',
        });
    });

    it('should return 404 if ShipId not found in the transaction', async () => {
        const req = {
            params: {
                id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockResolvedValue({
            ship: {
                shipId: null,
            },
        });

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'ShipId not found in the transaction',
        });
    });

    it('should return 404 if ship category is not found', async () => {
        const req = {
            params: {
                id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockResolvedValue({
            ship: {
                shipId: '123',
            },
            category: null,
        });

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship category not found',
        });
    });

    it('should return the transaction data when it exists', async () => {
        const mockTransactionData = {
            _id: 'transactionId',
            rentalId: 'rentalId',
            renterId: 'renterId',
            rentalDuration: 7,
            rentalStartDate: '2023-11-01',
            rentalEndDate: '2023-11-07',
            locationDeparture: 'Departure',
            locationDestination: 'Destination',
            status: 'active',
            rfq: 'RFQ data',
            proposal: 'Proposal data',
            offeredPrice: 500.0,
            createdAt: '2023-11-01T12:00:00Z',
            updatedAt: '2023-11-02T14:00:00Z',
            payment: [
                {
                    _id: 'paymentId',
                    paymentApproved: false,
                    receiptUrl: 'receipt-url',
                    createdAt: '2023-11-01T12:00:00Z',
                },
            ],
            contract: 'Contract data',
        };

        const mockShipData = {
            shipOwnerId: 'ownerId',
            name: 'Ship Name',
            imageUrl: 'ship-image-url',
            size: 'ship-size',
        };

        const mockShipCategoryData = {
            name: 'Category Name',
        };

        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockResolvedValue({
            ship: { shipId: mockShipData },
            ...mockTransactionData,
        });

        ShipCategory.findOne = jest
            .fn()
            .mockResolvedValue(mockShipCategoryData);

        const req = {
            params: {
                id: 'transactionId',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                ...mockTransactionData,
                ship: {
                    ...mockShipData,
                    category: { name: 'Category Name' },
                },
            },
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            params: {
                id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockReturnThis();
        Transaction.findOne().populate.mockRejectedValue(
            'Internal server error',
        );

        await getTransactionById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('submitCompanyProfile', () => {
    it('should return 404 if no files found', async () => {
        const req = {
            files: undefined,
            body: {
                name: 'Azis',
                companyType: 'CV',
                address: 'Jl. Pramuka 6',
                renterPreference: [
                    'Reputation and Track Record',
                    'Cargo Capacity',
                    'Experience',
                ],
            },
            user: {
                _id: '123',
            },
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

    it('should return 404 if bucket not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        const req = {
            files: [
                {
                    originalname: 'test.pdf',
                },
            ],
            body: {
                name: 'Azis',
                companyType: 'CV',
                address: 'Jl. Pramuka 6',
                renterPreference: [
                    'Reputation and Track Record',
                    'Cargo Capacity',
                    'Experience',
                ],
            },
            user: {
                _id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitCompanyProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });

    it('should return 404 if renter not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            files: [
                {
                    originalname: 'test.pdf',
                },
            ],
            body: {
                name: 'Azis',
                companyType: 'CV',
                address: 'Jl. Pramuka 6',
                renterPreference: [
                    'Reputation and Track Record',
                    'Cargo Capacity',
                    'Experience',
                ],
            },
            user: {
                firebaseId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOneAndUpdate.mockResolvedValue(null);
        Renter.findOneAndUpdate.mockResolvedValue(null);

        await submitCompanyProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Renter not found',
        });
    });

    it('should upload files and update renter and user data', async () => {
        const req = {
            body: {
                companyName: 'Test Company',
                typeOfCompany: 'CV',
                companyAddress: 'Jl. Sudirman 123',
            },
            files: [
                {
                    originalname: 'test.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('test'),
                },
                {
                    originalname: 'test.pdf',
                    mimetype: 'application/pdf',
                    buffer: Buffer.from('test'),
                },
            ],
            user: {
                id: '123',
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                googleId: undefined,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

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

        User.findOneAndUpdate.mockResolvedValueOnce({
            isCompanySubmitted: true,
        });
        Renter.findOneAndUpdate.mockResolvedValueOnce(expectedRenter);

        await submitCompanyProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
            {
                $or: [
                    { firebaseId: req.user.firebaseId },
                    {
                        googleId:
                            req.user.googleId === undefined
                                ? ''
                                : req.user.googleId,
                    },
                ],
            },
            { isCompanySubmitted: true },
            { new: true },
        );
        expect(Renter.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: req.user.id },
            {
                company: {
                    name: req.body.companyName,
                    companyType: req.body.typeOfCompany,
                    address: req.body.companyAddress,
                    documentCompany: [
                        {
                            documentName: 'test.pdf',
                            documentUrl: 'https://example.com/media/link',
                        },
                    ],
                    imageUrl: 'https://example.com',
                },
            },
            { new: true },
        );
    });

    // it('should return 200 and update renter data', async () => {
    //     firebaseAdmin.storage().bucket.mockReturnThis();
    //     const req = {
    //         files: [
    //             {
    //                 originalname: 'test.pdf',
    //             },
    //         ],
    //         body: {
    //             name: 'Azis',
    //             companyType: 'CV',
    //             address: 'Jl. Pramuka 6',
    //         },
    //         user: {
    //             firebaseId: '123',
    //         },
    //     };

    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     };

    //     const renter = {
    //         name: 'Azis',
    //         companyType: 'CV',
    //         address: 'Jl. Pramuka 6',
    //     };

    //     firebaseAdmin.storage().bucket.mockReturnThis();
    //     const uploadedFile = {
    //         getSignedUrl: jest.fn().mockResolvedValue({
    //             imageUrl: 'https://example.com/image/link',
    //         }),
    //         save: jest.fn(),
    //     };
    //     jest.spyOn(
    //         firebaseAdmin.storage().bucket().file(),
    //         'save',
    //     ).mockReturnValue(uploadedFile);

    //     firebaseAdmin
    //         .storage()
    //         .bucket()
    //         .getSignedUrl.mockResolvedValue([
    //             {
    //                 documentName: 'test.pdf',
    //                 documentUrl:
    //                     'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/test.pdf?generation=1695198267402692&alt=media',
    //             },
    //         ]);

    //     User.findOneAndUpdate.mockResolvedValue({
    //         isCompanySubmitted: true,
    //     });
    //     Renter.findOneAndUpdate.mockResolvedValue({
    //         ...renter,
    //         documentCompany: {
    //             documentName: 'test.pdf',
    //             documentUrl:
    //                 'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/test.pdf?generation=1695198267402692&alt=media',
    //         },
    //         imageUrl: 'https://example.com/image/link',
    //     });

    //     await submitCompanyProfile(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //         status: 'success',
    //     });
    // });

    it('should handle errors and return a 500 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            files: [
                {
                    originalname: 'test.pdf',
                },
            ],
            body: {
                name: 'Azis',
                companyType: 'CV',
                address: 'Jl. Pramuka 6',
            },
            user: {
                firebaseId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        firebaseAdmin.storage().bucket.mockReturnThis();
        firebaseAdmin
            .storage()
            .bucket()
            .getSignedUrl.mockResolvedValue([
                {
                    imageUrl: 'https://example.com/image/link',
                    documentName: 'test.pdf',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/test.pdf?generation=1695198267402692&alt=media',
                },
            ]);

        User.findOneAndUpdate.mockRejectedValue('Internal server error');

        await submitCompanyProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('sendOTPVerifEmail', () => {
    const message = {
        to: '{emailUser}',
        from: 'gabriel.jamrewav@gmail.com',
        subject: 'Shiphire email verification',
        text: `Your Shiphire email verification code is {generatedOTPVerifEmail}`,
    };
    it('should return 404 if user is not found', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOneAndUpdate.mockResolvedValue(null);

        await sendOTPVerifEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 200 and send OTP to email', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOneAndUpdate.mockResolvedValue({
            emailVerifOTP: '1234',
        });

        sendGrid.send.mockResolvedValue('Email sent success');
        const result = await sendEmail(message);

        await sendOTPVerifEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
        expect(result).toBe('Email sent success');
        expect(sendGrid.send).toHaveBeenCalledWith(message);
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOneAndUpdate.mockResolvedValue({
            emailVerifOTP: '1234',
        });

        sendGrid.send.mockRejectedValue('Internal server error');

        await sendOTPVerifEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('VerifyEmailOTP', () => {
    it('should return 422 if wrong otp', async () => {
        const req = {
            body: {
                emailVerifOTP: '1234',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedOtp = '4321';

        User.findOne.mockResolvedValue({
            emailVerifOTP: expectedOtp,
        });

        await VerifyEmailOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Wrong otp',
        });
    });

    it('should return 200 and verify email', async () => {
        const req = {
            body: {
                emailVerifOTP: '1234',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedOtp = '1234';

        User.findOne.mockResolvedValue({
            emailVerifOTP: expectedOtp,
        });

        User.findOneAndUpdate.mockResolvedValue({
            isEmailVerified: true,
        });

        await VerifyEmailOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                emailVerifOTP: '1234',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedOtp = '1234';

        User.findOne.mockResolvedValue({
            emailVerifOTP: expectedOtp,
        });

        User.findOneAndUpdate.mockRejectedValue('Internal server error');

        await VerifyEmailOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('sendOTPSignProposal', () => {
    const message = {
        to: '{emailUser}',
        from: 'gabriel.jamrewav@gmail.com',
        subject: 'Shiphire signing proposal',
        text: `Your Shiphire signing proposal OTP code is {generatedOTPSignProposal}`,
    };
    it('should return 404 if user is not found', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOne.mockResolvedValue(null);

        await sendOTPSignProposal(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 404 if proposal not found', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOne.mockResolvedValue({
            firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
        });

        Proposal.findOneAndUpdate.mockResolvedValue(null);

        await sendOTPSignProposal(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Proposal not found',
        });
    });

    it('should return 200 and send OTP sign proposal to email', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOne.mockResolvedValue({
            firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
        });

        Proposal.findOneAndUpdate.mockResolvedValue({
            renter: '123',
            signProposalOTP: '1234',
        });

        sendGrid.send.mockResolvedValue('Email sent success');
        const result = await sendEmail(message);

        await sendOTPSignProposal(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
        expect(result).toBe('Email sent success');
        expect(sendGrid.send).toHaveBeenCalledWith(message);
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOne.mockResolvedValue({
            firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
        });

        Proposal.findOneAndUpdate.mockRejectedValue('Internal server error');

        await sendOTPSignProposal(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('VerifySignProposalOTP', () => {
    it('should return 404 if proposal is not found', async () => {
        const req = {
            body: {
                signProposalOTP: '1234',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedOtp = '1234';

        User.findOne.mockResolvedValue({
            id: '123',
        });

        Proposal.findOne.mockResolvedValue(null);

        await VerifySignProposalOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Proposal not found',
        });
    });

    it('should return 422 if wrong otp', async () => {
        const req = {
            body: {
                signProposalOTP: '1234',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedOtp = '4321';

        User.findOne.mockResolvedValue({
            id: '123',
        });

        Proposal.findOne.mockResolvedValue({
            renter: '123',
            signProposalOTP: expectedOtp,
        });

        await VerifySignProposalOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Wrong otp',
        });
    });

    it('should return 200 and verify sign proposal otp', async () => {
        const req = {
            body: {
                signProposalOTP: '1234',
                rentalId: '123',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedOtp = '1234';

        User.findOne.mockResolvedValue({
            id: '123',
        });

        Proposal.findOne.mockResolvedValue({
            renter: '123',
            signProposalOTP: expectedOtp,
        });

        Transaction.findOneAndUpdate.mockResolvedValue({
            rentalId: '123',
            paymentExpireDate: '2023-11-07T12:00:00Z',
        });

        Proposal.findOneAndUpdate.mockResolvedValue({
            renter: '123',
            isAccepted: true,
        });

        Proposal.findOneAndUpdate.mockResolvedValue({
            renter: '123',
            signProposalOTP: expectedOtp,
        });

        Transaction.findOneAndUpdate.mockResolvedValue({
            addStatus: jest.fn().mockReturnThis(),
            save: jest.fn().mockReturnThis(),
        });

        await VerifySignProposalOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                signProposalOTP: '1234',
                rentalId: '123',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedOtp = '1234';

        User.findOne.mockResolvedValue({
            id: '123',
        });

        Proposal.findOne.mockResolvedValue({
            renter: '123',
            signProposalOTP: expectedOtp,
        });

        Transaction.findOneAndUpdate.mockRejectedValue('Internal server error');

        await VerifySignProposalOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('uploadPaymentReceipt', () => {
    it('should return 404 if no files found', async () => {
        const req = {
            files: undefined,
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await uploadPaymentReceipt(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No files found',
        });
    });

    it('should return 404 if bucket not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await uploadPaymentReceipt(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });

    it('should return 404 if transaction not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(null);

        await uploadPaymentReceipt(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should return 200 and update transaction data', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            rentalId: '123',
            renterId: '123',
            rentalStartDate: '21 September 2023',
            rentalEndDate: '10 November 2023',
            rentalDuration: 30,
            ship: {
                shipId: '123',
                shipOwnerId: '123',
            },
            rfq: {
                rfqId: '123',
                rfqUrl: 'https://example.com/rfq/link',
            },
            status: [],
            needs: 'Transportation',
            locationDeparture: 'Jakarta',
            locationDestination: 'Surabaya',
            addStatus: jest.fn(),
            save: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(transaction);

        Transaction.findOneAndUpdate.mockResolvedValue({
            paymentExpireDate: '2023-11-15T12:00:00Z',
        });

        firebaseAdmin
            .storage()
            .bucket()
            .getSignedUrl.mockResolvedValue([
                {
                    paymentReceiptUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/test.pdf?generation=1695198267402692&alt=media',
                },
            ]);

        await jest
            .spyOn(Transaction.prototype, 'save')
            .mockResolvedValue(transaction);

        await uploadPaymentReceipt(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        const req = {
            file: {
                originalname: 'test.pdf',
            },
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(null);

        firebaseAdmin
            .storage()
            .bucket()
            .getSignedUrl.mockRejectedValue('Internal server error');

        await uploadPaymentReceipt(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('renterOpenTransaction', () => {
    it('should return 400 if rentalId is not found', async () => {
        const req = {
            body: {
                rentalId: '',
            },
            user: {
                _id: '123',
                firebaseId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await renterOpenTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No rentalId found',
        });
    });

    it('should return 404 if transaction not found', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
                firebaseId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(null);

        await renterOpenTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should return 200 and update transaction data', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
                firebaseId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const transaction = {
            rentalId: '123',
            renterId: '123',
            rentalStartDate: '21 September 2023',
            rentalEndDate: '10 November 2023',
            rentalDuration: 30,
            ship: {
                shipId: '123',
                shipOwnerId: '123',
            },
            rfq: {
                rfqId: '123',
                rfqUrl: 'https://example.com/rfq/link',
            },
            status: [
                {
                    name: 'rfq 1',
                    desc: 'RFQ sent',
                    date: '2023-11-01T12:00:00Z',
                    isOpened: false,
                },
            ],
            needs: 'Transportation',
            locationDeparture: 'Jakarta',
            locationDestination: 'Surabaya',
            addStatus: jest.fn(),
            save: jest.fn(),
        };

        Transaction.findOne.mockResolvedValue(transaction);

        await jest
            .spyOn(Transaction.prototype, 'save')
            .mockResolvedValue(transaction);

        await renterOpenTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(transaction.status[0].isOpened).toBe(true);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                _id: '123',
                firebaseId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.findOne.mockRejectedValue('Internal server error');

        await renterOpenTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('sendOTPSignContract', () => {
    const message = {
        to: '{emailUser}',
        from: 'gabriel.jamrewav@gmail.com',
        subject: 'Shiphire signing contract',
        text: `Your Shiphire signing contract OTP code is {generatedOTPSignProposal}`,
    };
    it('should return 404 if contract is not found', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOne.mockResolvedValue({
            firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
        });

        Contract.findOneAndUpdate.mockResolvedValue(null);

        await sendOTPSignContract(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Contract not found',
        });
    });

    it('should return 200 and send OTP sign contract to email', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOne.mockResolvedValue({
            firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
        });

        Contract.findOneAndUpdate.mockResolvedValue({
            renter: '123',
            signContractOTP: '1234',
        });

        sendGrid.send.mockResolvedValue('Email sent success');
        const result = await sendEmail(message);

        await sendOTPSignContract(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
        expect(result).toBe('Email sent success');
        expect(sendGrid.send).toHaveBeenCalledWith(message);
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                userId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        generateOTP.mockReturnValue('1234');

        User.findOne.mockResolvedValue({
            firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
        });

        Contract.findOneAndUpdate.mockRejectedValue('Internal server error');

        await sendOTPSignContract(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('verifySignContractOTP', () => {
    let req;
    let res;
    let user;
    let renterContract;
    let transaction;
    let contract;
    let shipHistory;

    beforeEach(() => {
        req = {
            body: {
                signContractOTP: '123456',
                rentalId: '123',
            },
            user: {
                firebaseId: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
                googleId: undefined,
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        user = {
            renterId: '123',
        };
        renterContract = {
            signContractOTP: '123456',
        };
        transaction = {
            ship: {
                shipId: '123',
            },
            offeredPrice: 1000,
            rentalStartDate: new Date(),
            rentalEndDate: new Date(),
            needs: 'Transportation',
            locationDeparture: 'Jakarta',
            locationDestination: 'Surabaya',
            contract: {
                contractUrl: 'https://example.com/contract',
            },
            addStatus: jest.fn(),
            save: jest.fn(),
        };
        contract = {
            renterCompanyName: 'Azis Company',
        };
        shipHistory = {
            save: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if renter is not found', async () => {
        User.findOne.mockResolvedValue(null);

        await verifySignContractOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Contract not found',
        });
    });

    it('should return 404 if contract is not found', async () => {
        User.findOne.mockResolvedValue(user);
        Contract.findOne.mockResolvedValue(null);

        await verifySignContractOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Contract not found',
        });
    });

    it('should return 422 if OTP is wrong', async () => {
        User.findOne.mockResolvedValue(user);
        Contract.findOne.mockResolvedValue(renterContract);
        req.body.signContractOTP = '654321';

        await verifySignContractOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Wrong otp',
        });
    });

    it('should update contract and transaction, create ship history, and return 200', async () => {
        User.findOne.mockResolvedValue(user);
        Contract.findOne.mockResolvedValue(renterContract);
        Transaction.findOne.mockResolvedValue(transaction);
        Contract.findOneAndUpdate.mockResolvedValue(contract);
        ShipHistory.mockReturnValue(shipHistory);

        await verifySignContractOTP(req, res);

        expect(Contract.findOneAndUpdate).toHaveBeenCalledWith(
            { renter: user.renterId },
            { isAccepted: true },
            { new: true },
        );
        expect(Contract.findOneAndUpdate).toHaveBeenCalledWith(
            { renter: user.renterId },
            { $unset: { signContractOTP: 1 } },
            { new: true },
        );
        expect(shipHistory.save).toHaveBeenCalled();
        expect(transaction.addStatus).toHaveBeenCalledWith(
            'contract 2',
            'Contract signed',
        );
        expect(transaction.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return a 500 status', async () => {
        User.findOne.mockRejectedValue('Internal server error');

        await verifySignContractOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('sendOTPVerifyPhoneNumber', () => {
    it('should return 404 if user is not found', async () => {
        const req = {
            user: {
                firebaseId: '123',
                googleId: '456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(null);

        await sendOTPVerifyPhoneNumber(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should update phoneVerifOTP and return 200 if user is found', async () => {
        const req = {
            user: {
                firebaseId: '123',
                googleId: '456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedUser = {
            _id: '123',
            firebaseId: '123',
            googleId: '456',
            phoneVerifOTP: '1234',
        };

        User.findOne.mockResolvedValue(expectedUser);
        User.findOneAndUpdate.mockResolvedValue(expectedUser);

        await sendOTPVerifyPhoneNumber(req, res);

        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
            { firebaseId: '123' },
            { phoneVerifOTP: '1234' },
            { new: true },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedUser,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            user: {
                firebaseId: '123',
                googleId: '456',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockRejectedValue('Internal server error');

        await sendOTPVerifyPhoneNumber(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('VerifyPhoneOTP', () => {
    const req = {
        body: {
            phoneVerifOTP: '123456',
        },
        user: {
            firebaseId: '123',
            googleId: undefined,
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 422 if the OTP is wrong', async () => {
        User.findOne.mockResolvedValue({
            phoneVerifOTP: '654321',
        });

        await VerifyPhoneOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Wrong otp',
        });
    });

    it('should update the user and return 200 if the OTP is correct', async () => {
        User.findOne.mockResolvedValue({
            phoneVerifOTP: '123456',
        });

        User.findOneAndUpdate.mockResolvedValue({
            firebaseId: '123',
            isPhoneVerified: true,
        });

        await VerifyPhoneOTP(req, res);

        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
            { firebaseId: '123' },
            { $unset: { phoneVerifOTP: 1 } },
            { new: true },
        );

        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
            { firebaseId: '123' },
            { isPhoneVerified: true },
            { new: true },
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should return 500 if an error occurs', async () => {
        User.findOne.mockRejectedValue('Internal server error');

        await VerifyPhoneOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('sendNotification', () => {
    const req = {
        body: {
            token: 'test-token',
            title: 'Test Title',
            body: 'Test Body',
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send a notification and return a success response', async () => {
        firebaseAdmin.messaging().send.mockResolvedValueOnce('test-message');

        await sendNotification(req, res);

        expect(firebaseAdmin.messaging().send).toHaveBeenCalledWith({
            notification: {
                title: 'Test Title',
                body: 'Test Body',
            },
            token: 'test-token',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle errors and return a fail response', async () => {
        firebaseAdmin.messaging().send.mockRejectedValueOnce('test-error');

        await sendNotification(req, res);

        expect(firebaseAdmin.messaging().send).toHaveBeenCalledWith({
            notification: {
                title: 'Test Title',
                body: 'Test Body',
            },
            token: 'test-token',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'test-error',
        });
    });
});

describe('setShipReminderNotif', () => {
    const req = {
        body: {
            token: 'test_token',
            scheduleTime: '2022-12-31T23:59:59.999Z',
            shipId: '123',
        },
        user: {
            firebaseId: 'test_firebase_id',
            googleId: 'test_google_id',
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should schedule a reminder and update renter with the ship reminder', async () => {
        const expectedShip = {
            id: '123',
            reminderDate: new Date('2022-12-31T23:59:59.999Z'),
        };

        const expectedRenter = {
            userId: 'test_user_id',
            shipReminded: [
                {
                    ship: expectedShip,
                },
            ],
        };

        const expectedUser = {
            id: 'test_user_id',
        };

        Ship.findOne.mockResolvedValueOnce({
            id: '123',
        });

        User.findOne.mockResolvedValueOnce(expectedUser);

        Renter.findOneAndUpdate.mockResolvedValueOnce(expectedRenter);

        await setShipReminderNotif(req, res);

        expect(agenda.schedule).toHaveBeenCalledWith(
            new Date('2022-12-31T23:59:59.999Z'),
            'sendShipReminder',
            {
                token: 'test_token',
                shipId: '123',
                userId: 'test_user_id',
            },
        );

        expect(Renter.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: 'test_user_id' },
            {
                $push: {
                    shipReminded: {
                        ship: expectedShip,
                    },
                },
            },
            { new: true },
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle errors and return a 500 status', async () => {
        const expectedError = 'Internal server error';

        Ship.findOne.mockRejectedValueOnce(expectedError);

        await setShipReminderNotif(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: expectedError,
        });
    });
});

describe('completeNegotiate', () => {
    it('should return 404 if user is not found', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                firebaseId: '456',
                googleId: undefined,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(null);

        await completeNegotiate(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 403 if user is not renter', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                firebaseId: '456',
                googleId: undefined,
                roles: 'shipowner',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({});

        await completeNegotiate(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Only renters are allowed to complete negotiations.',
        });
    });

    it('should return 404 if transaction is not found', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                firebaseId: '456',
                googleId: undefined,
                roles: 'renter',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            firebaseId: '456',
            googleId: undefined,
            roles: 'renter',
        });
        Transaction.findOne.mockResolvedValue(null);

        await completeNegotiate(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should update transaction status and return 200 if successful', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                firebaseId: '456',
                googleId: undefined,
                roles: 'renter',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTransaction = {
            addStatus: jest.fn(),
            save: jest.fn(),
        };

        User.findOne.mockResolvedValue({
            firebaseId: '456',
            googleId: undefined,
            roles: 'renter',
        });
        Transaction.findOne.mockResolvedValue(mockTransaction);

        await completeNegotiate(req, res);

        expect(mockTransaction.addStatus).toHaveBeenCalledWith(
            'proposal 2',
            'Waiting for contract',
        );
        expect(mockTransaction.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                rentalId: '123',
            },
            user: {
                firebaseId: '456',
                googleId: undefined,
                roles: 'renter',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockRejectedValue('Internal server error');

        await completeNegotiate(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('getShipOwnerPaymentAccount', () => {
    const req = {
        params: {
            transactionId: '123',
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const mockTransaction = {
        ship: {
            shipOwnerId: '456',
        },
    };

    it('should return 404 if transaction is not found', async () => {
        Transaction.findById.mockResolvedValue(null);

        await getShipOwnerPaymentAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Transaction not found',
        });
    });

    it('should return 404 if ship owner is not found', async () => {
        Transaction.findById.mockResolvedValue(mockTransaction);
        ShipOwner.findOne.mockResolvedValue(null);

        await getShipOwnerPaymentAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship owner not found',
        });
    });

    it('should return 200 with ship owner payment data', async () => {
        const mockShipOwner = {
            company: {
                name: 'Ship Owner Company',
                companyType: 'LLC',
                bankName: 'Bank of Ship Owner',
                bankAccountName: 'Ship Owner Account',
                bankAccountNumber: '1234567890',
            },
        };

        Transaction.findById.mockResolvedValue(mockTransaction);
        ShipOwner.findOne.mockResolvedValue(mockShipOwner);

        await getShipOwnerPaymentAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                name: 'Ship Owner Company',
                companyType: 'LLC',
                bankName: 'Bank of Ship Owner',
                bankAccountName: 'Ship Owner Account',
                bankAccountNumber: '1234567890',
            },
        });
    });

    it('should handle errors and return a 500 status', async () => {
        Transaction.findById.mockRejectedValue('Internal server error');

        await getShipOwnerPaymentAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('getAllPayment', () => {
    it('should return 400 if rentalId is not found', async () => {
        const req = {
            params: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllPayment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No rentalId found',
        });
    });

    it('should return 404 if payment is not found', async () => {
        const req = {
            params: {
                rentalId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.find.mockResolvedValue(null);

        await getAllPayment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Payment not found',
        });
    });

    it('should return 200 with payment data if found', async () => {
        const req = {
            params: {
                rentalId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedPayment = [
            {
                payment: 100,
            },
            {
                payment: 200,
            },
        ];

        Transaction.find.mockResolvedValue(expectedPayment);

        await getAllPayment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedPayment,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            params: {
                rentalId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Transaction.find.mockRejectedValue('Internal server error');

        await getAllPayment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Internal server error',
        });
    });
});

describe('updateTracking', () => {
    const req = {
        params: {id: 'tansactionId'},
        body: {
            status: 'sailing',
            imgDesc: 'image description',
            desc: 'description',
            date: '18-05-2023',
            time: '14:30'
        },
        user: {
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId'
        },
        files: [{
            originalname: 'image.jpg',
            buffer: Buffer.from('file content'),
            mimetype: 'image/jpeg'
        }]
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if no bucket found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue();

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: 'No bucket found'});
    });

    it('should return 404 if user not found', async () => {
        firebaseAdmin.storage.mockReturnValue({});

        User.findOne.mockResolvedValue(null);

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: 'User not found'});
    });

    it('should return 400 if fields are missing', async () => {
        const reqWithMissingFields = {
            ...req,
            body: {
                desc: '',
                date: '',
                time: ''
            }
        }

        firebaseAdmin.storage.mockReturnValue({});

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users'
        });

        await updateTracking(reqWithMissingFields, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: `fields can't be empty`});
    });

    it('should return 404 if transaction not found', async () => {
        firebaseAdmin.storage.mockReturnValue({});

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users'
        });

        Transaction.findOne.mockResolvedValue(null);

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: 'No transaction found'});
    });

    it('should return 400 if latest status is not sailing and latest status is returning', async () => {
        firebaseAdmin.storage.mockReturnValue({});

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users'
        });

        Transaction.findOne.mockReturnValue({
            sailingStatus: [{status: 'beforeSailing'}],
            sailingStatus: [{status: 'afterSailing'}]
        })

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: `Update tracking data is currently unavailable`})
    });

    it('should return 200 and update tracking successfully', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue({
            file: jest.fn().mockReturnValue({
                save: jest.fn().mockResolvedValue({}),
                getSignedUrl: jest.fn().mockResolvedValue(['https://example.com/image.jpg'])
            })
        });

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users'
        })
        
        Transaction.findOne.mockResolvedValue({
            rentalId: 'transactionId',
            sailingStatus: 'sailing',
            status: [],
            ship: { shipId: 'ship123' },
            locationDeparture: 'Departure',
            locationDestination: 'Destination',
            save: jest.fn().mockResolvedValue({}),
        })

        Ship.findOne.mockResolvedValue({
            name: 'Ship name'
        });

        await updateTracking(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should return 500 if there is an internal server error', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue({
            file: jest.fn().mockReturnValue({
                save: jest.fn().mockResolvedValue({}),
                getSignedUrl: jest.fn().mockResolvedValue(['https://example.com/image.jpg'])
            })
        });

        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'name',
            roles: 'users'
        })

        Transaction.findOne.mockResolvedValue({
            rentalId: 'transactionId',
            sailingStatus: [],
            status: [],
            ship: { shipId: 'ship123' },
            locationDeparture: 'Departure',
            locationDestination: 'Destination',
            save: jest.fn().mockResolvedValue({}),
        })

        await updateTracking(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: 'Internal server error'})
    })
});

describe('getTrackingHistory', () => {
    const req = {
        params: {id: 'transactionId'},
        user: {
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId'
        }
    }

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return 404 if user is not found', async () => {
        User.findOne.mockResolvedValue(null)

        await getTrackingHistory(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: 'User not found'})
    })

    it('should return 404 if no tracking data is found', async () => {
        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'Name'
        })

        Transaction.aggregate.mockResolvedValue([])

        await getTrackingHistory(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: 'No tracking data found'})
    })

    it('should return 200 and tracking is successfully found', async () => {
        User.findOne.mockResolvedValue({
            firebaseId: 'firebaseId',
            googleId: 'googleId',
            _id: 'userId',
            appleId: 'appleId',
            name: 'Name'
        })

        const mockTrackingHistory = [{
            _id: 'transactionId',
            ship: { _id: 'shipId', name: 'Ship Name' },
            company: { company: { name: 'Company Name', companyType: 'Type' } },
            locationDeparture: 'Location A',
            locationDestination: 'Location B',
            trackingHistory: [{
                date: '2023-05-17',
                status: 'beforeSailing',
                desc: 'description'
            }]
        }]

        Transaction.aggregate.mockResolvedValue(mockTrackingHistory)

        await getTrackingHistory(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({status: 'success', data: mockTrackingHistory})
    })

    it('should return 500 if there is an internal server error', async ()=>{
        User.findOne.mockRejectedValue(new Error('Internal server error'))

        await getTrackingHistory(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({status: 'fail', message: 'Internal server error'})
    })
})