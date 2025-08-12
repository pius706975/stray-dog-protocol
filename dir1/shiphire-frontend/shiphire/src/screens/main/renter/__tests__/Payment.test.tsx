import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import {
    render,
    fireEvent,
    waitFor,
    screen,
} from '@testing-library/react-native';
import { Payment } from '../payment';
import { setMockImagePickerResolve } from '../../../../jest/setup';
import { useGetTransactionByRentalId } from '../../../../hooks';
import { PaymentHistory } from '../paymentHistory';
jest.mock('../../../../hooks', () => ({
    ...jest.requireActual('../../../../hooks'),
    useGetTransactionByRentalId: jest.fn(),
}));
const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockNavigation = {
    reset: jest.fn(),
};
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    rentalId: 'SH-12282023-5ac7d1a0',
    transactionId: '658d2b7e8c3ebaef6c964d43',
};
const mockTransaction = {
    _id: '1234',
    rentalId: 'SH-1234',
    renterId: '456',
    rentalDuration: 2,
    payment: [
        {
            _id: '659634e1d7911740a0d61b41',
            paymentReminded: [],
            createdAt: new Date('2024-01-04T04:33:12.268Z'),
            paymentApproved: true,
            paymentId: 'PY-01042024-a3029559',
            receiptUrl: 'https://storage.googleapis.com',
        },
        {
            createdAt: new Date('2024-01-04T04:42:33.655Z'),
            _id: '659635bad7911740a0d61caa',
            paymentReminded: [],
            paymentApproved: false,
            paymentId: 'PY-01042024-bf706fd0',
            receiptUrl: 'https://storage.googleapis.com',
        },
    ],
};
const mockPaymentComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="Payment"
                        component={Payment}
                        initialParams={mockParams}
                    />
                    <MainStack.Screen
                        name="PaymentHistory"
                        component={PaymentHistory}
                        initialParams={mockParams}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Payment Screen', () => {
    describe('Snapshot Testing', () => {
        mockAdapter
            .onGet('/renter/get-transaction')
            .reply(200, { status: 'success', data: mockTransaction });
        (useGetTransactionByRentalId as jest.Mock).mockImplementation(() => ({
            mutate: jest.fn().mockImplementation((data, options) => {
                const { onSuccess } = options;
                const mockResponseData = {
                    data: {
                        data: mockTransaction,
                    },
                };
                onSuccess(mockResponseData);
            }),
        }));
        it('should render Payment screen correctly', () => {
            const paymentScreen = render(mockPaymentComponent).toJSON();
            expect(paymentScreen).toMatchSnapshot();
        });
    });

    describe('Unit Testing', () => {
        it('should handle image picker', async () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByText, getByTestId } = render(mockPaymentComponent);

            fireEvent.press(getByText('Upload payment receipt'));
            setMockImagePickerResolve(true);

            await waitFor(() => {
                expect(getByTestId('selected-image-accordion')).toBeTruthy();
            });

            const textPaymentReceipt = getByText(
                'SelectedImageAccordion.textPaymentReceipt',
            );
            expect(textPaymentReceipt).toBeDefined();
        });
        it('should handle send receipt succesfully', async () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            jest.useFakeTimers();
            const { getByText, getByTestId } = render(mockPaymentComponent);

            fireEvent.press(getByText('Upload payment receipt'));
            setMockImagePickerResolve(true);

            await waitFor(() => {
                expect(getByTestId('selected-image-accordion')).toBeTruthy();
            });

            fireEvent.press(
                getByText('SelectedImageAccordion.labelButtonSendReceipt'),
            );

            mockAdapter
                .onPost('/renter/upload-payment-receipt')
                .reply(200, { status: 'success' });

            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'successSentPaymentReceipt',
                });

                jest.advanceTimersByTime(3000);

                const progressState = store.getState().progressIndicator;

                expect(progressState).toEqual({
                    visible: false,
                });
                // const homeScreen = screen.findByText('homeScreen');

                // expect(homeScreen).toBeTruthy();
            });
        });
        it('should handle send receipt failed', async () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByText, getByTestId } = render(mockPaymentComponent);

            fireEvent.press(getByText('Upload payment receipt'));
            setMockImagePickerResolve(true);

            await waitFor(() => {
                expect(getByTestId('selected-image-accordion')).toBeTruthy();
            });

            fireEvent.press(
                getByText('SelectedImageAccordion.labelButtonSendReceipt'),
            );

            mockAdapter
                .onPost('/renter/upload-payment-receipt')
                .reply(500, { status: 'failed' });

            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedSentPaymentReceipt',
                });

                jest.advanceTimersByTime(3000);

                const progressState = store.getState().progressIndicator;

                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should handle error when image picker rejected', async () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByText } = render(mockPaymentComponent);

            fireEvent.press(getByText('Upload payment receipt'));
            setMockImagePickerResolve(false);

            await waitFor(() => {
                expect(getByText('Upload payment receipt')).toBeDefined();
            });
        });
    });

    describe('Component Testing', () => {
        it('should render card history', () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByTestId } = render(mockPaymentComponent);
            expect(getByTestId('historyButton')).toBeDefined();
        });
        it('should redirect to history screen when press history button', () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByTestId } = render(mockPaymentComponent);
            fireEvent.press(getByTestId('historyButton'));

            expect(getByTestId('paymentHistoryScreen')).toBeDefined();
        });
        it('should expand accordion when clicked', async () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByText, getByTestId } = render(mockPaymentComponent);

            fireEvent.press(getByTestId('instructions-accordion-1'));

            expect(
                getByText('InstructionsAccordion.textInstruction'),
            ).toBeDefined();

            fireEvent.press(getByTestId('instructions-accordion-2'));

            expect(
                getByText('InstructionsAccordion.textInstruction'),
            ).toBeDefined();

            fireEvent.press(getByTestId('instructions-accordion-3'));

            expect(
                getByText('InstructionsAccordion.textInstruction'),
            ).toBeDefined();
        });
        it('should handle copy button when clicked', async () => {
            mockAdapter
                .onGet('/renter/get-transaction')
                .reply(200, { status: 'success', data: mockTransaction });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockTransaction,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByText, getByTestId } = render(mockPaymentComponent);

            fireEvent.press(getByTestId('copy-button'));

            await waitFor(() => {
                const successCopiedIcon = getByTestId('success-copied');

                expect(successCopiedIcon).toBeDefined();
            });
        });
    });
});
