import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainOwnerStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Payment } from '../paymentOwner';
import { PaymentOwnerHistory } from '../paymentHistory';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);
const mockParams = {
    paymentReceiptUrl:
        'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/SH-09212023-63c96de3%20payment%20receipt...',
    rentalId: 'SH-09212023-63c96de3',
    sailingStatus: 'beforeSailing',
    beforeSailingPictures: [
        {
            documentName: 'Image Before Tes',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Image%2',
            description: 'Tes',
        },
    ],
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
        {
            createdAt: new Date('2024-01-04T04:42:33.655Z'),
            _id: '659635bad7911740a0d61cab',
            paymentReminded: [],
            paymentApproved: false,
            paymentId: 'PY-01042024-bf706fd0',
        },
    ],
};

const mockParamsEmptyBeforeSailingPictures = {
    paymentReceiptUrl:
        'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/SH-09212023-63c96de3%20payment%20receipt...',
    rentalId: 'SH-09212023-63c96de3',
    sailingStatus: 'beforeSailing',
    beforeSailingPictures: [],
};

const acceptPaymentMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="Payment"
                        component={Payment}
                        initialParams={mockParams}
                    />
                    <MainOwnerStack.Screen
                        name="PaymentOwnerHistory"
                        component={PaymentOwnerHistory}
                        initialParams={{ payment: mockParams.payment }}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const acceptPaymentMockComponentEmptyBeforeSailingPictures = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="Payment"
                        component={Payment}
                        initialParams={mockParamsEmptyBeforeSailingPictures}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Accept Payment Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render accept payment screen correctly', () => {
            const acceptPaymentScreen = render(acceptPaymentMockComponent);
            expect(acceptPaymentScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should handle if user has not uploaded before sailing pictures', async () => {
            const { getByText } = render(
                acceptPaymentMockComponentEmptyBeforeSailingPictures,
            );

            fireEvent.press(getByText('Accept payment'));

            await waitFor(() => {
                const modalState = store.getState().modal;
                jest.advanceTimersByTime(1000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Please upload before sailing pictures first before accepting payment.',
                });
                jest.advanceTimersByTime(4000);

                const progressState = store.getState().progressIndicator;

                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should handle accept payment successfully', async () => {
            const { getByText } = render(acceptPaymentMockComponent);

            fireEvent.press(getByText('Accept payment'));
            mockAdapter
                .onPost('/ship-owner/approve-payment')
                .reply(200, { status: 'success' });

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Payment has been accepted',
                });
                jest.advanceTimersByTime(3000);

                const progressState = store.getState().progressIndicator;

                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should handle accept payment failed', async () => {
            const { getByText } = render(acceptPaymentMockComponent);

            fireEvent.press(getByText('Accept payment'));
            mockAdapter
                .onPost('/ship-owner/approve-payment')
                .reply(500, { status: 'failed' });

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Failed to accept the payment. Please try again.',
                });
                jest.advanceTimersByTime(3000);

                const progressState = store.getState().progressIndicator;

                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('shoud navigate to payment history when press history button', () => {
            const { getByTestId } = render(acceptPaymentMockComponent);
            const historyButton = getByTestId('historyButton');
            act(() => {
                fireEvent.press(historyButton);
            });
            expect(getByTestId('paymentOwner')).toBeDefined();
        });
    });
});
