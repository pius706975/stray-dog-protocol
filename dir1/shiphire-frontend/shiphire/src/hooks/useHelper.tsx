import { AxiosError, AxiosResponse } from 'axios';
import useMutationWithErrorHandler from './useMutationWithErrorHandler';
import { helperService } from '../services';
import {
    DefaultResponse,
    GetShipFacilityRequest,
    GetShipFacilityResponse,
    GetShipLocationsResponse,
    GetShipSpesificationRequest,
    GetShipSpesificationResponse,
    GetUserLocationRequest,
    GetUserLocationResponse,
} from '../types';

export const useGetShipFacility = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetShipFacilityResponse>,
        AxiosError,
        GetShipFacilityRequest
    >(data => {
        return helperService.getShipFacilityByShipType(data);
    });

export const useGetShipSpesification = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetShipSpesificationResponse>,
        AxiosError,
        GetShipSpesificationRequest
    >(data => {
        return helperService.getShipSpesificationByShipType(data);
    });

export const useGetShipLocations = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetShipLocationsResponse>,
        AxiosError,
        void
    >(helperService.getShipLocations);

export const useGetUserLocation = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetUserLocationResponse>,
        AxiosError,
        GetUserLocationRequest
    >(data => {
        return helperService.getUserLocation(data);
    });

export const useGetHealthCheck = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        void
    >(helperService.getHealthCheck);
