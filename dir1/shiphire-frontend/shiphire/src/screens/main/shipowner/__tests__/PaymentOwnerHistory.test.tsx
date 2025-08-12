import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainOwnerStackParamList, MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { PaymentOwnerHistory } from '../paymentHistory';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { HistoryList } from '../paymentHistory/components';
import { CheckIcon } from '../../../../configs';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mock = new MockAdapter(httpRequest);
const mockParams = {
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

const mockHistoryPaymentComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="PaymentOwnerHistory"
                        component={PaymentOwnerHistory}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing History Payment Owner Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render payment history screen correctly', () => {
            const paymentHistoryScreen = render(mockHistoryPaymentComponent);
            expect(paymentHistoryScreen).toMatchSnapshot();
        });
    });
    describe('Component Testing', () => {
        it('Should render a list of payment history', async () => {
            const { getByTestId } = render(mockHistoryPaymentComponent);
            let flatListComponent;
            act(() => {
                flatListComponent = getByTestId('flatlistHistory');
            });
            await waitFor(() => {
                expect(flatListComponent).toBeTruthy();
                expect(flatListComponent.props.data.length).toBe(3);
            });
        });
        it('Should render history item correctly with payment verified', () => {
            const { getByTestId, getByText } = render(
                <HistoryList item={mockParams.payment[0]} index={0} />,
            );
            expect(getByTestId('payment-0')).toBeTruthy();
            expect(getByText('04/01/2024 12:33')).toBeTruthy();
            expect(<CheckIcon />).toBeTruthy();
        });
        it('Should open modal to show image', () => {
            const { getByTestId } = render(
                <HistoryList item={mockParams.payment[0]} index={0} />,
            );
            const buttonImage = getByTestId('paymentImage-0');
            fireEvent.press(buttonImage);
            const modal = getByTestId('modalImage');
            expect(modal).toBeTruthy();
        });
        it('Should render empty view when payment not yet submitted', () => {
            const { getByTestId } = render(mockHistoryPaymentComponent);
            expect(getByTestId('emptyItem')).toBeTruthy();
        });
    });
});
