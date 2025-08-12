import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotifBadgeSlice } from '../types';

const initialState: NotifBadgeSlice = {
    totalNotif: 0,
};

const notifBadgeSlice = createSlice({
    name: 'notifBadgeSlice',
    initialState,
    reducers: {
        addNotifBadge: (state, action: PayloadAction<number>) => {
            state.totalNotif = action.payload;
        },
    },
});

export default notifBadgeSlice;
