import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import AuthScreenStacks from '../../../navigations/AuthScreenStacks';
import httpRequest from '../../../services/api';
import {
    modalSlice,
    userStatusSlice
} from '../../../slices';

const queryClient = new QueryClient();
const mock = new MockAdapter(httpRequest);

let store;
beforeEach(() => {
    store = configureStore({
        reducer: {
            modal: modalSlice.reducer,
            userStatus: userStatusSlice.reducer,
        },
    });
});

const renderWithProviders = component => {
    return render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <NavigationContainer>{component}</NavigationContainer>
            </QueryClientProvider>
        </Provider>,
    );
};

const mockSignInRequest = {
    email: 'test@example.com',
    password: 'testpassword',
};

const mockResponse = {
    status: 'success',
    data: {
        name: 'Mr Example',
        email: 'test@example.com',
        phoneNumber: '08123456789',
        roles: 'user',
    },
    token: 'token',
};

const mockFailureResponse = {
    status: 'failed',
    message: 'Email or password wrong',
};

const mockRenterPreferencesNotSubmittedResponse = {
    status: 'success',
    data: {
        name: 'Mr Example',
        email: 'test@example.com',
        phoneNumber: '08123456789',
        roles: 'renter',
        renterId: {
            _id: '64e301b71b191003bef921db',
            renterPreference: [],
        },
    },
    token: 'token',
};

const mockRenterPreferencesSubmittedResponse = {
    status: 'success',
    data: {
        name: 'Mr Example',
        email: '',
        phoneNumber: '',
        roles: 'renter',
        renterId: {
            _id: '64e301b71b191003bef921db',
            renterPreference: ['security'],
        },
    },
    token: 'token',
};

// const dispatch = jest.fn();
// const hideModal = jest.fn();
// const login = jest.fn();

describe('Sign In Page', () => {
    it('should navigates to SignUp page when "btnSignUp" is clicked', async () => {
        const { getByTestId, findByText } = renderWithProviders(
            <AuthScreenStacks />,
        );
        const signUpButton = getByTestId('btnSignUp');
        fireEvent.press(signUpButton);
        const signUpHeader = await findByText('Already have an account ?');
        expect(signUpHeader).toBeTruthy();
    });

    it('displays error text for invalid email and empty password submission', async () => {
        const { getByPlaceholderText, getByText, queryByText } =
            renderWithProviders(<AuthScreenStacks />);
        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Enter your password');

        fireEvent.changeText(emailInput, 'test');
        fireEvent.changeText(passwordInput, '');
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
            expect(queryByText('Invalid email')).not.toBeNull();
            expect(queryByText('Password is required.')).not.toBeNull();
        });
    });

    it('show password when "show password" is clicked', async () => {
        const { getByPlaceholderText, getByTestId } = renderWithProviders(
            <AuthScreenStacks />,
        );
        const passwordInput = getByPlaceholderText('Enter your password');
        const showPasswordButton = getByTestId('showPasswordButton');

        fireEvent.press(showPasswordButton);

        expect(passwordInput.props.secureTextEntry).toBe(false);
    });

    it('hide password when "hide password" is clicked', async () => {
        const { getByPlaceholderText, getByTestId } = renderWithProviders(
            <AuthScreenStacks />,
        );
        const passwordInput = getByPlaceholderText('Enter your password');
        const showPasswordButton = getByTestId('showPasswordButton');

        fireEvent.press(showPasswordButton);
        fireEvent.press(showPasswordButton);

        expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it('should show modal success when sign in successfully', async () => {
        const { getByPlaceholderText, getByText } = renderWithProviders(
            <AuthScreenStacks />,
        );

        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Enter your password');

        fireEvent.changeText(emailInput, mockSignInRequest.email);
        fireEvent.changeText(passwordInput, mockSignInRequest.password);

        fireEvent.press(getByText('Sign In'));

        mock.onPost('/auth/signin').reply(200, mockResponse);

        await waitFor(() => {
            const modalState = store.getState().modal;

            expect(modalState).toEqual({
                visible: true,
                status: 'success',
                text: 'Sign in successful!',
            });

            // expect(dispatch).toHaveBeenCalledWith(hideModal());
        });
    });

    it('should show modal failed when sign in failed', async () => {
        jest.useFakeTimers();
        const { getByPlaceholderText, getByText } = renderWithProviders(
            <AuthScreenStacks />,
        );

        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Enter your password');

        fireEvent.changeText(emailInput, mockSignInRequest.email);
        fireEvent.changeText(passwordInput, mockSignInRequest.password);

        fireEvent.press(getByText('Sign In'));

        mock.onPost('/auth/signin').reply(402, mockFailureResponse);

        await waitFor(() => {
            const modalState = store.getState().modal;

            expect(modalState).toEqual({
                visible: true,
                status: 'failed',
                text: 'Email or password wrong',
            });
        });
    });

    it('should change isLoggedIn to be "true" when User logged in', async () => {
        jest.useFakeTimers();

        const { getByPlaceholderText, getByText } = renderWithProviders(
            <AuthScreenStacks />,
        );

        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Enter your password');

        fireEvent.changeText(emailInput, mockSignInRequest.email);
        fireEvent.changeText(passwordInput, mockSignInRequest.password);

        fireEvent.press(getByText('Sign In'));

        mock.onPost('/auth/signin').reply(200, mockResponse);

        await waitFor(() => {
            const userStatusState = store.getState().userStatus;
            //wait for 2 seconds
            jest.advanceTimersByTime(2000);
            expect(userStatusState).toEqual({
                isLoggedIn: true,
                isOwner: false,
                isPreferencesSubmitted: true,
                isRoleSubmitted: false,
            });
        });
    });

    it('should change roleSubmitted to be "true" when User already selected Roles', async () => {
        jest.useFakeTimers();
        const { getByPlaceholderText, getByText } = renderWithProviders(
            <AuthScreenStacks />,
        );

        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Enter your password');

        fireEvent.changeText(emailInput, mockSignInRequest.email);
        fireEvent.changeText(passwordInput, mockSignInRequest.password);

        fireEvent.press(getByText('Sign In'));

        mock.onPost('/auth/signin').reply(
            200,
            mockRenterPreferencesSubmittedResponse,
        );

        await waitFor(() => {
            const userStatusState = store.getState().userStatus;

            // expect(dispatch).toHaveBeenCalledWith(login());

            jest.advanceTimersByTime(2000);
            expect(userStatusState).toEqual({
                isLoggedIn: true,
                isOwner: false,
                isPreferencesSubmitted: true,
                isRoleSubmitted: true,
            });
        });
    });
});
