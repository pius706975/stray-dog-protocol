import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { UserDetail } from '../userDetail';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { useUpdateUserActivation } from '../../../../hooks';

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
const mockUserData = {
    _id: '123',
    name: 'Alma',
    email: 'alma@mail.com',
    phoneNumber: '0812345674',
    roles: 'renter',
    isActive: true,
    renterId: {
        _id: '123',
        company: {
            name: 'alma company',
            address: 'pahlawan street',
        },
    },
    shipOwnerId: {
        _id: '123',
        company: {
            name: 'alma company',
            address: 'pahlawan street',
        },
    },
    isVerified: true,
    isPhoneVerified: true,
    googleId: '12232323343',
};

const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="UserDetail"
                        component={UserDetail}
                        initialParams={{ user: mockUserData }}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing user detail screen', () => {
    describe('Snapshot testing', () => {
        it('should render user detail screen correctly', () => {
            const userDetailScreen = render(adminStackMockComponent);
            expect(userDetailScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should showing confimation modal', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const showModal = getByTestId('activate-button');

            act(() => {
                fireEvent.press(showModal);
            });
            expect('updateConfirmation').toBeDefined();
        });
        it('should update user activation', async () => {
            mock.onPost('admin/activate-user').reply(200, {
                status: 'success',
            });
            (useUpdateUserActivation as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: {
                                isActive: false,
                            },
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId, getByText } = render(adminStackMockComponent);
            const showModal = getByTestId('activate-button');

            fireEvent.press(showModal);

            jest.advanceTimersByTime(2000);
            const updateStatus = getByTestId('update-status');
            fireEvent.press(updateStatus);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'successMessageUpdateActivation',
                });
            });
        });
    });
});
