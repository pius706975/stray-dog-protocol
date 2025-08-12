import {
    signUp,
    signUpAdmin,
    getNewToken,
    signIn,
    signOut,
    sendForgotPassOTP,
    verifyForgotPassOTP,
    resetPassword,
    signInWithGoogle,
    createAndSaveRefreshToken,
} from '../controller/authController';
import User from '../models/User';
import Admin from '../models/Admin';
import RefreshToken from '../models/RefreshToken';
import bcrypt from 'bcrypt';
import * as firebaseAdmin from '../utils/firebaseAdmin';
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

jest.mock('../models/Admin');
jest.mock('../models/RefreshToken');
jest.mock('../models/User');
jest.mock('../utils/sendEmail', () => ({
    sendEmail: jest.fn(),
}));
jest.mock('firebase/auth');
jest.mock('../utils/firebaseAdmin', () => ({
    auth: jest.fn().mockReturnThis(),
    deleteUser: jest.fn().mockReturnThis(),
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');

describe('signUp', () => {
    it('should fail cause email already exist and return 409 <auth/email-already-in-use>', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                phoneNumber: '813081',
                password: '123123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        createUserWithEmailAndPassword.mockRejectedValue({
            code: 'auth/email-already-in-use',
        });

        await signUp(req, res);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            'testing@email.com',
            '123123',
        );
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Email already exist',
        });
    });

    it('should success sign up and return 200', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                phoneNumber: '813081',
                password: '123123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: req.body,
        });

        await signUp(req, res);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            'testing@email.com',
            '123123',
        );
        expect(User.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
        });
    });

    it('should fail sign up and return 409', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                phoneNumber: '813081',
                password: '123123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: req.body,
        });

        User.findOne.mockResolvedValueOnce({
            name: 'existingUser',
            email: 'testing@email.com',
        });

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            data: 'email',
            status: 'fail',
            message: 'Email already exist',
        });
    });

    it('should fail cause invalid email and return 400 ', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'invalid-email',
                phoneNumber: '813081',
                password: '123123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        createUserWithEmailAndPassword.mockRejectedValue({
            code: 'auth/invalid-email',
        });

        await signUp(req, res);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            'invalid-email',
            '123123',
        );
        expect(User.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Invalid email',
        });
    });

    it('should error and return 500', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                phoneNumber: '813081',
                password: '123123',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        createUserWithEmailAndPassword.mockRejectedValueOnce(
            'Unexpected Error',
        );

        User.findOne.mockResolvedValue(null);

        await signUp(req, res);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            'testing@email.com',
            '123123',
        );
        expect(User.findOne).toHaveBeenCalledWith({
            email: 'testing@email.com',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Unexpected Error',
        });
    });
});

describe('signUp Admin', () => {
    it('should create a new admin and return 200', async () => {
        const req = {
            body: {
                name: 'testing admin',
                email: 'testing@admin.com',
                password: '123456',
                level: 'admin',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        bcrypt.genSalt = jest.fn().mockResolvedValue('mockedSalt');

        bcrypt.hash = jest.fn().mockResolvedValue('mockedHash');

        Admin.prototype.save = jest.fn();

        await signUpAdmin(req, res);

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith(
            req.body.password,
            'mockedSalt',
        );
        expect(Admin).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            password: 'mockedHash',
            level: 'admin',
        });

        expect(Admin.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should fail creating a new admin and return 500', async () => {
        const req = {
            body: {
                name: 'testing admin',
                email: 'testing@admin.com',
                password: '123456',
                level: 'admin',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        bcrypt.genSalt = jest.fn().mockResolvedValue('mockedSalt');

        bcrypt.hash = jest.fn().mockResolvedValue('mockedHash');

        Admin.prototype.save = jest.fn().mockRejectedValue('Error');

        await signUpAdmin(req, res);

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith(
            req.body.password,
            'mockedSalt',
        );
        expect(Admin).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            password: 'mockedHash',
            level: 'admin',
        });

        expect(Admin.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Error',
        });
    });
});

describe('signIn', () => {
    it('should succesfully sign in in a reguler user and return 200', async () => {
        const req = {
            body: {
                email: 'user@example.com',
                password: 'userPassword',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const fakeUser = {
            name: 'John Doe',
            email: 'user@example.com',
            roles: 'renter',
            renterId: 'ashdbkasdnn',
            renterPreference: 'sdaldmasd',
            isActive: true,
            firebaseId: 'fakeFirebaseId',
        };

        const fakeToken = {
            accessToken: '123jkn',
            refreshToken: 'asnd1',
        };

        Admin.findOne.mockResolvedValue(null);
        signInWithEmailAndPassword.mockResolvedValueOnce({
            auth: 'fakeAuth',
            email: 'user@example.com',
            password: '123123',
        });

        User.findOne.mockResolvedValue(fakeUser);

        User.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeUser),
        });

        jwt.sign
            .mockReturnValueOnce(fakeToken.accessToken)
            .mockReturnValueOnce(fakeToken.refreshToken);

        jest.spyOn(RefreshToken.prototype, 'save').mockReturnValue(
            fakeToken.refreshToken,
        );

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeUser,
            accessToken: fakeToken.accessToken,
            refreshToken: fakeToken.refreshToken,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should sign in as an admin successfully and return 200', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'adminPassword',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockAdmin = {
            id: 'adminId',
            email: 'test@example.com',
            password: 'adminPassword',
        };

        Admin.findOne.mockResolvedValue(mockAdmin);

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockReturnThis();
        jest.spyOn(RefreshToken.prototype, 'save').mockReturnThis();

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should fail sign in as an admin cause user not found and return 404', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'adminPassword',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Admin.findOne.mockResolvedValue(null);

        bcrypt.compare.mockResolvedValue(true);

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should cannot signIn cause user not found and return 404', async () => {
        const req = {
            body: {
                email: 'user@example.com',
                password: 'userPassword',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const fakeUser = {
            name: 'John Doe',
            email: 'user@example.com',
            roles: 'renter',
            renterId: 'ashdbkasdnn',
            renterPreference: 'sdaldmasd',
            isActive: true,
            firebaseId: 'fakeFirebaseId',
        };

        Admin.findOne.mockResolvedValue(null);
        signInWithEmailAndPassword.mockResolvedValueOnce({
            auth: 'fakeAuth',
            email: 'user@example.com',
            password: '123123',
        });

        User.findOne.mockResolvedValue(fakeUser);

        User.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should fail sign in cause user not active and retun 400', async () => {
        const req = {
            body: {
                email: 'tesstt@example.com',
                password: '123123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const existingUser = {
            name: 'testing',
            email: 'tesstt@example.com',
            isVerified: false,
            isPhoneVerified: false,
            isCompanySubmitted: false,
            phoneNumber: '085348371038',
            firebaseId: 'adadfqwfb2bHJJDK',
            roles: 'renter',
            isActive: false,
            __v: 0,
        };

        Admin.findOne.mockResolvedValue(null);
        signInWithEmailAndPassword.mockResolvedValueOnce({
            auth: 'fakeAuth',
            email: 'tesstt@example.com',
            password: '123123',
        });

        User.findOne.mockResolvedValue(existingUser);

        User.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(existingUser),
        });

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not active',
        });
    });

    it('should fail sign in cause email or password wrong and return 401', async () => {
        const req = {
            body: {
                email: 'testing@email.com',
                password: 'wrong_password',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        signInWithEmailAndPassword.mockRejectedValue({
            code: 'auth/wrong-password',
        });

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Email or password wrong',
        });
    });

    it('should error sign-in and return 500', async () => {
        const req = {
            body: {
                email: 'user@example.com',
                password: 'userPassword',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Admin.findOne.mockResolvedValue(null);
        signInWithEmailAndPassword.mockResolvedValueOnce({
            auth: 'fakeAuth',
            email: 'user@example.com',
            password: '123123',
        });

        User.findOne.mockRejectedValue('Error');

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Error',
        });
    });
});

describe('getNewToken', () => {
    it('should handle a missing refresh token', async () => {
        const req = {
            body: {},
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await getNewToken(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Access denied, token missing!',
        });
    });

    it('should return a new access token ', async () => {
        const req = {
            body: {
                refreshToken: '3199asdSf1jbbajhd791',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedToken = {
            accessToken: 'asdad',
            refreshToken: 'asdarfw',
            isExpired: true,
        };

        const fakePayload = {
            id: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            iat: 1699773881,
            exp: 1702365881,
        };

        jwt.verify.mockReturnValue(fakePayload);

        jwt.sign.mockReturnValue(expectedToken.accessToken);

        await getNewToken(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            accessToken: expectedToken.accessToken,
        });
    });

    it('should return a new access token and refresh token', async () => {
        const req = {
            body: {
                refreshToken: '3199asdSf1jbbajhd791',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedToken = {
            accessToken: 'asdad',
            refreshToken: 'asdarfw',
        };

        const fakePayload = {
            id: 'QAMjDbklDmNXTDf2SYEHqeafnN83',
            iat: 1699773881,
            exp: 1702365881,
            isExpired: false,
        };

        jwt.verify.mockReturnValue(fakePayload);

        RefreshToken.findOneAndDelete(expectedToken);

        jwt.sign
            .mockReturnValue(expectedToken.accessToken)
            .mockReturnValue(expectedToken.refreshToken);

        jest.spyOn(RefreshToken.prototype, 'save').mockReturnValue(
            expectedToken.refreshToken,
        );

        await getNewToken(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            accessToken: expectedToken.refreshToken,
        });
    });

    it('should error and return 500', async () => {
        const req = {
            body: {
                refreshToken: '3199asdSf1jbbajhd791',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        RefreshToken.findOneAndDelete.mockRejectedValue('Error');

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {
                payload: { id: 'someUserId' },
            });
        });

        jwt.sign.mockReturnValue('newAccessToken');

        try {
            await getNewToken(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Error',
            });
        } catch (error) {
            //
        }
    });
});

describe('signOut', () => {
    it('should sign out a user when given a valid refreshToken', async () => {
        const req = {
            body: {
                refreshToken: 'valid_refresh_token_here',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        jwt.verify = jest.fn((token, secret, callback) => {
            callback(null, { id: 'user_id' });
        });

        RefreshToken.findOneAndDelete = jest.fn();

        await signOut(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'User logged out!',
        });

        expect(RefreshToken.findOneAndDelete).toHaveBeenCalledWith({
            firebaseId: 'user_id',
            refreshToken: 'valid_refresh_token_here',
        });
    });

    it('should fail to sign out cause invalid token 401', async () => {
        const req = {
            body: {
                refreshToken: 'fail token',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(
                { name: 'JsonWebTokenError', message: 'Invalid Token' },
                null,
            );
        });

        await signOut(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Invalid Token',
        });
    });

    it('should handle missing refreshToken', async () => {
        const req = {
            body: {},
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await signOut(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Access denied, token missing!',
        });
    });
});

describe('sendForgotPassOTP', () => {
    it('should send an OTP to the user', async () => {
        const req = { body: { email: 'test@example.com' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest
            .fn()
            .mockResolvedValue({ email: 'test@example.com' });

        await sendForgotPassOTP(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'test@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should cannot find user and return 404', async () => {
        const req = {
            body: {
                email: 'test@email.com',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockResolvedValue(null);

        await sendForgotPassOTP(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@email.com' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should error send an OTP', async () => {
        const req = { body: { email: 'test@example.com' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockRejectedValue('should error');

        await sendForgotPassOTP(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'test@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'should error',
        });
    });
});

describe('verifyForgotPassOTP', () => {
    it('should verify the OTP and unset it if it matches', async () => {
        const req = {
            body: { email: 'test@example.com', forgotPassOTP: '1234' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockResolvedValue({
            email: 'test@example.com',
            forgotPassOTP: '1234',
        });

        await verifyForgotPassOTP(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'test@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should return an error if the OTP does not match', async () => {
        const req = {
            body: { email: 'test@example.com', forgotPassOTP: '5678' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockResolvedValue({
            email: 'test@example.com',
            forgotPassOTP: '1234',
        });

        await verifyForgotPassOTP(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'test@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'OTP not match',
        });
    });

    it('should return an error if the user is not found', async () => {
        const req = {
            body: { email: 'unknown@example.com', forgotPassOTP: '1234' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockResolvedValue(null);

        await verifyForgotPassOTP(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'unknown@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return 500 and fail', async () => {
        const req = {
            body: { email: 'test@example.com', forgotPassOTP: '1234' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockRejectedValue('error');

        await verifyForgotPassOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'error',
        });
    });
});

describe('resetPassword', () => {
    it('should reset the user password successfully', async () => {
        const req = {
            body: {
                email: 'testing@example.com',
                newPassword: 'newpassword',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const user = {
            email: 'testing@example.com',
            firebaseId: 'firebaseUserId',
        };

        User.findOne.mockResolvedValue(user);

        firebaseAdmin.auth().deleteUser.mockReturnThis();

        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: req.body,
        });

        User.findOneAndUpdate.mockResolvedValue(user);

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should return an error if the user does not exist', async () => {
        const req = {
            body: { email: 'unknown@example.com', newPassword: 'newpassword' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockResolvedValue(null);

        await resetPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'unknown@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return an error if update user and does not exist', async () => {
        const req = {
            body: { email: 'unknown@example.com', newPassword: 'newpassword' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const user = {
            email: 'testing@example.com',
            firebaseId: 'firebaseUserId',
        };

        User.findOne.mockResolvedValue(user);

        firebaseAdmin.auth().deleteUser.mockReturnThis();

        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: req.body,
        });

        User.findOneAndUpdate.mockResolvedValue(null);

        await resetPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'unknown@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return an error if the password reset process fails<auth/user not found>', async () => {
        const req = {
            body: { email: 'error@example.com', newPassword: 'newpassword' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const user = {
            email: 'error@example.com',
            firebaseId: 'firebaseUserId',
        };

        User.findOne = jest.fn().mockResolvedValue(user);

        createUserWithEmailAndPassword.mockRejectedValue({
            code: 'auth/user-not-found',
        });

        firebaseAdmin.auth = jest.fn(() => ({
            deleteUser: jest
                .fn()
                .mockRejectedValue(new Error('Some Firebase Error')),
        }));

        await resetPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'error@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should return an error if the password reset process fails', async () => {
        const req = {
            body: { email: 'error@example.com', newPassword: 'newpassword' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const user = {
            email: 'error@example.com',
            firebaseId: 'firebaseUserId',
        };

        User.findOne = jest.fn().mockResolvedValue(user);

        createUserWithEmailAndPassword.mockRejectedValue({
            code: 'auth/invalid-email',
        });

        firebaseAdmin.auth = jest.fn(() => ({
            deleteUser: jest
                .fn()
                .mockRejectedValue(new Error('Some Firebase Error')),
        }));

        await resetPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'error@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Password reset failed',
        });
    });
});

describe('signInWithGoogle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should sign in with Google successfully', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                googleId: 'idgaisgd1212',
                imageUrl: 'http://example.com',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedToken = {
            accessToken: 'aygdy2',
            refreshToken: 'yqwyt1',
        };

        const newGoogleUser = {
            name: req.body.name,
            email: req.body.email,
            roles: 'user',
            isVerified: true,
            isCompanySubmitted: false,
            isPhoneVerified: false,
            googleId: 'huehq1',
            imageUrl: req.body.imageUrl,
            phoneNumber: '',
        };

        User.findOne.mockResolvedValue(null);

        jest.spyOn(User.prototype, 'save').mockResolvedValue(newGoogleUser);

        jwt.sign.mockReturnValueOnce(expectedToken.accessToken);

        jwt.sign.mockReturnValueOnce(expectedToken.refreshToken);

        jest.spyOn(RefreshToken.prototype, 'save').mockReturnValue(
            expectedToken.refreshToken,
        );

        await signInWithGoogle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: newGoogleUser,
            accessToken: expectedToken.accessToken,
            refreshToken: expectedToken.refreshToken,
        });
    });

    it('should fail cause not active and return 401', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                googleId: 'idgaisgd1212',
                imageUrl: 'http://example.com',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedToken = {
            accessToken: 'aygdy2',
            refreshToken: 'yqwyt1',
        };

        const newGoogleUser = {
            name: req.body.name,
            email: req.body.email,
            roles: 'user',
            isVerified: true,
            isCompanySubmitted: false,
            isPhoneVerified: false,
            googleId: 'huehq1',
            imageUrl: req.body.imageUrl,
            phoneNumber: '',
        };

        User.findOne.mockResolvedValue({ email: 'testing@email.com' });

        jest.spyOn(User.prototype, 'save').mockResolvedValue(newGoogleUser);

        jwt.sign.mockReturnValueOnce(expectedToken.accessToken);

        jwt.sign.mockReturnValueOnce(expectedToken.refreshToken);

        jest.spyOn(RefreshToken.prototype, 'save').mockReturnValue(
            expectedToken.refreshToken,
        );

        await signInWithGoogle(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not active',
        });
    });

    it('should sign regularly with google account ', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                googleId: 'idgaisgd1212',
                imageUrl: 'http://example.com',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const expectedToken = {
            accessToken: 'aygdy2',
            refreshToken: 'yqwyt1',
        };

        const googleUser = {
            name: req.body.name,
            email: req.body.email,
            roles: 'renter',
            isVerified: true,
            isCompanySubmitted: false,
            isPhoneVerified: false,
            googleId: 'huehq1',
            imageUrl: req.body.imageUrl,
            phoneNumber: '',
            isActive: true,
        };

        User.findOne.mockResolvedValueOnce(googleUser);

        User.findOne.mockReturnThis();

        User.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(googleUser),
        });

        jwt.sign.mockReturnValue(expectedToken.accessToken);

        jwt.sign.mockResolvedValue(expectedToken.refreshToken);

        jest.spyOn(RefreshToken.prototype, 'save').mockReturnValue(
            expectedToken.refreshToken,
        );

        await signInWithGoogle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: googleUser,
            accessToken: expectedToken.accessToken,
            refreshToken: expectedToken.refreshToken,
        });
    });

    it('should error and return 500', async () => {
        const req = {
            body: {
                name: 'testing',
                email: 'testing@email.com',
                googleId: 'idgaisgd1212',
                imageUrl: 'http://example.com',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockRejectedValue('Error');

        await signInWithGoogle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: undefined,
        });
    });
});

describe('createAndSaveRefreshToken', () => {
    it('should handle errors and return a 500 status', async () => {
        const firebaseId = 'someFirebaseId';

        jest.mock('jsonwebtoken');
        jwt.sign.mockImplementation(() => {
            throw new Error('Mocked error');
        });

        try {
            await createAndSaveRefreshToken(firebaseId);
            fail('Expected an error but none was thrown');
        } catch (error) {
            expect(error.message).toBe(
                'Failed to create and save refresh token',
            );
        }
    });
});
