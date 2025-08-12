import { Router } from 'express';
import {
    getAddShipDynamicForm,
    getAllUserTransaction,
    getListUser,
    activateUser,
    shipApproved,
    unapproveShip,
    approveDeleteShipHistory,
    getDynamicInputByTemplateName,
    addDynamicInputAddShip,
    editDynamicInputAddShip,
    activateDynamicInput,
    deleteItemDropdownDynamicInput,
    addDynamicInputDropDownItem,
    addDynamicInputRfqForm,
    getDynamicInputRFQByTemplateType,
    createTemplateRFQForm,
    getAllTemplateRFQForms,
    activeDynamicInputRFQ,
    editDynamicInputRfqForm,
    getDynamicInputRFQById,
    activeDynamicFormRFQ,
    getShipSpects,
    getSelectDropDownInput,
    editAddShipInputOrder,
    deleteSpecificCategories,
    activateCompany,
    companyList,
    rejectCompany,
    verifyUserMobilePhone,
    getAllUsersWithUnverifiedPhoneNumber,
    updateFirebaseToken,
} from '../controller/adminController';
import { verifyAdminToken} from '../middleware/verifyRole';

const adminRouter = Router();

adminRouter.get(
    '/get-add-ship-dynamic-form',
    verifyAdminToken,
    getAddShipDynamicForm,
);
adminRouter.get(
    '/get-all-user-transaction',
    verifyAdminToken,
    getAllUserTransaction,
);
adminRouter.get('/get-list-user', verifyAdminToken, getListUser);
adminRouter.post('/activate-user', verifyAdminToken, activateUser);
adminRouter.post(
    '/verify-user-phone-number',
    verifyAdminToken,
    verifyUserMobilePhone,
);
adminRouter.get(
    '/get-unverified-phone-number',
    verifyAdminToken,
    getAllUsersWithUnverifiedPhoneNumber,
);
adminRouter.post('/ship-approved', verifyAdminToken, shipApproved);
adminRouter.post('/unapprove-ship', verifyAdminToken, unapproveShip);
adminRouter.post(
    '/approve-delete-ship-history',
    verifyAdminToken,
    approveDeleteShipHistory,
);
adminRouter.get(
    '/get-dynamic-input-add-ship/:templateName',
    verifyAdminToken,
    getDynamicInputByTemplateName,
);
adminRouter.get('/get-ship-spect/', verifyAdminToken, getShipSpects);
adminRouter.post(
    '/add-dynamic-input-add-ship',
    verifyAdminToken,
    addDynamicInputAddShip,
);
adminRouter.post(
    '/add-dynamic-input-drop-down-add-ship',
    verifyAdminToken,
    addDynamicInputDropDownItem,
);
adminRouter.post(
    '/edit-dynamic-input-add-ship-order',
    verifyAdminToken,
    editAddShipInputOrder,
);
adminRouter.post(
    '/edit-dynamic-input-add-ship/:id',
    verifyAdminToken,
    editDynamicInputAddShip,
);
adminRouter.post(
    '/activate-dynamic-input-add-ship',
    verifyAdminToken,
    activateDynamicInput,
);
adminRouter.post(
    '/delete-specific-categories-add-ship',
    verifyAdminToken,
    deleteSpecificCategories,
);
adminRouter.post(
    '/delete-item-dropdown-dynamic-input',
    verifyAdminToken,
    deleteItemDropdownDynamicInput,
);
adminRouter.post(
    '/add-dynamic-input-rfq-form',
    verifyAdminToken,
    addDynamicInputRfqForm,
);
adminRouter.get(
    '/get-dynamic-input-rfq-form/:templateType',
    verifyAdminToken,
    getDynamicInputRFQByTemplateType,
);
adminRouter.post(
    '/create-template-rfq-form',
    verifyAdminToken,
    createTemplateRFQForm,
);
adminRouter.get(
    '/get-all-template-rfq-forms',
    verifyAdminToken,
    getAllTemplateRFQForms,
);
adminRouter.post(
    '/active-dynamic-input-rfq',
    verifyAdminToken,
    activeDynamicInputRFQ,
);
adminRouter.post(
    '/edit-dynamic-input-rfq/:id',
    verifyAdminToken,
    editDynamicInputRfqForm,
);
adminRouter.get(
    '/get-dynamic-input-rfq/:id',
    verifyAdminToken,
    getDynamicInputRFQById,
);
adminRouter.post(
    '/active-dynamic-form-rfq',
    verifyAdminToken,
    activeDynamicFormRFQ,
);
adminRouter.post(
    '/approve-delete-ship-history',
    verifyAdminToken,
    approveDeleteShipHistory,
);

adminRouter.get(
    '/get-select-dropdown-input/:templateType',
    verifyAdminToken,
    getSelectDropDownInput,
);

adminRouter.post('/activate-company', verifyAdminToken, activateCompany);
adminRouter.post('/rejected-company', verifyAdminToken, rejectCompany);
adminRouter.get('/get-companies', verifyAdminToken, companyList);

adminRouter.post('/update-firebase-token', verifyAdminToken, updateFirebaseToken)

export default adminRouter;
