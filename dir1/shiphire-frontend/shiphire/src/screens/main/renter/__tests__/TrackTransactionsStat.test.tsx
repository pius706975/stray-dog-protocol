import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { TrackTransactionsStat } from '../trackTransactionsStat';
import { render } from '@testing-library/react-native';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

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
                name: 'rfq',
                desc: 'Request for Quote',
                date: '2024-01-27T08:49:43.158+00:00',
                isOpened: true,
                _id: 'id',
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

const trackStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="TrackTransactionsStat"
                        component={TrackTransactionsStat}
                        initialParams={{
                            rentalId: 'rentalId',
                        }}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

mockAdapter
    .onGet('/renter/get-transaction-by-id/rentalId')
    .reply(200, mockTransaction);

describe('TrackTransactionsStat', () => {
    describe('snapshot testing', () => {
        it('should match snapshot', () => {
            const tree = render(trackStackNavMockComponent()).toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
    describe('render screen correctly', () => {
        it('should render screen correctly', async () => {
            const { findByTestId } = render(trackStackNavMockComponent());
            const screen = await findByTestId('TrackTransactionsStatScreen');
            expect(screen).toBeTruthy();
        });
    });
});
