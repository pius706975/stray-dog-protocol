import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserCoordinates, IUserLocation, UserLocationState } from '../types';

const initialState: UserLocationState = {
    userLocation: {
        city: '',
        province: '',
    },
    userCoordinates: {
        latitude: '',
        longitude: '',
    },
};

const userLocationSlice = createSlice({
    name: 'userLocation',
    initialState,
    reducers: {
        setUserLocation: (state, action: PayloadAction<IUserLocation>) => {
            state.userLocation = action.payload;
        },
        setUserCoordinates: (
            state,
            action: PayloadAction<IUserCoordinates>,
        ) => {
            state.userCoordinates = action.payload;
        },
    },
});

export default userLocationSlice;
