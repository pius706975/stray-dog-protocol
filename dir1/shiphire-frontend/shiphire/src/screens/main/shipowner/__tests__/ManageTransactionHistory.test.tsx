import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import {
    EditShipHistory,
    ManageTransactionHistory,
} from '../manageTransactionHistory';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';
import { act } from 'react-test-renderer';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    shipId: '65a8bda44b191011546c21b1',
    shipHistory: [
        {
            _id: '65a8bda54b191011546c35cf',
            shipId: '65a8bda44b191011546c21b1',
            price: 50000000,
            rentStartDate: '2023-12-09T05:56:51.918Z',
            rentEndDate: '2023-12-14T05:56:51.918Z',
            locationDestination: 'Samarinda',
            locationDeparture: 'Balikpapan',
            source: 'automatic',
            deleteStatus: 'undefined',
            genericDocument: [
                {
                    fileName: 'file1',
                    fileUrl:
                        'https://shiphire-bucket.s3.ap-southeast-1.amazonaws.com/shiphire/shipHistory/65a8bda54b191011546c35cf/file1',
                },
            ],
            needs: '',
            renterCompanyName: '',
        },
    ],
};

const mockParamsEdit = {
    shipHistory: {
        _id: '65a8bda54b191011546c35cf',
        shipId: '65a8bda44b191011546c21b1',
        price: 50000000,
        rentStartDate: '2023-12-09T05:56:51.918Z',
        rentEndDate: '2023-12-14T05:56:51.918Z',
        locationDestination: 'Samarinda',
        locationDeparture: 'Balikpapan',
        source: 'automatic',
        deleteStatus: 'undefined',
        genericDocument: {
            fileName: 'file1',
            fileUrl:
                'https://shiphire-bucket.s3.ap-southeast-1.amazonaws.com/shiphire/shipHistory/65a8bda54b191011546c35cf/file1',
        }[0],
        needs: '',
        renterCompanyName: '',
    },
};

const mockShipData = {
    size: {
        length: 400,
        width: 75,
        height: 20,
    },
    _id: '65b9a9f35f216084af1f9e2f',
    shipOwnerId: {
        company: {
            isRejected: false,
            name: 'Fauzan Company',
            companyType: 'PT',
            address: 'Jl. Raudah',
            bankName: 'BRI',
            bankAccountName: 'Fauzan Corp',
            bankAccountNumber: 123456789,
            documentCompany: [
                {
                    documentName: 'Fauzan Corp Business License',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
                    _id: '65b9a9f35f216084af1f9d2a',
                },
                {
                    documentName: 'Fauzan Corp Deed of Establishment',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
                    _id: '65b9a9f35f216084af1f9d2b',
                },
            ],
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
            isVerified: true,
        },
        _id: '65b9a9f35f216084af1f9d27',
    },
    name: 'Barge Hauler',
    imageUrl:
        'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Barge%20Hauler?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=BmuSrc1ujivUWLEr4nH6YW%2BDrF5AAYBC5ILuijc3IZLecUPbajy6p8BF4KbtCJi9n7Ud0UjRvYrW%2FdNXN2S%2Bg2ie1vNu9XOAG0QFRwx03WKcyJ4X4oODpwgiI1j9RLCX2c4vFXAMjvlsqGMoZqLkEEn7pMnLu0lX8RxnZgE5Iv5JH%2FjiRG3LfpcDTmOgf9LECum01nS%2BW%2Bcto7Vs3g2YpanAWCvaq5vvwU3G765WhumhBPRNoQwMAAlqgXdZAEzQ4hqfrF3Fc8V9GmcGQVm2YwL2eNdZmR0djWWGU5gZx6opiCjwJlirmgJfAy4Q%2BB3LRoi7Zhh9xtZdOZm2Tz4j0g%3D%3D',
    desc: 'Barge Hauler is a heavy-duty cargo barge designed to transport goods and materials across rivers, lakes, and coastal areas. Equipped with robust loading and unloading mechanisms, it can handle large and bulky items with ease. Barge Hauler plays a crucial role in facilitating the movement of essential commodities and equipment for various industries.',
    category: {
        _id: '65b9a9f35f216084af1f9d40',
        name: 'Barge',
        __v: 0,
    },
    tags: [],
    shipDocuments: [
        {
            documentName: 'Ship Barge Hauler Document1',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Barge%20Hauler%20Owner%20Document%201?generation=1695180758491269&alt=media',
            _id: '65b9a9f35f216084af1f9e30',
        },
        {
            documentName: 'Ship Barge Hauler Document2',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Barge%20Hauler%20Owner%20Document%202?generation=1695180762377238&alt=media',
            _id: '65b9a9f35f216084af1f9e31',
        },
    ],
    pricePerMonth: 900000000,
    facilities: [
        {
            type: '65b9a9f35f216084af1f9d4a',
            typeName: 'Cargo Handling Equipment',
            name: 'Cranes',
            _id: '65b9a9f35f216084af1f9e32',
        },
        {
            type: '65b9a9f35f216084af1f9d4a',
            typeName: 'Cargo Handling Equipment',
            name: 'Conveyor Belt',
            _id: '65b9a9f35f216084af1f9e33',
        },
        {
            type: '65b9a9f35f216084af1f9d4c',
            typeName: 'Deck Cranes',
            name: 'Hydraulic Winches',
            _id: '65b9a9f35f216084af1f9e34',
        },
    ],
    specifications: [
        {
            spesificationId: {
                units: 'Units',
            },
            name: 'Vehicle Capacity',
            value: 100,
            _id: '65b9a9f35f216084af1f9e35',
        },
    ],
    rating: 5,
    totalRentalCount: 0,
    shipApproved: true,
    __v: 0,
    rfqDynamicForm: '65b9a9f35f216084af1fa026',
    shipHistory: [
        {
            _id: '65b9a9f35f216084af1fb23d',
            shipId: '65b9a9f35f216084af1f9e2f',
            price: 50000000,
            rentStartDate: '2023-12-22T02:01:22.119Z',
            rentEndDate: '2023-12-27T02:01:22.119Z',
            locationDestination: 'Samarinda',
            locationDeparture: 'Balikpapan',
            source: 'automatic',
            deleteStatus: 'undefined',
            genericDocument: [],
            __v: 0,
        },
        {
            _id: '65b9a9f35f216084af1fb245',
            shipId: '65b9a9f35f216084af1f9e2f',
            price: 50000000,
            rentStartDate: '2024-01-01T02:01:22.119Z',
            rentEndDate: '2024-01-06T02:01:22.119Z',
            locationDestination: 'Samarinda',
            locationDeparture: 'Balikpapan',
            source: 'automatic',
            deleteStatus: 'undefined',
            genericDocument: [],
            __v: 0,
        },
        {
            _id: '65b9a9f35f216084af1fb24d',
            shipId: '65b9a9f35f216084af1f9e2f',
            price: 50000000,
            rentStartDate: '2024-01-11T02:01:22.119Z',
            rentEndDate: '2024-01-16T02:01:22.119Z',
            locationDestination: 'Kutai Timur',
            locationDeparture: 'Kutai Barat',
            source: 'automatic',
            deleteStatus: 'undefined',
            genericDocument: [],
            __v: 0,
        },
    ],
};

const managementTransactionHistoryComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="ManageTransactionHistory"
                        component={ManageTransactionHistory}
                        initialParams={mockParams}
                    />
                    <MainOwnerStack.Screen
                        name="EditShipHistory"
                        component={EditShipHistory}
                        initialParams={mockParamsEdit}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Manage Transaction History Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Manage Transaction History correctly', async () => {
            const manageTransactionHistory = render(
                managementTransactionHistoryComponent,
            );
            expect(manageTransactionHistory).toMatchSnapshot();
        });
    });

    describe('Unit Testing', () => {
        it('should render item correctly', async () => {
            const manageTransactionHistory = render(
                managementTransactionHistoryComponent,
            );
            const { getByTestId, getByText } = manageTransactionHistory;
            expect(getByTestId('transaction-history-list')).toBeTruthy();
        });

        it('should handle if cancel delete transaction history', async () => {
            const manageTransactionHistory = render(
                managementTransactionHistoryComponent,
            );
            const { getByTestId, getByText } = manageTransactionHistory;
            const deleteButton = getByTestId('delete-transaction-history');
            fireEvent.press(deleteButton);

            const confirmModal = getByTestId('confirm-modal-delete');
            expect(confirmModal).toBeTruthy();

            const cancelButton = getByTestId('cancel-delete-ship-history');
            fireEvent.press(cancelButton);

            expect(getByTestId('transaction-history-list')).toBeTruthy();
        });

        it('should handle error delete transaction history', async () => {
            const manageTransactionHistory = render(
                managementTransactionHistoryComponent,
            );
            const { getByTestId, getByText } = manageTransactionHistory;
            const deleteButton = getByTestId('delete-transaction-history');
            fireEvent.press(deleteButton);

            const confirmModal = getByTestId('confirm-modal-delete');
            expect(confirmModal).toBeTruthy();

            const confirmButton = getByTestId('confirm-delete-ship-history');
            fireEvent.press(confirmButton);

            mockAdapter.onPost('/ship/delete-ship-history').reply(500, {
                message: 'failed',
            });

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'ShipOwner.ManageTransactionHistory.errorDelete',
                    visible: true,
                });

                jest.advanceTimersByTime(4000);
            });
        });

        it('should handle success delete transaction history', async () => {
            const manageTransactionHistory = render(
                managementTransactionHistoryComponent,
            );
            const { getByTestId, getByText } = manageTransactionHistory;
            const deleteButton = getByTestId('delete-transaction-history');
            fireEvent.press(deleteButton);

            const confirmModal = getByTestId('confirm-modal-delete');
            expect(confirmModal).toBeTruthy();

            const confirmButton = getByTestId('confirm-delete-ship-history');
            fireEvent.press(confirmButton);

            mockAdapter.onPost('/ship/delete-ship-history').reply(200, {
                message: 'Success',
            });

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'ShipOwner.ManageTransactionHistory.successDelete',
                    visible: true,
                });

                jest.advanceTimersByTime(4000);

                mockAdapter
                    .onGet(`/ship/get-ship-by-id/${mockParams.shipId}`)
                    .reply(200, {
                        message: 'Success',
                        data: mockShipData,
                    });
            });
        });
    });

    it('should navigate to edit transaction history', async () => {
        const manageTransactionHistory = render(
            managementTransactionHistoryComponent,
        );
        const { getByTestId, getByText } = manageTransactionHistory;
        const editButton = getByTestId('edit-transaction-history');
        fireEvent.press(editButton);

        await waitFor(() => {
            expect(getByTestId('EditHistory')).toBeTruthy();
        });
    });
});
