import { AxiosError, AxiosResponse } from 'axios';
import useMutationWithErrorHandler from './useMutationWithErrorHandler';
import { authService } from '../services';
import {
    AppleSignInRequest,
    DefaultResponse,
    GetNewTokenResponse,
    GoogleSignInRequest,
    ResetPasswordRequest,
    SignInRequest,
    SignInResponse,
    SignOutRequest,
    SignUpRequest,
    VerifyForgotPassOTPRequest,
} from '../types';

export const useSignUp = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        SignUpRequest
    >(data => authService.signUp(data));

export const useSignIn = () =>
    useMutationWithErrorHandler<
        AxiosResponse<SignInResponse>,
        AxiosError,
        SignInRequest
    >(data => authService.signIn(data));

export const useGetNewToken = () =>
    useMutationWithErrorHandler<
        AxiosResponse<GetNewTokenResponse>,
        AxiosError,
        void
    >(() => authService.getNewToken());

export const useSignOut = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        SignOutRequest
    >(data => authService.signOut(data));

export const useSendOTPForgotPass = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        { email: string }
    >(data => authService.sendOTPForgotPass(data));

export const useVerifyForgotPassOTP = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        VerifyForgotPassOTPRequest
    >(data => authService.verifyForgotPassOTP(data));

export const useResetPassword = () =>
    useMutationWithErrorHandler<
        AxiosResponse<DefaultResponse>,
        AxiosError,
        ResetPasswordRequest
    >(data => authService.resetPassword(data));

export const useGoogleSignIn = () =>
    useMutationWithErrorHandler<
        AxiosResponse<SignInResponse>,
        AxiosError,
        GoogleSignInRequest
    >(data => authService.googleSignIn(data));

export const useAppleSignIn = () =>
    useMutationWithErrorHandler<
        AxiosResponse<SignInResponse>,
        AxiosError,
        AppleSignInRequest
    >(data => authService.appleSignIn(data));
