import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import {
    AboutUs,
    Company,
    CompanyRegister,
    EditProfile,
    RemindedShips,
    RenterAccount,
    VerifyEmail,
} from '../';
import {
    RFQFILEPATH,
    ROLES,
    TOKEN,
    USERDATA,
    getDataFromLocalStorage,
} from '../../../../configs';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import { act } from 'react-test-renderer';
import { useGetUserNotif } from '../../../../hooks';
import { ChangeLanguage } from '../../../changeLanguage';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<MainScreenParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

const mockMainStackScreens: {
    name: keyof MainStackParamList;
    title: string;
    component: any;
}[] = [
    { name: 'AboutUs', title: 'About Us', component: AboutUs },
    { name: 'EditProfile', title: 'Edit Profile', component: EditProfile },
    {
        name: 'CompanyRegister',
        title: 'Company Register',
        component: CompanyRegister,
    },
    { name: 'Company', title: 'Company Profile', component: Company },
    {
        name: 'ChangeLanguage',
        title: 'Change Language',
        component: ChangeLanguage,
    },
    {
        name: 'RemindedShips',
        title: 'Reminded Ships',
        component: RemindedShips,
    },
    { name: 'VerifEmail', title: 'Verify Email', component: VerifyEmail },
];

const mainScreenStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="MainScreenTab">
                        {() => (
                            <Tab.Navigator>
                                <Tab.Screen
                                    name="Account"
                                    component={RenterAccount}
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

const mockUserProfileResponseSuccess = {
    status: 'success',
};
const mockUserSuccess = {
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
                        _id: 'test',
                        name: 'test',
                        imageUrl: 'test',
                    },
                    reminderDate: '09 Sep 2021',
                },
            },
        ],
    },
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

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        _id: 'test',
        firebaseId: 'test',
        name: 'Usmanul',
        email: 'usman@email.com',
        password: 'test',
        isVerified: false,
        isCompanySubmitted: false,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

const setupAsyncStorage2 = async () => {
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
            accessToken: 'test',
            refreshToken: 'test',
        }),
    );
};

// beforeEach(async () => {
//     AsyncStorage.getItem = jest.fn().mockReturnValue(
//         JSON.stringify({
//             name: 'Usmanul',
//             email: 'usman@email.com',
//             password: 'test',
//             isVerified: true,
//             isCompanySubmitted: true,
//         }),
//     );
// });

mockAdapter.onGet('/user/get-notification').reply(200, mockNotification);
mockAdapter.onGet('/renter/get-renter-data').reply(200, mockUserSuccess);
describe('Testing Account screen', () => {
    describe('Snapshot testing', () => {
        it('should render Account screen correctly', () => {
            const accountScreen = render(
                mainScreenStackNavMockComponent(),
            ).toJSON();

            expect(accountScreen).toMatchSnapshot();
        });
    });
    describe('Unit testing', () => {
        it('should navigate to About Us screen when About Us button pressed', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            act(() => {
                fireEvent.press(getByTestId('AccountScreen'));
            });

            expect(getByTestId('AccountScreen')).toBeTruthy();

            const aboutUsButton = await screen.findByText('labelAboutUs');

            act(() => {
                fireEvent.press(aboutUsButton);
            });

            expect(aboutUsButton).toBeTruthy();

            const aboutUsScreen = await screen.findByTestId('AboutUs');

            expect(aboutUsScreen).toBeTruthy();
        });
        it('should navigate to Edit Profile screen when Edit Profile clicked', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            act(() => {
                fireEvent.press(getByTestId('AccountScreen'));
            });

            expect(getByTestId('AccountScreen')).toBeTruthy();

            const editProfileButton = await screen.findByText(
                'labelEditProfile',
            );

            act(() => {
                fireEvent.press(editProfileButton);
            });

            expect(editProfileButton).toBeTruthy();

            const editProfileScreen = await screen.findByTestId(
                'EditProfileScreen',
            );

            expect(editProfileScreen).toBeTruthy();
        });
        // it('should navigate to Language Screen when clicked', async () => {
        //     const { getByTestId } = render(mainScreenStackNavMockComponent());

        //     act(() => {
        //         fireEvent.press(getByTestId('AccountScreen'));
        //     });

        //     expect(getByTestId('AccountScreen')).toBeTruthy();

        //     const languageButton = await screen.findByText(
        //         'labelChangeLanguage',
        //     );

        //     act(() => {
        //         fireEvent.press(languageButton);
        //     });

        //     expect(languageButton).toBeTruthy();

        // const changeLanguageScreen = await screen.findByTestId(
        //     'ChangeLanguageScreen',
        // );

        // expect(changeLanguageScreen).toBeTruthy();
        // });
        it('should navigate to company registration Screen when user not yet company register', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            act(() => {
                fireEvent.press(getByTestId('AccountScreen'));
            });

            expect(getByTestId('AccountScreen')).toBeTruthy();

            const companyRegisButton = await screen.findByText(
                'labelCompanyRegistration',
            );

            act(() => {
                fireEvent.press(companyRegisButton);
            });

            const companyRegisScreen = await screen.findByTestId(
                'CompanyRegisterScreen',
            );

            expect(companyRegisScreen).toBeTruthy();
        });
        it('should navigate to reminded ships Screen when clicked', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            act(() => {
                fireEvent.press(getByTestId('AccountScreen'));
            });

            expect(getByTestId('AccountScreen')).toBeTruthy();

            const remindedShipButton = await screen.findByText(
                'Reminded Ships',
            );

            act(() => {
                fireEvent.press(remindedShipButton);
            });

            await act(async () => {
                expect(remindedShipButton).toBeTruthy();
            }); // reafactor this (console warn iso format)
        });

        it('should remove Token, Roles, and RFQ file path from AsyncStorage when logout success', async () => {
            const { getByTestId } = render(mainScreenStackNavMockComponent());

            act(() => {
                fireEvent.press(getByTestId('AccountScreen'));
            });

            expect(getByTestId('AccountScreen')).toBeTruthy();

            const logoutButton = await screen.findByText('buttonLogout');

            fireEvent.press(logoutButton);

            await waitFor(() => {
                mockAdapter
                    .onPost('/auth/signout')
                    .reply(200, mockUserProfileResponseSuccess);

                expect(AsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN);
                expect(AsyncStorage.removeItem).toHaveBeenCalledWith(ROLES);
                expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
                    RFQFILEPATH,
                );
            });
        });
        describe('test for signout and show the slices', () => {
            beforeEach(async () => {
                await setupAsyncStorage2();
            });
            it('should update userStatusSlice when logout button pressed', async () => {
                const { getByTestId } = render(
                    mainScreenStackNavMockComponent(),
                );

                act(() => {
                    fireEvent.press(getByTestId('AccountScreen'));
                });

                expect(getByTestId('AccountScreen')).toBeTruthy();

                expect(screen.findByText('Usmanul')).toBeTruthy();

                const logoutButton = await screen.findByText('buttonLogout');

                fireEvent.press(logoutButton);

                await waitFor(() => {
                    mockAdapter
                        .onPost('/auth/signout')
                        .reply(200, mockUserProfileResponseSuccess);

                    const logOutAction = store.getState().userStatus.isLoggedIn;

                    expect(logOutAction).toBe(false);
                });
            });
        });
        describe('test for isCompanySubmitted already true', () => {
            beforeEach(async () => {
                await setupAsyncStorage2();
            });
            it('should navigate to company profile Screen when clicked', async () => {
                const { getByTestId } = render(
                    mainScreenStackNavMockComponent(),
                );

                act(() => {
                    fireEvent.press(getByTestId('AccountScreen'));
                });

                expect(getByTestId('AccountScreen')).toBeTruthy();

                const companyProfileButton = await screen.findByText(
                    'labelCompanyProfile',
                );

                act(() => {
                    fireEvent.press(companyProfileButton);
                });

                const companyProfileScreen = await screen.findByTestId(
                    'CompanyScreen',
                );

                expect(companyProfileScreen).toBeTruthy();
            });
        });
        describe('testing modal on verifying email', () => {
            beforeEach(async () => {
                setupAsyncStorage2();
            });
            it('should show info modal at first render when user profile has unverified email', async () => {
                jest.useFakeTimers();
                render(mainScreenStackNavMockComponent());

                await waitFor(() => {
                    const modalState = store.getState().modal;

                    expect(modalState).toEqual({
                        visible: true,
                        status: 'info',
                        text: 'AccountHeader.infoVerifyEmail',
                    });
                });

                await waitFor(() => {
                    jest.advanceTimersByTime(5000);
                    const modalState = store.getState().modal;

                    expect(modalState).toEqual({
                        visible: false,
                        status: undefined,
                        text: '',
                    });
                });
            });
        });
        describe('testing send verify email', () => {
            beforeEach(async () => {
                setupAsyncStorage2();
            });
            it('should send email to unverified user when user press verify email button', async () => {
                setupAsyncStorage2();
                const { getByTestId } = render(
                    mainScreenStackNavMockComponent(),
                );

                act(() => {
                    fireEvent.press(getByTestId('AccountScreen'));
                });

                expect(getByTestId('AccountScreen')).toBeTruthy();

                
                await waitFor(() => {
                    const modalState = store.getState().modal;

                    expect(modalState).toEqual({
                        visible: true,
                        status: 'info',
                        text: 'AccountHeader.infoVerifyEmail',
                    });
                });

                expect(screen.findByText('Usmanul')).toBeTruthy();
                
                await waitFor(() => {
                    expect(screen.findByText('AccountHeader.labelButtonVerify'))
                
                })
                const verifyEmailButton = getByTestId('verifyButton');

                fireEvent.press(verifyEmailButton);

                // mockAdapter
                // .onGet('/renter/send-otp-email-verif')
                // .reply(200, mockUserProfileResponseSuccess);
                // // const verifEmailScreen = screen.findByTestId('VerifyEmailScreen');
                
                // expect(getByTestId('VerifyEmailScreen')).toBeDefined()

                //  expect(verifEmailScreen).toBeTruthy();
        
            });
        });
    });
});
