import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import Admin from '../models/Admin';
import bcrypt from 'bcrypt';
import firebaseAdmin from '../utils/firebaseAdmin';
import auth from '../utils/firebaseAuth';
import { generateOTP } from '../utils/generateOTP';
import { sendEmail } from '../utils/sendEmail';

export const signUp = async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        const existingPhoneNumber = await User.findOne({ phoneNumber });

        if (existingUser) {
            return res.status(409).json({
                status: 'fail',
                data: 'email',
                message: 'Email already exist',
            });
        }
        if (existingPhoneNumber) {
            return res.status(409).json({
                status: 'fail',
                data: 'phoneNumber',
                message: 'Phone number already exist',
            });
        }
        const firebaseResponse = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );

        const newUser = new User({
            name,
            email,
            phoneNumber,
            roles: 'user',
            isVerified: false,
            isCompanySubmitted: false,
            isPhoneVerified: false,
            firebaseId: firebaseResponse.user.uid,
        });

        await newUser.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
            return res
                .status(409)
                .json({ status: 'fail', message: 'Email already exist' });
        }

        if (error.code === 'auth/invalid-email') {
            return res
                .status(400)
                .json({ status: 'fail', message: 'Invalid email' });
        }

        res.status(500).json({ status: 'fail', message: error });
    }
};

export const signUpAdmin = async (req, res) => {
    const { name, email, password, level } = req.body;

    try {
        const saltOrRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltOrRound);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            level: 'admin',
        });

        await newAdmin.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        //check apakah email ada di collection admin dan apakah password nya sesuai
        const admin = await Admin.findOne({ email });

        let isAdmin;
        if (admin) {
            isAdmin = bcrypt.compare(password, admin.password);
        }

        if (admin && isAdmin) {
            const accessToken = createAccessToken(admin.id);
            const refreshToken = await createAndSaveRefreshToken(admin.id);

            return res.status(200).json({
                status: 'success',
                data: admin,
                accessToken,
                refreshToken,
            });
        }

        const response = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        if (!response) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        const existingUser = await User.findOne({ email });
        const sortedUser =
            existingUser?.roles === 'renter'
                ? await User.findOne({ email }).populate(
                      'renterId',
                      'renterPreference company',
                  )
                : await User.findOne({ email }).populate(
                      'shipOwnerId',
                      'company',
                  );
        if (!sortedUser)
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });

        if (!sortedUser.isActive)
            return res
                .status(400)
                .json({ status: 'fail', message: 'User not active' });

        //create access token that expires in 5 minutes
        const accessToken = createAccessToken(sortedUser.firebaseId);
        //create refresh token that expires in 30 days
        const refreshToken = await createAndSaveRefreshToken(
            sortedUser.firebaseId,
        );

        res.status(200).json({
            status: 'success',
            data: sortedUser,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        if (
            error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password'
        ) {
            return res
                .status(401)
                .json({ status: 'fail', message: 'Email or password wrong' });
        }
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getNewToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res
            .status(401)
            .json({ status: 'fail', message: 'Access denied, token missing!' });

    try {
        const decodedToken = checkExpiredToken(refreshToken);
        if (decodedToken.isExpired) {
            await RefreshToken.findOneAndDelete({
                firebaseId: decodedToken.payload.id,
                refreshToken,
            });
            const newRefreshToken = await createAndSaveRefreshToken(
                decodedToken.payload.id,
            );
            const accessToken = createAccessToken(decodedToken.payload.id);

            return res.status(200).json({
                status: 'success',
                accessToken,
                refreshToken: newRefreshToken,
            });
        }

        const accessToken = jwt.sign(
            { id: decodedToken.payload.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' },
        );

        res.status(200).json({ status: 'success', accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

const createAccessToken = userId => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m',
    });
};

const checkExpiredToken = refreshToken => {
    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        return { payload: payload, isExpired: false };
    } catch (error) {
        console.log(error.name);
        if (error.name === 'TokenExpiredError') {
            const payload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                {
                    ignoreExpiration: true,
                },
            );
            return {
                payload: payload,
                isExpired: true,
            };
        }
    }
};

const createAndSaveRefreshToken = async firebaseId => {
    try {
        const refreshToken = jwt.sign(
            { id: firebaseId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' },
        );
        const newRefreshToken = new RefreshToken({
            firebaseId,
            refreshToken,
        });

        await newRefreshToken.save();

        return refreshToken;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to create and save refresh token');
        // return res.status(500).json({ status: 'fail', message: error });
    }
};

export const signOut = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res
            .status(401)
            .json({ status: 'fail', message: 'Access denied, token missing!' });

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ status: 'fail', message: 'Invalid Token' });
            }

            await RefreshToken.findOneAndDelete({
                firebaseId: decoded.id,
                refreshToken,
            });

            res.status(200).json({
                status: 'success',
                message: 'User logged out!',
            });
        },
    );
};

export const sendForgotPassOTP = async (req, res) => {
    const { email } = req.body;
    const forgotPassOTP = generateOTP(4);

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });

        await sendEmail({
            to: user.email,
            from: 'smishiphire.noreply@gmail.com',
            subject: 'Verify email before reset password',
            text: `To verify that your email your valid, here's an OTP code for resetting your password
      ${forgotPassOTP}`,
        });

        await User.findOneAndUpdate(
            { email },
            { forgotPassOTP },
            { new: true },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log('error', error);
    }
};

export const verifyForgotPassOTP = async (req, res) => {
    const { email, forgotPassOTP } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user)
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });

        if (user.forgotPassOTP !== forgotPassOTP) {
            return res
                .status(400)
                .json({ status: 'fail', message: 'OTP not match' });
        } else {
            await User.findOneAndUpdate(
                { email },
                { $unset: { forgotPassOTP: 1 } },
                { new: true },
            );

            return res.status(200).json({ status: 'success' });
        }
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });

        await firebaseAdmin.auth().deleteUser(user.firebaseId);
        const newFirebaseAcc = await createUserWithEmailAndPassword(
            auth,
            email,
            newPassword,
        );

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { firebaseId: newFirebaseAcc.user.uid },
            { new: true },
        );

        if (!updatedUser) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success' });
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        res.status(500).json({
            status: 'fail',
            message: 'Password reset failed',
        });
    }
};

export const signInWithGoogle = async (req, res) => {
    const { name, email, googleId, imageUrl } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const newGoogleUser = new User({
                name,
                email,
                roles: 'user',
                isVerified: true,
                isCompanySubmitted: false,
                isPhoneVerified: false,
                googleId,
                imageUrl,
                // phoneNumber: '',
            });
            const userSave = await newGoogleUser.save();

            //create access token that expires in 5 minutes
            const accessToken = createAccessToken(userSave.googleId);
            //create refresh token that expires in 30 days
            const refreshToken = await createAndSaveRefreshToken(
                userSave.googleId,
            );

            res.status(200).json({
                status: 'success',
                data: userSave,
                accessToken,
                refreshToken,
            });
        } else {
            if (!existingUser.isActive)
                return res
                    .status(401)
                    .json({ status: 'fail', message: 'User not active' });

            const sortedUser =
                existingUser.roles === 'renter'
                    ? await User.findOne({ email }).populate(
                          'renterId',
                          'renterPreference company',
                      )
                    : await User.findOne({ email }).populate(
                          'shipOwnerId',
                          'company',
                      );

            //create access token that expires in 5 minutes
            const accessToken = createAccessToken(existingUser.googleId);
            //create refresh token that expires in 30 days
            const refreshToken = await createAndSaveRefreshToken(
                existingUser.googleId,
            );

            res.status(200).json({
                status: 'success',
                data: sortedUser,
                accessToken,
                refreshToken,
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const signInWithApple = async (req, res) => {
    const { name, email, appleId } = req.body;

    try {
        const existing = await User.findOne({ email });

        if (!existing) {
            const newAppleUser = new User({
                name,
                email,
                roles: 'user',
                isVerified: true,
                isCompanySubmitted: false,
                isPhoneVerified: false,
                appleId,
                // phoneNumber: '',
            });
            const userSave = await newAppleUser.save();

            //create access token that expires in 5 minutes
            const accessToken = createAccessToken(userSave.appleId);
            //create refresh token that expires in 30 days
            const refreshToken = await createAndSaveRefreshToken(
                userSave.appleId,
            );

            res.status(200).json({
                status: 'success',
                data: userSave,
                accessToken,
                refreshToken,
            });
        } else {
            if (!existing.isActive)
                return res
                    .status(401)
                    .json({ status: 'fail', message: 'User not active' });

            const sortedUser =
                existing.roles === 'renter'
                    ? await User.findOne({ email }).populate(
                          'renterId',
                          'renterPreference company',
                      )
                    : await User.findOne({ email }).populate(
                          'shipOwnerId',
                          'company',
                      );

            //create access token that expires in 5 minutes
            const accessToken = createAccessToken(existing.appleId);
            //create refresh token that expires in 30 days
            const refreshToken = await createAndSaveRefreshToken(
                existing.appleId,
            );

            res.status(200).json({
                status: 'success',
                data: sortedUser,
                accessToken,
                refreshToken,
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export { createAndSaveRefreshToken, checkExpiredToken };
