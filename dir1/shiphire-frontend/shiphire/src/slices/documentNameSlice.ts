import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentNameState } from '../types';

const initialState: DocumentNameState = {
    text: 'Document',
};

const documentNameSlice = createSlice({
    name: 'documentName',
    initialState,
    reducers: {
        setDocumentScreenName: (
            state,
            action: PayloadAction<{
                text: string;
            }>,
        ) => {
            state.text = action.payload.text;
        },
    },
});

export default documentNameSlice;
