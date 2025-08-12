import { DocumentPickerResponse } from 'react-native-document-picker';
import store from '../store';

export interface ModalState {
    visible: boolean;
    status: 'success' | 'failed' | 'info' | undefined;
    text: string;
}

export interface ProgressIndicatorState {
    visible: boolean;
}

export interface RenterPreferenceSlice {
    renterPreference: string[];
}

export interface RequestForQuoteSlice {
    requestForQuoteData: any[];
}

export interface AddShipSlice {
    name: string;
    desc: string;
    category: string;
    pricePerMonth: string;
    location: string;
    length: string;
    width: string;
    height: string;
    facilities?: (string | undefined)[];
    specifications?: { name: string; value: string }[];
    shipDocument: {
        uri: string;
        name: string | null;
        copyError?: string | undefined;
        fileCopyUri: string | null;
        type: string | null;
        size: number | null;
        label: string;
        docExpired?: string | undefined;
    }[];
}

export interface UserStatusState {
    isLoggedIn: boolean;
    isRoleSubmitted: boolean;
    isPreferencesSubmitted: boolean;
    isOwner: boolean;
    isCompanySubmitted: boolean;
    isAdmin: boolean;
    isCompanyVerif: boolean;
    isCompanyReject: boolean;
    isGoogleSignIn: boolean;
}

export interface DocumentNameState {
    text: string;
}

export interface TermsStatusState {
    status: boolean;
}

export interface UserLanguageState {
    language: string;
}

export interface IUserLocation {
    city: string;
    province: string;
}

export interface IUserCoordinates {
    latitude: string;
    longitude: string;
}

export interface UserLocationState {
    userLocation: IUserLocation;
    userCoordinates: IUserCoordinates;
}

export interface ShipSpecStateSlice {
    shipSpecSlice: string[];
}

export interface NotifBadgeSlice {
    totalNotif: number;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface NetworkErrorState {
    isNetworkError: boolean;
}