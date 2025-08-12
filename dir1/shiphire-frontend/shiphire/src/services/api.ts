import axios from 'axios';
import Config from 'react-native-config';
import {
    TOKEN,
    getDataFromLocalStorage,
    removeDataToLocalStorage,
    setDataToLocalStorage,
} from '../configs';
import { authService } from '.';
import { handleAxiosError } from '../utils';

const httpRequest = axios.create({
    baseURL: Config.BASE_URL,
});

httpRequest.interceptors.request.use(
    async config => {
        const resp = await getDataFromLocalStorage(TOKEN);
        if (resp) {
            config.headers.authorization = `Bearer ${resp.accessToken}`;
        }
        return config;
    },
    error => {
        return handleAxiosError(error);
    },
);

httpRequest.interceptors.response.use(
    async response => {
        return response;
    },
    async error => {
        console.log('error', error);
        handleAxiosError(error);
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await authService.getNewToken();
                if (res.data.refreshToken) {
                    await removeDataToLocalStorage(TOKEN);
                    await setDataToLocalStorage(TOKEN, {
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                    });
                } else {
                    await getDataFromLocalStorage(TOKEN).then(resp => {
                        setDataToLocalStorage(TOKEN, {
                            accessToken: res.data.accessToken,
                            refreshToken: resp.refreshToken,
                        });
                    });
                }

                const resp = await getDataFromLocalStorage(TOKEN);

                originalRequest.headers.authorization = `Bearer ${resp.accessToken}`;
                const test = axios(originalRequest);

                return test;
            } catch (error) {
                // Handle error here
            }
        }

        return Promise.reject(error);
    },
);

export default httpRequest;
