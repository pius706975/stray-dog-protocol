import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    MainOwnerStackParamList,
    OwnerTransactionParamList,
} from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { OwnerTransactionTabNav } from '../../../../navigations';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    OwnerContractStats,
    OwnerProposalStats,
    OwnerRequestForQuoteStats,
} from '../transactionStatus';
import { render } from '@testing-library/react-native';
import { useGetAllOwnerTransaction } from '../../../../hooks';

jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const Tab = createMaterialTopTabNavigator<OwnerTransactionParamList>();

const renderScreen = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen name="OwnerTransactionTabNav">
                        {() => (
                            <Tab.Navigator>
                                <Tab.Screen
                                    name="RequestForQuote"
                                    component={OwnerRequestForQuoteStats}
                                />
                                <Tab.Screen
                                    name="Proposal"
                                    component={OwnerProposalStats}
                                />
                                <Tab.Screen
                                    name="Contract"
                                    component={OwnerContractStats}
                                />
                            </Tab.Navigator>
                        )}
                    </MainOwnerStack.Screen>
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockTransaction = [
    {
        _id: '12',
        rentalId: 'SH-09212023-f42e6b08',
        renterId: '23',
        rentalDuration: 456,
        rentalStartDate: '2023-09-20T16:00:00.000Z',
        rentalEndDate: '2024-12-20T16:00:00.000Z',
        ship: {
            shipOwnerId: '23',
            name: 'Island Hopper',
            imageUrl: 'https://img.com',
            category: 'Ferry',
            size: {
                length: 60,
                width: 20,
                height: 10,
            },
        },
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: false,
                _id: '23',
            },
        ],
        rfq: {
            rfqId: '23',
            rfqUrl: 'https://pdf.com',
        },
        proposal: null,
        offeredPrice: 4366999900,
        createdAt: '2024-01-17T02:13:24.761Z',
        updatedAt: '2024-01-17T02:13:24.761Z',
        contract: {},
        sailingStatus: 'beforeSailing',
        beforeSailingPictures: [],
        afterSailingPictures: [],
    },
    {
        _id: '1223',
        rentalId: 'SH-09212023-f42e6b09',
        renterId: '23',
        rentalDuration: 456,
        rentalStartDate: '2023-09-20T16:00:00.000Z',
        rentalEndDate: '2024-12-20T16:00:00.000Z',
        ship: {
            shipOwnerId: '23',
            name: 'Island Hopper',
            imageUrl: 'https://img.com',
            category: 'Ferry',
            size: {
                length: 60,
                width: 20,
                height: 10,
            },
        },
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: false,
                _id: '65a737c476517457909c6205',
            },
        ],
        rfq: {
            rfqId: '12',
            rfqUrl: 'https://pdf.com',
        },
        proposal: null,
        offeredPrice: 4366999900,
        createdAt: '2024-01-17T02:13:25.761Z',
        updatedAt: '2024-01-17T02:13:25.761Z',
        contract: {},
        sailingStatus: 'beforeSailing',
        beforeSailingPictures: [],
        afterSailingPictures: [],
    },
];

const mockHandleTransaction = () => {
    mockAdapter.onGet('/shipowner/get-transaction').reply(200, {
        message: 'success',
        data: mockTransaction,
    });
    (useGetAllOwnerTransaction as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
                data: {
                    data: mockTransaction,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
};

beforeAll(() => {
    mockHandleTransaction();
});
describe('TransactionStat', () => {
    describe('Snapshot Testing', () => {
        it('should render transaction stat correctly', () => {
            const tree = render(renderScreen);
            expect(
                tree.getByTestId('transaction-card-SH-09212023-f42e6b08'),
            ).toBeDefined();
        });
    });
});
