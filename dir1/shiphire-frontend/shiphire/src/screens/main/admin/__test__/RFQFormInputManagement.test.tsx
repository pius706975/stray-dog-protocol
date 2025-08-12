import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { RFQFormInputManagement } from '../rfqDynamicForm/rfqFormInputManagement';
import {
    useActiveDynamicInput,
    useGetDynamicInputRFQByTemplateType,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const mockParams = {
    templateType: 'bargeRfq',
    formType: 'rfqForm',
};
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="RFQFormInputManagement"
                        component={RFQFormInputManagement}
                        initialParams={mockParams}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockInputRfq = [
    {
        _id: '123',
        dynamicInput: {
            __v: 0,
            _id: '435',
            active: true,
            fieldName: 'additionalInformation',
            fieldType: 'string',
            formType: 'rfqForm',
            inputType: 'textInput',
            label: 'Additional Information',
            placeholder: 'Ex: Additioal Crew, etc',
            templateType: 'bargeRfq',
        },
        option: [],
        required: false,
    },
    {
        _id: '456',
        dynamicInput: {
            __v: 0,
            _id: '678',
            active: false,
            fieldName: 'rentalDate',
            fieldType: 'string',
            formType: 'rfqForm',
            inputType: 'datePickerCalendar',
            label: 'Rental Date',
            placeholder: 'Select date',
            templateType: 'bargeRfq',
        },
        option: [],
        required: true,
    },
];

const mockActivation = () => {
    mock.onPost('/admin/activate-dynamic-input').reply(200, {
        message: 'success',
    });
    (useActiveDynamicInput as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};

beforeEach(() => {
    mock.onGet('/admin/get-dynamic-input').reply(200, {
        message: 'success',
        data: { dynamicForms: mockInputRfq },
    });
    (useGetDynamicInputRFQByTemplateType as jest.Mock).mockImplementation(
        () => ({
            mutate: jest.fn().mockImplementation((data, options) => {
                const { onSuccess } = options;
                const mockResponseData = {
                    data: {
                        data: { dynamicForms: mockInputRfq },
                    },
                };
                onSuccess(mockResponseData);
            }),
        }),
    );
});

describe('Testing RFQ form input management screen', () => {
    describe('Snapshot testing', () => {
        it('should render RFQ form input management screen correctly', () => {
            const inputManagement = render(adminStackMockComponent);
            expect(inputManagement).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should update activation when press activation button', async () => {
            mockActivation();
            const { getByTestId } = render(adminStackMockComponent);
            const btnActive = getByTestId('btn-active');
            fireEvent.press(btnActive);

            const btnConfirm = getByTestId('btn-confirm');
            fireEvent.press(btnConfirm);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Dynamic Input Status Success',
                });
            });
        });
        it('should update activation when press deactive button', async () => {
            mockActivation();
            const { getByTestId } = render(adminStackMockComponent);
            const btnActive = getByTestId('btn-deactive');
            fireEvent.press(btnActive);

            const btnConfirm = getByTestId('btn-confirm');
            fireEvent.press(btnConfirm);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Dynamic Input Status Success',
                });
            });
        });
        it('should update activation when press deactive button', async () => {
            mockActivation();
            const { getByTestId } = render(adminStackMockComponent);
            const pressable = getByTestId('item-detail-0');
            fireEvent.press(pressable);

            expect(getByTestId('bottom-sheet-detail')).toBeDefined();
        });
    });
});
