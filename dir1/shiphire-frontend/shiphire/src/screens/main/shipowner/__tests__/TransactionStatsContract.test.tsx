import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import httpRequest from '../../../../services/api';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    MainOwnerStackParamList,
    OwnerTransactionParamList,
} from '../../../../types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { OwnerContractStats } from '../transactionStatus';
import {
    useGetAllOwnerTransaction,
    useGetRenterDataById,
    useOpenTransaction,
    useSubmitContract,
} from '../../../../hooks';
import { fireEvent, render } from '@testing-library/react-native';
import { SendContract } from '../sendContract';

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
                                    name="Contract"
                                    component={OwnerContractStats}
                                />
                            </Tab.Navigator>
                        )}
                    </MainOwnerStack.Screen>
                    <MainOwnerStack.Screen
                        name="SendContract"
                        component={SendContract}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockTransaction = [
    {
        _id: '12',
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
                isOpened: true,
                _id: '65a737c476517457909c6205',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ accepted',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: true,
                _id: '65a737c476517457909c6205',
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: true,
                _id: '65a737c476517457909c6205',
            },

            {
                name: 'proposal 2',
                desc: 'Waiting for contract',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: false,
                _id: '65a737c476517457909c6205',
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
        proposal: [
            {
                proposalId: '123',
                proposalUrl: 'https://storage.googleapis.com/ship',
                notes: 'note',
                offeredPrice: 900000000,
                _id: '65be4c3bf1fd1aa28a75aa11',
            },
        ],
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: true,
                _id: '65a737c476517457909c6205',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ accepted',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: true,
                _id: '65a737c476517457909c6205',
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: true,
                _id: '65a737c476517457909c6205',
            },

            {
                name: 'proposal 2',
                desc: 'Waiting for contract',
                date: '2024-01-17T02:13:23.715Z',
                isOpened: false,
                _id: '65a737c476517457909c6205',
            },
        ],
        rfq: {
            rfqId: '12',
            rfqUrl: 'https://pdf.com',
        },
        offeredPrice: 4366999900,
        createdAt: '2024-01-17T02:13:25.761Z',
        updatedAt: '2024-01-17T02:13:25.761Z',
        contract: {},
        sailingStatus: 'beforeSailing',
        beforeSailingPictures: [],
        afterSailingPictures: [],
    },
];

const mockRenter = {
    company: {
        isRejected: false,
        name: 'Azis Company',
        companyType: 'CV',
        address: 'Jl. Pramuka 6',
        documentCompany: [
            {
                documentName: 'Azis Corp Business License',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
                _id: '659faba8c42a651dc03e47b8',
            },
            {
                documentName: 'Azis Corp Deed of Establishment',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
                _id: '659faba8c42a651dc03e47b9',
            },
        ],
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
        isVerified: true,
    },
    _id: '659faba8c42a651dc03e47b2',
    userId: {
        _id: '659faba7c42a651dc03e4792',
        name: 'Usmanul',
        email: 'usman@email.com',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        phoneNumber: '12313123',
    },
    name: 'Usmanul',
    renterPreference: [
        'Reputation and Track Record',
        'Cargo Capacity',
        'Experience',
    ],
    shipReminded: [
        {
            ship: {
                id: {
                    _id: '234',
                    name: 'Ship 1',
                    imageUrl: 'http://image.com',
                },
                reminderDate: '2024-01-22T08:49:43.158+00:00',
            },
        },
    ],
    __v: 0,
};

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
const mockOpenTransaction = () => {
    mockAdapter.onPost('/shipowner/open-transaction').reply(200, {
        message: 'success',
    });
    (useOpenTransaction as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockSubmitContract = () => {
    mockAdapter.onPost('/shipowner/open-transaction').reply(200, {
        message: 'success',
    });
    (useSubmitContract as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onLoading } = options;
            const mockResponseData = false;
            onLoading(false);
        }),
    }));
};
const mockGetRenterData = () => {
    mockAdapter.onGet('/shipowner/get-renter-data').reply(200, {
        message: 'success',
        data: mockRenter,
    });
    (useGetRenterDataById as jest.Mock).mockImplementation(() => ({
        mutateAsync: jest.fn().mockResolvedValue({
            data: {
                data: mockRenter,
            },
        }),
    }));
};

beforeAll(() => {
    mockHandleTransaction();
});
describe('TransactionStat', () => {
    describe('Unit Testing', () => {
        it('should render transaction stat correctly', () => {
            const tree = render(renderScreen);
            expect(
                tree.getByTestId('transaction-card-SH-09212023-f42e6b08'),
            ).toBeDefined();
        });

        it('should navigate to contract preview', () => {
            mockOpenTransaction();
            mockGetRenterData();
            mockSubmitContract();
            const { getByTestId } = render(renderScreen);
            fireEvent.press(getByTestId('btn-respond-SH-09212023-f42e6b08'));
            expect(
                getByTestId('btn-respond-SH-09212023-f42e6b08'),
            ).toBeDefined();
        });
    });
});
