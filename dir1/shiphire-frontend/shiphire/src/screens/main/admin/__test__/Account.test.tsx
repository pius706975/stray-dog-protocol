import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    MainAdminStackParamList,
    MainScreenAdminParamList,
    MainScreenParamList,
} from '../../../../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import Account from '../account/Account';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMINDATA, ROLES, TOKEN } from '../../../../configs';
import { useSignOut } from '../../../../hooks';
import renderer from 'react-test-renderer';

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
jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<MainScreenAdminParamList>();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const adminStackMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen name="AdminHome">
                        {() => (
                            <Tab.Navigator>
                                <Tab.Screen
                                    name="Account"
                                    component={Account}
                                />
                            </Tab.Navigator>
                        )}
                    </MainAdminStack.Screen>
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
beforeEach(() => {
    AsyncStorage.setItem(
        ADMINDATA,
        JSON.stringify({
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
    mockAdapter.reset();
});
describe('account screen', () => {
    describe('snapshot testing', () => {
        it('should render account screen correctly', () => {
            const accountScreen = render(adminStackMockComponent());
            expect(accountScreen).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should show modal error when failed logout', async () => {
            renderer.create(adminStackMockComponent());
            mockAdapter
                .onPost('/auth/signout')
                .reply(500, { status: 'failed' });
            (useSignOut as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResponseData = {
                        message: 'failed',
                        status: 500,
                    };
                    onError(mockResponseData);
                }),
            }));
            const { findByText } = render(adminStackMockComponent());

            const logoutButton = await findByText('Logout');

            await waitFor(() => {
                fireEvent.press(logoutButton);
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedSignOut',
                });
            });
        });
        it('should remove Token and Roles from AsyncStorage when logout success', async () => {
            mockAdapter
                .onPost('/auth/signout')
                .reply(200, { status: 'success' });
            (useSignOut as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            message: 'success',
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { findByText } = render(adminStackMockComponent());

            const logoutButton = await findByText('Logout');

            fireEvent.press(logoutButton);

            await waitFor(() => {
                expect(AsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN);
                expect(AsyncStorage.removeItem).toHaveBeenCalledWith(ROLES);

                const modalState = store.getState().modal;
                const userState = store.getState().userStatus.isLoggedIn;
                expect(userState).toBeFalsy();
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'successSignOut',
                });
            });
        });
    });
});
