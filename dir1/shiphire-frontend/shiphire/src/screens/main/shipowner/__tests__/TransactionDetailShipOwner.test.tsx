import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainOwnerStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { ShipOwnerTransactionDetail } from '../transactionDetail';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ShipPictures } from '../shipPictures';
import { PaymentReceiptPreview } from '../paymentReceiptOwner';
import { NegotiateOwner } from '../negotiate';
import { useGetTransactionById } from '../../../../hooks';
import { ShipPicturesAfterRent } from '../shipPicturesAfterRent';
import { OwnerDocumentPreview } from '../documentPreview';
jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockMainStackScreens: {
    name: keyof MainOwnerStackParamList;
    title: string;
    component: any;
}[] = [
    { name: 'Negotiate', title: 'Negotiate', component: NegotiateOwner },
    {
        name: 'PaymentReceiptOwner',
        title: 'Payment Receipt Owner',
        component: PaymentReceiptPreview,
    },
    {
        name: 'OwnerDocumentPreview',
        title: 'Owner Document Preview',
        component: OwnerDocumentPreview,
    },
    { name: 'ShipPictures', title: 'Ship Pictures', component: ShipPictures },
    {
        name: 'ShipPicturesAfterRent',
        title: 'Ship Pictures After Rent',
        component: ShipPicturesAfterRent,
    },
];

const mockParamsBeforeSailing = {
    transactionId: '65bb143ba7ce793b14314577',
    sailingStatus: 'beforeSailing',
    beforeSailingPictures: [],
    afterSailingPictures: [],
};

const mockTransactionRespond = {
    status: 'success',
    data: {
        ship: {
            size: {
                length: 12,
                width: 12,
                height: 12,
            },
            _id: 'shipId',
            shipOwnerId: 'shipOwnerId',
            name: 'shipName',
            category: {
                _id: 'categoryId',
                name: 'categoryName',
            },
            imageUrl: 'imageUrl',
            shipDocuments: [
                {
                    _id: 'documentId',
                    documentUrl: 'documentUrl',
                },
            ],
        },
        rfq: {
            rfqId: 'rfqId',
            rfqUrl: 'rfqUrl',
        },
        _id: 'transactionId',
        rentalId: 'rentalId',
        renterId: 'renterId',
        rentalDuration: 60,
        rentalStartDate: '2024-01-27T08:49:43.158+00:00',
        rentalEndDate: '2024-03-27T08:49:43.158+00:00',
        offeredPrice: 12,
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2024-01-27T08:49:43.158+00:00',
                isOpened: true,
                _id: '11',
            },
        ],
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        ownerDetails: {
            company: {
                name: 'companyName',
            },
        },
        sailingStatus: 'beforeSailing',
        payment: [],
        beforeSailingPictures: [],
        afterSailingPictures: [],
        __v: 0,
    },
};
const mockTransactionBefore = {
    status: 'success',
    data: {
        ship: {
            size: {
                length: 12,
                width: 12,
                height: 12,
            },
            _id: 'shipId',
            shipOwnerId: 'shipOwnerId',
            name: 'shipName',
            category: {
                _id: 'categoryId',
                name: 'categoryName',
            },
            imageUrl: 'imageUrl',
            shipDocuments: [
                {
                    _id: 'documentId',
                    documentUrl: 'documentUrl',
                },
            ],
        },
        rfq: {
            rfqId: 'rfqId',
            rfqUrl: 'rfqUrl',
        },
        proposal: {
            proposalId: [],
            _id: 'proposalId',
            proposalUrl: 'proposalUrl',
            notes: 'notes',
            proposalName: 'proposalName',
            additionalImage: [],
        },
        contract: {
            contractId: 'contractId',
            contractUrl: 'contractUrl',
        },
        _id: 'transactionId',
        rentalId: 'rentalId',
        renterId: 'renterId',
        rentalDuration: 60,
        rentalStartDate: '2024-01-27T08:49:43.158+00:00',
        rentalEndDate: '2024-03-27T08:49:43.158+00:00',
        offeredPrice: 12,
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2024-01-27T08:49:43.158+00:00',
                isOpened: true,
                _id: '11',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ accepted',
                date: '2024-01-28T08:49:43.158+00:00',
                isOpened: true,
                _id: '22',
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: '2024-01-29T08:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
            {
                name: 'proposal 2',
                desc: 'Waiting for contract',
                date: '2024-01-30T08:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
            {
                name: 'contract 1',
                desc: 'Contract received',
                date: '2024-01-30T010:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
            {
                name: 'contract 2',
                desc: 'Contract signed',
                date: '2024-01-30T011:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
        ],
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        ownerDetails: {
            company: {
                name: 'companyName',
            },
        },
        sailingStatus: 'beforeSailing',
        payment: [],
        beforeSailingPictures: [],
        afterSailingPictures: [],
        __v: 0,
    },
};
const mockTransactionAfter = {
    status: 'success',
    data: {
        ship: {
            size: {
                length: 12,
                width: 12,
                height: 12,
            },
            _id: 'shipId',
            shipOwnerId: 'shipOwnerId',
            name: 'shipName',
            category: {
                _id: 'categoryId',
                name: 'categoryName',
            },
            imageUrl: 'imageUrl',
            shipDocuments: [
                {
                    _id: 'documentId',
                    documentUrl: 'documentUrl',
                },
            ],
        },
        rfq: {
            rfqId: 'rfqId',
            rfqUrl: 'rfqUrl',
        },
        proposal: {
            proposalId: [],
            _id: 'proposalId',
            proposalUrl: 'proposalUrl',
            notes: 'notes',
            proposalName: 'proposalName',
            additionalImage: [],
        },
        contract: {
            contractId: 'contractId',
            contractUrl: 'contractUrl',
        },
        _id: 'transactionId',
        rentalId: 'rentalId',
        renterId: 'renterId',
        rentalDuration: 60,
        rentalStartDate: '2024-01-27T08:49:43.158+00:00',
        rentalEndDate: '2024-03-27T08:49:43.158+00:00',
        offeredPrice: 12,
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2024-01-27T08:49:43.158+00:00',
                isOpened: true,
                _id: '11',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ accepted',
                date: '2024-01-28T08:49:43.158+00:00',
                isOpened: true,
                _id: '22',
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: '2024-01-29T08:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
            {
                name: 'proposal 2',
                desc: 'Waiting for contract',
                date: '2024-01-30T08:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
            {
                name: 'contract 1',
                desc: 'Contract received',
                date: '2024-01-30T010:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
            {
                name: 'contract 2',
                desc: 'Contract signed',
                date: '2024-01-30T011:49:43.158+00:00',
                isOpened: true,
                _id: '33',
            },
        ],
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        ownerDetails: {
            company: {
                name: 'companyName',
            },
        },
        sailingStatus: 'afterSailing',
        payment: [],
        beforeSailingPictures: [],
        afterSailingPictures: [],
        __v: 0,
    },
};

const transactionDetailComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="ShipOwnerTransactionDetail"
                        component={ShipOwnerTransactionDetail}
                        initialParams={{
                            rentalId: 'SH-02012024-500a5886',
                            status: 'rfq',
                        }}
                    />
                    {mockMainStackScreens.map(screen => (
                        <MainOwnerStack.Screen
                            key={screen.name}
                            name={screen.name}
                            component={screen.component}
                        />
                    ))}
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Transaction Detail Ship Owner', () => {
    describe('Snapshot Testing', () => {
        it('should render correctly', async () => {
            mockAdapter
                .onGet(`/ship-owner/get-transaction-by/SH-02012024-500a5886`)
                .reply(200, {
                    message: 'success',
                    data: mockTransactionBefore,
                });
            (useGetTransactionById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockTransactionBefore,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const component = render(transactionDetailComponent);
            await waitFor(() => {
                expect(component).toMatchSnapshot();
            });
        });
    });
    describe('Unit Testing', () => {
        it('should render transaction detail screen correctly', async () => {
            mockAdapter
                .onGet(`/ship-owner/get-transaction-by/SH-02012024-500a5886`)
                .reply(200, {
                    message: 'success',
                    data: mockTransactionBefore,
                });
            (useGetTransactionById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockTransactionBefore,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId } = render(transactionDetailComponent);

            await waitFor(() => {
                expect(
                    getByTestId('ShipOwnerTransactionDetailScreen'),
                ).toBeTruthy();
            });
        });
        it('should render document card correctly', async () => {
            mockAdapter
                .onGet(`/ship-owner/get-transaction-by/SH-02012024-500a5886`)
                .reply(200, {
                    message: 'success',
                    data: mockTransactionBefore,
                });
            (useGetTransactionById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockTransactionBefore,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId } = render(transactionDetailComponent);

            await waitFor(() => {
                expect(getByTestId('DocumentCardRFQ')).toBeTruthy();
            });
        });

        it('should handle respond pressed correctly', async () => {
            mockAdapter
                .onGet(`/ship-owner/get-transaction-by/SH-02012024-500a5886`)
                .reply(200, {
                    message: 'success',
                    data: mockTransactionRespond,
                });
            (useGetTransactionById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockTransactionRespond,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId } = render(transactionDetailComponent);

            fireEvent.press(getByTestId('TransactionStatusCardButton'));

            mockAdapter.onPost('/renter/open-transaction').reply(200, {
                message: 'success',
            });
            expect(getByTestId('DocumentShipScreen')).toBeTruthy();
        });

        it('should navigate to before sailing pictures screen', async () => {
            mockAdapter
                .onGet(`/ship-owner/get-transaction-by/SH-02012024-500a5886`)
                .reply(200, {
                    message: 'success',
                    data: mockTransactionBefore,
                });
            (useGetTransactionById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockTransactionBefore,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByText, getByTestId } = render(
                transactionDetailComponent,
            );

            fireEvent.press(getByText('Save Ship Pictures Before Rent'));

            expect(getByTestId('ShipPicturesScreen')).toBeTruthy();
        });

        it('should navigate to after sailing pictures screen', async () => {
            mockAdapter
                .onGet(`/ship-owner/get-transaction-by/SH-02012024-500a5886`)
                .reply(200, {
                    message: 'success',
                    data: mockTransactionAfter,
                });
            (useGetTransactionById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockTransactionAfter,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByText, getByTestId } = render(
                transactionDetailComponent,
            );

            fireEvent.press(getByText('Save Ship Pictures After Rent'));

            expect(getByTestId('ShipPicturesAfterRentScreen')).toBeTruthy();
        });
    });
});
