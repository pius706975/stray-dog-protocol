import { AxiosResponse } from "axios";
import { DefaultResponse, GetShipFacilityRequest, GetShipFacilityResponse, GetShipLocationsResponse, GetShipSpesificationRequest, GetShipSpesificationResponse, GetUserLocationRequest, GetUserLocationResponse } from "../types";
import httpRequest from "./api";

export const getShipFacilityByShipType= async (request: GetShipFacilityRequest): Promise<
AxiosResponse<GetShipFacilityResponse>> => {
    return await httpRequest.post(`/helper/getShipFacility/${request.shipType}`);
}

export const getShipSpesificationByShipType= async (request: GetShipSpesificationRequest): Promise<
AxiosResponse<GetShipSpesificationResponse>> => {
    return await httpRequest.post(`/helper/getShipSpesification/${request.shipType}`);
}

export const getShipLocations = async (): Promise<
    AxiosResponse<GetShipLocationsResponse>
> => {
    return httpRequest.get('/helper/getShipLocations');
};

export const getUserLocation = async (
    request: GetUserLocationRequest,
): Promise<AxiosResponse<GetUserLocationResponse>> => {
    return httpRequest.get(
        `/ship/get-ship-by-current-location?latitude=${request.latitude}&longitude=${request.longitude}`,
    );
};

export const getHealthCheck = async (): Promise<
    AxiosResponse<DefaultResponse>
> => {
    return await httpRequest.get('/health/health-check');
};