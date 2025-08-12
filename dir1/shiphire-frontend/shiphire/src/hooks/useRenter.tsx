import { AxiosError, AxiosResponse } from 'axios';
import useMutationWithErrorHandler from './useMutationWithErrorHandler';
import { renterService } from '../services';
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
    AddReviewResponse,
    AddReviewRequest,
} from '../types';
import { useMutation } from 'react-query';

export const useGetRenterData = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetRenterDataResponse>,
        AxiosError,
        void
    >(renterService.getRenterData);

export const useGetRenterDataById = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetRenterDataResponse>,
        AxiosError,
        string | String
    >(renterService.getRenterDataById);

export const useSubmitRenterPreference = () =>
    useMutationWithErrorHandler<
        AxiosResponse<SubmitRenterPreferenceResponse>,
        AxiosError,
        SubmitRenterPreferenceRequest
    >(data => {
        return renterService.submitRenterPreference(data);
    });

export const useSubmitRequestForQuote = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return renterService.submitRequestForQuote(data);
    });

export const useGetAllTransaction = () =>
    useMutationWithErrorHandler<
        AxiosResponse<TransactionResponse>,
        AxiosError,
        void
    >(renterService.getAllTransaction);

export const useGetTransactionByRentalId = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTransactionByRentalId>,
        AxiosError,
        string | String
    >(data => {
        return renterService.getTransactionByRentalId(data);
    });

export const useSendOTPEmailVerif = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        void
    >(renterService.sendOTPEmailVerif);

export const useVerifyEmailOTP = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        VerifyEmailOTPRequest
    >(data => {
        return renterService.verifyEmailOTP(data);
    });

export const useSubmitCompanyProfile = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        FormData
    >(data => {
        return renterService.submitCompanyProfile(data);
    });

export const useSendOTPSignProposal = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        void
    >(renterService.sendOTPSignProposal);

export const useVerifySignProposalOTP = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        VerifySignProposalOTPRequest
    >(data => {
        return renterService.verifySignProposalOTP(data);
    });

export const useUploadPaymentReceipt = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return renterService.uploadPaymentReceipt(data);
    });

export const useOpenTransaction = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        OpenTransactionRequest
    >(data => {
        return renterService.openTransaction(data);
    });

export const useSendOTPSignContract = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        void
    >(renterService.sendOTPSignContract);

export const useVerifySignContractOTP = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        VerifySignContractOTPRequest
    >(data => {
        return renterService.verifySignContractOTP(data);
    });

export const useCompleteNegotiate = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        CompleteNegotiationRequest
    >(data => {
        return renterService.completeNegotiate(data);
    });

export const useSendOTPPhoneVerif = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        void
    >(renterService.sendOTPPhoneVerif);

export const useVerifyPhoneOTP = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        VerifyPhoneOTPRequest
    >(data => {
        return renterService.verifyPhoneOTP(data);
    });

export const useVerifyPhoneByAdmin = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        {
            token: string;
        }
    >(data => {
        return renterService.verifyPhoneByAdmin(data);
    });

export const useSendNotification = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        { token: string; title: string; body: string }
    >(data => {
        return renterService.sendNotification(data);
    });

export const useSetShipReminderNotif = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        {
            token: string;
            scheduleTime: Date;
            shipId: string;
        }
    >(data => {
        return renterService.setShipReminderNotif(data);
    });

export const useGetTransactionForNegotiate = () =>
    useMutationWithErrorHandler<
        AxiosResponse<getTransactionNegoResponse>,
        AxiosError,
        string
    >(data => {
        return renterService.getTransactionNego(data);
    });

export const useSendRespondNegotiateContract = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return renterService.sendRespondNegotiate(data);
    });

export const useGetPaymentAccount = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetPaymentAccountTransactionResponse>,
        AxiosError,
        { transactionId: string }
    >(({ transactionId }) => {
        return renterService.getPaymentAccount(transactionId);
    });

export const useGetPaymentHistory = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetPaymentHistoryResponse>,
        AxiosError,
        { rentalId: string | String }
    >(({ rentalId }) => {
        return renterService.getPaymentHistory(rentalId);
    });

export const useUpdateRenterShipTracking = () =>
    useMutation<
        AxiosResponse<UpdateShipTrackingResponse>,
        AxiosError,
        { request: FormData; rentalId: string | String }
    >(({ request, rentalId }) => {
        return renterService.updateShipTracking(request, rentalId);
    });

export const useAddReview = () =>
    useMutation<AxiosResponse<AddReviewResponse>, AxiosError, AddReviewRequest>(
        data => {
            return renterService.AddReview(data);
        },
    );
