import { getDynamicInputRFQByTemplateType } from './admin';
import { getAllTransaction } from './renter';
import {
    AcceptPaymentRequest,
    AcceptRFQRequest,
    AddTransactionHistoryRequest,
    EditShipResponse,
    TransactionResponse,
    GetOwnerShipsResponse,
    GetTransactionByOwner,
    GetRenterUserDataResponse,
    GetTemplateShipRFQFormResponse,
    makeTemplateType,
    RfqFormInputOwnerRequest,
    RfqFormRequest,
    dynamicInputRequest,
    DynamicInputRFQData,
    RfqFormDropdownInputRequest,
    GetDynamicInputRFQByIdResponse,
    GetShipOwnerDataResponse,
    GetDynamicInputRFQByIdRFQ,
    GetDynamicInputRFQByTemplateTypeResponse,
    ActiveDynamicInputRFQRequest,
    ActiveDynamicInputOwnerRequest,
    getTransactionNegoResponse,
    sendContractNego,
    getTransactionNegoOwnerResponse,
    UpdateShipTrackingResponse,
    UpdateShipTrackingRequest,
} from './../types/Services';
import { AxiosResponse } from 'axios';
import {
    DefaultResponse,
    EditShipRequest,
    SubmitShipRequest,
    SubmitShipResponse,
    GetTopRentedOwnerResponse,
    GetTopRatedOwnerResponse,
    GetRenterDataResponse,
} from '../types';
import httpRequest from './api';

export const getOwnerShip = async (): Promise<
    AxiosResponse<GetOwnerShipsResponse>
> => {
    return await httpRequest.get('/ship-owner/get-ships');
};

export const submitShip = async (
    request: SubmitShipRequest,
): Promise<AxiosResponse<SubmitShipResponse>> => {
    return await httpRequest.post('/ship-owner/submit-ship', request);
};

export const submitContract = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/ship-owner/submit-contract', request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const submitShipDocument = async (
    request: FormData,
    shipId: string,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/document-upload/submit-ship-document/${shipId}`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const submitShipImage = async (
    request: FormData,
    shipId: string,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/document-upload/submit-ship-image/${shipId}`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const deleteShip = async (
    shipId: string,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.delete(`/ship-owner/delete-ship/${shipId}`);
};

export const submitOwnerCompanyRegister = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        'ship-owner/submit-owner-company-profile',
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const topRatedShips = async (): Promise<
    AxiosResponse<GetTopRatedOwnerResponse>
> => {
    return await httpRequest.get(`/ship-owner/get-top-rated-ships`);
};

export const topRentedShips = async (): Promise<
    AxiosResponse<GetTopRentedOwnerResponse>
> => {
    return await httpRequest.get(`/ship-owner/get-top-rented-ships`);
};

export const submitProposalOwner = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/ship-owner/submit-proposal', request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getRenterDataById = async (
    id: string | String,
): Promise<AxiosResponse<GetRenterDataResponse>> => {
    return await httpRequest.get(`/ship-owner/get-renter-data/${id}`);
};

export const editShip = async (
    request: EditShipRequest,
): Promise<AxiosResponse<EditShipResponse>> => {
    return await httpRequest.post(
        `/ship-owner/edit-ship-information/${request.shipId}`,
        request,
    );
};

export const editShipImage = async (
    request: FormData,
    shipId: string,
): Promise<AxiosResponse<EditShipResponse>> => {
    return await httpRequest.post(
        `/ship-owner/edit-ship-image/${shipId}`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const editShipDocument = async (
    request: FormData,
    shipId: string,
): Promise<AxiosResponse<EditShipResponse>> => {
    return await httpRequest.post(
        `/ship-owner/edit-ship-document/${shipId}`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const getAllOwnerTransaction = async (): Promise<
    AxiosResponse<TransactionResponse>
> => {
    return await httpRequest.get(`/ship-owner/get-all-transaction`);
};

export const updateTransactionAcceptRFQ = async (
    request: AcceptRFQRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/ship-owner/update-transaction/accept-rfq`,
        request,
    );
};

export const updateTransactionAcceptPayment = async (
    request: AcceptPaymentRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`/ship-owner/approve-payment`, request);
};

export const getTransactionByOwner = async (
    rentalId: string | String,
): Promise<AxiosResponse<GetTransactionByOwner>> => {
    return await httpRequest.get(
        `/ship-owner/get-transaction-by-id/${rentalId}`,
    );
};

export const submitTransactionHistory = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`/ship-owner/add-ship-history`, request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getRenterUserDataById = async (
    id: string | String,
): Promise<AxiosResponse<GetRenterUserDataResponse>> => {
    return await httpRequest.get(`/ship-owner/get-renter-user-data/${id}`);
};

export const getTemplateShipRfqByShipCategory = async (
    shipCategory: string | String,
): Promise<AxiosResponse<GetTemplateShipRFQFormResponse>> => {
    return await httpRequest.get(
        `/ship-owner/get-template-ship-rfq-form/${shipCategory}`,
    );
};

export const createTemplateDefaultRFQForm = async (
    request: makeTemplateType,
    shipId: string | String,
): Promise<AxiosResponse<GetTemplateShipRFQFormResponse>> => {
    return await httpRequest.post(
        `/ship-owner/create-template-default-rfq-form/${shipId}`,
        request,
    );
};

export const addDynamicInputRFQOwner = async (
    request: RfqFormInputOwnerRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`/ship-owner/add-dynamic-input-rfq`, request);
};

export const getDynamicInputRFQByTemplateTypeOwner = async (
    shipId: string | String,
): Promise<AxiosResponse<GetTemplateShipRFQFormResponse>> => {
    return await httpRequest.get(
        `/ship-owner/get-dynamic-input-rfq-by-ship-id/${shipId}`,
    );
};

export const createTemplateCustomRFQForm = async (
    shipId: string | String,
): Promise<AxiosResponse<GetTemplateShipRFQFormResponse>> => {
    return await httpRequest.post(
        `/ship-owner/create-template-custom-rfq-form/${shipId}`,
    );
};

export const editDynamicInputRFQOwner = async (
    request: RfqFormDropdownInputRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/ship-owner/edit-dynamic-input-form/${request.id}`,
        request,
    );
};

export const getDynamicInputRFQOwnerById = async (
    _id: string | String,
): Promise<AxiosResponse<GetDynamicInputRFQByTemplateTypeResponse>> => {
    return await httpRequest.get(
        `/ship-owner/get-dynamic-input-form-by-id/${_id}`,
    );
};
export const getShipOwnerData = async (): Promise<
    AxiosResponse<GetShipOwnerDataResponse>
> => {
    return await httpRequest.get(`/ship-owner/get-ship-owner-data`);
};

export const editDynamicInputRFQ = async (
    request: RfqFormDropdownInputRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/ship-owner/edit-dynamic-input-rfq-owner/${request.id}`,
        request,
    );
};

export const activeDynamicInputOwner = async (
    request: ActiveDynamicInputOwnerRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `ship-owner/activate-dynamic-input-form/${request._id}`,
        request,
    )
}

export const submitShipPicturesBeforeSailing = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/ship-owner/submit-ship-pictures-before-sailing`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const submitShipPictureAfterSailing = async (
    request: FormData,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/ship-owner/submit-ship-pictures-after-sailing`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const getTransactionNegoOwner = async (
    transactionId: string,
): Promise<AxiosResponse<getTransactionNegoOwnerResponse>> => {
    return await httpRequest.get(
        `/ship-owner/get-transaction-for-negotiate/${transactionId}`,
    );
};

export const sendNegotiateContractOwner = async (
    request: FormData,
): Promise<AxiosResponse<sendContractNego>> => {
    return await httpRequest.post(
        `/ship-owner/submit-negotiate-contract`,
        request,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

export const updateShipTracking = async (
    request: UpdateShipTrackingRequest,
): Promise<AxiosResponse<UpdateShipTrackingResponse>> => {
    return await httpRequest.post(
        `/ship-owner/update-tracking/${request.rentalId}`,
        request,
    );
};
