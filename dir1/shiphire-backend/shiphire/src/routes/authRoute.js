import { Router } from 'express';
import {
    getNewToken,
    resetPassword,
    sendForgotPassOTP,
    signIn,
    signInWithGoogle,
    signOut,
    signUp,
    verifyForgotPassOTP,
    signUpAdmin,
    signInWithApple,
} from '../controller/authController';

const authRouter = Router();

authRouter.post('/signup', signUp);
authRouter.post('/signIn', signIn);
authRouter.post('/getNewToken', getNewToken);
authRouter.post('/signout', signOut);
authRouter.post('/send-forgot-pass-otp', sendForgotPassOTP);
authRouter.post('/verify-forgot-pass-otp', verifyForgotPassOTP);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/google-sign-in', signInWithGoogle);
authRouter.post('/apple-sign-in', signInWithApple);
authRouter.post('/signup/admin', signUpAdmin);

export default authRouter;
