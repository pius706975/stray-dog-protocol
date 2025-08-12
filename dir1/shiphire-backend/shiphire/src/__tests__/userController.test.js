import {
    addPhoneNumber,
    getNotif,
    getUserProfile,
    submitUserRole,
    testEmailRenter,
    userOpenNotification,
} from '../controller/userController';
import Notification from '../models/Notification';
import Renter from '../models/Renter';
import ShipOwner from '../models/ShipOwner';
import User from '../models/User';
import { generateOTP } from '../utils/generateOTP';
import { sendEmail } from '../utils/sendEmail';
import sendGrid from '@sendgrid/mail';

jest.mock('../models/User');
jest.mock('../models/Renter');
jest.mock('../models/ShipOwner');
jest.mock('../models/Notification');
jest.mock('@sendgrid/mail');
jest.mock('../utils/generateOTP');

const fakeUser = {
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
const firebaseId = 'CTrhPWrCOl6ETAFz60912';
const googleId = '123';

const notificationExpectData = {
    _id: '654309942b57cad75',
    userId: '654300f3cc3696f0584',
    shipId: '654300b1aa396f074b',
    notifType: 'shipReminder',
    title: 'Ship availability reminder',
    body: 'Sunny Go is available today!',
    isReaded: false,
};

describe('getUserProfile', () => {
    it('should return profile data', async () => {
        const req = {
            user: {
                firebaseId,
                googleId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await User.findOne.mockResolvedValue(fakeUser);

        await getUserProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeUser,
        });
    });
    it('should handle error and return a 500 status', async () => {
        const req = {
            user: {
                firebaseId,
                googleId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await User.findOne.mockRejectedValue('something wrong');

        await getUserProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('submitUserRole', () => {
    describe('renter role', () => {
        it('should save renter role', async () => {
            const req = {
                body: {
                    roleSubmitted: 'renter',
                },
                user: {
                    firebaseId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockRenter = {
                userId: 'mockUserId',
                name: 'John',
                renterPreference: [],
            };

            User.findOneAndUpdate.mockResolvedValue(fakeUser);
            await jest
                .spyOn(Renter.prototype, 'save')
                .mockReturnValue(mockRenter);

            User.findOneAndUpdate.mockResolvedValue(fakeUser);
            await submitUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: fakeUser,
            });
        });

        it('should handle error and return 500 status', async () => {
            const req = {
                body: {
                    roleSubmitted: 'renter',
                },
                user: {
                    firebaseId,
                    googleId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOneAndUpdate.mockRejectedValue('something wrong');

            await submitUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'something wrong',
            });
        });

        it('should handle error when error saving renter data', async () => {
            const req = {
                body: {
                    roleSubmitted: 'renter',
                },
                user: {
                    firebaseId,
                    googleId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockRenter = {
                userId: 'mockUserId',
                name: 'John',
                renterPreference: [],
            };

            User.findOneAndUpdate.mockResolvedValue(fakeUser);
            await jest
                .spyOn(Renter.prototype, 'save')
                .mockResolvedValue(mockRenter);
            fakeUser.roles = 'shipOwner';
            User.findOneAndUpdate.mockResolvedValue(fakeUser);
            await submitUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'failed save renter role ',
            });
        });
    });

    describe('shipowner role', () => {
        it('should save shipowner role', async () => {
            const req = {
                body: {
                    roleSubmitted: 'shipOwner',
                },
                user: {
                    firebaseId,
                    googleId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockShipOwner = {
                userId: '12345',
                name: 'David',
                shipOwnerDocuments: [],
            };
            fakeUser.roles = 'shipOwner';

            User.findOneAndUpdate.mockResolvedValue(fakeUser);
            await jest
                .spyOn(ShipOwner.prototype, 'save')
                .mockReturnValue(mockShipOwner);

            User.findOneAndUpdate.mockResolvedValue(fakeUser);
            await submitUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: fakeUser,
            });
        });
        it('should handle error and return 500 status', async () => {
            const req = {
                body: {
                    roleSubmitted: 'shipOwner',
                },
                user: {
                    firebaseId,
                    googleId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOneAndUpdate.mockRejectedValue('something wrong');

            await submitUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'something wrong',
            });
        });

        it('should handle error when error saving ship owner data', async () => {
            const req = {
                body: {
                    roleSubmitted: 'shipOwner',
                },
                user: {
                    firebaseId,
                    googleId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockShipOwner = {
                userId: '12345',
                name: 'David',
                shipOwnerDocuments: [],
            };

            User.findOneAndUpdate.mockResolvedValue(mockShipOwner);
            await jest
                .spyOn(ShipOwner.prototype, 'save')
                .mockResolvedValue('something wrong');

            fakeUser.roles = 'renter';
            User.findOneAndUpdate.mockResolvedValue(fakeUser);

            await submitUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'failed save ship owner role ',
            });
        });
    });
});

describe('addPhoneNumber', () => {
    it('should saved phoneNumber', async () => {
        const req = {
            body: {
                phoneNumber: '0852525252',
            },
            user: {
                firebaseId,
                googleId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOneAndUpdate.mockResolvedValue(fakeUser);
        await addPhoneNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeUser,
        });
    });
    it('should handle error when return 500 status', async () => {
        const req = {
            body: {
                phoneNumber: '0852525252',
            },
            user: {
                firebaseId,
                googleId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        User.findOneAndUpdate.mockRejectedValue('something wrong');
        await addPhoneNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('getNotif', () => {
    it('should return some notification', async () => {
        const req = {
            user: {
                firebaseId,
                googleId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(fakeUser);
        Notification.find.mockResolvedValue(notificationExpectData);
        await getNotif(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: notificationExpectData,
        });
    });
    it('should handle error when return 500 status', async () => {
        const req = {
            user: {
                firebaseId,
                googleId,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockRejectedValue('something wrong');
        Notification.find.mockRejectedValue('something wrong');
        await getNotif(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});

describe('testEmailRenter', () => {
    const message = {
        to: 'aliffia.rosita@gmail.com',
        from: 'gabriel.jamrewav@gmail.com',
        subject: 'test email',
        text: 'This is a test email',
        html: '<h1>This is a test email with html</h1>',
    };
    it('should send email to tester email', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        sendGrid.send.mockResolvedValue('Email sent success');
        const result = await sendEmail(message);
        generateOTP.mockReturnValue('1235');
        await testEmailRenter(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            OTP: '1235',
        });
        expect(result).toBe('Email sent success');
        expect(sendGrid.send).toHaveBeenCalledWith(message);
    });
    it('should send handle error when send email failed', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        sendGrid.send.mockRejectedValue('Email sent failed');

        // const result = await sendEmail(message);
        generateOTP.mockReturnValue('1235');
        await testEmailRenter(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        await expect(sendEmail(message)).rejects.toEqual('Email sent failed');
        expect(sendGrid.send).toHaveBeenCalledWith(message);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Email sent failed',
        });
    });
});

describe('userOpenNotification', () => {
    it('should update notification ', async () => {
        const req = {
            body: {
                notifId: '654309942b57cad75',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        notificationExpectData.isReaded = true;
        Notification.findOneAndUpdate.mockResolvedValue(notificationExpectData);
        await userOpenNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });
    it('should handle error when notification data not found', async () => {
        const req = {
            body: {
                notifId: '654309942b57cad75',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Notification.findOneAndUpdate.mockResolvedValue(null);
        await userOpenNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Notification not found',
        });
    });
    it('should handle error when return 500 status', async () => {
        const req = {
            body: {
                notifId: '654309942b57cad75',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Notification.findOneAndUpdate.mockRejectedValue('something wrong');
        await userOpenNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'something wrong',
        });
    });
});
