import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './src/locales/en/common.json';
import idCommon from './src/locales/id/common.json';

import enHome from './src/locales/en/home.json';
import idHome from './src/locales/id/home.json';

import enDetailShip from './src/locales/en/detailship.json';
import idDetailShip from './src/locales/id/detailship.json';

import enRFQ from './src/locales/en/rfq.json';
import idRFQ from './src/locales/id/rfq.json';

import enProposal from './src/locales/en/proposal.json';
import idProposal from './src/locales/id/proposal.json';

import enTransactionDetail from './src/locales/en/transactiondetail.json';
import idTransactionDetail from './src/locales/id/transactiondetail.json';

import enShipTracking from './src/locales/en/shiptracking.json';
import idShipTracking from './src/locales/id/shiptracking.json';

import enPayment from './src/locales/en/payment.json';
import idPayment from './src/locales/id/payment.json';

import enCompanyRegister from './src/locales/en/companyregister.json';
import idCompanyRegister from './src/locales/id/companyregister.json';

import enVerifyEmail from './src/locales/en/verifyemail.json';
import idVerifyEmail from './src/locales/id/verifyemail.json';

import enNotification from './src/locales/en/notification.json';
import idNotification from './src/locales/id/notification.json';

import enAccount from './src/locales/en/account.json';
import idAccount from './src/locales/id/account.json';

import enSignIn from './src/locales/en/signin.json';
import idSignIn from './src/locales/id/signin.json';

import enSignUp from './src/locales/en/signup.json';
import idSignUp from './src/locales/id/signup.json';

import enForgotPassword from './src/locales/en/forgotpassword.json';
import idForgotPassword from './src/locales/id/forgotpassword.json';

import enShips from './src/locales/en/ships.json';
import idShips from './src/locales/id/ships.json';

import enUserManagement from './src/locales/en/usermanagement.json';
import idUserManagement from './src/locales/id/usermanagement.json';

import enSearch from './src/locales/en/search.json';
import idSearch from './src/locales/id/search.json';

import enSaveShip from './src/locales/en/saveship.json';
import idSaveShip from './src/locales/id/saveship.json';

import enReqLocationPerm from './src/locales/en/reqlocationperm.json';
import idReqLocationPerm from './src/locales/id/reqlocationperm.json';

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: {
            common: enCommon,
            home: enHome,
            detailship: enDetailShip,
            account: enAccount,
            rfq: enRFQ,
            proposal: enProposal,
            transactiondetail: enTransactionDetail,
            shiptracking: enShipTracking,
            payment: enPayment,
            companyregister: enCompanyRegister,
            verifyemail: enVerifyEmail,
            signin: enSignIn,
            signup: enSignUp,
            forgotpassword: enForgotPassword,
            notification: enNotification,
            ships: enShips,
            usermanagement: enUserManagement,
            search: enSearch,
            saveship: enSaveShip,
            reqlocationperm: enReqLocationPerm,
        },
        id: {
            common: idCommon,
            home: idHome,
            detailship: idDetailShip,
            account: idAccount,
            rfq: idRFQ,
            proposal: idProposal,
            transactiondetail: idTransactionDetail,
            shiptracking: idShipTracking,
            payment: idPayment,
            companyregister: idCompanyRegister,
            verifyemail: idVerifyEmail,
            signin: idSignIn,
            signup: idSignUp,
            forgotpassword: idForgotPassword,
            notification: idNotification,
            ships: idShips,
            usermanagement: idUserManagement,
            search: idSearch,
            saveship: idSaveShip,
            reqlocationperm: idReqLocationPerm,
        },
    },
});

export default i18next;
