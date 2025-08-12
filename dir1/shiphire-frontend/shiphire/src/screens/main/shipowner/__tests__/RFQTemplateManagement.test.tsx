import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { RFQTemplateOwnerManagement } from '../rfqDynamicFormOwner/rfqTemplateManagement';
import {
    createTemplateCustomRFQForm,
    useGetTemplateRfqShipFormByShipCategory,
} from '../../../../hooks';
import { fireEvent, render } from '@testing-library/react-native';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    shipCategory: '123',
    shipId: '234',
};

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="RFQTemplateOwnerManagement"
                        component={RFQTemplateOwnerManagement}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockCreateTemplate = () => {
    mockAdapter.onPost('/admin/save-custom-template-RFQ').reply(200, {
        message: 'success',
    });
    (createTemplateCustomRFQForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockCreateTemplateError = () => {
    mockAdapter.onPost('/admin/save-custom-template-RFQ').reply(500, {
        message: 'failed',
    });
    (createTemplateCustomRFQForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
            };
            onError(mockResponseData);
        }),
    }));
};

const mockTemplateData = {
    _id: '65af73fda6a0ba4f3492eb34',
    formType: 'rfqForm',
    templateType: 'Self Propelled Oil BargeRfq',
    dynamicForms: [
        {
            dynamicInput: {
                _id: '65a737c476517457909c5f42',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Needs',
                fieldName: 'needs',
                fieldType: 'string',
                placeholder: 'Ex: for transporting',
                active: true,
                __v: 0,
            },
            required: true,
            option: [],
            _id: '65af73fda6a0ba4f3492eb35',
        },
        {
            dynamicInput: {
                _id: '65a737c476517457909c5f43',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'radioDropdown',
                label: 'Ship Rent Type',
                fieldName: 'shipRentType',
                fieldType: 'string',
                placeholder: 'Select your ship rent type',
                active: true,
                __v: 0,
            },
            required: true,
            option: [],
            _id: '65af73fda6a0ba4f3492eb36',
        },
        {
            dynamicInput: {
                _id: '65a737c476517457909c5f44',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Location Departure',
                fieldName: 'locationDeparture',
                fieldType: 'string',
                placeholder: 'Ex: Palu, Sulawesi Tengah',
                active: true,
                __v: 0,
            },
            required: true,
            option: [],
            _id: '65af73fda6a0ba4f3492eb37',
        },
        {
            dynamicInput: {
                _id: '65a737c476517457909c5f45',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Location Destination',
                fieldName: 'locationDestination',
                fieldType: 'string',
                placeholder: 'Ex: Surabaya, Jawa Timur',
                active: true,
                __v: 0,
            },
            required: true,
            option: [],
            _id: '65af73fda6a0ba4f3492eb38',
        },
        {
            dynamicInput: {
                _id: '65a737c476517457909c5f46',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'datePickerCalendar',
                label: 'Rental Date',
                fieldName: 'rentalDate',
                fieldType: 'string',
                placeholder: 'Select date',
                active: true,
                __v: 0,
            },
            required: true,
            option: [],
            _id: '65af73fda6a0ba4f3492eb39',
        },
        {
            dynamicInput: {
                _id: '65a737c476517457909c5f47',
                formType: 'rfqForm',
                templateType: 'defaultRfq',
                inputType: 'textInput',
                label: 'Additional Information',
                fieldName: 'additionalInformation',
                fieldType: 'string',
                placeholder: 'Ex: Additioal Crew, etc',
                active: true,
                __v: 0,
            },
            required: true,
            option: [],
            _id: '65af73fda6a0ba4f3492eb3a',
        },
    ],
    active: true,
    createdAt: '2024-01-23T08:08:29.211Z',
    updatedAt: '2024-01-23T08:08:29.211Z',
    __v: 0,
};

beforeEach(() => {
    mockAdapter.onGet('/admin/get-dynamic-input').reply(200, {
        message: 'success',
        data: mockTemplateData,
    });
    (useGetTemplateRfqShipFormByShipCategory as jest.Mock).mockImplementation(
        () => ({
            mutate: jest.fn().mockImplementation((data, options) => {
                const { onSuccess } = options;
                const mockResponseData = {
                    data: {
                        data: mockTemplateData,
                    },
                };
                onSuccess(mockResponseData);
            }),
        }),
    );
});

describe('RFQ Template Management', () => {
    describe('Snapshot Testing', () => {
        it('should render RFQ Template Management screen correctly', () => {
            const templateScreen = render(ownerStackMockComponent);
            expect(templateScreen).toMatchSnapshot();
        });
    });

    describe('Unit Testing', () => {
        it('should save custom RFQ', () => {
            mockCreateTemplate();
            const { getByTestId } = render(ownerStackMockComponent);
            const customPressable = getByTestId('custom-rfq');
            fireEvent.press(customPressable);
            expect(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'RFQDynamicForm.SuccessCreatedCustomRFQ',
                    visible: true,
                });
            });
        });
        it('should show modal when failed save custom RFQ', () => {
            mockCreateTemplateError();
            const { getByTestId } = render(ownerStackMockComponent);
            const customPressable = getByTestId('custom-rfq');
            fireEvent.press(customPressable);
            expect(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'Add RFQ Template Failed/Duplicate Template',
                    visible: true,
                });
            });
        });
    });
});
