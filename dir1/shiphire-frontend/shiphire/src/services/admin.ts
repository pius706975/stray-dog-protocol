import { AxiosResponse } from 'axios';
import httpRequest from './api';
import {
    AddShipDropdownInputRequest,
    AddShipDynamicInputResponse,
    AddShipInputResponse,
    ApprovedShipRequest,
    DefaultResponse,
    DynamicInputAddShipActivation,
    GetAddShipDynamicInputRequest,
    GetAddShipDynamicInputResponse,
    GetAllUserResponse,
    GetAllUserTransactions,
    GetDynamicFormDataResponse,
    GetSelectDropDownResponse,
    GetShipSpecificationResponse,
    GetDynamicInputRFQByTemplateTypeResponse,
    RemoveItemDropdownRequest,
    TransactionResponse,
    UpdateDynamicFormAddShip,
    UpdateInputAddShipOrderRequest,
    UpdateUserActivationResponse,
    UserActivation,
    GetAllTemplateRFQFormResponse,
    AddRFQTemplateRequest,
    RfqFormDropdownInputRequest,
    ActiveDynamicInputRFQRequest,
    GetDynamicInputRFQByIdResponse,
    ActiveDynamicFormRFQRequest,
    GetCompanies,
    VerifyUserPhoneNumberRequest,
    VerifyUserPhoneNumberResponse,
    UpdateFirebaseTokenRequest,
} from '../types';

export const getAddShipDynamicForm = async (): Promise<
    AxiosResponse<GetDynamicFormDataResponse>
> => {
    return httpRequest.get('/ship-owner/get-add-ship-dynamic-form');
};

export const useGetAllUserTransactions = async (
    data: GetAllUserTransactions,
): Promise<AxiosResponse<TransactionResponse>> => {
    return await httpRequest.get(
        `/admin/get-all-user-transaction/?page=${data.page}&limit=${data.limit}&query=${data.query}`,
    );
};
export const getAllUser = async (): Promise<
    AxiosResponse<GetAllUserResponse>
> => {
    return await httpRequest.get(`/admin/get-list-user`);
};

export const updateActiveUser = async (
    request: UserActivation,
): Promise<AxiosResponse<UpdateUserActivationResponse>> => {
    return await httpRequest.post(`/admin/activate-user`, request);
};

export const verifyUserPhoneNumber = async (
    request: VerifyUserPhoneNumberRequest,
): Promise<AxiosResponse<VerifyUserPhoneNumberResponse>> => {
    return await httpRequest.post(`/admin/verify-user-phone-number`, request);
};

export const approvedShip = async (
    request: ApprovedShipRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`/admin/ship-approved`, request);
};

export const unapprovedShip = async (
    request: ApprovedShipRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`/admin/unapprove-ship`, request);
};

export const getDynamicInputRFQByTemplateType = async (
    templateType: string | String,
): Promise<AxiosResponse<GetDynamicInputRFQByTemplateTypeResponse>> => {
    return await httpRequest.get(
        `/admin/get-dynamic-input-rfq-form/${templateType}`,
    );
};

export const addDynamicInputAddShip = async (
    request: AddShipDropdownInputRequest,
): Promise<AxiosResponse<AddShipDynamicInputResponse>> => {
    return await httpRequest.post(`admin/add-dynamic-input-add-ship`, request);
};
export const addDynamicInputDropDownItem = async (
    request: AddShipDropdownInputRequest,
): Promise<AxiosResponse<AddShipInputResponse>> => {
    return await httpRequest.post(
        `admin/add-dynamic-input-drop-down-add-ship`,
        request,
    );
};
export const removeItemDropdown = async (
    request: RemoveItemDropdownRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `admin/delete-item-dropdown-dynamic-input`,
        request,
    );
};

export const getAllTemplateRFQForm = async (): Promise<
    AxiosResponse<GetAllTemplateRFQFormResponse>
> => {
    return await httpRequest.get(`/admin/get-all-template-rfq-forms`);
};

export const addRfqTemplate = async (
    request: AddRFQTemplateRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`/admin/create-template-rfq-form`, request);
};

export const addDynamicInputAddRFQ = async (
    request: RfqFormDropdownInputRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`admin/add-dynamic-input-rfq-form`, request);
};

export const activeDynamicInputRFQ = async (
    request: ActiveDynamicInputRFQRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`admin/active-dynamic-input-rfq`, request);
};

export const getDynamicInputRFQById = async (
    id: string | String,
): Promise<AxiosResponse<GetDynamicInputRFQByIdResponse>> => {
    return await httpRequest.get(`/admin/get-dynamic-input-rfq/${id}`);
};

export const editDynamicInputRFQ = async (
    request: RfqFormDropdownInputRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `admin/edit-dynamic-input-rfq/${request.id}`,
        request,
    );
};

export const activeDynamicFormRFQ = async (
    request: ActiveDynamicFormRFQRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`admin/active-dynamic-form-rfq`, request);
};
export const getAddShipDynamicInputByTemplateName = async (
    request: GetAddShipDynamicInputRequest,
): Promise<AxiosResponse<GetAddShipDynamicInputResponse>> => {
    return await httpRequest.get(
        `admin/get-dynamic-input-add-ship/${request.templateType}`,
    );
};
export const getShipSpect = async (): Promise<
    AxiosResponse<GetShipSpecificationResponse>
> => {
    return await httpRequest.get(`admin/get-ship-spect/`);
};
export const updateInputAddShipActivation = async (
    request: DynamicInputAddShipActivation,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `admin/activate-dynamic-input-add-ship`,
        request,
    );
};
export const getSelectDropdownInput = async (
    request: GetAddShipDynamicInputRequest,
): Promise<AxiosResponse<GetSelectDropDownResponse>> => {
    return await httpRequest.get(
        `admin/get-select-dropdown-input/${request.templateType}`,
    );
};
export const updateDynamicInputAddShip = async (
    request: UpdateDynamicFormAddShip,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `admin/edit-dynamic-input-add-ship/${request.id}`,
        request,
    );
};
export const updateInputAddShipOrder = async (
    request: UpdateInputAddShipOrderRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `admin/edit-dynamic-input-add-ship-order`,
        request,
    );
};
export const deleteShipSpectAddShip = async (
    request: GetAddShipDynamicInputRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `admin/delete-specific-categories-add-ship`,
        request,
    );
};

export const getCompanies = async (): Promise<AxiosResponse<GetCompanies>> => {
    return await httpRequest.get(`admin/get-companies`);
};
export const rejectCompany = async (request: {
    id: string | undefined;
    role: string;
}): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`admin/rejected-company`, request);
};
export const approveCompany = async (request: {
    id: string | undefined;
    role: string;
    verified: boolean;
}): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`admin/activate-company`, request);
};

export const updateFirebaseToken = async (
    request: UpdateFirebaseTokenRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `admin/update-firebase-token`,
        request,
    );
};