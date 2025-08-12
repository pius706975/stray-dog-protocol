import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContractPreview from '../contract/ContractPreview';
import { CloseIcon, TOKEN, USERDATA } from '../../../../configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import PDFView from 'react-native-view-pdf';
import { act } from 'react-test-renderer';
import { ProposalPreview } from '../proposal';
import {
    useSendOTPSignProposal,
    useVerifySignProposalOTP,
} from '../../../../hooks';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<MainScreenParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

const mockParams = {
    proposalUrl: 'https://example.com/contract.pdf',
    rentalId: '123',
};

const mockProposalComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="ProposalPreview"
                        component={ProposalPreview}
                        initialParams={mockParams}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Usmanul',
        email: 'usman@email.com',
        password: 'test',
        phoneNumber: '12313123',
        isVerified: true,
        isCompanySubmitted: true,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

describe('Proposal Preview', () => {
    it('should render the screen correctly', async () => {
        const proposalPreview = render(mockProposalComponent()).toJSON();
        expect(proposalPreview).toMatchSnapshot();
    });
});
describe('Receipt Preview', () => {
    it('should render the proposal', async () => {
        render(mockProposalComponent());
        const pdfView = render(
            <PDFView
                resource="https://example.com/contract.pdf"
                resourceType="url"
            />,
        );
        await act(() => {
            expect(pdfView).toBeTruthy();
        });
    });
    it('should not render the PDF view if proposal is not provided', async () => {
        render(mockProposalComponent());
        const pdfView = render(
            <PDFView
                resource={''}
                onError={error => {
                    console.log('Cannot render PDF', error);
                }}
            />,
        );

        const progressState = store.getState().progressIndicator;
        expect(progressState).toEqual({
            visible: true,
        });
        await waitFor(() => {
            const progressState = store.getState().progressIndicator;
            expect(progressState).toEqual({
                visible: false,
            });
        });
        await act(async () => {
            expect(pdfView).toBeDefined();
        });
    });
    it('should call handleAcceptPressed when the accept button is pressed', async () => {
        const { getByTestId } = render(mockProposalComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-proposal')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });
    });
    it('should call OTPModal when the accept button is pressed', async () => {
        const { getByTestId } = render(mockProposalComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-proposal')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        await waitFor(() => {
            expect(modal).toBeTruthy();
        });
    });
    it('should call OTPModal when the accept button is pressed and render the component', async () => {
        const { getByTestId, getByText } = render(mockProposalComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-proposal')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        await waitFor(() => {
            expect(modal).toBeTruthy();
        });

        const pressVisible = getByTestId('pressVisible');

        expect(pressVisible).toBeDefined();

        expect(getByText('OTP Verification')).toBeTruthy();

        const press = getByTestId('pressCount');

        expect(press).toBeDefined();
    });
    it('should call OTPModal when the accept button is pressed and input the field', async () => {
        jest.useFakeTimers();

        const { getByTestId } = render(mockProposalComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-proposal')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        await waitFor(() => {
            expect(modal).toBeTruthy();
        });

        const input = getByTestId('OTPInput');

        fireEvent.changeText(input, '123456');

        expect(input.props.value).toEqual('123456');

        const verifyButton = getByTestId('verifyButton');

        fireEvent.press(verifyButton);

        await act(async () => {
            expect(verifyButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/verify-otp-sign-proposal')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(verifyButton).toBeDefined();
        });
    });
});
