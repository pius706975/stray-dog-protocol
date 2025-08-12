import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    DynamicInputRFQResponse,
    MainAdminStackParamList,
} from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { EditRFQInputForm } from '../rfqDynamicForm/editRfqInputForm';
import {
    useEditRFQDynamicInputItem,
    useGetDynamicInputRFQById,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import renderer, { act } from 'react-test-renderer';

jest.mock('../../../../hooks');

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);
const mockParams = {
    _id: '123',
    templateType: '',
    formType: '',
};
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="EditRFQInputForm"
                        component={EditRFQInputForm}
                        initialParams={mockParams}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
const mockData: DynamicInputRFQResponse = {
    _id: '234',
    dynamicInput: {
        _id: '123',
        active: true,
        fieldName: 'needs',
        fieldType: 'string',
        formType: 'rfqForm',
        inputType: 'textInput',
        label: 'Needs',
        placeholder: 'Ex: for transporting',
        templateType: 'defaultRfq',
        option: [],
        required: true,
    },
    required: true,
    validation: { multiline: true, max: 10000000 },
};

const mockSubmitMutation = () => {
    mock.onPost('/admin/submit-dynamic-input').reply(200, {
        message: 'success',
    });
    (useEditRFQDynamicInputItem as jest.Mock).mockImplementation(() => ({
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
    (useEditRFQDynamicInputItem as jest.Mock).mockImplementation(() => ({
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
    (useEditRFQDynamicInputItem as jest.Mock).mockImplementation(() => ({
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

beforeEach(() => {
    mock.onGet('/admin/egt-dynamic-input').reply(200, {
        message: 'success',
        data: mockData,
    });
    (useGetDynamicInputRFQById as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});
describe('Testing RFQ edit input Form screen', () => {
    describe('Snapshot testing', () => {
        it('should render RFQ edit input form screen corectly', () => {
            const editInputScreen = render(adminStackMockComponent);
            expect(editInputScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should submit dynamic input with provided data', async () => {
            mockSubmitMutation();
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
                    text: 'Edit Input Success',
                });
            });
        });
        it('should submit dynamic input with provided data numeric input', async () => {
            mockSubmitMutation();
            mockData.dynamicInput.inputType = 'numericInput';
            mockData.dynamicInput.fieldType = 'number';
            mockData.validation = {
                min: 1,
                max: 10,
            };
            mockData.dynamicInput.unit = 'Ton';
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText } = render(
                adminStackMockComponent,
            );
            const btnSubmit = getByTestId('add-button');
            expect(getByPlaceholderText('Unit')).toBeDefined();
            act(() => {
                fireEvent.changeText(getByPlaceholderText('Unit'), 'm3');
            });
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Edit Input Success',
                });
            });
        });
        it('should submit dynamic input with provided data radio dropdown', async () => {
            mockSubmitMutation();
            mockData.dynamicInput.inputType = 'radioDropdown';
            mockData.dynamicInput.fieldType = 'string';
            mockData.dynamicInput.validate = {};
            mockData.dynamicInput.unit = '';
            mockData.dynamicInput.option.push({
                value: 'option 1',
                _id: '1',
            });
            renderer.create(adminStackMockComponent);

            const { getByTestId, getByPlaceholderText } = render(
                adminStackMockComponent,
            );

            const item = getByPlaceholderText('Item');

            act(() => {
                fireEvent.changeText(item, 'Option 1');
            });
            fireEvent.press(getByTestId('btn-radio-add'));

            act(() => {
                fireEvent.changeText(item, 'Option 2');
            });
            fireEvent.press(getByTestId('btn-radio-add'));
            fireEvent.press(getByTestId('btn-delete-radio-item-1'));

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Edit Input Success',
                });
            });
        });
        it('should showing modal error when radio dropdown item is empty', async () => {
            mockSubmitMutation();
            mockData.dynamicInput.inputType = 'radioDropdown';
            mockData.dynamicInput.fieldType = 'string';
            mockData.dynamicInput.validate = {};
            mockData.dynamicInput.unit = '';
            mockData.dynamicInput.option = [];
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
        it('should showing modal error when label already exists', async () => {
            mockSubmitMutationError400();
            mockData.dynamicInput.inputType = 'textInput';
            mockData.dynamicInput.fieldType = 'string';
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
        it('should show modal error when error submit form', async () => {
            mockSubmitMutationError();
            mockData.dynamicInput.inputType = 'textInput';
            mockData.dynamicInput.fieldType = 'string';
            const { getByTestId } = render(adminStackMockComponent);
            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Cannot Edit Input',
                });
            });
        });
    });
});
