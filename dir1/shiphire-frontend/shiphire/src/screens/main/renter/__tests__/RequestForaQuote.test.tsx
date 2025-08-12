import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    MainStackParamList,
    RequestForAQuoteParamList,
} from '../../../../types';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { RequestForaQuote } from '../requestForQuote';
import MockAdapter from 'axios-mock-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPANYDATA, TOKEN, USERDATA } from '../../../../configs';
import { RFQDocPreview } from '../rfqDocPreview';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { useGetShipRFQForm } from '../../../../hooks';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<RequestForAQuoteParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockRfq = {
    categoryId: '123',
    shipId: '2486',
    shipOwnerId: '126das',
    dynamicFormId: 'agsd',
};

const mockShip = {
    status: 'success',
    data: {
        _id: '2486',
        size: {
            length: 13,
            width: 21,
            height: 11,
        },
        shipOwnerId: {
            _id: '213',
            company: {
                name: '',
                companyType: '',
                address: '',
                isVerified: true,
                isRejected: true,
            },
        },
        name: '',
        desc: '',
        tags: [],
        pricePerMonth: 100000,
        category: {
            _id: '123',
            name: '',
        },
        facilities: [
            {
                _id: '123',
                name: '',
                type: '',
            },
        ],
        specifications: [
            {
                _id: '',
                name: '',
                spesificationId: { units: '' },
                value: '',
            },
        ],
        rating: 1441,
        totalRentalCount: 1441,
        shipDocuments: [],
        __v: 1441,
        imageUrl: '',
        shipHistory: [
            {
                _id: '',
                rentStartDate: '',
                rentEndDate: '',
                locationDeparture: '',
                locationDestination: '',
                needs: '',
                renterCompanyName: '',
                deleteStatus: '',
                price: '',
                genericDocument: [
                    {
                        fileName: '',
                        fileUrl: '',
                    },
                ],
            },
        ],
        rfqDynamicForm: '',
        shipApproved: [
            {
                name: '',
                desc: '',
                approvedShip: true,
                _id: '',
            },
        ],
    },
};

const mockDynamicForm = {
    status: 'success',
    data: {
        _id: '12',
        formType: 'asdfg',
        shipId: '2486',
        dynamicForms: [
            // {
            //     dynamicInput: {
            //         _id: '659f8d881bf82d3f593281fe',
            //         formType: 'rfqForm',
            //         templateType: 'defaultRfq',
            //         inputType: 'radioDropdown',
            //         label: 'Ship Rent Type',
            //         fieldName: 'shipRentType',
            //         fieldType: 'radioDropdown',
            //         placeholder: 'Select your ship rent type',
            //         active: true,
            //         __v: 0,
            //     },
            // },
            {
                dynamicInput: {
                    _id: '659f8d881bf82d3f59328340',
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
            },
            {
                dynamicInput: {
                    _id: '659f8d881bf82d3f59328202',
                    formType: 'rfqForm',
                    templateType: 'bargeRfq',
                    inputType: 'textInput',
                    label: 'Unloading Address',
                    fieldName: 'unloadingAddress',
                    fieldType: 'string',
                    placeholder: 'unloading',
                    active: true,
                    __v: 0,
                },
            },
            {
                dynamicInput: {
                    _id: '659f325235',
                    formType: 'rfqForm',
                    templateType: 'bargeRfq',
                    inputType: 'textInput',
                    label: 'Load Address',
                    fieldName: 'loadAddress',
                    fieldType: 'string',
                    placeholder: 'load',
                    active: true,
                    __v: 0,
                },
            },
        ],
        active: false,
        createdAt: '',
        updatedAt: '',
    },
};

const rfqStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="ShipInformation"
                        component={RequestForaQuote}
                        initialParams={mockRfq}
                    />
                    <MainStack.Screen
                        name="DocPreview"
                        component={RFQDocPreview}
                        initialParams={mockRfq}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

mockAdapter.onGet('/ship/get-ship-rfq-form/agsd').reply(200, mockDynamicForm);

mockAdapter.onGet('/ship/get-ship-by-id/2486').reply(200, mockShip);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Muhamad Fauzan',
        email: 'usman@email.com',
        password: 'test',
        isVerified: false,
    }),
);
AsyncStorage.setItem(
    COMPANYDATA,
    JSON.stringify({
        name: 'mock',
        companyType: 'PT',
        address: 'jljl',
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

describe('request for quote screen', () => {
    it('should renders correctly', async () => {
        const tree = render(rfqStackNavMockComponent()).toJSON();
        await act(async () => {
            expect(tree).toMatchSnapshot();
        });
    });
});
describe('Request for a quote screen', () => {
    it('should renders correctly', async () => {
        const { getByTestId } = render(rfqStackNavMockComponent());
        await act(async () => {
            expect(getByTestId('RFQScreen')).toBeDefined();
        });
    });
    it('should clicked Edit Profile', async () => {
        const { getByTestId } = render(rfqStackNavMockComponent());

        expect(getByTestId('personalComp')).toBeDefined();

        const edit = getByTestId('editBtn');

        await act(async () => {
            fireEvent.press(edit);
        });
    });
    // it('should submit form', async () => {
    //     const { getByTestId, getByPlaceholderText, getByText } = render(
    //         rfqStackNavMockComponent(),
    //     );

    //     const rfq = getByTestId('RFQScreen');

    //     expect(rfq).toBeDefined();

    //     await waitFor(async () => {
    //         const rentalDate = getByPlaceholderText('Select date');

    //         fireEvent.press(rentalDate);

    //         expect(getByTestId('calendarModal')).toBeDefined();

    //         const startDate = getByText('Thursday 1 February 2024');

    //         fireEvent.press(startDate);

    //         const endDate = getByText('Wednesday 10 February 2024');

    //         fireEvent.press(endDate);

    //         // fireEvent.press(getByTestId('selectButton'));

    //         const unload = getByPlaceholderText('unloading');
    //         act(() => {
    //             fireEvent.changeText(unload, 'Surabaya');
    //         });

    //         expect(unload.props.value).toBe('Surabaya');

    //         const load = getByPlaceholderText('load');
    //         act(() => {
    //             fireEvent.changeText(load, 'Jakarta');
    //         });
    //     });
    // });
    it('should close the modal calendar', async () => {
        const { getByTestId, getByPlaceholderText } = render(
            rfqStackNavMockComponent(),
        );

        const rfq = getByTestId('RFQScreen');

        expect(rfq).toBeDefined();

        await waitFor(async () => {
            const rentalDate = getByPlaceholderText('Select date');

            fireEvent.press(rentalDate);

            expect(getByTestId('calendarModal')).toBeDefined();

            fireEvent.press(getByTestId('closeButton'));
        });
    });
});
