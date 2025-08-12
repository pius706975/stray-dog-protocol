import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from '../../../../store';
import { PaymentHistory } from '../paymentHistory';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useGetPaymentHistory } from '../../../../hooks';
import { act } from 'react-test-renderer';
import { HistoryList } from '../paymentHistory/components';
import { CheckIcon } from '../../../../configs';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const mock = new MockAdapter(httpRequest);
const mockParams = {
    rentalId: 'SH-12282023-5ac7d1a0',
};

const mockPaymentList = [
    {
        _id: '6594b8b7657162517ef76872',
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
    },
];

const mockPaymentHistoryComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
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

describe('Testing Payment History Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Payment History screen correctly', () => {
            mock.onGet('/renter/get-payment').reply(200, {
                message: 'success',
                data: mockPaymentList,
            });
            (useGetPaymentHistory as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockPaymentList,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const paymentHistoryScreen = render(
                mockPaymentHistoryComponent,
            ).toJSON();
            expect(paymentHistoryScreen).toMatchSnapshot();
        });
    });

    describe('Component Testing', () => {
        it('Should render a list of payment history', async () => {
            const { getByTestId } = render(mockPaymentHistoryComponent);
            mock.onGet('/renter/get-payment').reply(200, mockPaymentList);

            let flatListComponent;
            act(() => {
                flatListComponent = getByTestId('flatlistHistory');

                flatListComponent.props.data.push(mockPaymentList[0].payment);
                flatListComponent.props.data.pop();
            });

            await waitFor(() => {
                expect(flatListComponent).toBeTruthy();
                expect(flatListComponent.props.data.length).toBe(3);
            });
        });
        it('should renders history item correctly with payment verified', () => {
            const { getByTestId, getByText } = render(
                <HistoryList item={mockPaymentList[0].payment[0]} index={0} />,
            );

            expect(getByTestId('payment-0')).toBeTruthy();
            expect(getByText('04/01/2024 12:33')).toBeTruthy();
            expect(<CheckIcon />).toBeTruthy();
        });
        it('should open modal to show image', () => {
            const { getByTestId } = render(
                <HistoryList item={mockPaymentList[0].payment[0]} index={0} />,
            );

            const buttonImage = getByTestId('paymentImage-0');
            fireEvent.press(buttonImage);
            const modal = getByTestId('modalImage');
            expect(modal).toBeTruthy();
        });
        it('should render empty view when payment not yet submitted', () => {
            const { getByTestId } = render(mockPaymentHistoryComponent);
            mock.onGet('/renter/get-payment').reply(200, mockPaymentList);

            expect(getByTestId('emptyItem')).toBeTruthy();
        });
    });
});
