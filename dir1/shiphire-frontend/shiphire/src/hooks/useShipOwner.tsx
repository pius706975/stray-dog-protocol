import { AxiosResponse, AxiosError } from 'axios';
import useMutationWithErrorHandler from './useMutationWithErrorHandler';
import { shipOwnerService } from '../services';
import {
    DefaultResponse,
    EditShipRequest,
    EditShipResponse,
    SubmitShipRequest,
    SubmitShipResponse,
    GetTopRatedOwnerResponse,
    GetTopRentedOwnerResponse,
    GetOwnerShipsResponse,
    GetRenterDataResponse,
    TransactionResponse,
    AcceptRFQRequest,
    AcceptPaymentRequest,
    GetTransactionByOwner,
    GetRenterUserDataResponse,
    GetTemplateShipRFQFormResponse,
    makeTemplateType,
    RfqFormInputOwnerRequest,
    DynamicInputRFQData,
    dynamicInputRequest,
    RFQInputFormRequest,
    GetDynamicInputRFQByIdResponse,
    GetShipOwnerDataResponse,
    GetDynamicInputRFQByTemplateTypeResponse,
    ActiveDynamicInputRFQRequest,
    ActiveDynamicInputOwnerRequest,
    getTransactionNegoResponse,
    getTransactionNegoOwnerResponse,
    UpdateShipTrackingResponse,
    UpdateShipTrackingRequest,
} from '../types';
import { useMutation } from 'react-query';

export const useGetOwnerShips = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetOwnerShipsResponse>,
        AxiosError,
        void
    >(shipOwnerService.getOwnerShip);

export const useSubmitShip = () =>
    useMutationWithErrorHandler<
        AxiosResponse<SubmitShipResponse>,
        AxiosError,
        SubmitShipRequest
    >(data => {
        return shipOwnerService.submitShip(data);
    });

export const useSubmitContract = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return shipOwnerService.submitContract(data);
    });

export const useDeleteShip = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        string
    >(data => {
        return shipOwnerService.deleteShip(data);
    });

export const useSubmitShipDocument = () =>
    useMutation<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        { request: FormData; shipId: string }
    >(({ request, shipId }) => {
        return shipOwnerService.submitShipDocument(request, shipId);
    });

export const useSubmitShipImage = () =>
    useMutation<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        { request: FormData; shipId: string }
    >(({ request, shipId }) => {
        return shipOwnerService.submitShipImage(request, shipId);
    });

export const useSubmitOwnerCompanyRegister = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return shipOwnerService.submitOwnerCompanyRegister(data);
    });

export const useGetTopRatedOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTopRatedOwnerResponse>,
        AxiosError,
        void
    >(shipOwnerService.topRatedShips);

export const useSubmitProposalOwner = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return shipOwnerService.submitProposalOwner(data);
    });

export const useGetRenterDataByOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetRenterDataResponse>,
        AxiosError,
        string | String
    >(data => {
        return shipOwnerService.getRenterDataById(data);
    });

export const useGetTopRentedOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTopRentedOwnerResponse>,
        AxiosError,
        void
    >(shipOwnerService.topRentedShips);

export const useEditShip = () =>
    useMutationWithErrorHandler<
        AxiosResponse<EditShipResponse>,
        AxiosError,
        EditShipRequest
    >(data => {
        return shipOwnerService.editShip(data);
    });

export const useEditShipImage = () =>
    useMutation<
        AxiosResponse<EditShipResponse>,
        AxiosError,
        { request: FormData; shipId: string }
    >(({ request, shipId }) => {
        return shipOwnerService.editShipImage(request, shipId);
    });

export const useEditShipDocument = () =>
    useMutation<
        AxiosResponse<EditShipResponse>,
        AxiosError,
        { request: FormData; shipId: string }
    >(({ request, shipId }) => {
        return shipOwnerService.editShipDocument(request, shipId);
    });

export const useGetAllOwnerTransaction = () =>
    useMutationWithErrorHandler<
        AxiosResponse<TransactionResponse>,
        AxiosError,
        void
    >(shipOwnerService.getAllOwnerTransaction);

export const useUpdateTransactionAcceptRFQ = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        AcceptRFQRequest
    >(data => {
        return shipOwnerService.updateTransactionAcceptRFQ(data);
    });

export const useAcceptPayment = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        AcceptPaymentRequest
    >(data => {
        return shipOwnerService.updateTransactionAcceptPayment(data);
    });

export const useGetTransactionById = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTransactionByOwner>,
        AxiosError,
        string | String
    >(data => {
        return shipOwnerService.getTransactionByOwner(data);
    });

export const useSubmitTransactionHistory = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return shipOwnerService.submitTransactionHistory(data);
    });

export const useGetRenterUserData = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetRenterUserDataResponse>,
        AxiosError,
        string | String
    >(data => {
        return shipOwnerService.getRenterUserDataById(data);
    });

export const useGetTemplateRfqShipFormByShipCategory = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTemplateShipRFQFormResponse>,
        AxiosError,
        string | String
    >(data => {
        return shipOwnerService.getTemplateShipRfqByShipCategory(data);
    });

export const createTemplateDefaultRFQForm = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTemplateShipRFQFormResponse>,
        AxiosError,
        { request: makeTemplateType; shipId: string | String }
    >(({ request, shipId }) => {
        return shipOwnerService.createTemplateDefaultRFQForm(request, shipId);
    });

export const useAddDynamicInputItemOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        RfqFormInputOwnerRequest
    >(data => {
        return shipOwnerService.addDynamicInputRFQOwner(data);
    });

export const useGetDynamicInputRFQByTemplateTypeOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTemplateShipRFQFormResponse>,
        AxiosError,
        string | String
    >(data => {
        return shipOwnerService.getDynamicInputRFQByTemplateTypeOwner(data);
    });

export const createTemplateCustomRFQForm = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTemplateShipRFQFormResponse>,
        AxiosError,
        { shipId: string | String }
    >(({ shipId }) => {
        return shipOwnerService.createTemplateCustomRFQForm(shipId);
    });

export const useEditRFQDynamicInputOwnerItem = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        RFQInputFormRequest
    >(data => {
        return shipOwnerService.editDynamicInputRFQOwner(data);
    });

export const useGetDynamicInputRFQOwnerById = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetDynamicInputRFQByTemplateTypeResponse>,
        AxiosError,
        string | String
    >(data => {
        return shipOwnerService.getDynamicInputRFQOwnerById(data);
    });

export const useGetShipOwnerData = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetShipOwnerDataResponse>,
        AxiosError,
        void
    >(shipOwnerService.getShipOwnerData);

export const useEditDynamicInputOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        RFQInputFormRequest
    >(data => {
        return shipOwnerService.editDynamicInputRFQOwner(data);
    });

export const useActiveDynamicInputOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        ActiveDynamicInputOwnerRequest
    >(data => {
        return shipOwnerService.activeDynamicInputOwner(data);
    });

export const useSubmitShipPicturesBeforeSailing = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return shipOwnerService.submitShipPicturesBeforeSailing(data);
    });

export const useSubmitShipPicturesAfterSailing = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return shipOwnerService.submitShipPictureAfterSailing(data);
    });

export const useGetTransactionForNegotiateOwner = () =>
    useMutationWithErrorHandler<
        AxiosResponse<getTransactionNegoOwnerResponse>,
        AxiosError,
        string
    >(data => {
        return shipOwnerService.getTransactionNegoOwner(data);
    });

export const useSendNegotiateContractOwner = () =>
    useMutation<AxiosResponse<DefaultResponse>, AxiosError, FormData>(data => {
        return shipOwnerService.sendNegotiateContractOwner(data);
    });

export const useUpdateShipTracking = () =>
    useMutationWithErrorHandler<
        AxiosResponse<UpdateShipTrackingResponse>,
        AxiosError,
        UpdateShipTrackingRequest
    >(data => {
        return shipOwnerService.updateShipTracking(data);
    });
