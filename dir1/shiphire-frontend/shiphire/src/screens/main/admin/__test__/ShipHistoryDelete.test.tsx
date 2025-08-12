import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { ShipHistoryDelete } from '../shipHistoryDelete';
import {
    useApproveDeleteShipHistory,
    useGetAllShipsHistoryPending,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="ShipHistoryDelete"
                        component={ShipHistoryDelete}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockShipData = [
    {
        _id: '123',
        shipId: {
            size: {
                length: 400,
                width: 75,
                height: 20,
            },
            _id: '456',
            shipOwnerId: '565',
            name: 'Barge Hauler',
            imageUrl: 'http://image.com',
            desc: 'Barge Hauler is a heavy-duty cargo barge designed to transport goods and materials across rivers, lakes, and coastal areas. Equipped with robust loading and unloading mechanisms, it can handle large and bulky items with ease. Barge Hauler plays a crucial role in facilitating the movement of essential commodities and equipment for various industries.',
            category: '345',
            tags: [],
            shipDocuments: [
                {
                    documentName:
                        'Ship Barge Hauler Owner CertificateOfRegister',
                    documentUrl: 'http://doc.com',
                    documentExpired: '2100-12-30T16:00:00.000Z',
                    _id: '65a737c476517457909c4beb',
                },
            ],
            pricePerMonth: 900000000,
            facilities: [
                {
                    type: '567',
                    typeName: 'Cargo Handling Equipment',
                    name: 'Cranes',
                    _id: '2345',
                },
            ],
            specifications: [
                {
                    spesificationId: '46',
                    name: 'Vehicle Capacity',
                    value: 100,
                    _id: '345',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
            rfqDynamicForm: '4657',
        },
        price: 50000000,
        rentStartDate: '2024-01-17T16:00:00.000Z',
        rentEndDate: '2024-01-19T16:00:00.000Z',
        locationDestination: 'test tujuan',
        locationDeparture: 'test keberangkatan',
        source: 'manual',
        genericDocument: [
            {
                fileName: 'doc 1',
                fileUrl: 'http://doc.com',
                _id: '45',
            },
        ],
        deleteStatus: 'pending',
        __v: 0,
    },
    {
        _id: '657',
        shipId: {
            size: {
                length: 400,
                width: 75,
                height: 20,
            },
            _id: '456',
            shipOwnerId: '565',
            name: 'Barge ',
            imageUrl: 'http://image.com',
            desc: 'Barge  is a heavy-duty cargo barge designed to transport goods and materials across rivers, lakes, and coastal areas. Equipped with robust loading and unloading mechanisms, it can handle large and bulky items with ease. Barge Hauler plays a crucial role in facilitating the movement of essential commodities and equipment for various industries.',
            category: '345',
            tags: [],
            shipDocuments: [
                {
                    documentName:
                        'Ship Barge Hauler Owner CertificateOfRegister',
                    documentUrl: 'http://doc.com',
                    documentExpired: '2100-12-30T16:00:00.000Z',
                    _id: '65a737c476517457909c4beb',
                },
            ],
            pricePerMonth: 900000000,
            facilities: [
                {
                    type: '567',
                    typeName: 'Cargo Handling Equipment',
                    name: 'Cranes',
                    _id: '2345',
                },
            ],
            specifications: [
                {
                    spesificationId: '46',
                    name: 'Vehicle Capacity',
                    value: 100,
                    _id: '345',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
            rfqDynamicForm: '4657',
        },
        price: 50000000,
        rentStartDate: '2024-01-17T16:00:00.000Z',
        rentEndDate: '2024-01-19T16:00:00.000Z',
        locationDestination: 'test tujuan',
        locationDeparture: 'test keberangkatan',
        source: 'manual',
        genericDocument: [
            {
                fileName: 'doc 1',
                fileUrl: 'http://doc.com',
                _id: '45',
            },
        ],
        deleteStatus: 'pending',
        __v: 0,
    },
];

beforeEach(() => {
    mock.onGet('/admin/ship-history-pending').reply(200, {
        message: 'success',
        data: mockShipData,
    });
    (useGetAllShipsHistoryPending as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockShipData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

describe('Testing ship history delete management', () => {
    describe('Snapshot testing', () => {
        it('should render ship history delete screen correctly', () => {
            const shipHistoryDeleteScreen = render(adminStackMockComponent);
            expect(shipHistoryDeleteScreen).toMatchSnapshot();
        });
    });

    describe('Unit Test', () => {
        it('should update ship history delete pending status', async () => {
            mock.onPost('/admin/ship-history-pending').reply(200, {
                message: 'success',
            });
            (useApproveDeleteShipHistory as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            message: 'success',
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByTestId } = render(adminStackMockComponent);
            const btnDelete = getByTestId('item-0');

            fireEvent.press(btnDelete);
            const modal = getByTestId('confirm-modal');
            expect(modal.props.visible).toBeTruthy();

            const btnConfirm = getByTestId('confirm-delete-button');
            fireEvent.press(btnConfirm);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Approve Delete Ship History Success',
                });
            });
        });
    });
});
