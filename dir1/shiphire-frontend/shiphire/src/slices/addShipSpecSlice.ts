import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSpecStateSlice } from '../types';

const initialState: ShipSpecStateSlice = {
    shipSpecSlice: [],
};

const shipSpecSlice = createSlice({
    name: 'shipSpecSlice',
    initialState,
    reducers: {
        addShipSpecs: (state, action: PayloadAction<string[]>) => {
            state.shipSpecSlice = action.payload;
        },
        removeShipSpecs: (state, action: PayloadAction<number>) => {
            state.shipSpecSlice.splice(action.payload, 1);
        },
    },
});

export default shipSpecSlice;
