import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RenterPreferenceSlice } from '../types';

const initialState: RenterPreferenceSlice = {
  renterPreference: []
};

const renterPreferenceSlice = createSlice({
  name: 'renterPreference',
  initialState,
  reducers: {
    addRenterPreference: (state, action: PayloadAction<string>) => {
      state.renterPreference.push(action.payload);
    },
    removeRenterPreference: (state, action: PayloadAction<number>) => {
      state.renterPreference.splice(action.payload, 1);
    },
  },
});

export default renterPreferenceSlice;