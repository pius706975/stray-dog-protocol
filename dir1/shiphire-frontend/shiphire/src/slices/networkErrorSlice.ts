import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NetworkErrorState } from '../types';

const initialState: NetworkErrorState = {
    isNetworkError: false,
};

const networkErrorSlice = createSlice({
    name: 'networkError',
    initialState,
    reducers: {
        setIsNetworkError: (state, action: PayloadAction<boolean>) => {
            state.isNetworkError = action.payload;
        },
    },
});

export default networkErrorSlice;
