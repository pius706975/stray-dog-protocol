import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestForQuoteSlice } from '../types';

const initialState: RequestForQuoteSlice = {
  requestForQuoteData: []
};

const requestForQuoteSlice = createSlice({
  name: 'requestForQuote',
  initialState,
  reducers: {
    addRequestForQuote: (state, action: PayloadAction<any>) => {
      state.requestForQuoteData.push(action.payload);
      console.log("add requestForQuoteData", state.requestForQuoteData)
    },
    removeRequestForQuote: (state, action: PayloadAction<number>) => {
      state.requestForQuoteData.splice(action.payload, 1);
      console.log("delete requestForQuoteData", state.requestForQuoteData)
    },
  },
});

export default requestForQuoteSlice;