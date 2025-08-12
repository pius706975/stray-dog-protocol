import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { AddShipInputForm } from '../addShipDynamicForm/addShipInputForm';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act, ReactTestInstance } from 'react-test-renderer';
import {
    useAddDynamicInputDropDownItem,
    useAddDynamicInputItem,
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

const mockParams = { templateType: 'generalAddShip' };
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="AddShipInputForm"
                        component={AddShipInputForm}
                        initialParams={mockParams}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing add ship input form screen', () => {
    describe('Snapshot testing', () => {
        it('should render ship input form screen correctly', () => {
            const addShipInputScreen = render(adminStackMockComponent);
            expect(addShipInputScreen).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should submit dynamic input form with inputType text input', async () => {
            mock.onGet('/admin/get-dynamic-input').reply(200, {
                message: 'success',
                data: { templateType: 'generalAddShip' },
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
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

            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Name');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const textInput = getByTestId('text-input-item');
            fireEvent.press(textInput);

            const multiline = getByTestId('multiline-checkbox');
            fireEvent.press(multiline);

            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            expect(getByTestId('multiline-checkbox')).toBeDefined();
            expect(required.props.accessibilityState.checked).toBeTruthy();
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Add Input Success',
                });
            });
        });
        it('should submit dynamic input form with inputType numeric input', async () => {
            mock.onGet('/admin/get-dynamic-input').reply(200, {
                message: 'success',
                data: { templateType: 'generalAddShip' },
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
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

            const { getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'offered price');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const numericInput = getByTestId('numeric-input-item');
            fireEvent.press(numericInput);

            const unit = getByPlaceholderText('Unit');

            act(() => {
                fireEvent.changeText(unit, 'Rupiah');
            });

            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Add Input Success',
                });
            });
        });
        it('should submit dynamic input form with inputType radio drop down input', async () => {
            mock.onGet('/admin/get-dynamic-input').reply(200, {
                message: 'success',
                data: { templateType: 'generalAddShip' },
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
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

            const { getByText, getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'category');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const radiodropdown = getByTestId('radio-dropdown-item');
            fireEvent.press(radiodropdown);

            const item = getByPlaceholderText('Item');

            act(() => {
                fireEvent.changeText(item, 'Option 1');
            });
            fireEvent.press(getByTestId('btn-radio-add'));
            expect(getByText('- Option 1')).toBeTruthy();
            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Add Input Success',
                });
            });
        });
        it('should show modal error when radio drop down input has no item', async () => {
            mock.onGet('/admin/get-dynamic-input').reply(200, {
                message: 'success',
                data: { templateType: 'generalAddShip' },
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
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

            const { getByText, getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'category');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const radiodropdown = getByTestId('radio-dropdown-item');
            fireEvent.press(radiodropdown);

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
        // it('should remove item from radio drop down item', async () => {
        //     const { getByText, getByPlaceholderText, getByTestId, rerender } =
        //         render(adminStackMockComponent);
        //     const label = getByPlaceholderText('Label');
        //     const required = getByTestId('check-required');
        //     const dropDown = getByTestId('field-type');

        //     act(() => {
        //         fireEvent.changeText(label, 'category');
        //         fireEvent.press(required);
        //         fireEvent.press(dropDown);
        //     });
        //     const radiodropdown = getByTestId('radio-dropdown-item');
        //     fireEvent.press(radiodropdown);
        //     rerender(adminStackMockComponent);

        //     const item = getByPlaceholderText('Item');

        //     act(() => {
        //         fireEvent.changeText(item, 'Option 1');
        //     });
        //     fireEvent.press(getByTestId('btn-radio-add'));
        //     const btnDeleteItem = getByTestId('btn-option-delete');

        //     fireEvent.press(btnDeleteItem);

        // });
        it('should submit dynamic input form with inputType document select input', async () => {
            mock.onGet('/admin/get-dynamic-input').reply(200, {
                message: 'success',
                data: { templateType: 'generalAddShip' },
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
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

            const { getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'document 1');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const radiodropdown = getByTestId('document-select-item');
            fireEvent.press(radiodropdown);

            const expired = getByTestId('expired-checkbox');

            act(() => {
                fireEvent.press(expired);
            });

            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Add Input Success',
                });
            });
        });
        it('should submit dynamic input form with inputType select dropdown input', async () => {
            mock.onGet('/admin/get-dynamic-input').reply(200, {
                message: 'success',
                data: { templateType: 'generalAddShip' },
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
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

            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Facilities');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const selectDropdown = getByTestId('select-dropdown-item');
            fireEvent.press(selectDropdown);

            const pickMinimum = getByPlaceholderText('0');
            const itemInput = getByPlaceholderText('Item');
            const btnAddOption = getByTestId('add-item-select-button');
            act(() => {
                fireEvent.changeText(pickMinimum, '2');
                fireEvent.changeText(itemInput, 'Option 1');
            });
            fireEvent.press(btnAddOption);

            expect(getByText('- Option 1')).toBeDefined();

            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Add Input Success',
                });
            });
        });
        it('should submit select input dropdown with additional input  ', async () => {
            mock.onPost('/admin/create-input-option').reply(200, {
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
            mockParams.templateType = 'BargeShipSpecs';
            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );

            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Facilities');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const selectDropdown = getByTestId('select-dropdown-item');
            fireEvent.press(selectDropdown);

            const pickMinimum = getByPlaceholderText('0');
            const itemInput = getByPlaceholderText('Item');
            const checkboxInput = getByTestId('cb-select-dropdown');

            act(() => {
                fireEvent.changeText(pickMinimum, '2');
                fireEvent.changeText(itemInput, 'Option 1');
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
                expect(getByText('- Option 1')).toBeDefined();
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Adding input success',
                });
            });
        });
        it('should submit select input dropdown with additional input  ', async () => {
            mock.onPost('/admin/create-input-option').reply(200, {
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
            mockParams.templateType = 'BargeShipSpecs';
            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );

            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Facilities');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const selectDropdown = getByTestId('select-dropdown-item');
            fireEvent.press(selectDropdown);

            const pickMinimum = getByPlaceholderText('0');
            const itemInput = getByPlaceholderText('Item');
            const checkboxInput = getByTestId('cb-select-dropdown');

            act(() => {
                fireEvent.changeText(pickMinimum, '2');
                fireEvent.changeText(itemInput, 'Option 1');
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
                expect(getByText('- Option 1')).toBeDefined();
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Adding input success',
                });
            });
            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Add Input Success',
                });
            });
        });
        it('should show modal error when drop down input has no item', async () => {
            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );

            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Facilities');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const selectDropdown = getByTestId('select-dropdown-item');
            fireEvent.press(selectDropdown);

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
        it('should handle error when label already exists', async () => {
            mock.onPost('/admin/create-input-option').reply(400, {
                status: 'failed',
                message: 'label already exists',
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResponseData = {
                        response: {
                            status: 400,
                        },
                    };
                    onError(mockResponseData);
                }),
            }));

            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );

            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Name');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const textInput = getByTestId('text-input-item');
            fireEvent.press(textInput);

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
        it('should handle error when failed save dynamic input', async () => {
            mock.onPost('/admin/create-input-option').reply(500, {
                status: 'failed',
                message: 'Cannot save input',
            });
            (useAddDynamicInputItem as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResponseData = {
                        response: {
                            status: 500,
                        },
                    };
                    onError(mockResponseData);
                }),
            }));

            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );

            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Name');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const textInput = getByTestId('text-input-item');
            fireEvent.press(textInput);

            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Cannot Save Input',
                });
            });
        });

        // it('should delete select input dropdown with additional input  ', async () => {
        //     mock.onPost('/admin/create-input-option').reply(200, {
        //         message: 'success',
        //         data: { itemId: '123' },
        //     });
        //     (useAddDynamicInputDropDownItem as jest.Mock).mockImplementation(
        //         () => ({
        //             mutate: jest.fn().mockImplementation((data, options) => {
        //                 const { onSuccess } = options;
        //                 const mockResponseData = {
        //                     data: {
        //                         data: { itemId: '123' },
        //                     },
        //                 };
        //                 onSuccess(mockResponseData);
        //             }),
        //         }),
        //     );
        //     mock.onPost('/admin/remove-input-option').reply(200, {
        //         message: 'success',
        //     });
        //     (useAddDynamicInputDropDownItem as jest.Mock).mockImplementation(
        //         () => ({
        //             mutate: jest.fn().mockImplementation((data, options) => {
        //                 const { onSuccess } = options;

        //                 onSuccess();
        //             }),
        //         }),
        //     );
        //     mockParams.templateType = 'BargeShipSpecs';
        //     const { getByPlaceholderText, getByTestId, getByText } = render(
        //         adminStackMockComponent,
        //     );

        //     const label = getByPlaceholderText('Label');
        //     const required = getByTestId('check-required');
        //     const dropDown = getByTestId('field-type');

        //     act(() => {
        //         fireEvent.changeText(label, 'Facilities');
        //         fireEvent.press(required);
        //         fireEvent.press(dropDown);
        //     });
        //     const selectDropdown = getByTestId('select-dropdown-item');
        //     fireEvent.press(selectDropdown);

        //     const pickMinimum = getByPlaceholderText('0');
        //     const itemInput = getByPlaceholderText('Item');
        //     const checkboxInput = getByTestId('cb-select-dropdown');

        //     act(() => {
        //         fireEvent.changeText(pickMinimum, '2');
        //         fireEvent.changeText(itemInput, 'Option 1');
        //         fireEvent.press(checkboxInput);
        //     });

        //     const dropdownSelect = getByTestId('dp-select');
        //     act(() => {
        //         fireEvent.press(dropdownSelect);
        //     });
        //     const textInputSelect = getByTestId('text-input-select');
        //     fireEvent.press(textInputSelect);

        //     const btnAdditionalInput = getByTestId('btn-add-input-additional');
        //     fireEvent.press(btnAdditionalInput);

        //     await waitFor(() => {
        //         const modalState = store.getState().modal;

        //         expect(modalState).toEqual({
        //             visible: true,
        //             status: 'success',
        //             text: 'Adding input success',
        //         });
        //     });
        //     await waitFor(() => {
        //         const option1 = getByText('- Option 1');
        //     });

        //     // const btnDeleteItem = getByTestId('btn-delete-item-select');
        //     // fireEvent.press(btnDeleteItem);

        //     // const modalState = store.getState().modal;

        //     // expect(modalState).toEqual({
        //     //     visible: true,
        //     //     status: 'success',
        //     //     text: 'remove input success',
        //     // });
        // });
    });
});
