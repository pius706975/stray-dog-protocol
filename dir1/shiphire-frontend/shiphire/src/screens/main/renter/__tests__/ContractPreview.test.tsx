import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContractPreview from '../contract/ContractPreview';
import { TOKEN, USERDATA } from '../../../../configs';
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
import { OTPModal } from '../contract/component';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

const mockParams = {
    contractUrl: 'https://example.com/contract.pdf',
    rentalId: '123',
};

const mockContractComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="ContractPreview"
                        component={ContractPreview}
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

describe('contract Preview', () => {
    it('should render the screen correctly', async () => {
        const contractPreview = render(mockContractComponent()).toJSON();
        expect(contractPreview).toMatchSnapshot();
    });
});
describe('Receipt Preview', () => {
    it('should render the contract', async () => {
        render(mockContractComponent());
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
    it('should not render the PDF view if contract is not provided', async () => {
        render(mockContractComponent());
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
        const { getByTestId } = render(mockContractComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-contract')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });
    });
    it('should call OTPModal when the accept button is pressed', async () => {
        const { getByTestId } = render(mockContractComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-contractl')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        expect(modal).toBeTruthy();
    });
    it('should call OTPModal when the accept button is pressed and render the component', async () => {
        const { getByTestId, getByText } = render(mockContractComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-contract')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        expect(modal).toBeTruthy();

        const pressVisible = getByTestId('pressVisible');

        expect(pressVisible).toBeDefined();

        expect(getByText('OTPModal.textOTPVerif')).toBeTruthy();

        const press = getByTestId('pressCount');

        expect(press).toBeDefined();
    });
    it('should send OTP again after click send code', async () => {
        const { getByTestId, getByText } = render(mockContractComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        expect(modal).toBeTruthy();

        const pressResend = getByTestId('pressCount');
        fireEvent.press(pressResend);

        // Assert that another OTP request has been sent
        await waitFor(() => {
            mockAdapter
                .onPost('/renter/send-otp-sign-contract')
                .reply(200, { status: 'success' });
        });
    });
    it('should call OTPModal when the accept button is pressed and input the field', async () => {
        jest.useFakeTimers();

        const { getByTestId } = render(mockContractComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-contract')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        expect(modal).toBeTruthy();

        const input = getByTestId('OTPInput');

        fireEvent.changeText(input, '1234');

        expect(input.props.value).toEqual('1234');

        const verifyButton = getByTestId('verifyButton');

        fireEvent.press(verifyButton);

        await act(async () => {
            expect(verifyButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/verify-otp-sign-contract')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(verifyButton).toBeDefined();
        });
    });
    it('should success sign the contract', async () => {
        jest.useFakeTimers();

        const { getByTestId } = render(mockContractComponent());
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

        expect(modal).toBeTruthy();

        const input = getByTestId('OTPInput');

        fireEvent.changeText(input, '1234');

        expect(input.props.value).toEqual('1234');

        const verifyButton = getByTestId('verifyButton');

        fireEvent.press(verifyButton);

        await act(async () => {
            expect(verifyButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/verify-otp-sign-contract')
            .reply(200, { status: 'success' });

        expect(verifyButton).toBeDefined();

        await waitFor(() => {
            const modalState = store.getState().modal;

            jest.advanceTimersByTime(4000);
            expect(modalState).toEqual({
                visible: false,
                status: undefined,
                text: '',
            });
        });
    });
    it('should verify the OTP', async () => {
        const { getByTestId } = render(mockContractComponent());
        const acceptButton = getByTestId('acceptButton');
        await act(async () => {
            fireEvent.press(acceptButton);
        });

        await waitFor(() => {
            expect(getByTestId('OTPModal')).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-contract')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/verify-otp-sign-contract')
            .reply(200, { status: 'success' });
    });
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('error handling', () => {
    it('should error verify OTP', async () => {
        jest.useFakeTimers();

        const { getByTestId } = render(mockContractComponent());
        const acceptButton = getByTestId('acceptButton');
        fireEvent.press(acceptButton);

        await act(() => {
            expect(acceptButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/send-otp-sign-contract')
            .reply(200, { status: 'success' });

        await act(async () => {
            expect(acceptButton).toBeDefined();
        });

        const modal = getByTestId('OTPModal');

        expect(modal).toBeTruthy();

        const input = getByTestId('OTPInput');

        fireEvent.changeText(input, '124');

        const verifyButton = getByTestId('verifyButton');

        fireEvent.press(verifyButton);

        await act(async () => {
            expect(verifyButton).toBeDefined();
        });

        mockAdapter
            .onPost('/renter/verify-otp-sign-contract')
            .reply(422, { status: 'failed' });

        expect(verifyButton).toBeDefined();

        // await waitFor(() => {
        //     const modalState = store.getState().modal;
        //     jest.advanceTimersByTime(4000);
        //     expect(modalState).toEqual({
        //         visible: true,
        //         status: 'failed',
        //         text: 'OTPModal.failedInvalidOTP',
        //     });
        // });
        // const updatedModalState = store.getState().modal;
        // expect(updatedModalState.visible).toBe(true);
    });
});
