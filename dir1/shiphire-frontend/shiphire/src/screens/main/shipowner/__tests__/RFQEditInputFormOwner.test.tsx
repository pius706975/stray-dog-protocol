import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    AddShipDynamicInput,
    DynamicInputRFQResponse,
    MainOwnerStackParamList,
} from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { EditRFQInputFormOwner } from '../rfqDynamicFormOwner/editRfqFormInput';
import {
    useEditDynamicInputOwner,
    useGetDynamicInputRFQById,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    _id: '123',
    templateType: 'bargeRfq',
    formType: 'rfqForm',
};

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="EditRFQInputFormOwner"
                        component={EditRFQInputFormOwner}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
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
const mockUpdateDynamicInput = () => {
    mockAdapter.onGet('/shipowner/get-dynamic-input').reply(200, {
        message: 'success',
    });
    (useEditDynamicInputOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockUpdateDynamicInputError400 = () => {
    mockAdapter.onGet('/shipowner/get-dynamic-input').reply(400, {
        message: 'failed',
    });
    (useEditDynamicInputOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
                response: {
                    status: 400,
                },
            };
            onError(mockResponseData);
        }),
    }));
};
const mockUpdateDynamicInputError = () => {
    mockAdapter.onGet('/shipowner/get-dynamic-input').reply(500, {
        message: 'failed',
    });
    (useEditDynamicInputOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
            };
            onError(mockResponseData);
        }),
    }));
};

beforeEach(() => {
    mockAdapter.onGet('/shipowner/get-dynamic-input').reply(200, {
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

describe('RFQ Edit input form owner', () => {
    describe('Snapshot Testing', () => {
        it('should render RFQ Edit input form owner screen correctly', () => {
            const editScreen = render(ownerStackMockComponent);
            expect(editScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should submit dynamic input with provided data', async () => {
            mockUpdateDynamicInput();
            const { getByTestId } = render(ownerStackMockComponent);
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
                    text: 'Ubah Dynamic Input Berhasil',
                });
            });
        });
        it('should submit dynamic input with provided data numeric input', async () => {
            mockUpdateDynamicInput();
            mockData.dynamicInput.inputType = 'numericInput';
            mockData.dynamicInput.fieldType = 'number';
            mockData.validation = {
                min: 1,
                max: 10,
            };
            mockData.dynamicInput.unit = 'Ton';

            const { getByTestId, getByPlaceholderText } = render(
                ownerStackMockComponent,
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
                    text: 'Ubah Dynamic Input Berhasil',
                });
            });
        });
        it('should submit dynamic input with provided data radio dropdown', async () => {
            mockUpdateDynamicInput();
            mockData.dynamicInput.inputType = 'radioDropdown';
            mockData.dynamicInput.fieldType = 'string';
            mockData.dynamicInput.validate = {};
            mockData.dynamicInput.unit = '';
            mockData.dynamicInput.option.push({
                value: 'option 1',
                _id: '1',
            });

            const { getByTestId, getByPlaceholderText } = render(
                ownerStackMockComponent,
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
                    text: 'Ubah Dynamic Input Berhasil',
                });
            });
        });
        it('should showing modal error when radio dropdown item is empty', async () => {
            mockUpdateDynamicInput();
            mockData.dynamicInput.inputType = 'radioDropdown';
            mockData.dynamicInput.fieldType = 'string';
            mockData.dynamicInput.validate = {};
            mockData.dynamicInput.unit = '';
            mockData.dynamicInput.option = [];

            const { getByTestId } = render(ownerStackMockComponent);

            const btnSubmit = getByTestId('add-button');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'RFQFormInputView.failedText',
                });
            });
        });
        it('should show modal error when error submit form', async () => {
            mockUpdateDynamicInputError();
            mockData.dynamicInput.inputType = 'textInput';
            mockData.dynamicInput.fieldType = 'string';
            const { getByTestId } = render(ownerStackMockComponent);
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
        it('should show modal error when label already exists', async () => {
            mockUpdateDynamicInputError400();
            mockData.dynamicInput.inputType = 'textInput';
            mockData.dynamicInput.fieldType = 'string';
            const { getByTestId } = render(ownerStackMockComponent);
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
