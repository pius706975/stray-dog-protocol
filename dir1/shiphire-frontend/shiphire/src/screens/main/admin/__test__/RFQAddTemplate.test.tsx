import { QueryClient, QueryClientProvider } from 'react-query';
import { AddRfqTemplate } from '../rfqDynamicForm/addRfqTemplate';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { useAddRfqTemplate, useGetShipCategories } from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { RFQTemplateManagement } from '../rfqDynamicForm/rfqTemplateManagement';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);
const mockCategories = [
    {
        _id: '1',
        name: 'barge',
        __v: '1',
    },
    {
        _id: '2',
        name: 'tugboat',
        __v: '2',
    },
];
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="AddRfqTemplate"
                        component={AddRfqTemplate}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockSubmitForm = () => {
    mock.onGet('/admin/save-rfq-template').reply(200, {
        message: 'success',
    });
    (useAddRfqTemplate as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockSubmitFormError = () => {
    mock.onGet('/admin/save-rfq-template').reply(500, {
        message: 'failed',
    });
    (useAddRfqTemplate as jest.Mock).mockImplementation(() => ({
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
    mock.onGet('/admin/get-categories').reply(200, {
        message: 'success',
        data: mockCategories,
    });
    (useGetShipCategories as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockCategories,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

describe('Testing RFQ add template screen', () => {
    describe('Snapshot testing', () => {
        it('should render RFQ add template screen correctly', () => {
            const rfqAddTemplate = render(adminStackMockComponent);
            expect(rfqAddTemplate).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should submit form add template test', async () => {
            mockSubmitForm();
            const { getByTestId } = render(adminStackMockComponent);
            const templatePicker = getByTestId('template-picker');
            act(() => {
                fireEvent.press(templatePicker);
            });
            const bargeItem = getByTestId('item-barge');
            fireEvent.press(bargeItem);

            const submitBtn = getByTestId('submit-btn');
            fireEvent.press(submitBtn);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Add RFQ Template Success',
                });
            });
        });
        it('should show error when add template failed', async () => {
            mockSubmitFormError();
            const { getByTestId } = render(adminStackMockComponent);
            const templatePicker = getByTestId('template-picker');
            act(() => {
                fireEvent.press(templatePicker);
            });
            const bargeItem = getByTestId('item-barge');
            fireEvent.press(bargeItem);

            const submitBtn = getByTestId('submit-btn');
            fireEvent.press(submitBtn);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Add RFQ Template Failed/Duplicate Template',
                });
            });
        });
    });
});
