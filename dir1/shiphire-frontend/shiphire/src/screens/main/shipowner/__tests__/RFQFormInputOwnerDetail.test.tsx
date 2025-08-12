import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { useAddDynamicInputItemOwner } from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { RFQInputFormOwnerDetail } from '../rfqDynamicFormOwner/rfqInputFormOwnerDetail';
import { act } from 'react-test-renderer';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    templateType: 'bargeRfq',
    formType: 'rfqForm',
    shipId: '123',
};

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="RFQInputFormOwnerDetail"
                        component={RFQInputFormOwnerDetail}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockSubmitInput = () => {
    mockAdapter.onPost('/admin/save-dynamic-input').reply(200, {
        message: 'success',
    });
    (useAddDynamicInputItemOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockSubmitInput400 = () => {
    mockAdapter.onPost('/admin/save-dynamic-input').reply(400, {
        message: 'failed',
    });
    (useAddDynamicInputItemOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
                response: { status: 400 },
            };
            onError(mockResponseData);
        }),
    }));
};
const mockSubmitInputError = () => {
    mockAdapter.onPost('/admin/save-dynamic-input').reply(500, {
        message: 'failed',
    });
    (useAddDynamicInputItemOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
            };
            onError(mockResponseData);
        }),
    }));
};
// beforeEach(()=>{
//     mockAdapter.onGet('/admin/save-dynamic-input').reply(500, {
//         message: 'failed',
//     });
//     (useAddDynamicInputItemOwner as jest.Mock).mockImplementation(() => ({
//         mutate: jest.fn().mockImplementation((data, options) => {
//             const { onError } = options;
//             const mockResponseData = {
//                 message: 'failed',
//             };
//             onError(mockResponseData);
//         }),
//     }));
// })
describe('RFQ Form Input Owner Detail', () => {
    describe('Snapshot testing', () => {
        it('Should render RFQ form input owner detail correctly', () => {
            const inputFormScreen = render(ownerStackMockComponent);
            expect(inputFormScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should submit dynamic input form with inputType text input', async () => {
            mockSubmitInput();
            const { getByPlaceholderText, getByTestId, getByText } = render(
                ownerStackMockComponent,
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
                    text: 'RFQFormInputView.successTextAdd',
                });
            });
        });
        it('should submit dynamic input form with inputType numeric input', async () => {
            mockSubmitInput();
            const { getByPlaceholderText, getByTestId } = render(
                ownerStackMockComponent,
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
                    text: 'RFQFormInputView.successTextAdd',
                });
            });
        });
        it('should submit dynamic input form with inputType radio drop down input', async () => {
            const { getByText, getByPlaceholderText, getByTestId } = render(
                ownerStackMockComponent,
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
                    text: 'RFQFormInputView.successTextAdd',
                });
            });
        });
        it('should show modal error when radio drop down input has no item', async () => {
            const { getByText, getByPlaceholderText, getByTestId } = render(
                ownerStackMockComponent,
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
            fireEvent.press(getByTestId('item-delete-0'));

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
        it('should submit dynamic input form with inputType document select input', async () => {
            const { getByPlaceholderText, getByTestId } = render(
                ownerStackMockComponent,
            );
            const label = getByPlaceholderText('Label');
            const required = getByTestId('check-required');
            const dropDown = getByTestId('field-type');

            act(() => {
                fireEvent.changeText(label, 'document 1');
                fireEvent.press(required);
                fireEvent.press(dropDown);
            });
            const docSelect = getByTestId('document-select-item');
            fireEvent.press(docSelect);

            const btnSubmit = getByTestId('add-button');

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'RFQFormInputView.successTextAdd',
                });
            });
        });
        it('should handle error when label already exists', async () => {
            mockSubmitInput400();

            const { getByPlaceholderText, getByTestId } = render(
                ownerStackMockComponent,
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
            mockSubmitInputError();
            const { getByPlaceholderText, getByTestId } = render(
                ownerStackMockComponent,
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
    });
});
