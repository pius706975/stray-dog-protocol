import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    DynamicInputRFQData,
    MainOwnerStackParamList,
} from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { RFQFormInputManagementOwner } from '../rfqDynamicFormOwner/rfqFormInputManagement';
import { createTemplateDefaultRFQForm } from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

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
];
const mockParams = {
    dynamicForms: mockDynamicInput,
    templateType: 'bargeRfq',
    shipId: '234',
};

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="RFQFormInputManagementOwner"
                        component={RFQFormInputManagementOwner}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockSubmitDynamic = () => {
    mockAdapter.onPost('/admin/save-default-RFQ').reply(200, {
        message: 'success',
    });
    (createTemplateDefaultRFQForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockSubmitDynamicError = () => {
    mockAdapter.onPost('/admin/save-default-RFQ').reply(500, {
        message: 'failed',
    });
    (createTemplateDefaultRFQForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
            };
            onError(mockResponseData);
        }),
    }));
};

describe('RFQ Form Input Management Owner', () => {
    describe('Snapshot Testing', () => {
        it('Should render RFQ Form Input Management Owner screen correctly', () => {
            const inputManagementScreen = render(ownerStackMockComponent);
            expect(inputManagementScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('Should submit rfq selected', async () => {
            mockSubmitDynamic();
            const { getByTestId } = render(ownerStackMockComponent);
            const btnSubmit = getByTestId('btn-submit');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'Successfully added dynamic form.',
                    visible: true,
                });
            });
        });
        it('Should show modal error when submit rfq selected failed', async () => {
            mockSubmitDynamicError();
            const { getByTestId } = render(ownerStackMockComponent);
            const btnSubmit = getByTestId('btn-submit');
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'Failed to add dynamic form.',
                    visible: true,
                });
            });
        });
    });
});
