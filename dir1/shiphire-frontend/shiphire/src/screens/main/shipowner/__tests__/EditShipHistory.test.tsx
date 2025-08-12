import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { EditShipHistory } from '../manageTransactionHistory';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';
import { act } from 'react-test-renderer';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    shipHistory: {
        _id: '65a8bda54b191011546c35cf',
        shipId: '65a8bda44b191011546c21b1',
        price: 50000000,
        rentStartDate: '2023-12-09T05:56:51.918Z',
        rentEndDate: '2023-12-14T05:56:51.918Z',
        locationDestination: 'Samarinda',
        locationDeparture: 'Balikpapan',
        source: 'automatic',
        deleteStatus: 'undefined',
        genericDocument: {
            fileName: 'file1',
            fileUrl:
                'https://shiphire-bucket.s3.ap-southeast-1.amazonaws.com/shiphire/shipHistory/65a8bda54b191011546c35cf/file1',
        }[0],
        needs: '',
        renterCompanyName: '',
    },
};

const editShipHistoryComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="EditShipHistory"
                        component={EditShipHistory}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Edit Ship History Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Edit Ship History correctly', async () => {
            const editShipHistory = render(editShipHistoryComponent);
            expect(editShipHistory).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should render the form correctly', async () => {
            const editShipHistory = render(editShipHistoryComponent);
            const form = editShipHistory.getByTestId('edit-ship-history-form');
            expect(form).toBeTruthy();
        });
        it('should handle submit edit ship history form with error', async () => {
            const editShipHistory = render(editShipHistoryComponent);

            const { getByTestId, getByText, getByPlaceholderText } =
                editShipHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDestination',
            );
            const locationDeparture = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDeparture',
            );

            fireEvent.changeText(numericInput, '70000000');

            fireEvent.press(rentalStartDate);
            fireEvent.changeText(datePicker, '26 February 2024');

            fireEvent.press(rentalEndDate);
            fireEvent.changeText(datePickerEnd, '28 February 2024');

            fireEvent.changeText(locationDestination, 'Samarinda');
            fireEvent.changeText(locationDeparture, 'Makassar');

            const submitButton = getByText(
                'ShipOwner.EditTransactionHistory.textButtonSubmit',
            );

            fireEvent.press(submitButton);

            mockAdapter
                .onPost(`/ship/edit-ship-history/${mockParams.shipHistory._id}`)
                .reply(500, {
                    message: 'error',
                });

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'ShipOwner.EditTransactionHistory.statusFailed',
                    text: 'ShipOwner.EditTransactionHistory.failedEditHistory',
                    visible: true,
                });
            });
        });

        it('should handle submit edit ship history form without additional document', async () => {
            const editShipHistory = render(editShipHistoryComponent);

            const { getByTestId, getByText, getByPlaceholderText } =
                editShipHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDestination',
            );
            const locationDeparture = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDeparture',
            );

            fireEvent.changeText(numericInput, '70000000');

            fireEvent.press(rentalStartDate);
            fireEvent.changeText(datePicker, '26 February 2024');

            fireEvent.press(rentalEndDate);
            fireEvent.changeText(datePickerEnd, '28 February 2024');

            fireEvent.changeText(locationDestination, 'Samarinda');
            fireEvent.changeText(locationDeparture, 'Makassar');

            const submitButton = getByText(
                'ShipOwner.EditTransactionHistory.textButtonSubmit',
            );

            fireEvent.press(submitButton);

            mockAdapter
                .onPost(`/ship/edit-ship-history/${mockParams.shipHistory._id}`)
                .reply(200, {
                    message: 'success',
                });

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'ShipOwner.EditTransactionHistory.statusSuccess',
                    text: 'ShipOwner.EditTransactionHistory.successEditHistory',
                    visible: true,
                });
            });
        });
        it('should handle submit edit ship history form with additional document', async () => {
            const editTransactionHistory = render(editShipHistoryComponent);

            const { getByTestId, getByText, getByPlaceholderText } =
                editTransactionHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDestination',
            );

            const locationDeparture = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDeparture',
            );

            const btnModalAdditional = getByTestId('add-input-additional-doc');

            const submitButton = getByText(
                'ShipOwner.EditTransactionHistory.textButtonSubmit',
            );

            act(() => {
                fireEvent.changeText(numericInput, '70000000');

                fireEvent.press(rentalStartDate);
                fireEvent.changeText(datePicker, '26 February 2024');

                fireEvent.press(rentalEndDate);
                fireEvent.changeText(datePickerEnd, '28 February 2024');

                fireEvent.changeText(locationDestination, 'Samarinda');

                fireEvent.changeText(locationDeparture, 'Makassar');

                fireEvent.press(btnModalAdditional);
            });

            const docName = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textDocumentName',
            );
            const additionalDoc = getByTestId('additional-doc-pressable');
            act(() => {
                fireEvent.changeText(docName, 'Document 1');
            });
            await waitFor(() => {
                fireEvent.press(additionalDoc);
                setMockDocumentPickerResolve(true);
            });

            fireEvent.press(getByTestId('btn-submit-additional'));

            fireEvent.press(submitButton);

            mockAdapter
                .onPost(`/ship/edit-ship-history/${mockParams.shipHistory._id}`)
                .reply(200, {
                    message: 'success',
                });

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'ShipOwner.EditTransactionHistory.statusSuccess',
                    text: 'ShipOwner.EditTransactionHistory.successEditHistory',
                    visible: true,
                });

                jest.advanceTimersByTime(4000);
            });
        });

        it('should show modal pdf when clicl additional document', async () => {
            const editShipHistory = render(editShipHistoryComponent);

            const { getByTestId, getByPlaceholderText } = editShipHistory;

            const numericInput = getByTestId('numericInput');

            const rentalStartDate = getByPlaceholderText('Rental Start');
            const datePicker = getByTestId('datePicker');

            const rentalEndDate = getByPlaceholderText('Rental End');
            const datePickerEnd = getByTestId('datePickerEnd');

            const locationDestination = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDestination',
            );

            const locationDeparture = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textPlaceholderDeparture',
            );

            const btnModalAdditional = getByTestId('add-input-additional-doc');

            act(() => {
                fireEvent.changeText(numericInput, '70000000');

                fireEvent.press(rentalStartDate);
                fireEvent.changeText(datePicker, '26 February 2024');

                fireEvent.press(rentalEndDate);
                fireEvent.changeText(datePickerEnd, '28 February 2024');

                fireEvent.changeText(locationDestination, 'Samarinda');

                fireEvent.changeText(locationDeparture, 'Makassar');

                fireEvent.press(btnModalAdditional);
            });

            const docName = getByPlaceholderText(
                'ShipOwner.EditTransactionHistory.textDocumentName',
            );
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
