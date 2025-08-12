import { createSlice } from "@reduxjs/toolkit";
import { ProgressIndicatorState } from "../types";

const initialState: ProgressIndicatorState = {
    visible: false,
};

const progressIndicatorSlice = createSlice({
    name: 'progressIndicator',
    initialState,
    reducers: {
        showProgressIndicator: state => {
            state.visible = true;
        },
        hideProgressIndicator: state => {
            state.visible = false;
        },
    },
});

export default progressIndicatorSlice;