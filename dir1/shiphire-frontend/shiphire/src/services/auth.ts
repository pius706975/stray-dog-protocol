import { AxiosResponse } from 'axios';
import { TOKEN, getDataFromLocalStorage } from '../configs';
import {
    DefaultResponse,
    GetNewTokenResponse,
    GoogleSignInRequest,
    AppleSignInRequest,
    ResetPasswordRequest,
    SignInRequest,
    SignInResponse,
    SignOutRequest,
    SignUpRequest,
    VerifyForgotPassOTPRequest
} from '../types';
import httpRequest from './api';

export const signUp = async (
    request: SignUpRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/auth/signup', request);
};

export const signIn = async (
    request: SignInRequest,
): Promise<AxiosResponse<SignInResponse>> => {
    return await httpRequest.post('/auth/signin', request);
};

export const getNewToken = async (): Promise<
    AxiosResponse<GetNewTokenResponse>
> => {
    return await getDataFromLocalStorage(TOKEN).then(resp =>
        httpRequest.post('/auth/getNewToken', {
            refreshToken: resp.refreshToken,
        }),
    );
};

export const signOut = async (
    request: SignOutRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/auth/signout', request);
};

export const sendOTPForgotPass = async (
    request: { email: string },
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/auth/send-forgot-pass-otp', request);
};

export const verifyForgotPassOTP = async (
    request: VerifyForgotPassOTPRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/auth/verify-forgot-pass-otp', request);
};

export const resetPassword = async (
    request: ResetPasswordRequest,
): Promise<AxiosResponse<DefaultResponse>> => {
    return await httpRequest.post('/auth/reset-password', request);
};

export const googleSignIn = async (
    request: GoogleSignInRequest,
): Promise<AxiosResponse<SignInResponse>> => {
    return await httpRequest.post('/auth/google-sign-in', request);
};

export const appleSignIn = async (
    request: AppleSignInRequest,
): Promise<AxiosResponse<SignInResponse>> => {
    return await httpRequest.post('/auth/apple-sign-in', request);
}
