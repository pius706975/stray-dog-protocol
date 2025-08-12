import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { RFQTemplateManagement } from '../rfqDynamicForm/rfqTemplateManagement';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import {
    useActiveDynamicForm,
    useGetAllTemplateRFQForm,
} from '../../../../hooks';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);
const mockData = [
    {
        _id: '123',
        formType: 'rfqForm',
        templateType: 'bargeRfq',
        dynamicForms: [],
        active: true,
    },
    {
        _id: '345',
        formType: 'rfqForm',
        templateType: 'bargeRfq',
        dynamicForms: [],
        active: false,
    },
];
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="RFQTemplateManagement"
                        component={RFQTemplateManagement}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockActivation = () => {
    mock.onPost('/admin/activate-dynamic-input-rfq').reply(200, {
        message: 'success',
    });
    (useActiveDynamicForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};

const mockErrorActivation = () => {
    mock.onPost('/admin/activate-dynamic-input-rfq').reply(500, {
        message: 'failed',
    });
    (useActiveDynamicForm as jest.Mock).mockImplementation(() => ({
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
    mock.onGet('/admin/get-dynamic-input-rfq').reply(200, {
        message: 'success',
        data: mockData,
    });
    (useGetAllTemplateRFQForm as jest.Mock).mockImplementation(() => ({
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

describe('Testing RFQ template management screen', () => {
    describe('Snapshot testing', () => {
        it('should render RFQ template management screen correctly', () => {
            const rfqTemplateScreen = render(adminStackMockComponent);
            expect(rfqTemplateScreen).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should update activate RFQ template correctly', async () => {
            mockActivation();
            const { getByTestId } = render(adminStackMockComponent);
            const btnActive = getByTestId('btn-confirm-active');
            fireEvent.press(btnActive);

            const btnConfirm = getByTestId('btn-confirm');
            fireEvent.press(btnConfirm);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Template RFQ Form Status Success',
                });
            });
        });
        it('should deactive RFQ template correctly', async () => {
            mockActivation();
            const { getByTestId } = render(adminStackMockComponent);
            const btnActive = getByTestId('btn-confirm-deactive');
            fireEvent.press(btnActive);

            const btnConfirm = getByTestId('btn-confirm');
            fireEvent.press(btnConfirm);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Update Template RFQ Form Status Success',
                });
            });
        });
        it('should return error when update activation RFQ template', async () => {
            mockErrorActivation();
            const { getByTestId } = render(adminStackMockComponent);
            const btnActive = getByTestId('btn-confirm-deactive');
            fireEvent.press(btnActive);

            const btnConfirm = getByTestId('btn-confirm');
            fireEvent.press(btnConfirm);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Update Template RFQ Form Status Failed',
                });
            });
        });
    });
});
