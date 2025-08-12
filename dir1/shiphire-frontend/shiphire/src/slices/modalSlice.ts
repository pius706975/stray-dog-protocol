import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState } from '../types';

const initialState: ModalState = {
    visible: false,
    status: undefined,
    text: '',
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showModal: (
            state,
            action: PayloadAction<{
                status: 'success' | 'failed' | 'info';
                text: string;
            }>,
        ) => {
            state.visible = true;
            state.status = action.payload.status;
            state.text = action.payload.text;
        },
        hideModal: state => {
            state.visible = false;
            state.status = undefined;
            state.text = "";
        },
    },
});

export default modalSlice;
