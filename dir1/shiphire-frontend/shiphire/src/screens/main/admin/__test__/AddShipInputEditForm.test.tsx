import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    AddShipDynamicInput,
    MainAdminStackParamList,
} from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { AddShipInputEditForm } from '../addShipDynamicForm/addShipInputEditForm';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import renderer, { act } from 'react-test-renderer';
import {
    useAddDynamicInputDropDownItem,
    useGetSelectDropDownInput,
    useRemoveItemDropdownDynamicInput,
    useUpdateDynamicInputAddShip,
} from '../../../../hooks';

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => ({
            pop: jest.fn(),
        }),
    };
});
jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const mockParams: AddShipDynamicInput = {
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
    option: [],
    validate: {
        multiline: true,
        min: undefined,
        max: undefined,
    },
};

const mockSelectItemData = [
    {
        __v: 0,
        _id: '65a737c476517457909c4d8b',
        active: true,
        fieldName: 'capacity',
        fieldType: 'number',
        formType: 'addShipForm',
        inputType: 'numericInput',
        label: 'Capacity',
        order: 4,
        templateType: 'bargeSpesificSpec',
        unit: 'tons',
    },
    {
        __v: 0,
        _id: '65a737c476517457909c4d8b',
        active: true,
        fieldName: 'capacity',
        fieldType: 'number',
        formType: 'addShipForm',
        inputType: 'numericInput',
        label: 'Capacity',
        order: 1,
        templateType: 'bargeSpesificSpec',
        unit: 'tons',
    },
];
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="AddShipInputEditForm"
                        component={AddShipInputEditForm}
                        initialParams={{ inputData: mockParams }}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockUpdateDynamicInput = () => {
    mock.onPost('/admin/update-dynamic-input').reply(200, {
        message: 'success',
        data: { templateType: 'generalAddShip' },
    });
    (useUpdateDynamicInputAddShip as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: { templateType: 'generalAddShip' },
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
};

describe('Testing edit ship input form screen', () => {
    describe('Snapshot testing', () => {
        it('should render edit ship input screen correctly', () => {
            const editShipInput = render(adminStackMockComponent);
            expect(editShipInput).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should submit dynamic input with provided data', async () => {
            mockUpdateDynamicInput();
            const { getByTestId } = render(adminStackMockComponent);
            fireEvent.press(getByTestId('cb-required'));
            const btnSubmit = getByTestId('add-button');

            const multiline = getByTestId('cb-textInput');

            fireEvent.press(multiline);
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Input Success',
                });
            });
        });
        it('should submit dynamic input with provided data numeric input', async () => {
            mockUpdateDynamicInput();
            mockParams.inputType = 'numericInput';
            mockParams.fieldType = 'number';
            mockParams.validate = {
                min: 1,
                max: 10,
            };
            mockParams.unit = 'Ton';
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText } = render(
                adminStackMockComponent,
            );
            const btnSubmit = getByTestId('add-button');
            expect(getByPlaceholderText('Unit')).toBeDefined();

            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Input Success',
                });
            });
        });
        it('should submit dynamic input with provided data document select', async () => {
            mockUpdateDynamicInput();
            mockParams.inputType = 'docSelect';
            mockParams.fieldType = 'document';
            mockParams.validate = {};
            mockParams.expired = true;
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText } = render(
                adminStackMockComponent,
            );
            const btnSubmit = getByTestId('add-button');
            const expired = getByTestId('cb-expired');

            fireEvent.press(expired);
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Input Success',
                });
            });
        });
        it('should submit dynamic input with provided data radio dropdown', async () => {
            mockUpdateDynamicInput();
            mockParams.inputType = 'radioDropdown';
            mockParams.fieldType = 'string';
            mockParams.validate = {};
            mockParams.expired = false;
            mockParams.unit = '';
            mockParams.option.push({
                value: 'option 1',
                _id: '1',
            });
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText } = render(
                adminStackMockComponent,
            );
            expect(getByTestId('radio-data')).toBeDefined();

            const item = getByPlaceholderText('Item');

            act(() => {
                fireEvent.changeText(item, 'Option 1');
            });
            fireEvent.press(getByTestId('btn-radio-add'));

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Input Success',
                });
            });
        });

        it('should submit dynamic input with provided data select dropdown with add 1 item', async () => {
            mockUpdateDynamicInput();
            mock.onGet('/admin/get-select-dropdown-input').reply(200, {
                message: 'success',
                data: mockSelectItemData,
            });
            (useGetSelectDropDownInput as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockSelectItemData,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            mockParams.inputType = 'selectDropDown';
            mockParams.fieldType = 'arrayOfString';
            mockParams.validate = { min: 2 };
            mockParams.expired = false;
            mockParams.unit = '';
            mockParams.option.push({
                value: 'option 1',
                _id: '1',
            });
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText } = render(
                adminStackMockComponent,
            );
            expect(getByTestId('select-data')).toBeDefined();

            const pickMinimum = getByPlaceholderText('0');
            const itemInput = getByPlaceholderText('Item');
            const btnAddOption = getByTestId('add-item-select-button');
            act(() => {
                fireEvent.changeText(pickMinimum, '2');
                fireEvent.changeText(itemInput, 'Option 2');
            });
            fireEvent.press(btnAddOption);

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Input Success',
                });
            });
        });
        it('should submit dynamic input with provided data select dropdown with add 1 item with additional input', async () => {
            mockUpdateDynamicInput();
            mock.onGet('/admin/get-select-dropdown-input').reply(200, {
                message: 'success',
                data: mockSelectItemData,
            });
            (useGetSelectDropDownInput as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockSelectItemData,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            mock.onPost('/admin/create-dropdown-input-item').reply(200, {
                message: 'success',
                data: { itemId: '123' },
            });
            (useAddDynamicInputDropDownItem as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: { itemId: '123' },
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            mockParams.inputType = 'selectDropDown';
            mockParams.fieldType = 'arrayOfString';
            mockParams.validate = { min: 2 };
            mockParams.expired = false;
            mockParams.unit = '';
            mockParams.option.push({
                value: 'option 1',
                _id: '1',
            });
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText } = render(
                adminStackMockComponent,
            );
            expect(getByTestId('select-data')).toBeDefined();

            const pickMinimum = getByPlaceholderText('0');
            const itemInput = getByPlaceholderText('Item');
            const checkboxInput = getByTestId('cb-select-dropdown');

            act(() => {
                fireEvent.changeText(pickMinimum, '2');
                fireEvent.changeText(itemInput, 'Option 2');
                fireEvent.press(checkboxInput);
            });

            const dropdownSelect = getByTestId('dp-select');
            act(() => {
                fireEvent.press(dropdownSelect);
            });
            const textInputSelect = getByTestId('text-input-select');
            fireEvent.press(textInputSelect);

            const btnAdditionalInput = getByTestId('btn-add-input-additional');
            fireEvent.press(btnAdditionalInput);

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Input Success',
                });
            });
        });
        it('submit dynamic input with provided data select dropdown then remove the option', async () => {
            mockUpdateDynamicInput();
            mock.onGet('/admin/get-select-dropdown-input').reply(200, {
                message: 'success',
                data: mockSelectItemData,
            });
            (useGetSelectDropDownInput as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockSelectItemData,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            mock.onPost('/admin/create-dropdown-input-item').reply(200, {
                message: 'success',
                data: '123',
            });
            (useAddDynamicInputDropDownItem as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: '123',
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            mock.onPost('/admin/remove-dropdown-input-item').reply(200, {
                message: 'success',
            });
            (useRemoveItemDropdownDynamicInput as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        onSuccess();
                    }),
                }),
            );

            mockParams.inputType = 'selectDropDown';
            mockParams.fieldType = 'arrayOfString';
            mockParams.validate = { min: 2 };
            mockParams.expired = false;
            mockParams.unit = '';
            mockParams.option.push({
                value: 'option 1',
                _id: '1',
            });
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText, getByText } = render(
                adminStackMockComponent,
            );
            expect(getByTestId('select-data')).toBeDefined();

            const pickMinimum = getByPlaceholderText('0');
            const itemInput = getByPlaceholderText('Item');
            const checkboxInput = getByTestId('cb-select-dropdown');

            act(() => {
                fireEvent.changeText(pickMinimum, '2');
                fireEvent.changeText(itemInput, 'Option 2');
                fireEvent.press(checkboxInput);
            });

            const dropdownSelect = getByTestId('dp-select');
            act(() => {
                fireEvent.press(dropdownSelect);
            });
            const textInputSelect = getByTestId('text-input-select');
            fireEvent.press(textInputSelect);

            const btnAdditionalInput = getByTestId('btn-add-input-additional');
            fireEvent.press(btnAdditionalInput);
            await waitFor(() => {
                expect(getByText('- Option 2')).toBeDefined();
            });
            const btnRemove = getByTestId('btn-remove-select-item-4');
            fireEvent.press(btnRemove);

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Input Success',
                });
            });
        });

        it('should showing modal error when radio dropdown item is empty', async () => {
            mockParams.inputType = 'radioDropdown';
            mockParams.fieldType = 'string';
            mockParams.validate = {};
            mockParams.expired = false;
            mockParams.unit = '';
            mockParams.option = [];
            renderer.create(adminStackMockComponent);

            const { getByTestId } = render(adminStackMockComponent);

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Add at least 1 item',
                });
            });
        });
        it('should showing modal error when radio dropdown item is empty', async () => {
            mock.onGet('/admin/get-select-dropdown-input').reply(200, {
                message: 'success',
                data: {},
            });
            (useGetSelectDropDownInput as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: {},
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            mockParams.inputType = 'selectDropDown';
            mockParams.fieldType = 'arrayOfString';
            mockParams.validate = { min: 2 };
            mockParams.expired = false;
            mockParams.unit = '';
            mockParams.option = [];
            renderer.create(adminStackMockComponent);

            const { getByTestId } = render(adminStackMockComponent);

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Add at least 1 item',
                });
            });
        });
        it('should submit dynamic input with provided data', async () => {
            mock.onPost('/admin/update-dynamic-input').reply(400, {
                status: 'failed',
            });
            (useUpdateDynamicInputAddShip as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onError } = options;
                        const mockResponseData = {
                            response: {
                                status: 400,
                            },
                        };
                        onError(mockResponseData);
                    }),
                }),
            );
            mockParams.inputType = 'textInput';
            mockParams.fieldType = 'string';
            const { getByTestId } = render(adminStackMockComponent);
            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Label already exists',
                });
            });
        });
        it('should submit dynamic input with provided data', async () => {
            mock.onPost('/admin/update-dynamic-input').reply(500, {
                status: 'failed',
            });
            (useUpdateDynamicInputAddShip as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onError } = options;
                        const mockResponseData = {
                            response: {
                                status: 500,
                            },
                        };
                        onError(mockResponseData);
                    }),
                }),
            );
            mockParams.inputType = 'textInput';
            mockParams.fieldType = 'string';
            const { getByTestId } = render(adminStackMockComponent);
            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Cannot Update Input',
                });
            });
        });
    });
});
