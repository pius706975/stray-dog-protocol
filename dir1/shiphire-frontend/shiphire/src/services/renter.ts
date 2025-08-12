import { AxiosResponse } from 'axios';
import {
    DefaultResponse,
    TransactionResponse,
    GetRenterDataResponse,
    GetTransactionByRentalId,
    OpenTransactionRequest,
    SubmitRenterPreferenceRequest,
    SubmitRenterPreferenceResponse,
    VerifyEmailOTPRequest,
    VerifySignContractOTPRequest,
    VerifySignProposalOTPRequest,
    VerifyPhoneOTPRequest,
    getTransactionNegoResponse,
    CompleteNegotiationRequest,
    GetPaymentAccountTransactionResponse,
    GetPaymentHistoryResponse,
    UpdateShipTrackingResponse,
    AddReviewRequest,
    AddReviewResponse,
} from '../types';
import httpRequest from './api';

export const getRenterData = async (): Promise<
    AxiosResponse<GetRenterDataResponse>
> => {
    return httpRequest.get('/renter/get-renter-data');
};

export const getRenterDataById = async (
    renterId: string | String,
): Promise<AxiosResponse<GetRenterDataResponse>> => {
    return httpRequest.get(`/renter/get-renter/${renterId}`);
};

export const submitRenterPreference = async (
    request: SubmitRenterPreferenceRequest,
): Promise<AxiosResponse<SubmitRenterPreferenceResponse>> => {
    return await httpRequest.post('/renter/submit-renter-preference', request);
};

export const submitRequestForQuote = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/submit-request-for-quote', request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllTransaction = async (): Promise<
    AxiosResponse<TransactionResponse>
> => {
    return await httpRequest.get('/renter/get-all-transaction');
};

export const getTransactionByRentalId = async (
    rentalId: string | String,
): Promise<AxiosResponse<GetTransactionByRentalId>> => {
    return await httpRequest.get(`/renter/get-transaction-by-id/${rentalId}`);
};

export const sendOTPEmailVerif = async (): Promise<
    AxiosResponse<DefaultResponse>
> => {
    return await httpRequest.post('/renter/send-otp-email-verif', null);
};

export const verifyEmailOTP = async (
    request: VerifyEmailOTPRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/verify-email-otp', request);
};

export const submitCompanyProfile = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/submit-company-profile', request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const sendOTPSignProposal = async (): Promise<
    AxiosResponse<DefaultResponse>
> => {
    return await httpRequest.post('/renter/send-otp-sign-proposal', null);
};

export const verifySignProposalOTP = async (
    request: VerifySignProposalOTPRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/verify-sign-proposal-otp', request);
};

export const uploadPaymentReceipt = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/upload-payment-receipt', request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const openTransaction = async (
    request: OpenTransactionRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/open-transaction', request);
};

export const sendOTPSignContract = async (): Promise<
    AxiosResponse<DefaultResponse>
> => {
    return await httpRequest.post('/renter/send-otp-sign-contract', null);
};

export const verifySignContractOTP = async (
    request: VerifySignContractOTPRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/verify-sign-contract-otp', request);
};

export const completeNegotiate = async (
    request: CompleteNegotiationRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/complete-negotiate', request);
};

export const sendOTPPhoneVerif = async (): Promise<
    AxiosResponse<DefaultResponse>
> => {
    return await httpRequest.post('/renter/send-otp-verify-phone-number', null);
};

export const verifyPhoneOTP = async (
    request: VerifyPhoneOTPRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/verify-phone-number-otp', request);
};

export const verifyPhoneByAdmin = async (request: {
    token: string;
}): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        '/renter/verify-phone-number-by-admin',
        request,
    );
};

export const sendNotification = async (request: {
    token: string;
    title: string;
    body: string;
}): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/send-notification', request);
};

export const setShipReminderNotif = async (request: {
    token: string;
    scheduleTime: Date;
    shipId: string;
}): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/renter/set-ship-reminder-notif', request);
};
export const getTransactionNego = async (
    transactionId: string,
): Promise<AxiosResponse<getTransactionNegoResponse>> => {
    return await httpRequest.get(
        `/renter/get-transaction-for-negotiate/${transactionId}`,
    );
};
export const sendRespondNegotiate = async (
    request: FormData,
): Promise<AxiosResponse<getTransactionNegoResponse>> => {
    return await httpRequest.post(`/renter/respond-draft-contract`, request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getPaymentAccount = async (
    transactionId: string,
): Promise<AxiosResponse<GetPaymentAccountTransactionResponse>> => {
    return await httpRequest.get(
        `/renter/get-ship-owner-payment-data/${transactionId}`,
    );
};
export const getPaymentHistory = async (
    rentalId: string | String,
): Promise<AxiosResponse<GetPaymentHistoryResponse>> => {
    return await httpRequest.get(`/renter/get-all-payment/${rentalId}`);
};

export const updateShipTracking = async (
    request: FormData,
    rentalId: string | String,
): Promise<AxiosResponse<UpdateShipTrackingResponse>> => {
    return await httpRequest.post(
        `/renter/update-tracking/${rentalId}`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const AddReview = async (
    request: AddReviewRequest,
): Promise<AxiosResponse<AddReviewResponse>> => {
    return await httpRequest.post('/renter/add-rating', request);
};
