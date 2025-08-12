import { AxiosError, AxiosResponse } from 'axios';
import useMutationWithErrorHandler from './useMutationWithErrorHandler';
import { userService } from '../services';
import {
    AddPhoneNumberRequest,
    DefaultResponse,
    DeleteAccountRequest,
    GetUserNotifResponse,
    GetUserProfileResponse,
    SubmitUserRoleRequest,
    SubmitUserRoleResponse,
} from '../types';

export const useGetUserProfile = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetUserProfileResponse>,
        AxiosError,
        void
    >(userService.getUserProfile);

export const useSubmitUserRole = () =>
    useMutationWithErrorHandler<
        AxiosResponse<SubmitUserRoleResponse>,
        AxiosError,
        SubmitUserRoleRequest
    >(data => {
        return userService.submitUserRole(data);
    });

export const addPhoneNumber = () =>
    useMutationWithErrorHandler<
        AxiosResponse<any>,
        AxiosError,
        AddPhoneNumberRequest
    >(data => {
        return userService.addPhoneNumber(data);
    });

export const useGetUserNotif = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetUserNotifResponse>,
        AxiosError,
        void
    >(userService.getUserNotif);

export const useUserOpenNotif = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        { notifId: string }
    >(data => {
        return userService.userOpenNotif(data);
    });

export const useUserDeleteAccount = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        DeleteAccountRequest
    >(data => {
        return userService.userDeleteAccount(data);
    });
