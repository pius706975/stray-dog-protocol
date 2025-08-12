import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { TOKEN, USERDATA } from '../../../../configs';
import MainScreenStack from '../../../../navigations/MainScreenStack';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import { DetailShip } from '../detailShip';
import { TransactionStatusTabNav } from '../../../../navigations';
import { Search } from '../search';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../home/Home';
import Notification from '../notification/Notification';
import Account from '../account/Account';
import { act } from 'react-test-renderer';
import {
    useGetPaymentAccount,
    useGetRenterData,
    useGetShipById,
    useGetTransactionById,
    useGetTransactionByRentalId,
    useGetUserNotif,
    useUserOpenNotif,
} from '../../../../hooks';
import { Payment } from '../payment';
import { getTransactionByRentalId } from '../../../../services/renter';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<MainScreenParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

jest.mock('../../../../hooks');

jest.mock('@gorhom/bottom-sheet', () => ({
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useIsFocused: jest.fn(),
}));

const mockMainStackScreens: {
    name: keyof MainStackParamList;
    title: string;
    component: any;
}[] = [
    { name: 'DetailShip', title: 'Detail Ship', component: DetailShip },
    {
        name: 'TransactionStatusTab',
        title: 'Transaction Status',
        component: TransactionStatusTabNav,
    },
    {
        name: 'Search',
        title: 'Search',
        component: Search,
    },
    {
        name: 'Payment',
        title: 'Payment',
        component: Payment,
    },
];

const mainScreenStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="MainScreenTab">
                        {() => (
                            <Tab.Navigator>
                                <Tab.Screen
                                    name="Notification"
                                    component={Notification}
                                />
                            </Tab.Navigator>
                        )}
                    </MainStack.Screen>
                    {mockMainStackScreens.map(screen => (
                        <MainStack.Screen
                            key={screen.name}
                            name={screen.name}
                            component={screen.component}
                        />
                    ))}
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockGetRenterDataResponse = {
    company: {
        name: 'Shiphire Indonesia',
        companyType: 'PT',
        address: 'Jl. Raya Bogor KM 30',
        documentCompany: [
            {
                documentName: 'SIUP',
                documentUrl: 'https://www.google.com',
            },
        ],
        isVerified: true,
        isRejected: false,
        imageUrl: 'https://www.google.com',
    },
    _id: '64e301b71b191003bef921db',
    userId: {
        _id: '64e301b71b191003bef921da',
        name: 'Muhamad Fauzan',
        email: 'renter@email.com',
        phoneNumber: '081234567890',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        imageUrl: 'https://www.google.com',
    },
    name: 'Muhamad Fauzan',
    renterPreference: ['reputation and track record', 'barge'],
    __v: 0,
    shipReminded: [
        {
            ship: {
                id: {
                    _id: '64e56ec67288cbf8d26c2aae',
                    name: 'Flying dutchman',
                    imageUrl: 'https://www.google.com',
                },
                reminderDate: '23 Jan 2024',
            },
        },
        {
            ship: {
                id: {
                    _id: '2',
                    name: 'Bargeeee',
                    imageUrl: 'https://www.google.com',
                },
                reminderDate: '25 Jan 2024',
            },
        },
    ],
};

const mockPaymentAccount = {
    name: '',
    companyType: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: 123,
};

const mockNotification = {
    _id: 'test',
    userId: '64e301b71b191003bef921da',
    shipId: '64e56ec67288cbf8d26c2aae',
    transactionId: 'test',
    rentalId: '123123',
    notifType: 'shipReminder',
    title: 'test',
    body: 'test',
    isReaded: false,
    createdAt: '2024-01-17T16:00:00.319+00:00',
    updatedAt: '2024-01-18T02:48:39.802+00:00',
    __v: 0,
};
const mockNotificationReaded = {
    _id: 'test',
    userId: '64e301b71b191003bef921da',
    transactionId: 'test',
    rentalId: '123123',
    notifType: 'paymentReminder',
    title: 'test',
    body: 'test',
    isReaded: true,
    createdAt: '2024-01-17T16:00:00.319+00:00',
    updatedAt: '2024-01-18T02:48:39.802+00:00',
    __v: 0,
};

const mockTransaction = {
    ship: {
        size: {
            length: 12,
            width: 12,
            height: 12,
        },
        _id: 'da12132',
        shipOwnerId: '113e4d23',
        name: 'bargeHauler',
        category: {
            _id: '123123',
            name: 'barge',
        },
        imageUrl: 'https://www.google.com',
        shipDocuments: [],
    },
    rfq: {
        rfqId: '123123',
        rfqUrl: 'https://www.google.com',
    },
    proposal: {
        proposalId: {
            _id: '123123',
            otherDoc: {
                documentName: 'test',
                documentUrl: 'https://www.google.com',
                _id: '123123',
            },
        },
        _id: '123123',
        proposalUrl: 'https://www.google.com',
        notes: 'asdafag',
        proposalName: 'test proposal',
        additionalImage: {
            imageUrl: 'https://www.google.com',
            imageDescription: 'ini kapal',
        },
    },
    contract: {
        contractId: '123123',
        contractUrl: 'https://www.google.com',
    },
    _id: '123123',
    rentalId: '123123',
    notifType: 'paymentReminder',
    title: 'test',
    body: 'test',
    isReaded: false,
    createdAt: '2024-01-17T16:00:00.319+00:00',
    updatedAt: '2024-01-18T02:48:39.802+00:00',
    __v: 0,
};

const mockShip = {
    _id: '1',
    size: {
        length: 13,
        width: 13,
        height: 8,
    },
    shipOwnerId: {
        _id: '64e301b71b191003bef921db',
        company: {
            name: 'Shiphire Indonesia',
            companyType: 'PT',
            address: 'Jl. Raya Bogor KM 30',
            isVerified: true,
            isRejected: false,
        },
    },
    name: 'Flying dutchman',
    desc: 'test',
    tags: [],
    pricePerMonth: 100000000,
    category: {
        _id: '64e301b71b191003bef921da',
        name: 'barge',
    },
    facilities: [
        {
            _id: '64e56ec67288cbf8d26c2aae',
            name: 'test',
            type: 'test',
        },
    ],
    specifications: [
        {
            _id: '64e56ec67288cbf8d26c2aae',
            name: 'test',
            spesificationId: { units: '1213ads' },
            value: 'test',
        },
    ],
    rating: 4,
    totalRentalCount: 2,
    shipDocuments: [],
    __v: 0,
    imageUrl: 'https://www.google.com',
    shipHistory: [],
    rfqDynamicForm: 'qweqe',
    shipApproved: [
        {
            name: 'test',
            desc: 'test',
            approvedShip: true,
            _id: '64e56ec67288cbf8d26c2aae',
        },
    ],
};

mockAdapter
    .onGet('/renter/get-renter-data')
    .reply(200, { status: 'success', data: mockGetRenterDataResponse });
(useGetRenterData as jest.Mock).mockImplementation(() => ({
    mutate: jest.fn().mockImplementation((data, options) => {
        const { onSuccess } = options;
        const mockResponseData = {
            data: {
                data: mockGetRenterDataResponse,
            },
        };
        onSuccess(mockResponseData);
    }),
}));

// mockAdapter.onGet('/renter/get-all-transaction').reply(200, mockTransaction);

mockAdapter.onGet('/user/get-notification').reply(200, {
    status: 'success',
    data: mockNotification,
});
(useGetUserNotif as jest.Mock).mockImplementation(() => ({
    mutate: jest.fn().mockImplementation((data, options) => {
        const { onSuccess } = options;
        const mockResponseData = {
            data: {
                data: [mockNotification],
            },
        };
        onSuccess(mockResponseData);
    }),
}));

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Muhamad Fauzan',
        email: 'usman@email.com',
        password: 'test',
        isVerified: false,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

describe('Notification Screen', () => {
    it('should renders correctly', async () => {
        const tree = render(mainScreenStackNavMockComponent()).toJSON();
        await act(async () => {
            expect(tree).toMatchSnapshot();
        });
    });

    describe('Notification Screen Functionality', () => {
        it('should render new ship reminder notifications', async () => {
            mockAdapter.onGet('/user/get-notification').reply(200, {
                status: 'success',
                data: mockNotification,
            });
            (useGetUserNotif as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [mockNotification],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            const notificationTab = getByTestId('NotificationScreen');

            await act(async () => {
                fireEvent.press(notificationTab);
            });

            expect(notificationTab).toBeTruthy();

            await waitFor(() => {
                const notifCard = getByTestId('notifCard-0');
                expect(notifCard).toBeTruthy();
            });
        });
        it('should opened notifications and navigate into detailship', async () => {
            mockAdapter.onGet('/ship/get-ship-by-id/1').reply(200, mockShip);
            (useGetShipById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockShip,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            mockAdapter.onGet('/user/get-notification').reply(200, {
                status: 'success',
                data: mockNotification,
            });
            (useGetUserNotif as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [mockNotification],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            mockAdapter
                .onPost('/user/open-notification')
                .reply(200, { status: 'success' });
            (useUserOpenNotif as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [mockNotification],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(mainScreenStackNavMockComponent());

            const notificationTab = getByTestId('NotificationScreen');

            await act(async () => {
                fireEvent.press(notificationTab);
            });

            await act(async () => {
                expect(notificationTab).toBeTruthy();
            });

            act(() => {
                fireEvent.press(getByTestId('notifCard-0'));
            });

            // expect(getByTestId('notifCard-0')).toBeDefined();
            await waitFor(() => {
                expect(getByTestId('DetailShipScreen')).toBeDefined();
            });
        });
        it('should opened notifications and navigate into payment', async () => {
            mockAdapter.onGet('/user/get-notification').reply(200, {
                status: 'success',
                data: mockNotificationReaded,
            });
            (useGetUserNotif as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [mockNotificationReaded],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            mockAdapter
                .onPost('user/open-notification')
                .reply(200, { status: 'success' });
            (useUserOpenNotif as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [mockNotificationReaded],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            mockAdapter
                .onGet('/renter/get-transaction-by-id/123123')
                .reply(200, { status: 'success', data: mockTransaction });
            // (getTransactionByRentalId as jest.Mock).mockImplementation(() => ({
            //     mutate: jest.fn().mockImplementation((data, options) => {
            //         const { onSuccess } = options;
            //         const mockResponseData = {
            //             mockTransaction,
            //         };
            //         onSuccess(mockResponseData);
            //     }),
            // }));

            mockAdapter
                .onGet('/renter/get-transaction-by-id/1')
                .reply(200, { status: 'success' });
            (useGetTransactionByRentalId as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: {
                                    payment: [
                                        {
                                            _id: '1',
                                            paymentId: '1',
                                            receiptUrl: '1',
                                            paymentApproved: false,
                                            paymentExpiredDate: new Date(),
                                            paymentReminded: {
                                                reminderDate: '1',
                                            },
                                            createdAt: new Date(),
                                        },
                                    ],

                                    offeredPrice: 20000,
                                    rentalStartDate: new Date(),
                                    rentalEndDate: new Date(),
                                },
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            mockAdapter
                .onGet('/renter/get-ship-owner-payment-data/1')
                .reply(200, { status: 'success' });
            (useGetPaymentAccount as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockPaymentAccount,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(mainScreenStackNavMockComponent());

            const notificationTab = getByTestId('NotificationScreen');

            await act(async () => {
                fireEvent.press(notificationTab);
            });

            await act(async () => {
                expect(notificationTab).toBeTruthy();
            });

            act(() => {
                fireEvent.press(getByTestId('notifCardOpen-0'));
            });

            // // expect(getByTestId('notifCard-0')).toBeDefined();
            await waitFor(() => {
                expect(getByTestId('PaymentScreen')).toBeDefined();
            });
        });
    });
});
