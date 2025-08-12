import { AxiosResponse } from 'axios';
import { TOKEN, getDataFromLocalStorage } from '../configs';
import {
    AddPhoneNumberRequest,
    DefaultResponse,
    DeleteAccountRequest,
    GetUserNotifResponse,
    GetUserProfileResponse,
    SubmitUserRoleRequest,
    SubmitUserRoleResponse,
} from '../types';
import httpRequest from './api';

export const getUserProfile = async (): Promise<
    AxiosResponse<GetUserProfileResponse>
> => {
    return await getDataFromLocalStorage(TOKEN).then(resp =>
        httpRequest.get('/user/get-user-profile'),
    );
};

export const submitUserRole = async (
    request: SubmitUserRoleRequest,
): Promise<AxiosResponse<SubmitUserRoleResponse>> => {
    return await getDataFromLocalStorage(TOKEN).then(resp =>
        httpRequest.post('/user/submit-user-role', request),
    );
};

export const addPhoneNumber = async (
    request: AddPhoneNumberRequest,
): Promise<AxiosResponse<SubmitUserRoleResponse>> => {
    return await getDataFromLocalStorage(TOKEN).then(resp =>
        httpRequest.post('/user/add-phone-number', request),
    );
};

export const getUserNotif = async (): Promise<
    AxiosResponse<GetUserNotifResponse>
> => {
    return await httpRequest.get('/user/get-notification');
};

export const userOpenNotif = async (request: {
    notifId: string;
}): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/user/open-notification', request);
};

export const userDeleteAccount = async (request: DeleteAccountRequest): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/user/delete-account', request);
}