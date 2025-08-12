import { createSlice } from "@reduxjs/toolkit";
import { ProgressIndicatorState, TermsStatusState } from "../types";

const initialState: TermsStatusState = {
    status: false,
};

const termsStatusSlice = createSlice({
    name: 'termsStatus',
    initialState,
    reducers: {
        checkTermsStatus: state => {
            state.status = !state.status;
        },
        restartTermsStatus: state =>{
            state.status = false
        }
    },
});

export default termsStatusSlice;