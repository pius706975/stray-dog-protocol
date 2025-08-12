import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ShipManagement } from '../shipManagement';
import { useGetAllShips, useGetShipById } from '../../../../hooks';
import { render } from '@testing-library/react-native';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const mockShipData = [
    {
        _id: '123',
        size: {
            length: 12,
            width: 34,
            height: 56,
        },
        shipOwnerId: {
            _id: '123',
            company: {
                name: 'Ship company',
                companyType: '',
                address: '',
                isVerified: true,
                isRejected: false,
            },
        },
        name: 'Ship 1',
        desc: 'ship desc',
        tags: [],
        pricePerMonth: 1200000,
        category: {
            _id: '12121',
            name: 'barge',
        },
        facilities: [
            {
                _id: '1222',
                name: 'ddd',
                type: '',
            },
        ],
        specifications: [
            {
                _id: '5466',
                name: '',
                spesificationId: { units: '' },
                value: '',
            },
        ],
        rating: 5,
        totalRentalCount: 12,
        shipDocuments: [],
        __v: 1,
        imageUrl: 'http://image.com',
        shipHistory: [
            {
                _id: '',
                rentStartDate: '',
                rentEndDate: '',
                locationDeparture: '',
                locationDestination: '',
                needs: '',
                renterCompanyName: '',
                deleteStatus: '',
                price: '',
                genericDocument: [
                    {
                        fileName: '',
                        fileUrl: '',
                    },
                ],
            },
        ],
        rfqDynamicForm: '',
        shipApproved: true,
    },
    {
        _id: '456',
        size: {
            length: 12,
            width: 34,
            height: 56,
        },
        shipOwnerId: {
            _id: '123',
            company: {
                name: 'Ship company',
                companyType: '',
                address: '',
                isVerified: true,
                isRejected: false,
            },
        },
        name: 'Ship 2',
        desc: 'ship desc',
        tags: [],
        pricePerMonth: 1200000,
        category: {
            _id: '12121',
            name: 'barge',
        },
        facilities: [
            {
                _id: '1222',
                name: 'ddd',
                type: '',
            },
        ],
        specifications: [
            {
                _id: '5466',
                name: '',
                spesificationId: { units: '' },
                value: '',
            },
        ],
        rating: 5,
        totalRentalCount: 12,
        shipDocuments: [],
        __v: 1,
        imageUrl: 'http://image.com',
        shipHistory: [
            {
                _id: '',
                rentStartDate: '',
                rentEndDate: '',
                locationDeparture: '',
                locationDestination: '',
                needs: '',
                renterCompanyName: '',
                deleteStatus: '',
                price: '',
                genericDocument: [
                    {
                        fileName: '',
                        fileUrl: '',
                    },
                ],
            },
        ],
        rfqDynamicForm: '',
        shipApproved: false,
    },
];

const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="ShipManagement"
                        component={ShipManagement}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

beforeEach(() => {
    mock.onGet('/admin/get-ship-data').reply(200, {
        message: 'success',
        data: mockShipData,
    });
    (useGetAllShips as jest.Mock).mockImplementation(() => ({
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

describe('Testing ship management screen', () => {
    describe('Snapshot testing', () => {
        it('should render ship management screen correctly', () => {
            const shipManagementScreen = render(adminStackMockComponent);

            expect(shipManagementScreen).toMatchSnapshot();
        });
    });
    describe('Component Test', () => {
        it('should render list of user', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const flatlist = getByTestId('ship-management-flatlist');

            expect(flatlist.props.data.length).toBe(2);
        });
        it('should render a flag ship approved', () => {
            const { getByText } = render(adminStackMockComponent);
            const shipItem = getByText('Ship has been approved');

            expect(shipItem).toBeTruthy();
        });
        it('should render a flag ship approved', () => {
            const { getByText } = render(adminStackMockComponent);
            const shipItem = getByText('Ship has not been approved yet');

            expect(shipItem).toBeTruthy();
        });
    });
});
