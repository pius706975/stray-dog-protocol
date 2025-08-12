import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStatusState } from '../types';

const initialState: UserStatusState = {
    isLoggedIn: false,
    isRoleSubmitted: false,
    isPreferencesSubmitted: false,
    isOwner: false,
    isCompanySubmitted: false,
    isAdmin: false,
    isCompanyVerif: false,
    isCompanyReject: false,
    isGoogleSignIn: true,
};

const userStatusSlice = createSlice({
    name: 'userStatus',
    initialState,
    reducers: {
        login: state => {
            state.isLoggedIn = true;
        },
        logout: state => {
            state.isLoggedIn = false;
            state.isRoleSubmitted = false;
            state.isPreferencesSubmitted = false;
            state.isOwner = false;
            state.isCompanySubmitted = false;
            state.isAdmin = false;
        },
        setRoleSubmitted: state => {
            state.isRoleSubmitted = true;
        },
        setRoleNotSubmitted: state => {
            state.isRoleSubmitted = false;
        },
        setPreferencesNotSubmitted: state => {
            state.isPreferencesSubmitted = false;
        },
        setPreferencesSubmitted: state => {
            state.isPreferencesSubmitted = true;
        },
        setRoleOwner: state => {
            state.isOwner = true;
        },
        setRoleRenter: state => {
            state.isOwner = false;
        },
        setRoleAdmin: state => {
            state.isAdmin = true;
        },
        setCompanySubmitted: state => {
            state.isCompanySubmitted = true;
        },
        setCompanyNotSubmitted: state => {
            state.isCompanySubmitted = false;
        },
        setCompanyVerif: state => {
            state.isCompanyVerif = true;
        },
        setCompanyReject: state => {
            state.isCompanyReject = true;
        },
        setGoogleSignIn: (state, action: PayloadAction<boolean>) => {
            console.log('action.payload', action.payload);
            state.isGoogleSignIn = action.payload;
        }
    },
});

export default userStatusSlice;
