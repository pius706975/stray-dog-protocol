import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import {
    MainOwnerStackParamList,
    MainScreenOwnerParamList,
} from '../../../../types';
import { Account } from '../account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPANYDATA, ROLES, TOKEN, USERDATA } from '../../../../configs';
import { ShipOwnerCompany } from '../shipownerCompany';
import { ChangeLanguage } from '../../../changeLanguage';
import { AboutUs } from '../../renter';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
        i18n: { changeLanguage: jest.fn() },
    }),
}));

const queryClient = new QueryClient();
const MainScreenStack = createNativeStackNavigator<MainScreenOwnerParamList>();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const accountMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainScreenStack.Navigator>
                    <MainScreenStack.Screen
                        name="Account"
                        component={Account}
                    />
                    <MainOwnerStack.Screen
                        name="ShipOwnerCompany"
                        component={ShipOwnerCompany}
                    />
                    <MainOwnerStack.Screen
                        name="ChangeLanguage"
                        component={ChangeLanguage}
                    />
                    <MainOwnerStack.Screen name="AboutUs" component={AboutUs} />
                </MainScreenStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

beforeEach(() => {
    AsyncStorage.setItem(
        TOKEN,
        JSON.stringify({
            accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkNUcmhQV3IxS0tPYzhrQ09sNkVUQUZ6NjA5MTIiLCJpYXQiOjE3MDU2MzcwNDgsImV4cCI6MTcwNTYzNzM0OH0.uhRxdQskxQxGVOgXo_9N0NH5luzxLlTtTb4Q0YGZYLI',
            refreshToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkNUcmhQV3IxS0tPYzhrQ09sNkVUQUZ6NjA5MTIiLCJpYXQiOjE3MDU2MzcwNDgsImV4cCI6MTcwODIyOTA0OH0.KwwW6isb8_NPkbXqFT56CDLS-GBxsVJTUVOIWg6gZgM',
        }),
    );
    mockAdapter.reset();
});

describe('Testing Account Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Account screen correctly', () => {
            AsyncStorage.setItem(
                COMPANYDATA,
                JSON.stringify({
                    isCompanySubmitted: true,
                }),
            );
            const accountScreenOwner = render(accountMockComponent);
            expect(accountScreenOwner).toMatchSnapshot();
        });
    });

    describe('Unit Testing', () => {
        it('should render Account screen correctly if company not submitted', () => {
            AsyncStorage.setItem(
                COMPANYDATA,
                JSON.stringify({
                    isCompanySubmitted: false,
                }),
            );
            const { getByTestId } = render(accountMockComponent);
            expect(getByTestId('AccountScreen')).toBeTruthy();
            expect(getByTestId('CompanyBeforeSubmitted')).toBeDefined();
            fireEvent.press(getByTestId('CompanyBeforeSubmitted'));
            expect(getByTestId('ShipOwnerCompanyScreen')).toBeTruthy();
        });
        it('should render Account screen correctly if company already submitted', async () => {
            AsyncStorage.setItem(
                COMPANYDATA,
                JSON.stringify({
                    isCompanySubmitted: true,
                }),
            );
            const { getByTestId } = render(accountMockComponent);
            expect(getByTestId('AccountScreen')).toBeTruthy();
            await waitFor(() => {
                expect(getByTestId('CompanyAfterSubmitted')).toBeDefined();
                fireEvent.press(getByTestId('CompanyAfterSubmitted'));
                expect(getByTestId('ShipOwnerCompanyScreen')).toBeTruthy();
            });
        });
        it('should navigate to change language screen', async () => {
            AsyncStorage.setItem(
                COMPANYDATA,
                JSON.stringify({
                    isCompanySubmitted: true,
                }),
            );
            const { getByTestId } = render(accountMockComponent);
            expect(getByTestId('AccountScreen')).toBeTruthy();
            fireEvent.press(getByTestId('ChangeLanguage'));
            expect(getByTestId('ChangeLanguageScreen')).toBeTruthy();
        });
        it('should navigate to about us screen', async () => {
            AsyncStorage.setItem(
                COMPANYDATA,
                JSON.stringify({
                    isCompanySubmitted: true,
                }),
            );
            const { getByTestId } = render(accountMockComponent);
            expect(getByTestId('AccountScreen')).toBeTruthy();
            fireEvent.press(getByTestId('AboutUs'));
            expect(getByTestId('AboutUs')).toBeTruthy();
        });
        it('should handle error if logout failed', async () => {
            AsyncStorage.setItem(
                COMPANYDATA,
                JSON.stringify({
                    isCompanySubmitted: true,
                }),
            );
            const { getByTestId } = render(accountMockComponent);
            expect(getByTestId('AccountScreen')).toBeTruthy();
            fireEvent.press(getByTestId('Logout'));
            await waitFor(() => {
                jest.advanceTimersByTime(2000);

                mockAdapter
                    .onPost('/auth/signout')
                    .reply(400, { status: 'failed' });

                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedSignOut',
                });
            });
        });
        it('should handle succes if logout succes', async () => {
            AsyncStorage.setItem(
                COMPANYDATA,
                JSON.stringify({
                    isCompanySubmitted: true,
                }),
            );
            const { getByTestId } = render(accountMockComponent);
            expect(getByTestId('AccountScreen')).toBeTruthy();
            fireEvent.press(getByTestId('Logout'));
            await waitFor(() => {
                mockAdapter
                    .onPost('/auth/signout')
                    .reply(200, { status: 'success' });

                expect(AsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN);
                expect(AsyncStorage.removeItem).toHaveBeenCalledWith(ROLES);

                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'successSignOut',
                });

                jest.advanceTimersByTime(2000);
            });
        });
    });
});
