import { AxiosError } from 'axios';

const handleAxiosError = (error: AxiosError) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(
            'error.response.data',
            JSON.stringify(error.response.data, null, 4),
        );
        console.log(
            'error.response.status',
            JSON.stringify(error.response.status, null, 4),
        );
        console.log(
            'error.response.headers',
            JSON.stringify(error.response.headers, null, 4),
        );
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('error.request', JSON.stringify(error.request, null, 4));
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('error.message', JSON.stringify(error.message, null, 4));
    }
    console.log('error.config', JSON.stringify(error.config, null, 4));
};

export default handleAxiosError;
