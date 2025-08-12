import React from 'react';
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react-native';
import RemindedShips from '../remindedShips/RemindedShips';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import {
    NativeStackNavigationProp,
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { ShipReminderCard } from '../remindedShips/components';
import { DetailShip } from '../detailShip';
import { act } from 'react-test-renderer';
import { useGetShipById } from '../../../../hooks';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));
jest.mock('@gorhom/bottom-sheet', () => ({
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
}));

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockRenterData = {
    status: 'success',
    data: {
        _id: 'test',
        googleId: 'test',
        firebaseId: 'test',
        roles: 'renter',
        userId: {
            _id: 'test',
            name: 'test',
            email: 'test',
            phoneNumber: 'test',
            isVerified: true,
            isPhoneVerified: true,
            isCompanySubmitted: true,
            imageUrl: 'test',
        },
        renterPreference: [],
        name: 'test',
        company: {
            name: 'test',
            companyType: 'test',
            address: 'test',
            documentCompany: [
                {
                    documentName: 'test',
                    documentUrl: 'http://test.com',
                },
                {
                    documentName: 'test2',
                    documentUrl: 'http://test.com',
                },
            ],
            isVerified: true,
            isRejected: false,
            imageUrl: 'test',
        },
        shipReminded: [
            {
                ship: {
                    id: {
                        imageUrl: 'https://example.com/ship1.jpg',
                        name: 'Ship 1',
                        _id: '1',
                    },
                    reminderDate: '2022-01-01',
                },
            },
            {
                ship: {
                    id: {
                        imageUrl: 'https://example.com/ship2.jpg',
                        name: 'Ship 2',
                        _id: '2',
                    },
                    reminderDate: '2022-01-02',
                },
            },
        ],
    },
};

const mockShip = {
    _id: '1',
    size: {
        length: 15,
        width: 15,
        height: 15,
    },
    shipOwnerId: {
        _id: 'tester',
        company: {
            name: 'tester',
            companyType: 'tester',
            address: 'tester',
            isVerified: true,
            isRejected: true,
        },
    },
    name: 'ship 1',
    desc: 'tester',
    tags: [],
    pricePerMonth: 15,
    category: {
        _id: 'tester',
        name: 'tester',
    },
    facilities: [
        {
            _id: 'tester',
            name: 'tester',
            type: 'tester',
        },
    ],
    specifications: [
        {
            _id: 'tester',
            name: 'tester',
            spesificationId: { units: 'tester' },
            value: 'tester',
        },
    ],
    rating: 15,
    totalRentalCount: 15,
    shipDocuments: [],
    __v: 15,
    imageUrl: 'tester',
    shipHistory: [
        {
            _id: 'tester',
            rentStartDate: 'tester',
            rentEndDate: 'tester',
            locationDeparture: 'tester',
            locationDestination: 'tester',
            needs: 'tester',
            renterCompanyName: 'tester',
            deleteStatus: 'tester',
            price: 'tester',
            genericDocument: [
                {
                    fileName: 'tester',
                    fileUrl: 'tester',
                },
            ],
        },
    ],
    rfqDynamicForm: 'tester',
    shipApproved: [
        {
            name: 'tester',
            desc: 'tester',
            approvedShip: true,
            _id: 'tester',
        },
    ],
};

const mainScreenStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="RemindedShips"
                        component={RemindedShips}
                    />
                    <MainStack.Screen
                        name="DetailShip"
                        component={DetailShip}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

mockAdapter.onGet('/renter/get-renter-data').reply(200, mockRenterData);
mockAdapter.onGet('/ship/get-ship-by-id/1').reply(200, mockShip);

describe('Testing RemindedShips Screen', () => {
    it('should render RemindedShips screen correctly', () => {
        const remindedShipsScreen = render(
            mainScreenStackNavMockComponent(),
        ).toJSON();
        expect(remindedShipsScreen).toMatchSnapshot();
    });
});
describe('RemindedShips', () => {
    it('renders the ship reminder cards correctly', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());

        await waitFor(() => {
            expect(getByTestId('ship-1')).toBeTruthy();
        });
    });
    it('should go to detail ship after clicked', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());

        await waitFor(() => {
            expect(getByTestId('ship-1')).toBeTruthy();
        });

        await act(async () => {
            fireEvent.press(getByTestId('ship-1'));
        });

        await waitFor(() => {
            expect(getByTestId('DetailShipScreen')).toBeTruthy();
        });
    });
});
