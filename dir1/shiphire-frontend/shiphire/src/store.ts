import { configureStore } from '@reduxjs/toolkit';
import {
    addShipSlice,
    documentNameSlice,
    modalSlice,
    networkErrorSlice,
    notifBadgeSlice,
    progressIndicatorSlice,
    renterPreferenceSlice,
    requestForQuoteSlice,
    shipSpecSlice,
    termsStatusSlice,
    userLanguageSlice,
    userLocationSlice,
    userStatusSlice,
} from './slices';

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        progressIndicator: progressIndicatorSlice.reducer,
        renterPreference: renterPreferenceSlice.reducer,
        requestForQuote: requestForQuoteSlice.reducer,
        userStatus: userStatusSlice.reducer,
        addShip: addShipSlice.reducer,
        documentName: documentNameSlice.reducer,
        termsStatus: termsStatusSlice.reducer,
        userLanguage: userLanguageSlice.reducer,
        userLocation: userLocationSlice.reducer,
        shipSpecSlice: shipSpecSlice.reducer,
        notifBadgeSlice: notifBadgeSlice.reducer,
        networkError: networkErrorSlice.reducer,
    },
});

export default store;
