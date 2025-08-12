import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import MainScreenAdminTabNav from '../../../../navigations/MainScreenAdminTabNav';
import { MainScreenAdminStack } from '../../../../navigations';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMINDATA, USERDATA } from '../../../../configs';
import {
    useGetAllShips,
    useGetAllShipsHistoryPending,
    useGetAllTemplateRFQForm,
    useGetAllUser,
    useGetAllUserTransactions,
    useGetCompany,
} from '../../../../hooks';

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
}));
jest.mock('../../../../hooks');
const queryClient = new QueryClient();

const mock = new MockAdapter(httpRequest);

const renderScreen = component =>
    render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <NavigationContainer>{component}</NavigationContainer>
            </Provider>
        </QueryClientProvider>,
    );
beforeAll(() => {
    AsyncStorage.setItem(
        ADMINDATA,
        JSON.stringify({
            name: 'Muhamad Fauzan',
            email: 'usman@email.com',
            password: 'test',
            isVerified: false,
        }),
    );
});
describe('Home Screen', () => {
    describe('Snapshot testing', () => {
        it('should render home screen correctly', () => {
            const tree = renderScreen(<MainScreenAdminStack />);
            expect(tree).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should navigate to transaction management screen', async () => {
            mock.onGet('/admin/get-transaction').reply(200, {
                message: 'success',
                data: [],
            });
            (useGetAllUserTransactions as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByText, getByTestId } = renderScreen(
                <MainScreenAdminStack />,
            );
            await waitFor(() => {
                const manageTransaction = getByTestId('manage-transaction');
                fireEvent.press(manageTransaction);
                expect(getByText('Transaction List')).toBeTruthy();
            });
        });
        it('should navigate to user management screen', async () => {
            mock.onGet('/admin/get-user-data').reply(200, {
                message: 'success',
                data: [],
            });
            (useGetAllUser as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByText, getByTestId } = renderScreen(
                <MainScreenAdminStack />,
            );
            const manageUser = getByTestId('manage-user');
            await waitFor(() => {
                fireEvent.press(manageUser);
                expect(getByTestId('user-flatlist')).toBeTruthy();
            });
        });
        it('should navigate to user management screen', async () => {
            mock.onGet('/admin/get-user-data').reply(200, {
                message: 'success',
                data: [],
            });
            (useGetAllUser as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByText, getByTestId } = renderScreen(
                <MainScreenAdminStack />,
            );
            const manageUser = getByTestId('manage-user');
            await waitFor(() => {
                fireEvent.press(manageUser);
                expect(getByTestId('user-flatlist')).toBeTruthy();
            });
        });
        it('should navigate to ship management screen', async () => {
            mock.onGet('/admin/get-ship-data').reply(200, {
                message: 'success',
                data: [],
            });
            (useGetAllShips as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId } = renderScreen(<MainScreenAdminStack />);
            const manageShip = getByTestId('manage-ship');
            await waitFor(() => {
                fireEvent.press(manageShip);
                expect(getByTestId('AdminShipManagement')).toBeTruthy();
            });
        });
        it('should navigate to ship history management screen', async () => {
            mock.onGet('/admin/ship-history-pending').reply(200, {
                message: 'success',
                data: [],
            });
            (useGetAllShipsHistoryPending as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: [],
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const { getByTestId } = renderScreen(<MainScreenAdminStack />);
            const manageHistory = getByTestId('manage-ship-history');
            await waitFor(() => {
                fireEvent.press(manageHistory);
                expect(getByTestId('shipHistoryData')).toBeTruthy();
            });
        });
        it('should navigate to add ship dynamic form management screen', async () => {
            const { getByTestId } = renderScreen(<MainScreenAdminStack />);
            const addShipDynamic = getByTestId('add-ship-form-management');
            await waitFor(() => {
                fireEvent.press(addShipDynamic);
                expect(getByTestId('flatlist')).toBeTruthy();
            });
        });
        it('should navigate to rfq template management screen', async () => {
            mock.onGet('/admin/get-dynamic-input-rfq').reply(200, {
                message: 'success',
                data: [],
            });
            (useGetAllTemplateRFQForm as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId, getByText } = renderScreen(
                <MainScreenAdminStack />,
            );
            const rfqTemplate = getByTestId('rfq-template-management');
            await waitFor(() => {
                fireEvent.press(rfqTemplate);
                expect(getByTestId('btn-add-template')).toBeTruthy();
            });
        });
        it('should navigate to company management screen', async () => {
            mock.onGet('/admin/get-companies').reply(200, {
                message: 'success',
                data: [],
            });
            (useGetCompany as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: [],
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId, getByText } = renderScreen(
                <MainScreenAdminStack />,
            );
            const companyManage = getByTestId('company-management');
            await waitFor(() => {
                fireEvent.press(companyManage);
                expect(getByTestId('companyManagementScreen')).toBeTruthy();
            });
        });
    });
});
