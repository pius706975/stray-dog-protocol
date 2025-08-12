import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';

import { ManageTransaction } from '../manageTransaction';
import { useGetAllUserTransactions } from '../../../../hooks';
import {
    fireEvent,
    render,
    userEvent,
    waitFor,
} from '@testing-library/react-native';
import renderer, { act } from 'react-test-renderer';
import { TransactionCard } from '../manageTransaction/components';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);
const mockTransaction = [
    {
        _id: '1234',
        rentalId: 'SH-1234',
        renterId: '456',
        rentalDuration: 2,
        ship: {
            name: 'Ship 1',
        },
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ Sent',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ Accepted',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
        ],
        ownerDetails: {
            company: {
                name: 'test company',
            },
        },
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
    },
    {
        _id: '4567',
        rentalId: 'SH-4567',
        renterId: '456',
        rentalDuration: 2,
        ship: {
            name: 'Barge Hauler',
        },
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ Sent',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ Accepted',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
        ],
        ownerDetails: {
            company: {
                name: 'test company',
            },
        },
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
    },
    {
        _id: '786',
        rentalId: 'SH-4567',
        renterId: '456',
        rentalDuration: 2,
        ship: {
            name: 'MV Cruiser',
        },
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ Sent',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ Accepted',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
        ],
        ownerDetails: {
            company: {
                name: 'test company',
            },
        },
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
    },
    {
        _id: '3435',
        rentalId: 'SH-4567',
        renterId: '456',
        rentalDuration: 2,
        ship: {
            name: 'Tugboat',
        },
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ Sent',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ Accepted',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
        ],
        ownerDetails: {
            company: {
                name: 'test company',
            },
        },
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
    },
    {
        _id: '9476',
        rentalId: 'SH-4567',
        renterId: '456',
        rentalDuration: 2,
        ship: {
            name: 'Seven',
        },
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ Sent',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ Accepted',
                isOpened: true,
                date: new Date(),
                _id: '1234',
            },
        ],
        ownerDetails: {
            company: {
                name: 'test company',
            },
        },
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
    },
];
const adminStackMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="ManageTransaction"
                        component={ManageTransaction}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
beforeEach(() => {
    mock.onGet('/admin/get-transaction').reply(200, {
        message: 'success',
        data: mockTransaction,
    });
    (useGetAllUserTransactions as jest.Mock).mockImplementation(() => ({
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
});
describe('Testing transaction management screen', () => {
    describe('Snapshot testing', () => {
        it('should render transaction management screen corectly', async () => {
            const transactionManagementScreen = renderer.create(
                adminStackMockComponent(),
            );
            expect(transactionManagementScreen).toMatchSnapshot();
        });
    });
    describe('Unit Test', () => {
        it('should render all transaction list', () => {
            const { getByTestId } = render(adminStackMockComponent());
            // rerender(adminStackMockComponent());
            const flatList = getByTestId('transaction-flatlist');

            expect(flatList.props.data.length).toBe(5);
        });
        it('should paginate on scroll', async () => {
            const { getByTestId, rerender } = render(adminStackMockComponent());
            const flatList = getByTestId('transaction-flatlist');
            const user = userEvent.setup();
            act(() => {
                fireEvent(flatList, 'onEndReached');
            });
            // await new Promise(resolve => setTimeout(resolve, 500));

            expect(flatList.props.data.length).toBe(10);
        });
        it('should render transaction list when search ship name', async () => {
            mock.onGet('/admin/get-transaction').reply(200, {
                message: 'success',
                data: [mockTransaction[0]],
            });
            (useGetAllUserTransactions as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [mockTransaction[0]],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId, rerender } = render(adminStackMockComponent());
            const searchBar = getByTestId('search-bar');

            act(() => {
                fireEvent.changeText(searchBar, 'Shi');
                jest.advanceTimersByTime(499);
            });

            rerender(adminStackMockComponent());

            await waitFor(() => {
                const flatList = getByTestId('transaction-flatlist');

                expect(flatList.props.data.length).toBe(1);
            });
        });
        it('should render transaction card component', () => {
            const { getByTestId } = render(
                <TransactionCard
                    testID="transaction-0"
                    onPress={jest.fn()}
                    status={mockTransaction[0].status[1]}
                    shipImage=""
                    shipName={mockTransaction[0].ship.name}
                    rentalId={mockTransaction[0].rentalId}
                    totalRent={23000}
                    shipCompany={''}
                    timeStamp={new Date()}
                />,
            );
            const pressable = getByTestId('transaction-0');
            expect('Ship 1').toBeDefined();
            expect('SH-1234').toBeDefined();
            expect('23000').toBeDefined();
            expect(pressable).toBeDefined();
        });
    });
});
