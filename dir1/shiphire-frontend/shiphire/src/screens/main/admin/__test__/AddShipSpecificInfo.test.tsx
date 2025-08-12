import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import {
    useDeleteShipSpectAddShip,
    useGetAddShipDynamicInputByTemplateName,
    useGetShipSpecification,
} from '../../../../hooks';
import { AddShipSpecificInfo } from '../addShipDynamicForm/addShipSpecificInfo';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AddShipInputForm } from '../addShipDynamicForm/addShipInputForm';
import { AddShipInputManagement } from '../addShipDynamicForm/addShipInputManagement';

jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="AddShipSpecificInfo"
                        component={AddShipSpecificInfo}
                    />
                    <MainAdminStack.Screen
                        name="AddShipInputForm"
                        component={AddShipInputForm}
                        initialParams={{ templateType: '' }}
                    />
                    <MainAdminStack.Screen
                        name="AddShipInputManagement"
                        component={AddShipInputManagement}
                        initialParams={{ templateType: 'bargeSpesific' }}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockShipSpect = [
    { templateType: 'bargeSpesific', value: 'barge spesific' },
    { templateType: 'ferrySpesific', value: 'ferry spesific' },
];
beforeEach(() => {
    mock.onGet('/admin/get-dynamic-input-spec').reply(200, {
        message: 'success',
        data: mockShipSpect,
    });
    (useGetShipSpecification as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockShipSpect,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

describe('Testing add ship spesific info test', () => {
    describe('Snapshot testing', () => {
        it('should render add ship spesific info test screen correctly', () => {
            const specificInfoScreen = render(adminStackMockComponent);
            expect(specificInfoScreen).toMatchSnapshot();
        });
    });
    describe('Unit testing', () => {
        it('should navigate to add specific screen when press + icon', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const addSpecificBtn = getByTestId('add-specific-btn');
            fireEvent.press(addSpecificBtn);

            expect(getByTestId('AddShipInputForm')).toBeDefined();
        });
        it('should navigate to input management screen when press item', () => {
            mock.onGet('/admin/get-dynamic-input').reply(200, {
                message: 'success',
                data: [],
            });
            (
                useGetAddShipDynamicInputByTemplateName as jest.Mock
            ).mockImplementation(() => ({
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

            const { getByTestId } = render(adminStackMockComponent);
            const inputManageBtn = getByTestId('input-manage-0');
            fireEvent.press(inputManageBtn);

            expect(getByTestId('addshipinputmanagement')).toBeDefined();
        });
        it('should delete specific item succesfully', async () => {
            mock.onPost('/admin/delete-specific').reply(200, {
                message: 'success',
            });
            (useDeleteShipSpectAddShip as jest.Mock).mockImplementation(() => ({
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

            const { getByTestId } = render(adminStackMockComponent);
            const deleteBtn = getByTestId('btn-delete-1');
            fireEvent.press(deleteBtn);
            fireEvent.press(getByTestId('confirm-delete'));

            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Delete successfully',
                });
            });
        });
        it('should show modal when error deleting', async () => {
            mock.onPost('/admin/delete-specific').reply(500, {
                message: 'failed',
            });
            (useDeleteShipSpectAddShip as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResp = {
                        data: { message: 'failed' },
                    };
                    onError(mockResp);
                }),
            }));

            const { getByTestId } = render(adminStackMockComponent);
            const deleteBtn = getByTestId('btn-delete-1');
            fireEvent.press(deleteBtn);
            fireEvent.press(getByTestId('confirm-delete'));

            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Cannot delate specification',
                });
            });
        });
    });
});
