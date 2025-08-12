import { Axios, AxiosResponse } from 'axios';
import httpRequest from './api';
import {
    GetDynamicFormDataResponse,
    GetPopularShipsResponse,
    GetShipByIdResponse,
    GetAllShipsResponse,
    SearchShipsResponse,
    SearchRequest,
    GetShipCategoriesResponse,
    GetTopRatedShipsResponse,
    DeleteShipHistoryRequest,
    DefaultResponse,
    GetAllShipPending,
    ApproveDeleteShipHistoryRequest,
    EditShipHistoryResponse,
} from '../types';

export const getShipCategories = async (): Promise<
    AxiosResponse<GetShipCategoriesResponse>
> => {
    return await httpRequest.get('/ship/get-ship-categories');
};

export const getTopRatedShips = async (): Promise<
    AxiosResponse<GetTopRatedShipsResponse>
> => {
    return await httpRequest.get('/ship/get-top-rated-ships');
};

export const getPopularShips = async (): Promise<
    AxiosResponse<GetPopularShipsResponse>
> => {
    return await httpRequest.get('/ship/get-popular-ships');
};

export const getShipById = async (
    id: string | String,
): Promise<AxiosResponse<GetShipByIdResponse>> => {
    return await httpRequest.get(`/ship/get-ship-by-id/${id}`);
};

export const getAllShips = async (): Promise<
    AxiosResponse<GetAllShipsResponse>
> => {
    return await httpRequest.get('/ship');
};

export const searchShips = async (
    request: SearchRequest,
): Promise<AxiosResponse<SearchShipsResponse>> => {
    return await httpRequest.get(
        `/ship/search-ship?searchTerm=${request.searchTerm}&category=${request.category}&city=${request.city}&province=${request.province}&latitude=${request.latitude}&longitude=${request.longitude}&inputRentStartDate=${request.inputRentStartDate}&inputRentEndDate=${request.inputRentEndDate}`,
    );
};

export const getShipRFQForm = async (
    id: string | String,
): Promise<AxiosResponse<GetDynamicFormDataResponse>> => {
    return await httpRequest.get(`/ship/get-ship-rfq-form/${id}`);
};

export const deleteShipHistory = async (
    request: DeleteShipHistoryRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(`/ship/delete-ship-history`, request);
};

export const getAllShipHistoryPending = async (): Promise<
    AxiosResponse<GetAllShipPending>
> => {
    return await httpRequest.get(`/ship/get-ship-history-pending`);
};

export const approveDeleteShipHistory = async (
    request: ApproveDeleteShipHistoryRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post(
        `/admin/approve-delete-ship-history`,
        request,
    );
};

export const editShipHistory = async (
    request: FormData,
    id: string,
): Promise<AxiosResponse<EditShipHistoryResponse>> => {
    return await httpRequest.post(`/ship/edit-ship-history/${id}`, request, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};