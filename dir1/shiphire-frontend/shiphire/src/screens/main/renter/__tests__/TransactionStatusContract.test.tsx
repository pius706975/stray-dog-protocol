import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList, TransactionParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    Complete,
    ContractStats,
    Failed,
    PaymentStats,
    ProposalStats,
    RequestForQuoteStats,
} from '../trasanctionStatus';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { useGetAllTransaction } from '../../../../hooks';

jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const Tab = createMaterialTopTabNavigator<TransactionParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockTransaction = [
    {
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
        contract: [],
        _id: '123123',
        rentalId: '123123',
        renterId: '123123',
        rentalDuration: '10 day',
        rentalStartDate: '2024-01-27T08:49:43.158+00:00',
        rentalEndDate: '2024-02-27T08:49:43.158+00:00',
        offeredPrice: 3131,
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2024-01-27T08:49:43.158+00:00',
                isOpened: true,
                _id: '123123',
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
        createdAt: 'daadafbqk1k23b1k',
        updatedAt: 'alkjsdhakhfghakfh',
        ownerDetails: {
            company: {
                name: 'fauzan',
            },
        },
        sailingStatus: 'jalan',
        payment: [],
        beforeSailingPictures: [
            {
                documentName: 'tester',
                documentUrl: 'https://www.google.com',
                description: 'ini kapal',
            },
        ],
        afterSailingPictures: [
            {
                documentName: 'tester',
                documentUrl: 'https://www.google.com',
            },
        ],
        __v: 0,
    },
];

const mainScreenStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="TransactionStatusTab">
                        {() => (
                            <Tab.Navigator>
                                <Tab.Screen
                                    name="Contract"
                                    component={ContractStats}
                                />
                            </Tab.Navigator>
                        )}
                    </MainStack.Screen>
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

mockAdapter
    .onGet('/renter/get-all-transaction')
    .reply(200, { status: 'success', data: mockTransaction });
(useGetAllTransaction as jest.Mock).mockImplementation(() => ({
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

describe('transaction status', () => {
    describe('snapshot testing', () => {
        // it('should match snapshot', async () => {
        //     const tree = render(mainScreenStackNavMockComponent()).toJSON();
        //     expect(tree).toMatchSnapshot();
        // });
    });
    describe('rendering testing', () => {
        it('should render ContractStats component', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            await waitFor(() => {
                expect(getByTestId('ContractStatsScreen')).toBeTruthy();
            });
        });
    });
});
