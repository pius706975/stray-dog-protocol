import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainAdminStackParamList, Transaction } from '../../../../types';
import { DetailTransaction } from '../detailTransaction';
import { useGetTransactionByRentalId } from '../../../../hooks';
import renderer from 'react-test-renderer';
import { act, fireEvent, render } from '@testing-library/react-native';
import { AdminDocumentPreview } from '../documentPreview';
import { useTranslation } from 'react-i18next';

jest.mock('../../../../hooks');
jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: str => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
    initReactI18next: {
        type: '3rdParty',
        init: () => {},
    },
}));
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const mockTransaction: Transaction = {
    _id: '34345',
    rentalId: 'SH-4567',
    renterId: '456',
    rentalDuration: 2,
    ship: {
        size: {
            length: 12,
            width: 12,
            height: 12,
        },
        _id: '12',
        shipOwnerId: '34',
        name: 'Ship 1',
        category: {
            _id: '123',
            name: 'barge',
        },
        imageUrl: '',
        shipDocuments: [],
    },
    rfq: {
        rfqId: '',
        rfqUrl: 'http://doc.com',
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
        {
            name: 'rfq 2',
            desc: 'RFQ Accepted',
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
        {
            name: 'rfq 2',
            desc: 'RFQ Accepted',
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
    contract: {
        contractId: '123',
        contractUrl: 'http://',
    },
    proposal: [
        {
            proposalId: {
                _id: '',
                otherDoc: [
                    {
                        documentName: '',
                        documentUrl: '',
                        _id: '',
                    },
                ],
            },
            proposalUrl: 'http://doc.com',
            _id: '',
            additionalImage: [
                {
                    imageUrl: '',
                    imageDescription: '',
                },
            ],
        },
    ],
    rentalStartDate: new Date(),
    rentalEndDate: new Date(),
    offeredPrice: 1112222333,
    needs: '',
    locationDestination: '',
    locationDeparture: '',
    shipTypeRent: '',
    createdAt: '',
    updatedAt: '',
    sailingStatus: '',
    beforeSailingPictures: [
        {
            documentName: 'wewew',
            documentUrl: '',
            description: '',
        },
    ],
    afterSailingPictures: [
        {
            documentName: '',
            documentUrl: '',
        },
    ],
    payment: [
        {
            _id: '',
            paymentId: '',
            receiptUrl: '',
            paymentApproved: true,
            paymentExpiredDate: new Date(),
            paymentReminded: [{ reminderDate: '' }],
            createdAt: new Date(),
        },
    ],
    __v: 1,
};

const mockDocProps = {
    documentUrl: 'http://doc.com',
    isButtonActive: false,
    shipId: '123',
    documentName: 'RFQ Document',
};

const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="DetailTransaction"
                        component={DetailTransaction}
                        initialParams={{ transactionData: mockTransaction }}
                    />
                    <MainAdminStack.Screen
                        name="AdminDocumentPreview"
                        component={AdminDocumentPreview}
                        initialParams={mockDocProps}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

beforeEach(() => {
    mock.onGet('/admin/get-transactionById').reply(200, {
        message: 'success',
        data: mockTransaction,
    });
    (useGetTransactionByRentalId as jest.Mock).mockImplementation(() => ({
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
    useTranslation('common');
});

describe('Testing transaction detail screen', () => {
    describe('Snapshot testing', () => {
        it('should render transaction detail screen corectly', async () => {
            const transactionDetail = renderer.create(adminStackMockComponent);
            expect(transactionDetail).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should open pdf viewer when press RFQ document', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const rfqdoc = getByTestId('RFQ-document-preview');
            act(() => {
                fireEvent.press(rfqdoc);
            });
            const documentScreen = getByTestId('DocumentShipScreen');
            expect(rfqdoc).toBeDefined();
            expect(documentScreen).toBeDefined();
        });
        it('should open pdf viewer when press proposal document', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const proposalDoc = getByTestId('Proposal-document-preview');
            act(() => {
                fireEvent.press(proposalDoc);
            });
            const documentScreen = getByTestId('DocumentShipScreen');
            expect(proposalDoc).toBeDefined();
            expect(documentScreen).toBeDefined();
        });
        it('should open pdf viewer when press contract document', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const contractDoc = getByTestId('Contract-document-preview');
            act(() => {
                fireEvent.press(contractDoc);
            });
            const documentScreen = getByTestId('DocumentShipScreen');
            expect(contractDoc).toBeDefined();
            expect(documentScreen).toBeDefined();
        });
    });
});
