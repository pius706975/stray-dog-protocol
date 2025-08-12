import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { TransactionDetail } from '../transactionDetail';
import { Negotiate } from '../negotiate';
import { PaymetReceiptPreview } from '../paymentReceipt';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { documentNameSlice } from '../../../../slices';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockMainStackScreens: {
    name: keyof MainStackParamList;
    title: string;
    component: any;
}[] = [
    { name: 'Negotiate', title: 'Negotiate', component: Negotiate },
    {
        name: 'PaymentReceipt',
        title: 'Payment Receipt',
        component: PaymetReceiptPreview,
    },
];

const mockTransaction = {
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
        sailingStatus: 'sailingStatus',
        payment: [],
        beforeSailingPictures: [],
        afterSailingPictures: [],
        __v: 0,
    },
};

const mainScreenStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="TransactionDetailStack"
                        component={TransactionDetail}
                        initialParams={{
                            rentalId: 'rentalId',
                            status: 'rfq',
                        }}
                    />
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

mockAdapter
    .onGet('/renter/get-transaction-by-id/rentalId')
    .reply(200, mockTransaction);

describe('transaction detail', () => {
    describe('snapshot testing', () => {
        it('should match snapshot', async () => {
            const component = render(mainScreenStackNavMockComponent());
            await waitFor(() => {
                expect(component).toMatchSnapshot();
            });
        });
    });
    describe('render screen correctly', () => {
        it('should render transaction detail screen correctly', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            await waitFor(() => {
                expect(getByTestId('TransactionDetailScreen')).toBeTruthy();
            });
        });
        it('should render document card correctly', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            fireEvent.press(getByTestId('proposalDoc-documentCard'));

            expect(getByTestId('proposalDoc-documentCard')).toBeTruthy();
        });
    });
});
