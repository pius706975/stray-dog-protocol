import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { AddTransactionHistory } from '../addTransactionHistory';
import { useSubmitTransactionHistory } from '../../../../hooks';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';
import { act } from 'react-test-renderer';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    shipId: '65a8bda44b191011546c21b1',
    shipName: 'Barge Hauler',
    shipCategory: 'Barge',
    shipImageUrl:
        'https://shiphire-assets.s3.ap-southeast-1.amazonaws.com/shiphire/ship/65a8bda44b191011546c21b1/ship.jpg',
    shipSize: {
        length: 30,
        width: 10,
        height: 5,
    },
    shipCompany: {
        name: 'ShipHire Indonesia',
        companyType: 'PT',
    },
};

const addTransactionHistoryComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="AddTransactionHistory"
                        component={AddTransactionHistory}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Add Transaction History Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Add Transaction History screen correctly', async () => {
            const addTransactionHistory = render(
                addTransactionHistoryComponent,
            );
            expect(addTransactionHistory).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should render the form correctly', async () => {
            const addTransactionHistory = render(
                addTransactionHistoryComponent,
            );

            const { getByTestId, getByText, getByPlaceholderText } =
                addTransactionHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDestination',
            );

            const locationDeparture = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDeparture',
            );

            expect(numericInput).toBeTruthy();
            expect(rentalStartDate).toBeTruthy();
            expect(datePicker).toBeTruthy();
            expect(rentalEndDate).toBeTruthy();
            expect(datePickerEnd).toBeTruthy();
            expect(locationDestination).toBeTruthy();
            expect(locationDeparture).toBeTruthy();
        });
        it('should handle submit add transaction history form with error', async () => {
            const addTransactionHistory = render(
                addTransactionHistoryComponent,
            );

            const { getByTestId, getByText, getByPlaceholderText } =
                addTransactionHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDestination',
            );

            const locationDeparture = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDeparture',
            );

            fireEvent.changeText(numericInput, '60000000');

            fireEvent.press(rentalStartDate);
            fireEvent.changeText(datePicker, '20 February 2024');

            fireEvent.press(rentalEndDate);
            fireEvent.changeText(datePickerEnd, '25 February 2024');

            fireEvent.changeText(locationDestination, 'Jakarta');

            fireEvent.changeText(locationDeparture, 'Surabaya');

            const submitButton = getByText(
                'ShipOwner.AddTransactionHistory.labelSubmit',
            );

            fireEvent.press(submitButton);

            mockAdapter.onPost('/ship-owner/add-ship-history').reply(500, {
                message: 'error',
                data: {},
            });
            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'ShipOwner.AddTransactionHistory.failedAddHistory',
                    visible: true,
                });
            });
        });
        it('should handle submit add transaction history form without additional document', async () => {
            const addTransactionHistory = render(
                addTransactionHistoryComponent,
            );

            const {
                getByTestId,
                getByText,
                getByPlaceholderText,
                getByDisplayValue,
            } = addTransactionHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDestination',
            );

            const locationDeparture = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDeparture',
            );

            const submitButton = getByText(
                'ShipOwner.AddTransactionHistory.labelSubmit',
            );

            act(() => {
                fireEvent.changeText(numericInput, '60000000');

                fireEvent.press(rentalStartDate);
                fireEvent.changeText(datePicker, '20 February 2024');

                fireEvent.press(rentalEndDate);
                fireEvent.changeText(datePickerEnd, '25 February 2024');

                fireEvent.changeText(locationDestination, 'Jakarta');

                fireEvent.changeText(locationDeparture, 'Surabaya');
            });

            fireEvent.press(submitButton);

            mockAdapter.onPost('/ship-owner/add-ship-history').reply(200, {
                message: 'success',
                data: {
                    shipId: '65a8bda44b191011546c21b1',
                    price: 60000000,
                    rentStartDate: '2024-02-20T00:00:00.000Z',
                    rentEndDate: '2024-02-25T00:00:00.000Z',
                    locationDeparture: 'Surabaya',
                    locationDestination: 'Jakarta',
                },
            });
            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'ShipOwner.AddTransactionHistory.successAddHistory',
                    visible: true,
                });

                jest.advanceTimersByTime(3000);
            });
        });
        it('should handle submit add transaction history form with additional document', async () => {
            const addTransactionHistory = render(
                addTransactionHistoryComponent,
            );

            const {
                getByTestId,
                getByText,
                getByPlaceholderText,
                getByDisplayValue,
            } = addTransactionHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDestination',
            );

            const locationDeparture = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDeparture',
            );

            const btnModalAdditional = getByTestId('add-input-additional-doc');

            const submitButton = getByText(
                'ShipOwner.AddTransactionHistory.labelSubmit',
            );

            act(() => {
                fireEvent.changeText(numericInput, '60000000');

                fireEvent.press(rentalStartDate);
                fireEvent.changeText(datePicker, '20 February 2024');

                fireEvent.press(rentalEndDate);
                fireEvent.changeText(datePickerEnd, '25 February 2024');

                fireEvent.changeText(locationDestination, 'Jakarta');

                fireEvent.changeText(locationDeparture, 'Surabaya');

                fireEvent.press(btnModalAdditional);
            });

            const docName = getByPlaceholderText('Document Name');
            const additionalDoc = getByTestId('additional-doc-pressable');
            act(() => {
                fireEvent.changeText(docName, 'Document 1');
            });
            await waitFor(() => {
                fireEvent.press(additionalDoc);
                setMockDocumentPickerResolve(true);
            });

            fireEvent.press(getByTestId('btn-submit-additional'));
            // fireEvent.press(getByTestId('additional-doc-0'));
            // const pdf = getByTestId('modalPdf');

            // pdf.props.visible = false;
            // console.log(pdf.props);

            fireEvent.press(submitButton);

            mockAdapter.onPost('/ship-owner/add-ship-history').reply(200, {
                message: 'success',
                data: {
                    shipId: '65a8bda44b191011546c21b1',
                    price: 60000000,
                    rentStartDate: '2024-02-20T00:00:00.000Z',
                    rentEndDate: '2024-02-25T00:00:00.000Z',
                    locationDeparture: 'Surabaya',
                    locationDestination: 'Jakarta',
                },
            });
            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'ShipOwner.AddTransactionHistory.successAddHistory',
                    visible: true,
                });
            });
        });

        it('should show modal pdf when click additional document', async () => {
            const addTransactionHistory = render(
                addTransactionHistoryComponent,
            );

            const {
                getByTestId,
                getByText,
                getByPlaceholderText,
                getByDisplayValue,
            } = addTransactionHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDestination',
            );

            const locationDeparture = getByPlaceholderText(
                'ShipOwner.AddTransactionHistory.placeholderLocationDeparture',
            );

            const btnModalAdditional = getByTestId('add-input-additional-doc');

            act(() => {
                fireEvent.changeText(numericInput, '60000000');

                fireEvent.press(rentalStartDate);
                fireEvent.changeText(datePicker, '20 February 2024');

                fireEvent.press(rentalEndDate);
                fireEvent.changeText(datePickerEnd, '25 February 2024');

                fireEvent.changeText(locationDestination, 'Jakarta');

                fireEvent.changeText(locationDeparture, 'Surabaya');

                fireEvent.press(btnModalAdditional);
            });

            const docName = getByPlaceholderText('Document Name');
            const additionalDoc = getByTestId('additional-doc-pressable');
            act(() => {
                fireEvent.changeText(docName, 'Document 1');
            });
            await waitFor(() => {
                fireEvent.press(additionalDoc);
                setMockDocumentPickerResolve(true);
            });

            const pdf = getByTestId('modalPdf');
            fireEvent.press(getByTestId('btn-submit-additional'));

            const additionalDoc1 = getByTestId('additional-doc-0');
            fireEvent.press(additionalDoc1);

            expect(pdf).toBeTruthy();
        });
    });
});
