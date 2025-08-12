import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RootParamList } from '../../../../types';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { OwnerCompanyRegister } from '../ownerCompany';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import {
    setMockDocumentPickerResolve,
    setMockImagePickerResolve,
} from '../../../../jest/setup';
import { act } from 'react-test-renderer';
import { useSubmitOwnerCompanyRegister } from '../../../../hooks';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';

jest.mock('../../../../hooks');
jest.mock('react-native-image-crop-picker', () => ({
    openPicker: jest.fn(() =>
        Promise.resolve({
            cropRect: { height: 1080, width: 1513, x: 204, y: 0 },
            height: 1000,
            mime: 'image/jpeg',
            modificationDate: '1706166538000',
            path: 'file:///storage/emulated/0/Android/data/id.smiteknologi.shiphire/files/Pictures/553466d2-3a3e-441d-941b-5206a52646fc.jpg',
            size: 303593,
            width: 1400,
        }),
    ),
    types: {
        image: 'image/jpg',
    },
}));

const queryClient = new QueryClient();
const RootStack = createNativeStackNavigator<RootParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockSubmitForm = () => {
    mockAdapter.onPost('/admin/save-company').reply(200, {
        message: 'success',
    });
    (useSubmitOwnerCompanyRegister as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <RootStack.Navigator>
                    <RootStack.Screen
                        name="OwnerCompanyRegister"
                        component={OwnerCompanyRegister}
                    />
                </RootStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('company register screen', () => {
    describe('snapshot test', () => {
        it('should render company register screen correctly', () => {
            const companyRegister = render(ownerStackMockComponent);
            expect(companyRegister).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should show modal error when businessPdf null ', async () => {
            mockSubmitForm();
            const { getByTestId, getByPlaceholderText } = render(
                ownerStackMockComponent,
            );
            const imageBtn = getByTestId('btn-image');
            const companyName = getByPlaceholderText('placeholderCompanyName');
            const companyType = getByPlaceholderText('Ex: PT, CV, Persero,...');
            const companyAddress = getByPlaceholderText(
                'placeholderCompanyAddress',
            );
            const bankDropdown = getByTestId('bank-dd');
            const bankAccName = getByPlaceholderText(
                'placeholderBankAccountName',
            );
            const bankAccNo = getByPlaceholderText(
                'placeholderBankAccountNumber',
            );
            // const btnLisenceNo = getByTestId('btnLisence');
            const btnTax = getByTestId('btnTax');
            const btnSubmit = getByTestId('btn-submit');

            fireEvent.press(imageBtn);
            setMockImagePickerResolve(true);

            fireEvent.changeText(companyName, 'Karya samudra sejati');
            fireEvent.changeText(companyType, 'PT');

            fireEvent.changeText(companyAddress, 'Jalan Jakarta');
            fireEvent.press(bankDropdown);

            fireEvent.press(getByTestId('item-bni'));

            fireEvent.changeText(bankAccName, 'Alfiani');
            fireEvent.changeText(bankAccNo, '1233454676');
            // fireEvent.press(btnLisenceNo);

            fireEvent.press(btnTax);

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'failedBusinessLicenseNumber',
                    visible: true,
                });
            });
        });
        it('should show modal error when tax id null ', async () => {
            mockSubmitForm();
            const { getByTestId, getByPlaceholderText } = render(
                ownerStackMockComponent,
            );
            const imageBtn = getByTestId('btn-image');
            const companyName = getByPlaceholderText('placeholderCompanyName');
            const companyType = getByPlaceholderText('Ex: PT, CV, Persero,...');
            const companyAddress = getByPlaceholderText(
                'placeholderCompanyAddress',
            );
            const bankDropdown = getByTestId('bank-dd');
            const bankAccName = getByPlaceholderText(
                'placeholderBankAccountName',
            );
            const bankAccNo = getByPlaceholderText(
                'placeholderBankAccountNumber',
            );
            const btnLisenceNo = getByTestId('btnLisence');
            // const btnTax = getByTestId('btnTax');
            const btnSubmit = getByTestId('btn-submit');

            fireEvent.press(imageBtn);
            setMockImagePickerResolve(true);

            fireEvent.changeText(companyName, 'Karya samudra sejati');
            fireEvent.changeText(companyType, 'PT');

            fireEvent.changeText(companyAddress, 'Jalan Jakarta');
            fireEvent.press(bankDropdown);

            fireEvent.press(getByTestId('item-bni'));

            fireEvent.changeText(bankAccName, 'Alfiani');
            fireEvent.changeText(bankAccNo, '1233454676');
            fireEvent.press(btnLisenceNo);
            setMockDocumentPickerResolve(true);
            // fireEvent.press(btnTax);

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'failedTaxIDNumber',
                    visible: true,
                });
            });
        });
        it('should show modal error when image path undefined ', async () => {
            mockSubmitForm();
            const { getByTestId, getByPlaceholderText } = render(
                ownerStackMockComponent,
            );
            const imageBtn = getByTestId('btn-image');
            const companyName = getByPlaceholderText('placeholderCompanyName');
            const companyType = getByPlaceholderText('Ex: PT, CV, Persero,...');
            const companyAddress = getByPlaceholderText(
                'placeholderCompanyAddress',
            );
            const bankDropdown = getByTestId('bank-dd');
            const bankAccName = getByPlaceholderText(
                'placeholderBankAccountName',
            );
            const bankAccNo = getByPlaceholderText(
                'placeholderBankAccountNumber',
            );
            const btnLisenceNo = getByTestId('btnLisence');
            const btnTax = getByTestId('btnTax');
            const btnSubmit = getByTestId('btn-submit');

            fireEvent.changeText(companyName, 'Karya samudra sejati');
            fireEvent.changeText(companyType, 'PT');

            fireEvent.changeText(companyAddress, 'Jalan Jakarta');
            fireEvent.press(bankDropdown);

            fireEvent.press(getByTestId('item-bni'));

            fireEvent.changeText(bankAccName, 'Alfiani');
            fireEvent.changeText(bankAccNo, '1233454676');
            fireEvent.press(btnLisenceNo);
            setMockDocumentPickerResolve(true);
            fireEvent.press(btnTax);
            setMockDocumentPickerResolve(true);

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'failedCompanyImage',
                    visible: true,
                });
            });
        });
        it('should submit form company register', async () => {
            mockSubmitForm();
            const { getByTestId, getByPlaceholderText } = render(
                ownerStackMockComponent,
            );
            const imageBtn = getByTestId('btn-image');
            const companyName = getByPlaceholderText('placeholderCompanyName');
            const companyType = getByPlaceholderText('Ex: PT, CV, Persero,...');
            const companyAddress = getByPlaceholderText(
                'placeholderCompanyAddress',
            );
            const bankDropdown = getByTestId('bank-dd');
            const bankAccName = getByPlaceholderText(
                'placeholderBankAccountName',
            );
            const bankAccNo = getByPlaceholderText(
                'placeholderBankAccountNumber',
            );
            const btnLisenceNo = getByTestId('btnLisence');
            const btnTax = getByTestId('btnTax');
            const btnSubmit = getByTestId('btn-submit');

            fireEvent.press(imageBtn);
            setMockImagePickerResolve(true);

            fireEvent.changeText(companyName, 'Karya samudra sejati');
            fireEvent.changeText(companyType, 'PT');

            fireEvent.changeText(companyAddress, 'Jalan Jakarta');
            fireEvent.press(bankDropdown);

            fireEvent.press(getByTestId('item-bni'));

            fireEvent.changeText(bankAccName, 'Alfiani');
            fireEvent.changeText(bankAccNo, '1233454676');
            fireEvent.press(btnLisenceNo);
            setMockDocumentPickerResolve(true);
            fireEvent.press(btnTax);
            setMockDocumentPickerResolve(true);
            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'textSuccess',
                    visible: true,
                });
            });
        });
    });
});
