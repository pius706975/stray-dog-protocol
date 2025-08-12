import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { UserManagement } from '../userManagement';
import { useGetAllUser } from '../../../../hooks';
import { fireEvent, render } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { UserDetail } from '../userDetail';
import { act } from 'react-test-renderer';

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

const adminStackMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="UserManagement"
                        component={UserManagement}
                    />
                    <MainAdminStack.Screen
                        name="UserDetail"
                        component={UserDetail}
                        initialParams={{ user: mockUserData[0] }}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
const mockUserData = [
    {
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
    },
    {
        _id: '456',
        name: 'Sasha',
        email: 'sasha@mail.com',
        phoneNumber: '0812345674',
        roles: 'shipOwner',
        isActive: false,
        shipOwnerId: {
            _id: '567',
            company: {
                name: 'sasha company',
                address: 'pahlawan street',
            },
        },
        isVerified: true,
        isPhoneVerified: true,
    },
];

beforeEach(() => {
    useTranslation('usermanagement');
    mock.onGet('/admin/get-user-data').reply(200, {
        message: 'success',
        data: mockUserData,
    });
    (useGetAllUser as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockUserData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});
describe('Testing user management screen', () => {
    describe('Snapshot Testing', () => {
        it('should render user management screen corectly', () => {
            const companyManagementScreen = render(adminStackMockComponent());

            expect(companyManagementScreen).toMatchSnapshot();
        });
    });
    describe('Component test', () => {
        it('should render list of user', () => {
            const { getByTestId } = render(adminStackMockComponent());
            const flatlist = getByTestId('user-flatlist');
            expect(flatlist.props.data.length).toBe(2);
        });
        it('should show user with google sign in badge', () => {
            const { getByText } = render(adminStackMockComponent());
            const googleText = getByText('googleAccount');
            expect(googleText).toBeDefined();
        });
        it('should navigate to user detail when press user item', () => {
            const { getByTestId } = render(adminStackMockComponent());
            const user = getByTestId('user-0');
            act(() => {
                fireEvent.press(user);
            });
            expect(getByTestId('adminUserDetail')).toBeDefined();
        });
    });
});
