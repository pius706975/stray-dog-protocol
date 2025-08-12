import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { RFQFormInputView } from '../rfqDynamicFormOwner/rfqFormInputView';
import {
    useActiveDynamicInputOwner,
    useGetDynamicInputRFQOwnerById,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { RFQInputFormOwnerDetail } from '../rfqDynamicFormOwner/rfqInputFormOwnerDetail';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    _id: '123',
    category: 'Barge',
    shipId: '234',
};
const mockParamsInputForm = {
    shipId: '234',
    templateType: 'ship1Rfq',
    formType: 'Barge',
};

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="RFQFormInputView"
                        component={RFQFormInputView}
                        initialParams={mockParams}
                    />
                    <MainOwnerStack.Screen
                        name="RFQInputFormOwnerDetail"
                        component={RFQInputFormOwnerDetail}
                        initialParams={mockParamsInputForm}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockDynamicInput = [
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
    {
        dynamicInput: {
            _id: '65a737c476517457909c5f48',
            formType: 'rfqForm',
            templateType: '65b32be0c1cca55a0CustomRfq',
            inputType: 'textInput',
            label: 'Test input',
            fieldName: 'testInput',
            fieldType: 'string',
            placeholder: 'test',
            active: true,
            __v: 0,
        },
        required: true,
        option: [],
        _id: '65af73fda6a0ba4f3492eb3a4',
    },
    {
        dynamicInput: {
            _id: '65a737c476517457909c5f49',
            formType: 'rfqForm',
            templateType: '65b32be0c1cca55a0CustomRfq',
            inputType: 'textInput',
            label: 'Test input',
            fieldName: 'testInput',
            fieldType: 'string',
            placeholder: 'test',
            active: false,
            __v: 0,
        },
        required: true,
        option: [],
        _id: '65af73fda6a0ba4f3492eb3a5',
    },
];

const mockActivation = () => {
    mockAdapter.onPost('/admin/activation-dynamic-input').reply(200, {
        message: 'success',
    });
    (useActiveDynamicInputOwner as jest.Mock).mockImplementation(() => ({
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
    mockAdapter.onGet('/admin/get-dynamic-input').reply(200, {
        message: 'success',
        data: mockDynamicInput,
    });
    (useGetDynamicInputRFQOwnerById as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
                data: {
                    data: {
                        dynamicForms: mockDynamicInput,
                        templateType: 'ship1Rfq',
                    },
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});
describe('RFQ Form Input View Screen', () => {
    describe('Snapshot Testing', () => {
        it('Should render RFQ Form Input View correctly', () => {
            const formInputView = render(ownerStackMockComponent);
            expect(formInputView).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should navigate to add dynamic input', () => {
            const { getByTestId } = render(ownerStackMockComponent);

            fireEvent.press(getByTestId('add-input-btn'));
            expect(getByTestId('addDefaultRFQForm')).toBeDefined;
        });
        it('should deactive input', async () => {
            mockActivation();
            const { getByTestId } = render(ownerStackMockComponent);

            fireEvent.press(getByTestId('btn-deactive-6'));
            fireEvent.press(getByTestId('btn-confirm'));

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'RFQFormInputView.successText',
                    visible: true,
                });
            });
        });
        it('should activate input', async () => {
            mockActivation();
            const { getByTestId } = render(ownerStackMockComponent);

            fireEvent.press(getByTestId('btn-active-7'));
            fireEvent.press(getByTestId('btn-confirm'));

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'RFQFormInputView.successText',
                    visible: true,
                });
            });
        });
        it('should show bottom sheet input', async () => {
            const { getByTestId } = render(ownerStackMockComponent);

            fireEvent.press(getByTestId('detail-item-7'));

            expect(getByTestId('detail-input')).toBeDefined();
        });
    });
});
