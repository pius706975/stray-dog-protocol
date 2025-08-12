import {
    submitShipOwnerDocument,
    submitShipDocument,
    submitShipImage,
} from '../controller/docUploadController';
import User from '../models/User';
import ShipOwner from '../models/ShipOwner';
import Ship from '../models/Ship';
import firebaseAdmin from '../utils/firebaseAdmin';

jest.mock('../models/User');
jest.mock('../models/ShipOwner');
jest.mock('../models/Ship');
jest.mock('../utils/firebaseAdmin', () => ({
    storage: jest.fn().mockReturnThis(),
    bucket: jest.fn().mockReturnThis(),
    file: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    metadata: {
        mediaLink: 'https://example.com/media/link',
    },
}));

describe('submitShipOwnerDocument', () => {
    it('should return 400 if no files are found', async () => {
        const req = {
            files: [],
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipOwnerDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No files found' });
    });

    it('should return 404 if bucket is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        const req = {
            files: [{ originalname: 'test' }],
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipOwnerDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Bucket not found' });
    });

    it('should return 404 if user is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(null);
        const req = {
            files: [{ originalname: 'test' }],
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipOwnerDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 404 if ship owner is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue(null);
        const req = {
            files: [{ originalname: 'test' }],
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipOwnerDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });

    it('should return 200 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        const req = {
            files: [{ originalname: 'test' }],
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ShipOwner.findOneAndUpdate.mockResolvedValue({
            shipOwnerDocuments: [
                {
                    documentName: 'test',
                    documentUrl: 'https://example.com/media/link',
                },
            ],
        });

        await submitShipOwnerDocument(req, res);

        expect(ShipOwner.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: '123' },
            {
                shipOwnerDocuments: expect.arrayContaining([
                    {
                        documentName: 'test',
                        documentUrl: 'https://example.com/media/link',
                    },
                ]),
            },
            { new: true },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return 500 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockRejectedValue('Some database error');
        const req = {
            files: [{ originalname: 'test' }],
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipOwnerDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('submitShipDocument', () => {
    const mockReq = {
        files: [{ originalname: 'test' }],
        params: {
            shipId: '123',
        },
        user: {
            firebaseId: '123',
            googleId: '123',
        },
        body: {
            docExpired: '2021-01-01',
        },
    };
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    it('should return 400 if no files are found', async () => {
        const req = {
            files: [],
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
            body: {
                docExpired: '2021-01-01',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No files found' });
    });

    it('should return 404 if bucket is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue(null);

        await submitShipDocument(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });

    it('should return 404 if user is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(null);

        await submitShipDocument(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 404 if ship owner is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue(null);

        await submitShipDocument(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });

    it('should return 404 if ship is not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        Ship.findOne.mockResolvedValue(null);

        await submitShipDocument(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });

    it('should return 200 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        Ship.findOne.mockResolvedValue({ id: '123' });

        console.log('Actual date:', new Date(mockReq.body.docExpired));
        console.log('Expected date:', new Date('2021-01-01'));
        console.log('Expected date:', new Date('2'));

        await submitShipDocument(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(Ship.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '123' },
            {
                shipDocuments: [
                    {
                        documentExpired: new Date(mockReq.body.docExpired),
                        documentName: 'test',
                        documentUrl: 'https://example.com/media/link',
                    },
                ],
            },
            { new: true },
        );
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return 500 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        Ship.findOne.mockRejectedValue('Some database error');

        await submitShipDocument(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});

describe('submitShipImage', () => {
    it('should return 400 if no files found', async () => {
        const req = {
            file: null,
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipImage(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No files found',
        });
    });

    it('should return 404 if bucket not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnValue(null);
        const req = {
            file: { originalname: 'test' },
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipImage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bucket not found',
        });
    });

    it('should return 404 if user not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue(null);
        const req = {
            file: { originalname: 'test' },
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipImage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 404 if ship owner not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue(null);
        const req = {
            file: { originalname: 'test' },
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipImage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship Owner not found',
        });
    });

    it('should return 404 if ship not found', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        Ship.findOne.mockResolvedValue(null);

        const req = {
            file: { originalname: 'test' },
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipImage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship not found',
        });
    });

    it('should return 400 and message ship image upload failed', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        Ship.findOne.mockResolvedValue({ id: '123' });
        const uploadedFile = {
            save: jest.fn(),
            getSignedUrl: jest
                .fn()
                .mockResolvedValue(['https://example.com/signed/url']),
        };
        const req = {
            file: { originalname: 'test' },
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(firebaseAdmin.storage().bucket(), 'file').mockReturnValue(
            uploadedFile,
        );
        await submitShipImage(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Ship image upload failed',
        });
    });

    it('should return 200 and message success', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        Ship.findOne.mockResolvedValue({ id: '123' });
        const uploadedFile = {
            getSignedUrl: jest
                .fn()
                .mockResolvedValue(['https://example.com/signed/url']),
            save: jest.fn(), // Mock the save method
        };
        const req = {
            file: { originalname: 'test' },
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(
            firebaseAdmin.storage().bucket().file(),
            'save',
        ).mockReturnValue(uploadedFile);

        Ship.findOneAndUpdate.mockResolvedValue({
            imageUrl: 'https://example.com/signed/url',
        });
        await submitShipImage(req, res);

        expect(Ship.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '123' },
            { imageUrl: 'https://example.com/signed/url' },
            { new: true },
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should handle errors and return 500 status', async () => {
        firebaseAdmin.storage().bucket.mockReturnThis();
        User.findOne.mockResolvedValue({ id: '123' });
        ShipOwner.findOne.mockResolvedValue({ id: '123' });
        Ship.findOne.mockRejectedValue('Some database error');
        const req = {
            file: { originalname: 'test' },
            params: {
                shipId: '123',
            },
            user: {
                firebaseId: '123',
                googleId: '123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await submitShipImage(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Some database error',
        });
    });
});
