import { AxiosError, AxiosResponse } from 'axios';
import useMutationWithErrorHandler from './useMutationWithErrorHandler';
import { shipService } from '../services';
import {
    GetDynamicFormDataResponse,
    GetPopularShipsResponse,
    GetShipByIdResponse,
    GetAllShipsResponse,
    SearchShipsResponse,
    SearchRequest,
    GetShipCategoriesResponse,
    GetTopRatedShipsResponse,
    DefaultResponse,
    DeleteShipHistoryRequest,
    GetAllShipPending,
    ApproveDeleteShipHistoryRequest,
    EditShipHistoryResponse,
} from '../types';
import { useMutation } from 'react-query';

export const useGetShipCategories = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetShipCategoriesResponse>,
        AxiosError,
        void
    >(shipService.getShipCategories);

export const useGetTopRatedShips = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetTopRatedShipsResponse>,
        AxiosError,
        void
    >(shipService.getTopRatedShips);

export const useGetPopularShips = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetPopularShipsResponse>,
        AxiosError,
        void
    >(shipService.getPopularShips);

export const useGetShipById = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetShipByIdResponse>,
        AxiosError,
        string | String
    >(data => {
        return shipService.getShipById(data);
    });

export const useGetAllShips = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetAllShipsResponse>,
        AxiosError,
        void
    >(shipService.getAllShips);

export const useGetSearch = () =>
    useMutationWithErrorHandler<
        AxiosResponse<SearchShipsResponse>,
        AxiosError,
        SearchRequest
    >(data => {
        return shipService.searchShips(data);
    });

export const useGetShipRFQForm = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetDynamicFormDataResponse>,
        AxiosError,
        string | String
    >(data => {
        return shipService.getShipRFQForm(data);
    });

export const useDeleteShipHistory = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        DeleteShipHistoryRequest
    >(data => {
        return shipService.deleteShipHistory(data);
    });

export const useGetAllShipsHistoryPending = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetAllShipPending>,
        AxiosError,
        void
    >(shipService.getAllShipHistoryPending);

export const useApproveDeleteShipHistory = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        ApproveDeleteShipHistoryRequest
    >(data => {
        return shipService.approveDeleteShipHistory(data);
    });

export const useEditShipHistory = () =>
    useMutation<
        AxiosResponse<EditShipHistoryResponse>,
        AxiosError,
        { request: FormData; id: string }
    >(({ request, id }) => {
        return shipService.editShipHistory(request, id);
    });
