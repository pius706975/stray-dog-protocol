import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { RFQInputForm } from '../rfqDynamicForm/rfqInputForm';
import { useAddRFQDynamicInputItem } from '../../../../hooks';
import { act } from 'react-test-renderer';

jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const mockParams = { templateType: 'generalAddShip', formType: '' };
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="RFQInputForm"
                        component={RFQInputForm}
                        initialParams={mockParams}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
const mockSubmitMutation = () => {
    mock.onPost('/admin/submit-dynamic-input').reply(200, {
        message: 'success',
    });
    (useAddRFQDynamicInputItem as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockSubmitMutationError = () => {
    mock.onPost('/admin/submit-dynamic-input').reply(500, {
        message: 'failed',
    });
    (useAddRFQDynamicInputItem as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
            };
            onError(mockResponseData);
        }),
    }));
};
const mockSubmitMutationError400 = () => {
    mock.onPost('/admin/submit-dynamic-input').reply(400, {
        message: 'failed',
    });
    (useAddRFQDynamicInputItem as jest.Mock).mockImplementation(() => ({
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
};
describe('Testing RFQ input form screen', () => {
    describe('Snapshot testing', () => {
        it('should render RFQ input form screen correctly', () => {
            const inputFormScreen = render(adminStackMockComponent);
            expect(inputFormScreen).toMatchSnapshot();
        });
    });
    describe('Unit testing', () => {
        it('should submit dynamic input with input type text input', async () => {
            mockSubmitMutation();
            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
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
        it('should submit dynamic input with input type numeric input', async () => {
            mockSubmitMutation();
            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'Offered Price');
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
        it('should submit dynamic input with input type radio drop down', async () => {
            mockSubmitMutation();
            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'rent type');
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
        it('should submit dynamic input with input type radio drop down with remove 1 item', async () => {
            mockSubmitMutation();
            const { getByPlaceholderText, getByTestId, getByText } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'rent type');
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

            act(() => {
                fireEvent.changeText(item, 'Option 2');
            });
            fireEvent.press(getByTestId('btn-radio-add'));

            expect(getByText('- Option 1')).toBeTruthy();
            expect(getByText('- Option 2')).toBeTruthy();

            const btnDelete = getByTestId('btn-option-delete-1');
            fireEvent.press(btnDelete);
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
            mockSubmitMutation();

            const { getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
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
        it('should submit dynamic input form with inputType document select input', async () => {
            mockSubmitMutation();
            const { getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'document 1');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const radiodropdown = getByTestId('document-select-item');
            fireEvent.press(radiodropdown);

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
        it('should show modal when submit form error', async () => {
            mockSubmitMutationError();
            const { getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'document 1');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const radiodropdown = getByTestId('document-select-item');
            fireEvent.press(radiodropdown);

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
        it('should show modal when submit form error', async () => {
            mockSubmitMutationError400();
            const { getByPlaceholderText, getByTestId } = render(
                adminStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('cb-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'document 1');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const radiodropdown = getByTestId('document-select-item');
            fireEvent.press(radiodropdown);

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
    });
});
