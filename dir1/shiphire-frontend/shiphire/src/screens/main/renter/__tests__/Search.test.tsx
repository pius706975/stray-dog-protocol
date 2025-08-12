import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { Search } from '../search';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN, USERDATA } from '../../../../configs';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockCategories = {
    status: 'success',
    data: [
        {
            _id: '64c764bbdb67b394e843b139',
            name: 'Barge',
            __v: 0,
        },
        {
            _id: '64c769bddb67b394e843b16c',
            name: 'Tugboat',
            __v: 0,
        },
        {
            _id: '64c76a7ddb67b394e843b1af',
            name: 'Ferry',
            __v: 0,
        },
    ],
};

const mockSearching = {
    status: 'success',
    data: [
        {
            _id: '1',
            name: 'barge',
            categories: 'barge',
            companyName: 'PT. Barge',
            rating: '4.5',
            totalRentalCount: '100',
            imageUrl: 'https://www.google.com',
            pricePerMonth: 9000000,
            shipApproved: [
                {
                    name: 'barge',
                    desc: 'barge',
                    approvedShip: true,
                    _id: '1',
                },
            ],
        },
        {
            _id: '2',
            name: 'coastal',
            categories: 'Ferry',
            companyName: 'PT. Coastal',
            rating: '4.8',
            totalRentalCount: '80',
            imageUrl: 'https://www.google.com',
            pricePerMonth: 12000000,
            shipApproved: [
                {
                    name: 'coastal',
                    desc: 'coastal',
                    approvedShip: true,
                    _id: '1',
                },
            ],
        },
    ],
};

const mockScreen = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="Search" component={Search} />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

mockAdapter.onGet('/ship/get-ship-categories').reply(200, mockCategories);

mockAdapter
    .onGet(
        '/ship/search-ship?searchTerm=&category=&inputRentStartDate=02Jan2023&inputRentEndDate=30Mar2024',
    )
    .reply(200, mockSearching);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Usmanul',
        email: 'usman@email.com',
        password: 'test',
        phoneNumber: '12313123',
        isVerified: false,
        isCompanySubmitted: true,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

describe('Testing search screen', () => {
    describe('Snapshot Testing', () => {
        it('should render search screen correctly', async () => {
            const searchScreen = render(mockScreen).toJSON();
            await act(async () => {
                expect(searchScreen).toMatchSnapshot();
            });
        });
    });
    describe('Unit Testing', () => {
        it('should render search screen correctly', async () => {
            const { getByTestId } = render(mockScreen);
            const searchScreen = getByTestId('SearchScreen');

            await act(async () => {
                expect(searchScreen).toBeTruthy();
                expect(getByTestId('shipList')).toBeDefined();
            });
        });
        test('searching input integration', async () => {
            const { getByPlaceholderText, getByTestId } = render(mockScreen);

            const searchInput = getByPlaceholderText('searchFieldPlaceholder');

            await act(async () => {
                fireEvent.changeText(searchInput, 'Ba');
            });

            await waitFor(async () => {
                expect(searchInput).toBeTruthy();
            });

            jest.advanceTimersByTime(800);

            mockAdapter
                .onGet(
                    '/ship/search-ship?searchTerm=Ba&category=&inputRentStartDate=&inputRentEndDate=',
                )
                .reply(200, mockSearching);

            await waitFor(async () => {
                expect(getByTestId('shipList')).toBeDefined();
            });
        });
        test('searching input integration and clicked', async () => {
            const { getByPlaceholderText, getByTestId, findByTestId } =
                render(mockScreen);

            const searchInput = getByPlaceholderText('searchFieldPlaceholder');

            await act(async () => {
                fireEvent.changeText(searchInput, 'Ba');
            });

            await waitFor(async () => {
                expect(searchInput).toBeTruthy();
            });

            jest.advanceTimersByTime(800);

            mockAdapter
                .onGet(
                    '/ship/search-ship?searchTerm=Ba&category=&inputRentStartDate=&inputRentEndDate=',
                )
                .reply(200, mockSearching);

            await waitFor(async () => {
                expect(getByTestId('shipList')).toBeDefined();
            });

            await act(async () => {
                fireEvent.press(getByTestId('shipList'));
            });

            // expect(findByTestId('DetailShipScreen')).toBeTruthy();
        });
        test('modal filter to be close', async () => {
            const { getByTestId } = render(mockScreen);

            const filterButton = getByTestId('filterButton');

            await act(async () => {
                fireEvent.press(filterButton);
            });

            await waitFor(async () => {
                const filterModal = getByTestId('filterModal');
                expect(filterModal).toBeTruthy();
            });

            const closeFilter = getByTestId('btnCloseFilterModal');

            await act(async () => {
                fireEvent.press(closeFilter);
            });

            expect(closeFilter).toBeTruthy();
        });
        test('modal apply filter', async () => {
            const { getByTestId } = render(mockScreen);

            const filterButton = getByTestId('filterButton');

            await act(async () => {
                fireEvent.press(filterButton);
            });

            await waitFor(async () => {
                const filterModal = getByTestId('filterModal');
                expect(filterModal).toBeTruthy();
            });

            const applyFilter = getByTestId('btnApplyFilterModal');

            await act(async () => {
                fireEvent.press(applyFilter);
            });

            expect(applyFilter).toBeTruthy();
        });
        test('searching input', async () => {
            const { getByPlaceholderText } = render(mockScreen);

            const searchInput = getByPlaceholderText('searchFieldPlaceholder');

            await act(async () => {
                fireEvent.changeText(searchInput, 'Ba');
            });

            await waitFor(async () => {
                expect(searchInput).toBeTruthy();
            });
        });
    });
});
describe('integration Error', () => {
    it('should error get API categories', async () => {
        await AsyncStorage.setItem(
            USERDATA,
            JSON.stringify({
                name: 'Usmanul',
                email: 'usman@email.com',
                password: 'test',
                phoneNumber: '12313123',
                isVerified: false,
                isCompanySubmitted: true,
            }),
        );
        await AsyncStorage.setItem(
            TOKEN,
            JSON.stringify({
                accessToken: '',
                refreshToken: '',
            }),
        );
        render(mockScreen);
        mockAdapter
            .onGet('/ship/get-ship-categories')
            .reply(401, { status: 'failed' });
        await waitFor(async () => {
            const modalState = store.getState().modal;
            jest.advanceTimersByTime(4000);
            expect(modalState).toEqual({
                visible: true,
                status: 'failed',
                text: 'Token expired, please re-sign in',
            });
        });
    });
    it('should error get API search', async () => {
        render(mockScreen);
        mockAdapter
            .onGet(
                '/ship/search-ship?searchTerm=&category=&inputRentStartDate=&inputRentEndDate=',
            )
            .reply(500, { status: 'failed' });
    });
});
