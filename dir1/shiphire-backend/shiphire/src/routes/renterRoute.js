import { Router } from 'express';
import multer from 'multer';
import {
    VerifyEmailOTP,
    VerifySignProposalOTP,
    getAllTransaction,
    getRenterById,
    getRenterData,
    getTransactionById,
    renterOpenTransaction,
    sendNotification,
    sendOTPSignContract,
    sendOTPSignProposal,
    sendOTPVerifEmail,
    setShipReminderNotif,
    submitCompanyProfile,
    submitRenterPreference,
    submitRequestForQuote,
    uploadPaymentReceipt,
    verifySignContractOTP,
    sendOTPVerifyPhoneNumber,
    VerifyPhoneOTP,
    respondNegotiateContract,
    getTransactionNegoById,
    completeNegotiate,
    getShipOwnerPaymentAccount,
    getAllPayment,
    VerifyPhoneNumberByAdmin,
    updateTracking,
    getTrackingHistory,
    addRating,
    shipIsReviewed,
} from '../controller/renterController';
import verifyToken from '../middleware/verifyToken';

const renterRoute = Router();
const upload = multer();

renterRoute.get('/get-renter-data', verifyToken, getRenterData);
renterRoute.get('/get-renter/:renterId', verifyToken, getRenterById);
renterRoute.post(
    '/submit-renter-preference',
    verifyToken,
    submitRenterPreference,
);
renterRoute.post(
    '/submit-request-for-quote',
    upload.single('document'),
    verifyToken,
    submitRequestForQuote,
);
renterRoute.post(
    '/submit-company-profile',
    upload.array('files', 10),
    verifyToken,
    submitCompanyProfile,
);

renterRoute.post(
    '/respond-draft-contract',
    upload.array('files', 10),
    verifyToken,
    respondNegotiateContract,
);

renterRoute.post('/complete-negotiate', verifyToken, completeNegotiate);

renterRoute.get(
    '/get-transaction-for-negotiate/:id',
    verifyToken,
    getTransactionNegoById,
);

renterRoute.get('/get-all-transaction', verifyToken, getAllTransaction);
renterRoute.get('/get-transaction-by-id/:id', verifyToken, getTransactionById);
renterRoute.post('/send-otp-email-verif', verifyToken, sendOTPVerifEmail);
renterRoute.post('/verify-email-otp', verifyToken, VerifyEmailOTP);
renterRoute.post('/send-otp-sign-proposal', verifyToken, sendOTPSignProposal);
renterRoute.post(
    '/verify-sign-proposal-otp',
    verifyToken,
    VerifySignProposalOTP,
);
renterRoute.post(
    '/upload-payment-receipt',
    upload.single('image'),
    verifyToken,
    uploadPaymentReceipt,
);

renterRoute.get('/get-all-payment/:rentalId', verifyToken, getAllPayment);

renterRoute.post('/open-transaction', verifyToken, renterOpenTransaction);
renterRoute.post('/send-otp-sign-contract', verifyToken, sendOTPSignContract);
renterRoute.post(
    '/verify-sign-contract-otp',
    verifyToken,
    verifySignContractOTP,
);

renterRoute.post(
    '/send-otp-verify-phone-number',
    verifyToken,
    sendOTPVerifyPhoneNumber,
);
renterRoute.post('/verify-phone-number-otp', verifyToken, VerifyPhoneOTP);
renterRoute.post(
    '/verify-phone-number-by-admin',
    verifyToken,
    VerifyPhoneNumberByAdmin,
);
renterRoute.post('/set-ship-reminder-notif', verifyToken, setShipReminderNotif);
renterRoute.get(
    '/get-ship-owner-payment-data/:transactionId',
    verifyToken,
    getShipOwnerPaymentAccount,
);

//REFACTOR THIS CODE
renterRoute.post('/send-notification', sendNotification);

renterRoute.post(
    '/update-tracking/:id',
    verifyToken,
    upload.array('files', 10),
    updateTracking,
);

renterRoute.get(
    '/get-tracking-history/:id',
    verifyToken,
    getTrackingHistory,
);

renterRoute.post(
    '/add-rating',
    verifyToken,
    addRating,
);

// renterRoute.post(
//     '/ship-is-reviewed',
//     verifyToken,
//     shipIsReviewed,
// );

export default renterRoute;
