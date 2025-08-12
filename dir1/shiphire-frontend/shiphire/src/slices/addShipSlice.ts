import { DocumentPickerResponse } from 'react-native-document-picker';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    GeneralFormAddShipRequest,
    AddShipSlice,
    SpecificFormAddShipRequest,
} from '../types';

const initialState: AddShipSlice = {
    name: '',
    desc: '',
    category: '',
    pricePerMonth: '',
    location: '',
    length: '',
    width: '',
    height: '',
    facilities: [],
    specifications: [
        {
            name: '',
            value: '',
        },
    ],
    shipDocument: [
        {
            uri: '',
            name: '',
            fileCopyUri: '',
            type: '',
            size: 0,
            docExpired: undefined,
            label: '',
        },
    ],
};

const addShipSlice = createSlice({
    name: 'addShip',
    initialState,
    reducers: {
        addGeneralData: (
            state,
            action: PayloadAction<GeneralFormAddShipRequest>,
        ) => {
            state.name = action.payload.shipName;
            state.desc = action.payload.shipDescription;
            state.category = action.payload.shipCategory!!;
            state.pricePerMonth = action.payload.rentPrice.toString();
            state.location = action.payload.shipLocation!!;
        },
        addSpesificData: (
            state,
            action: PayloadAction<SpecificFormAddShipRequest>,
        ) => {
            state.length = action.payload.length;
            state.width = action.payload.width;
            state.height = action.payload.height;
            state.facilities = action.payload.facilities;
            state.specifications = action.payload.specifications;
        },
        addDocument: (
            state,
            action: PayloadAction<DocumentPickerResponse & { label: string }>,
        ) => {
            state.shipDocument.push(action.payload);
        },
        removeDocument: state => {
            state.shipDocument = [];
        },
    },
});

export default addShipSlice;
