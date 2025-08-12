import { Router } from 'express';
import {
    addPhoneNumber,
    deleteAccount,
    getNotif,
    getUserProfile,
    submitUserRole,
    testEmailRenter,
    userOpenNotification,
} from '../controller/userController';
import verifyToken from '../middleware/verifyToken';

const userRouter = Router();

userRouter.get('/get-user-profile', verifyToken, getUserProfile);
userRouter.post('/submit-user-role', verifyToken, submitUserRole);
userRouter.post('/test-email', testEmailRenter);
userRouter.post('/add-phone-number', verifyToken, addPhoneNumber);
userRouter.get('/get-notification', verifyToken, getNotif);
userRouter.post('/open-notification', verifyToken, userOpenNotification);
userRouter.post('/delete-account', verifyToken, deleteAccount);

export default userRouter;
