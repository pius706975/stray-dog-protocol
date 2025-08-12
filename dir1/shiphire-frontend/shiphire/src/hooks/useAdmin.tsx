import { AxiosError, AxiosResponse } from 'axios';
import useMutationWithErrorHandler from './useMutationWithErrorHandler';
import { adminService } from '../services';
import {
    ActiveDynamicFormRFQRequest,
    ActiveDynamicInputRFQRequest,
    AddRFQTemplateRequest,
    AddShipDropdownInputRequest,
    AddShipDynamicInputRequest,
    AddShipDynamicInputResponse,
    AddShipInputResponse,
    ApprovedShipRequest,
    DefaultResponse,
    GetAllTemplateRFQFormResponse,
    GetDynamicInputRFQByIdResponse,
    GetDynamicInputRFQByTemplateTypeResponse,
    RFQInputFormRequest,
    DynamicInputAddShipActivation,
    GetAddShipDynamicInputRequest,
    GetAddShipDynamicInputResponse,
    GetAllUserResponse,
    GetAllUserTransactions,
    GetDynamicFormDataResponse,
    GetSelectDropDownResponse,
    GetShipSpecificationResponse,
    RemoveItemDropdownRequest,
    TransactionResponse,
    UpdateDynamicFormAddShip,
    UpdateInputAddShipOrderRequest,
    UpdateUserActivationResponse,
    UserActivation,
    GetCompanies,
    VerifyUserPhoneNumberRequest,
    VerifyUserPhoneNumberResponse,
    UpdateFirebaseTokenRequest,
} from '../types';

export const useGetAllUserTransactions = () =>
    useMutationWithErrorHandler<
        AxiosResponse<TransactionResponse>,
        AxiosError,
        GetAllUserTransactions
    >(data => adminService.useGetAllUserTransactions(data));

export const useGetAddShipDynamicForm = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetDynamicFormDataResponse>,
        AxiosError,
        void
    >(() => adminService.getAddShipDynamicForm());

export const useGetAllUser = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetAllUserResponse>,
        AxiosError,
        void
    >(() => adminService.getAllUser());

export const useUpdateUserActivation = () =>
    useMutationWithErrorHandler<
        AxiosResponse<UpdateUserActivationResponse>,
        AxiosError,
        UserActivation
    >(data => {
        return adminService.updateActiveUser(data);
    });

export const useVerifyUserPhoneNumber = () =>
    useMutationWithErrorHandler<
        AxiosResponse<VerifyUserPhoneNumberResponse>,
        AxiosError,
        VerifyUserPhoneNumberRequest
    >(data => {
        return adminService.verifyUserPhoneNumber(data);
    });

export const useApproveShip = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        ApprovedShipRequest
    >(data => adminService.approvedShip(data));

export const useUnapproveShip = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        ApprovedShipRequest
    >(data => adminService.unapprovedShip(data));

export const useGetDynamicInputRFQByTemplateType = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetDynamicInputRFQByTemplateTypeResponse>,
        AxiosError,
        string | String
    >(data => adminService.getDynamicInputRFQByTemplateType(data));

export const useAddDynamicInputItem = () =>
    useMutationWithErrorHandler<
        AxiosResponse<AddShipDynamicInputResponse>,
        AxiosError,
        AddShipDynamicInputRequest
    >(data => adminService.addDynamicInputAddShip(data));

export const useAddDynamicInputDropDownItem = () =>
    useMutationWithErrorHandler<
        AxiosResponse<AddShipInputResponse>,
        AxiosError,
        AddShipDropdownInputRequest
    >(data => adminService.addDynamicInputDropDownItem(data));

export const useRemoveItemDropdownDynamicInput = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        RemoveItemDropdownRequest
    >(data => adminService.removeItemDropdown(data));

export const useGetAllTemplateRFQForm = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetAllTemplateRFQFormResponse>,
        AxiosError,
        void
    >(() => adminService.getAllTemplateRFQForm());

export const useAddRfqTemplate = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        AddRFQTemplateRequest
    >(data => adminService.addRfqTemplate(data));

export const useAddRFQDynamicInputItem = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        RFQInputFormRequest
    >(data => adminService.addDynamicInputAddRFQ(data));

export const useActiveDynamicInput = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        ActiveDynamicInputRFQRequest
    >(data => adminService.activeDynamicInputRFQ(data));

export const useGetDynamicInputRFQById = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetDynamicInputRFQByIdResponse>,
        AxiosError,
        string | String
    >(data => adminService.getDynamicInputRFQById(data));

export const useEditRFQDynamicInputItem = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        RFQInputFormRequest
    >(data => adminService.editDynamicInputRFQ(data));

export const useActiveDynamicForm = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        ActiveDynamicFormRFQRequest
    >(data => adminService.activeDynamicFormRFQ(data));

export const useGetAddShipDynamicInputByTemplateName = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetAddShipDynamicInputResponse>,
        AxiosError,
        GetAddShipDynamicInputRequest
    >(data => adminService.getAddShipDynamicInputByTemplateName(data));

export const useGetSelectDropDownInput = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetSelectDropDownResponse>,
        AxiosError,
        GetAddShipDynamicInputRequest
    >(data => adminService.getSelectDropdownInput(data));

export const useGetShipSpecification = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetShipSpecificationResponse>,
        AxiosError,
        void
    >(() => adminService.getShipSpect());

export const useUpdateDynamicInputAddShipActivation = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        DynamicInputAddShipActivation
    >(data => adminService.updateInputAddShipActivation(data));

export const useUpdateDynamicInputAddShip = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        UpdateDynamicFormAddShip
    >(data => adminService.updateDynamicInputAddShip(data));

export const useUpdateDynamicInputAddShipOrder = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        UpdateInputAddShipOrderRequest
    >(data => adminService.updateInputAddShipOrder(data));

export const useDeleteShipSpectAddShip = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        GetAddShipDynamicInputRequest
    >(data => adminService.deleteShipSpectAddShip(data));

export const useGetCompany = () =>
    useMutationWithErrorHandler<AxiosResponse<GetCompanies>, AxiosError, void>(
        () => adminService.getCompanies(),
    );

export const useRejectCompany = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        { id: string | undefined; role: string }
    >(data => adminService.rejectCompany(data));

export const useApproveCompany = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        { id: string | undefined; role: string; verified: boolean }
    >(data => {
        return adminService.approveCompany(data);
    });

export const useUpdateFirebaseToken = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        UpdateFirebaseTokenRequest
    >(data => {
        return adminService.updateFirebaseToken(data);
    });
