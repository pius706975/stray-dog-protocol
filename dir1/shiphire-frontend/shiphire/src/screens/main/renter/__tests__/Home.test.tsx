import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { TOKEN, USERDATA } from '../../../../configs';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../home/Home';
import { DetailShip } from '../detailShip';
import { TransactionStatusTabNav } from '../../../../navigations';
import { act } from 'react-test-renderer';
import { Search } from '../search';
import Notification from '../notification/Notification';
import Account from '../account/Account';
import { useGetUserNotif } from '../../../../hooks';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<MainScreenParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

// jest.mock('../../../../hooks');

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useIsFocused: jest.fn(),
}));

const mockMainStackScreens: {
    name: keyof MainStackParamList;
    title: string;
    component: any;
}[] = [
    { name: 'DetailShip', title: 'Detail Ship', component: DetailShip },
    {
        name: 'TransactionStatusTab',
        title: 'Transaction Status',
        component: TransactionStatusTabNav,
    },
    {
        name: 'Search',
        title: 'Search',
        component: Search,
    },
];

const mainScreenStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="MainScreenTab">
                        {() => (
                            <Tab.Navigator>
                                <Tab.Screen name="Home" component={Home} />
                                <Tab.Screen
                                    name="Notification"
                                    component={Notification}
                                />
                                <Tab.Screen
                                    name="Account"
                                    component={Account}
                                />
                            </Tab.Navigator>
                        )}
                    </MainStack.Screen>
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

const mockGetRenterDataResponse = {
    status: 'success',
    data: {
        company: {
            documentCompany: [],
        },
        _id: '64e301b71b191003bef921db',
        userId: '64e2e2a71b191003bef9216f',
        name: 'Muhamad Fauzan',
        renterPreference: ['reputation and track record', 'barge'],
        __v: 0,
    },
};

const mockGetShipCategoriesResponse = {
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

const mockGetTopRatedShipsResponse = {
    status: 'success',
    data: [
        {
            size: {
                length: 80,
                width: 30,
                height: 15,
            },
            _id: '1',
            shipOwnerId: '64c764b5db67b394e843b133',
            name: 'Flying dutchman',
            desc: 'this ship has 7 captain and 50 crew and this ship made of steel',
            category: {
                _id: '64c76a7ddb67b394e843b1af',
                name: 'Ferry',
            },
            tags: [],
            pricePerMonth: 3000000000,
            facilities: [],
            specifications: [],
            rating: 4.8,
            totalRentalCount: 555,
            shipDocuments: [],
            __v: 0,
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/pngtree-cat-default-avatar-image_2246581.jpg?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=MNFuDljnyr1xrLs1efab6TvlKq8rFxPjwceQwzN11EKw7AUdnteAjCX2R%2FPFuQiAnA2i7tMGt9f88XYrejS6l45FyPOjk2FQscngKUpeLnWeHFV0GNoDMthiCXb8PcmWHM70onfFmhbH%2FXzWcoHr8GC%2FL005Lorvu9moATAbXdGeHdj3EH3uTbfn6wrXrWuy%2BMJn8xJfZKC9ul8Wi0IDMob8TKThSE9VNavEUhOvBCdE%2BD%2Bq4L8oRXyli6kAAjSOrugn%2Fg059UHMdoTNP3chznlsdv3Mo26oE%2B5aLniXCWr%2Fv2D5OpfnnrI3aDE6YXqwPV%2FfYl4ULCTNEYw0VaTP3g%3D%3D',
            shipHistory: [],
            rfqDynamicForm: 'sad',
            shipApproved: [
                {
                    name: 'Ferry',
                    desc: 'barge',
                    approvedShip: true,
                    _id: '1',
                },
            ],
        },
        {
            size: {
                length: 80,
                width: 30,
                height: 15,
            },
            _id: '2',
            shipOwnerId: '64c764b5db67b394e843b133',
            name: 'Spongebob',
            desc: 'this ship has 50 crew and this ship made of steel',
            category: {
                _id: '12e1bkdk31',
                name: 'Barge',
            },
            tags: [],
            pricePerMonth: 10000000,
            facilities: [],
            specifications: [],
            rating: 4.8,
            totalRentalCount: 555,
            shipDocuments: [],
            __v: 0,
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/pngtree-cat-default-avatar-image_2246581.jpg?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=MNFuDljnyr1xrLs1efab6TvlKq8rFxPjwceQwzN11EKw7AUdnteAjCX2R%2FPFuQiAnA2i7tMGt9f88XYrejS6l45FyPOjk2FQscngKUpeLnWeHFV0GNoDMthiCXb8PcmWHM70onfFmhbH%2FXzWcoHr8GC%2FL005Lorvu9moATAbXdGeHdj3EH3uTbfn6wrXrWuy%2BMJn8xJfZKC9ul8Wi0IDMob8TKThSE9VNavEUhOvBCdE%2BD%2Bq4L8oRXyli6kAAjSOrugn%2Fg059UHMdoTNP3chznlsdv3Mo26oE%2B5aLniXCWr%2Fv2D5OpfnnrI3aDE6YXqwPV%2FfYl4ULCTNEYw0VaTP3g%3D%3D',
            shipHistory: [],
            rfqDynamicForm: 'sad',
            shipApproved: [
                {
                    name: 'barge',
                    desc: 'barge',
                    approvedShip: true,
                    _id: '2',
                },
            ],
        },
        {
            size: {
                length: 80,
                width: 30,
                height: 15,
            },
            _id: '3',
            shipOwnerId: '64c764b5db67b394e843b133',
            name: 'Patrick',
            desc: 'this ship has 7 captain',
            category: {
                _id: '64c76a7ddb67b394e843b1af',
                name: 'SPOB',
            },
            tags: [],
            pricePerMonth: 2000004,
            facilities: [],
            specifications: [],
            rating: 4.8,
            totalRentalCount: 555,
            shipDocuments: [],
            __v: 0,
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/pngtree-cat-default-avatar-image_2246581.jpg?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=MNFuDljnyr1xrLs1efab6TvlKq8rFxPjwceQwzN11EKw7AUdnteAjCX2R%2FPFuQiAnA2i7tMGt9f88XYrejS6l45FyPOjk2FQscngKUpeLnWeHFV0GNoDMthiCXb8PcmWHM70onfFmhbH%2FXzWcoHr8GC%2FL005Lorvu9moATAbXdGeHdj3EH3uTbfn6wrXrWuy%2BMJn8xJfZKC9ul8Wi0IDMob8TKThSE9VNavEUhOvBCdE%2BD%2Bq4L8oRXyli6kAAjSOrugn%2Fg059UHMdoTNP3chznlsdv3Mo26oE%2B5aLniXCWr%2Fv2D5OpfnnrI3aDE6YXqwPV%2FfYl4ULCTNEYw0VaTP3g%3D%3D',
            shipHistory: [],
            rfqDynamicForm: 'sad',
            shipApproved: [
                {
                    name: 'SPOB',
                    desc: 'barge',
                    approvedShip: true,
                    _id: '3',
                },
            ],
        },
    ],
};

const mockGetPopularShipsResponse = {
    status: 'success',
    data: [
        {
            size: {
                length: 75,
                width: 25,
                height: 8,
            },
            _id: '2',
            shipOwnerId: '64c764b5db67b394e843b133',
            name: 'Barge Hauler',
            desc: 'Barge Hauler designed to provide a comfortable and safe journey along coastal routes. Equipped with advanced navigation systems and luxurious amenities, it offers a delightful travel experience for passengers.',
            category: {
                _id: 'aafdhfahfd12kk12',
                name: 'Barge',
                __v: 0,
            },
            tags: [],
            pricePerMonth: 900000000,
            facilities: [
                '64c76ac5db67b394e843b1dd',
                '64c76ac5db67b394e843b1de',
            ],
            specifications: [
                '64c76ac5db67b394e843b1e1',
                '64c76ac5db67b394e843b1e2',
            ],
            rating: 4,
            totalRentalCount: 800,
            shipDocuments: [],
            __v: 0,
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/677555.jpg?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=G9oswYH1gE%2FaAPKutP1iAjWtqcZNfWV3T%2FKnXAFngY76NgTALZ%2Bw6s2MOKcMR2mDhXhj0FxINEa3Hw8lopsDrGo1WDM3FlcrTYLAdtkKaXgQJFfdtzd%2F0hu0uwTfsDUm%2BKFf46bVEZxrszosXF%2BOzDLZkDCLz9ftRR3WFOptcLVjpC2Yu1HOKC0CjFIjeN%2FO4SuNmKEBLwZL14bicbBQWGCHEfFxQjoWS%2Bowxatamcx0ioy6jvDvkbksRZmCWj9%2B0Txllu5ti7jezC%2B8mT5OZhA7dcZE8Onh57Zn5S3gRbFV%2Fdqm6u2hY1pbALt1sLXILxbK%2BqIgDR3aqjbqqPuAfw%3D%3D',
            shipApproved: true,
        },
    ],
};

const mockNotification = {
    userId: 'test',
    shipId: 'test',
    transactionId: 'test',
    rentalId: 'test',
    notifType: 'test',
    title: 'test',
    body: 'test',
    isReaded: false,
};

const mockTransaction = {
    status: 'success',
    data: [
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
            contract: {
                contractId: '123123',
                contractUrl: 'https://www.google.com',
            },
            _id: '123123',
            rentalId: '123123',
            renterId: '123123',
            rentalDuration: '10 day',
            rentalStartDate: new Date(),
            rentalEndDate: new Date(),
            offeredPrice: 3131,
            status: [
                {
                    name: 'proposal 1',
                    desc: 'test',
                    date: new Date(),
                    isOpened: false,
                    _id: '123123',
                },
                {
                    name: 'contract 1',
                    desc: 'test',
                    date: new Date(),
                    isOpened: false,
                    _id: '123123',
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
    ],
};

beforeEach(() => {
    mockAdapter.onGet('/user/get-notification').reply(200, mockTransaction);
    // (useGetUserNotif as jest.Mock).mockImplementation(() => ({
    //     mutate: jest.fn().mockImplementation((data, options) => {
    //         const onSuccess = options;
    //         const mockResponseData = {
    //             data: {
    //                 data: [mockTransaction.data[0]],
    //             },
    //         };
    //         onSuccess(mockResponseData);
    //     }),
    // }));
});

mockAdapter
    .onGet('/renter/get-renter-data')
    .reply(200, mockGetRenterDataResponse);

mockAdapter
    .onGet('/ship/get-ship-categories')
    .reply(200, mockGetShipCategoriesResponse);

mockAdapter
    .onGet('/ship/get-top-rated-ships')
    .reply(200, mockGetTopRatedShipsResponse);

mockAdapter
    .onGet('/ship/get-popular-ships')
    .reply(200, mockGetPopularShipsResponse);

mockAdapter
    .onGet(
        '/ship/search-ship?searchTerm=barge&category=barge&inputRentStartDate=02Jan2023&inputRentEndDate=05Jan2023',
    )
    .reply(200, mockSearching);

mockAdapter.onGet('/renter/get-all-transaction').reply(200, mockTransaction);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Muhamad Fauzan',
        email: 'usman@email.com',
        password: 'test',
        isVerified: false,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

describe('Home Screen', () => {
    it('should renders correctly', () => {
        const tree = render(mainScreenStackNavMockComponent()).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Home Screen Component', () => {
    it('should show name of user in header text', async () => {
        const { getByText, getByTestId } = render(
            mainScreenStackNavMockComponent(),
        );
        await act(async () => {
            fireEvent.press(getByTestId('homeScreen'));
        });

        expect(getByTestId('homeScreen')).toBeTruthy();

        await act(() => {
            expect(getByTestId('headerHome')).toBeTruthy();
        });

        await waitFor(() => expect(getByText('textGreetMuhamad')).toBeTruthy());
    });
    it('should show transaction button and navigate', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());
        await act(async () => {
            fireEvent.press(getByTestId('homeScreen'));
        });

        expect(getByTestId('homeScreen')).toBeTruthy();

        await act(() => {
            expect(getByTestId('headerHome')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByTestId('transactionButton'));
        });

        expect(getByTestId('RequestForQuoteStatsScreen')).toBeTruthy();
    });
    it('should navigate to Search Screen when click Search field', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());
        await act(async () => {
            fireEvent.press(getByTestId('homeScreen'));
        });

        expect(getByTestId('homeScreen')).toBeTruthy();

        await act(async () => {
            fireEvent.press(getByTestId('searchBar'));
        });
    });
    it('should show top rated ships', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());
        await act(async () => {
            fireEvent.press(getByTestId('homeScreen'));
        });

        expect(getByTestId('homeScreen')).toBeTruthy();

        const carouselTopRatedShips = getByTestId('carouselTopRatedShip');

        const carouselComponent = getByTestId('carouselComponent-0');

        fireEvent.press(carouselTopRatedShips);

        expect(carouselTopRatedShips).toBeDefined();

        expect(carouselComponent).toBeDefined();

        fireEvent.press(getByTestId('categoryPressable-Patrick'));
    });
    it('should handle error when get top rented ships error', async () => {
        render(mainScreenStackNavMockComponent());
        mockAdapter
            .onGet('/ship/get-top-rated-ships')
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
    it('should handle error when get popular ships error', async () => {
        render(mainScreenStackNavMockComponent());
        mockAdapter
            .onGet('/ship/get-popular-ships')
            .reply(401, { status: 'failed' });

        await waitFor(async () => {
            const modalState = store.getState().modal;
            jest.advanceTimersByTime(4000);

            expect(modalState).toEqual({
                visible: true,
                status: 'failed',
                text: 'failedTokenExpired',
            });
        });
    });
    it('should render top rated ships correctly', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());

        mockAdapter
            .onGet('/ship-owner/get-top-rated-ships')
            .reply(200, mockGetTopRatedShipsResponse);

        const carouselTopRatedShips = getByTestId('carouselTopRatedShip');

        act(async () => {
            fireEvent.press(carouselTopRatedShips);
        });

        expect(carouselTopRatedShips).toBeDefined();
    });
    it('should navigate to search screen when viewALl clicked', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());

        const viewAll = getByTestId('shipListViewPopular-button');

        act(async () => {
            fireEvent.press(viewAll);
        });

        expect(getByTestId('SearchScreen')).toBeDefined();
    });
    it('should render popularship', async () => {
        mockAdapter
            .onGet('/ship/get-popular-ships')
            .reply(200, mockGetPopularShipsResponse);

        const { getByTestId, findByText } = render(
            mainScreenStackNavMockComponent(),
        );

        const popularShips = getByTestId(
            'shipListViewPopular-shipListViewPopular',
        );

        expect(popularShips).toBeDefined();

        // expect(findByText('Barge Hauler')).toBeTruthy();
    });
    // it('should get user notif filter', async () => {
    //     mockAdapter.onGet('/user/get-notification').reply(200, mockNotification);
    //         (useGetUserNotif as jest.Mock).mockImplementation(() => ({
    //             mutate: jest.fn().mockImplementation((data, options) => {
    //                 const onSuccess = options;
    //                 const mockResponseData = {
    //                     data: {
    //                         data: [
    //                             {
    //                                 isReaded: false,
    //                             },
    //                         ],
    //                     },
    //                 };
    //                 onSuccess(mockResponseData);
    //             }),
    //         }));

    //     const { getByTestId, findByText } = render(
    //         mainScreenStackNavMockComponent(),
    //     );

    // });
});

describe('integration token ', () => {
    test('if token expired, should show modal', async () => {
        render(mainScreenStackNavMockComponent());
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

        mockAdapter
            .onGet('/ship/get-popular-ships')
            .reply(401, { status: 'failed' });

        await waitFor(async () => {
            const modalState = store.getState().modal;
            jest.advanceTimersByTime(4000);
            expect(modalState).toEqual({
                visible: true,
                status: 'failed',
                text: 'failedTokenExpired',
            });
        });
    });
});
