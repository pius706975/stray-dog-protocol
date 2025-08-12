import { Router } from 'express';
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
    // getDynamicInputRFQByShipId,
    sendNegotiateContact,
    submitShipPicturesBeforeSailing,
    submitShipPicturesAfterSailing,
    getTransactionNegoById,
    updateTracking,
    getTrackingHistory,
} from '../controller/shipOwnerController';
import verifyToken from '../middleware/verifyToken';
import multer from 'multer';
import { getAddShipDynamicForm } from '../controller/adminController';

const shipOwnerRoute = Router();
const upload = multer();

shipOwnerRoute.get(
    '/get-add-ship-dynamic-form',
    verifyToken,
    getAddShipDynamicForm,
);

shipOwnerRoute.get('/get-ship-owner-data', verifyToken, getShipOwnerData);
shipOwnerRoute.post('/submit-ship', verifyToken, submitShip);
shipOwnerRoute.post(
    '/submit-proposal',
    upload.fields([
        { name: 'draftContract', maxCount: 1 },
        { name: 'otherDoc', maxCount: 20 },
    ]),
    verifyToken,
    submitProposal,
);

shipOwnerRoute.post(
    '/submit-negotiate-contract',
    upload.single('document'),
    verifyToken,
    sendNegotiateContact,
);

shipOwnerRoute.get('/get-top-rated-ships', verifyToken, getTopRatedShips);
shipOwnerRoute.get('/get-top-rented-ships', verifyToken, getTopRentedShips);
shipOwnerRoute.get('/get-ships/', verifyToken, getShipById);
shipOwnerRoute.post('/approve-payment', verifyToken, approvePayment);

shipOwnerRoute.post(
    '/submit-contract',
    upload.single('document'),
    verifyToken,
    submitContract,
);

shipOwnerRoute.post(
    '/submit-owner-company-profile',
    upload.array('files', 10),
    verifyToken,
    submitCompanyProfile,
);

shipOwnerRoute.post(
    '/edit-ship-information/:shipId',
    verifyToken,
    editShipById,
);

shipOwnerRoute.post(
    '/edit-ship-image/:shipId',
    upload.single('image'),
    verifyToken,
    editShipImageById,
);

shipOwnerRoute.post(
    '/edit-ship-document/:shipId',
    upload.single('files'),
    verifyToken,
    editShipDocumentById,
);

shipOwnerRoute.delete('/delete-ship/:id', verifyToken, deleteShipById);
shipOwnerRoute.get('/get-renter-data/:id', verifyToken, getRenterDataById);

shipOwnerRoute.get('/get-all-transaction', verifyToken, getAllTransaction);

shipOwnerRoute.post(
    '/update-transaction/accept-rfq',
    verifyToken,
    acceptRFQById,
);

shipOwnerRoute.get(
    '/get-transaction-by-id/:id',
    verifyToken,
    getTransactionById,
);

shipOwnerRoute.post(
    '/add-ship-history',
    upload.array('files', 50),
    verifyToken,
    addShipHistory,
);

shipOwnerRoute.get(
    '/get-renter-user-data/:id',
    verifyToken,
    getRenterUserDataById,
);

shipOwnerRoute.post(
    '/add-dynamic-input-rfq',
    verifyToken,
    addDynamicInputRfqFormOwner,
);

shipOwnerRoute.get(
    '/get-template-ship-rfq-form/:shipCategory',
    verifyToken,
    getTemplateShipRFQFormsByShipCategory,
);

shipOwnerRoute.post(
    '/create-template-default-rfq-form/:shipId',
    verifyToken,
    createTemplateDefaultRFQForm,
);

shipOwnerRoute.get(
    '/get-dynamic-input-rfq-by-ship-id/:shipId',
    verifyToken,
    getDynamicInputRFQByTemplateTypeOwner,
);

shipOwnerRoute.post(
    '/create-template-custom-rfq-form/:shipId',
    verifyToken,
    createTemplateCustomRFQForm,
);

shipOwnerRoute.post(
    '/edit-dynamic-input-form/:id',
    verifyToken,
    editDynamicInputOwnerRfqForm,
);

shipOwnerRoute.get(
    '/get-dynamic-input-form-by-id/:_id',
    verifyToken,
    getDynamicInputRFQOwnerById,
);

shipOwnerRoute.post(
    '/activate-dynamic-input-form/:_id',
    verifyToken,
    activateDynamicInput,
);
shipOwnerRoute.post(
    '/submit-ship-pictures-before-sailing',
    upload.array('files', 10),
    verifyToken,
    submitShipPicturesBeforeSailing,
);

shipOwnerRoute.post(
    '/submit-ship-pictures-after-sailing',
    upload.array('files', 10),
    verifyToken,
    submitShipPicturesAfterSailing,
);

shipOwnerRoute.get(
    '/get-transaction-for-negotiate/:id',
    verifyToken,
    getTransactionNegoById,
);

shipOwnerRoute.post(
    '/update-tracking/:id',
    verifyToken,
    upload.array('files', 4),
    updateTracking,
);

shipOwnerRoute.get(
    '/get-tracking-history/:id',
    verifyToken,
    getTrackingHistory,
);

export default shipOwnerRoute;
