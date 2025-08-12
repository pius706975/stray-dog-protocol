import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserLanguageState } from '../types';

const initialState: UserLanguageState = {
    language: '',
};

const userLanguageSlice = createSlice({
    name: 'userLanguage',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
    },
});

export default userLanguageSlice;
