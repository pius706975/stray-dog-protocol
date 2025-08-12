import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { AddShipInputManagement } from '../addShipDynamicForm/addShipInputManagement';
import {
    useGetAddShipDynamicInputByTemplateName,
    useUpdateDynamicInputAddShipActivation,
    useUpdateDynamicInputAddShipOrder,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AddShipInputForm } from '../addShipDynamicForm/addShipInputForm';

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
                        name="AddShipInputManagement"
                        component={AddShipInputManagement}
                        initialParams={{ templateType: 'generalAddShip' }}
                    />
                    <MainAdminStack.Screen
                        name="AddShipInputForm"
                        component={AddShipInputForm}
                        initialParams={{ templateType: 'generalAddShip' }}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockData = [
    {
        _id: '123',
        formType: 'addShipForm',
        templateType: 'generalAddShip',
        inputType: 'textInput',
        label: 'Ship Name',
        fieldName: 'shipName',
        fieldType: 'string',
        placeholder: 'Enter your ship name',
        active: true,
        expired: false,
        order: 1,
        required: true,
    },
    {
        _id: '345',
        formType: 'addShipForm',
        templateType: 'generalAddShip',
        inputType: 'radioDropdown',
        label: 'Category',
        fieldName: 'category',
        fieldType: 'string',
        placeholder: 'Enter your category',
        active: true,
        expired: false,
        order: 2,
        required: true,
        option: [
            {
                value: 'barge',
                id: '1',
            },
            {
                value: 'tugboat',
                id: '2',
            },
        ],
    },
];

beforeEach(() => {
    mock.onGet('/admin/get-dynamic-input').reply(200, {
        message: 'success',
        data: mockData,
    });
    (useGetAddShipDynamicInputByTemplateName as jest.Mock).mockImplementation(
        () => ({
            mutate: jest.fn().mockImplementation((data, options) => {
                const { onSuccess } = options;
                const mockResponseData = {
                    data: {
                        data: mockData,
                    },
                };
                onSuccess(mockResponseData);
            }),
        }),
    );
});

describe('Testing add ship input management screen ', () => {
    describe('Snapshot testing', () => {
        it('should render add ship input management screen correctly', () => {
            const inputManageScreen = render(adminStackMockComponent);
            expect(inputManageScreen).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should navigate to add input', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const addShipPressable = getByTestId('addShipButton');

            fireEvent.press(addShipPressable);
            expect(getByTestId('AddShipInputForm')).toBeDefined();
        });
        it('should update activation when press activation button', async () => {
            mock.onPost('/admin/update-dynamic-input-activation').reply(200, {
                status: 'success',
            });
            (
                useUpdateDynamicInputAddShipActivation as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        status: 'success',
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(adminStackMockComponent);
            const btnActive = getByTestId('btn-active-0');

            fireEvent.press(btnActive);

            const activationBtn = getByTestId('activation-btn');

            fireEvent.press(activationBtn);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update activation successfully',
                });
            });
        });
        it('should fail update activation when press activation button', async () => {
            mock.onPost('/admin/update-dynamic-input-activation').reply(200, {
                status: 'error',
            });
            (
                useUpdateDynamicInputAddShipActivation as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResponseData = {
                        status: 'error',
                    };
                    onError(mockResponseData);
                }),
            }));

            const { getByTestId } = render(adminStackMockComponent);
            const btnActive = getByTestId('btn-active-0');

            fireEvent.press(btnActive);

            const activationBtn = getByTestId('activation-btn');

            fireEvent.press(activationBtn);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Cannot Update activation',
                });
            });
        });
        it('should update order input when press update save order', async () => {
            mock.onPost('/admin/update-dynamic-input-order').reply(200, {
                status: 'success',
            });
            (useUpdateDynamicInputAddShipOrder as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            status: 'success',
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(adminStackMockComponent);
            const btnEdit = getByTestId('edit-input-order');

            fireEvent.press(btnEdit);

            const btnSave = getByTestId('btn-save-order');

            fireEvent.press(btnSave);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update order successfully',
                });
            });
        });
        it('should fail update order input when press update save order', async () => {
            mock.onPost('/admin/update-dynamic-input-order').reply(200, {
                status: 'error',
            });
            (useUpdateDynamicInputAddShipOrder as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onError } = options;
                        const mockResponseData = {
                            status: 'error',
                        };
                        onError(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(adminStackMockComponent);
            const btnEdit = getByTestId('edit-input-order');

            fireEvent.press(btnEdit);

            const btnSave = getByTestId('btn-save-order');

            fireEvent.press(btnSave);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Cannot Update Order',
                });
            });
        });
        it('should show bottom sheet to display detail input', async () => {
            const { getByTestId, getByText } = render(adminStackMockComponent);
            const renderItem = getByTestId('renderItem-1');

            fireEvent.press(renderItem);

            expect(getByText('Input Information')).toBeDefined();
            expect(getByText('Options')).toBeDefined();
        });
    });
});
