import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { GeneralForm } from '../addShip';
import { useGetAddShipDynamicForm } from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import renderer, { act } from 'react-test-renderer';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="GeneralForm"
                        component={GeneralForm}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockDynamicData = {
    dynamicForms: [
        {
            _id: '1',
            dynamicInput: {
                __v: 0,
                _id: '123',
                active: true,
                fieldName: 'shipName',
                fieldType: 'string',
                formType: 'addShipForm',
                inputType: 'textInput',
                label: 'Ship Name',
                order: 1,
                placeholder: 'Enter your ship name',
                templateType: 'generalAddShip',
            },
            option: [],
            required: true,
        },
        {
            _id: '2',
            dynamicInput: {
                __v: 0,
                _id: '2',
                active: true,
                fieldName: 'shipCategory',
                fieldType: 'string',
                formType: 'addShipForm',
                inputType: 'radioDropdown',
                label: 'Ship Category',
                order: 2,
                placeholder: 'Select your ship category',
                templateType: 'generalAddShip',
            },
            option: [
                { _id: '12', value: 'Barge' },
                { _id: '34', value: 'Tugboat' },
                { _id: '45', value: 'Ferry' },
            ],
            required: true,
        },
        {
            _id: '3',
            dynamicInput: {
                __v: 0,
                _id: '5',
                active: true,
                fieldName: 'rentPrice',
                fieldType: 'number',
                formType: 'addShipForm',
                inputType: 'numericInput',
                label: 'Rent Price',
                order: 3,
                templateType: 'generalAddShip',
                unit: 'Rp/month',
            },
            option: [],
            required: true,
        },
        {
            _id: '4',
            dynamicInput: {
                __v: 0,
                _id: '45',
                active: true,
                fieldName: 'shipDescription',
                fieldType: 'string',
                formType: 'addShipForm',
                inputType: 'textInput',
                label: 'Ship Description',
                order: 4,
                placeholder: 'Enter your ship description',
                templateType: 'generalAddShip',
            },
            option: [],
            required: true,
            validation: { multiline: true },
        },
    ],
};

beforeEach(() => {
    mockAdapter.onGet('/admin/get-dynamic-input').reply(200, {
        message: 'success',
        data: mockDynamicData,
    });
    (useGetAddShipDynamicForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockDynamicData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

describe('General add ship screen', () => {
    describe('Snapshot Testing', () => {
        it('Should render general add ship screen correctly', () => {
            const generalScreen = render(ownerStackMockComponent);
            renderer.create(ownerStackMockComponent);
            expect(generalScreen).toMatchSnapshot();
        });
    });
    describe('Unit testing', () => {
        it('should handle submit general add ship form', async () => {
            const { getByTestId, getByPlaceholderText, getByDisplayValue } =
                render(ownerStackMockComponent);
            const shipName = getByPlaceholderText('Enter your ship name');
            const shipCategory = getByTestId('radio-dropdown-shipCategory');
            const shipDesc = getByPlaceholderText(
                'Enter your ship description',
            );

            const btnSubmit = getByTestId('dynamic-button');
            act(() => {
                fireEvent.changeText(getByDisplayValue('0'), '12345');
                fireEvent.changeText(shipName, 'Ship 123');
                fireEvent.changeText(shipDesc, 'Ship Desc');
            });
            fireEvent.press(shipCategory);
            fireEvent.press(getByTestId('item-Barge'));
            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modalState = store.getState().addShip;

                expect(modalState).toEqual({
                    name: 'Ship 123',
                    desc: 'Ship Desc',
                    category: 'Barge',
                    pricePerMonth: '12345',
                    length: '',
                    width: '',
                    height: '',
                    facilities: [],
                    specifications: [
                        {
                            name: '',
                            value: '',
                        },
                    ],
                    shipDocument: [
                        {
                            uri: '',
                            name: '',
                            fileCopyUri: '',
                            type: '',
                            size: 0,
                            docExpired: undefined,
                            label: '',
                        },
                    ],
                });
            });
        });
    });
});
