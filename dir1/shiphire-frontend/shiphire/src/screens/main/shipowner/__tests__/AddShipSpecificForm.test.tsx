import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SpecificForm } from '../addShip';
import { useGetAddShipDynamicForm } from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));
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
                        name="SpecificForm"
                        component={SpecificForm}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockDynamicData = {
    dynamicForms: [
        {
            _id: '65a737c476517457909c4d18',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d7a',
                active: true,
                fieldName: 'length',
                fieldType: 'number',
                formType: 'addShipForm',
                inputType: 'numericInput',
                label: 'Ship Length',
                order: 1,
                templateType: 'spesificAddShip',
                unit: 'meter',
            },
            option: [],
            required: true,
        },
        {
            _id: '65a737c476517457909c4d19',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d7b',
                active: true,
                fieldName: 'width',
                fieldType: 'number',
                formType: 'addShipForm',
                inputType: 'numericInput',
                label: 'Ship Width',
                order: 2,
                templateType: 'spesificAddShip',
                unit: 'meter',
            },
            option: [],
            required: true,
        },
        {
            _id: '65a737c476517457909c4d1a',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d7c',
                active: true,
                fieldName: 'height',
                fieldType: 'number',
                formType: 'addShipForm',
                inputType: 'numericInput',
                label: 'Ship Height',
                order: 3,
                templateType: 'spesificAddShip',
                unit: 'meter',
            },
            option: [],
            required: true,
        },
        {
            _id: '65a737c476517457909c4d3b',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d89',
                active: true,
                fieldName: 'shipFacility',
                fieldType: 'arrayOfString',
                formType: 'addShipForm',
                inputType: 'selectDropDown',
                label: 'Ship Facility',
                order: 4,
                placeholder: 'Select your ship facility',
                templateType: 'bargeSpesific',
            },
            option: [
                { _id: '12', value: 'facility1' },
                { _id: '32', value: 'facility2' },
            ],
            required: true,
            validation: { min: 1 },
        },
        {
            _id: '65a737c476517457909c4d43',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d8a',
                active: true,
                fieldName: 'shipSpec',
                fieldType: 'arrayOfString',
                formType: 'addShipForm',
                inputType: 'selectDropDown',
                label: 'Ship Specification',
                order: 5,
                placeholder: 'Select your ship spesification',
                templateType: 'bargeSpesific',
            },
            option: [{ _id: '12', value: 'Capacity' }],
            required: true,
            validation: { min: 1 },
        },
        {
            _id: '65a737c476517457909c4d45',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d8b',
                active: true,
                fieldName: 'capacity',
                fieldType: 'number',
                formType: 'addShipForm',
                inputType: 'numericInput',
                label: 'Capacity',
                order: 4,
                templateType: 'bargeSpesificSpec',
                unit: 'tons',
            },
            option: [],
            required: true,
        },
    ],
};
const initialState = {
    name: '',
    desc: '',
    pricePerMonth: '',
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
};

beforeEach(() => {
    (useSelector as jest.Mock).mockReturnValue({
        ...initialState,
        category: 'Barge',

        shipSpecSlice: ['Capacity'],
    });
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

describe('add ship specific form', () => {
    describe('Snapshot testing', () => {
        it('should render add specific screen correctly', () => {
            const specificScreen = render(ownerStackMockComponent);
            expect(specificScreen).toMatchSnapshot();
        });
    });
    describe('Unit testing', () => {
        it('should submit spesific data', async () => {
            const { getByTestId, getAllByDisplayValue, getByDisplayValue } =
                render(ownerStackMockComponent);
            const shipSize = getAllByDisplayValue('0');
            const shipFacility = getByTestId('dropdown-shipFacility');
            const shipSpec = getByTestId('dropdown-spec');
            const btnSubmit = getByTestId('dynamic-button');
            act(() => {
                fireEvent.changeText(shipSize[0], '1234');
                fireEvent.changeText(shipSize[1], '1234');
                fireEvent.changeText(shipSize[2], '1234');
            });
            fireEvent.press(shipFacility);
            fireEvent.press(getByTestId('item-facility1'));
            fireEvent.press(shipSpec);
            fireEvent.press(getByTestId('item-Capacity'));

            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const specificData = store.getState().addShip;
                expect(specificData).toEqual({
                    name: '',
                    desc: '',
                    category: '',
                    pricePerMonth: '',
                    length: 1234,
                    width: 1234,
                    height: 1234,
                    facilities: ['facility1'],
                    specifications: [
                        {
                            name: 'Capacity',
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
