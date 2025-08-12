import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import store from '../../../../store';
import { CompanyRegister } from '../renterCompany';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import renderer, { act } from 'react-test-renderer';
import {
    setMockDocumentPickerResolve,
    setMockImagePickerResolve,
} from '../../../../jest/setup';
import Home from '../home/Home';

jest.mock('react-native-image-crop-picker');

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
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockCompanyRegister = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="CompanyRegister"
                        component={CompanyRegister}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Testing Company Register', () => {
    describe('snapshot test', () => {
        it('should match snapshot', () => {
            const tree = render(mockCompanyRegister).toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
    describe('render test correctly', () => {
        it('should render all elements correctly and submit', async () => {
            const { getByTestId, getByPlaceholderText, getByText } =
                render(mockCompanyRegister);
            const companyRegister = getByTestId('CompanyRegisterScreen');

            expect(companyRegister).toBeTruthy();

            const imageField = getByTestId('imageField');

            act(() => {
                fireEvent.press(imageField);
            });

            await waitFor(() => {
                expect(imageField).toBeDefined();
            });
            //need image input
            const companyNameField = getByPlaceholderText(
                'placeholderCompanyName',
            );

            await act(async () => {
                fireEvent.changeText(companyNameField, 'mock company name');
            });

            await act(async () => {
                expect(companyNameField.props.value).toBe('mock company name');
            });

            const companyTypeField = getByPlaceholderText(
                'placeholderTypeofCompany',
            );

            await act(() => {
                fireEvent.changeText(companyTypeField, 'mock company type');
            });

            await act(async () => {
                expect(companyTypeField.props.value).toBe('mock company type');
            });

            const companyAddressField = getByPlaceholderText(
                'placeholderCompanyAddress',
            );

            await act(() => {
                fireEvent.changeText(
                    companyAddressField,
                    'mock company address',
                );
            });

            act(() => {
                expect(companyAddressField.props.value).toBe(
                    'mock company address',
                );
            });

            act(() => {
                fireEvent.press(getByTestId('businessLicenseNumber'));
            });

            await waitFor(() => {
                expect(getByTestId('businessLicenseNumber')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('taxID'));
            });

            setMockDocumentPickerResolve(true);

            await waitFor(() => {
                expect(getByTestId('taxID')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('submitButton'));
            });

            mockAdapter
                .onPost('/renter/submit-company-profile')
                .reply(200, { status: 'success' });

            await waitFor(() => {
                jest.advanceTimersByTime(3000);
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'successSubmitted',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should handle error when pdf selection rejected', async () => {
            setMockDocumentPickerResolve(false);
            const { getByTestId } = render(mockCompanyRegister);

            act(() => {
                fireEvent.press(getByTestId('businessLicenseNumber'));
            });

            await waitFor(() => {
                expect(getByTestId('businessLicenseNumber')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('submitButton'));
            });
            await waitFor(() => {
                jest.advanceTimersByTime(4000);
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: false,
                    status: undefined,
                    text: '',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should handle error when pdf selection rejected', async () => {
            setMockDocumentPickerResolve(false);
            const { getByTestId } = render(mockCompanyRegister);

            act(() => {
                fireEvent.press(getByTestId('taxID'));
            });

            await waitFor(() => {
                expect(getByTestId('taxID')).toBeDefined();
            });
            await waitFor(() => {
                jest.advanceTimersByTime(4000);
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: false,
                    status: undefined,
                    text: '',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should allow delete pdf document after selecting businessDocument', async () => {
            setMockDocumentPickerResolve(true);
            const { getByTestId } = render(mockCompanyRegister);

            act(() => {
                fireEvent.press(getByTestId('businessLicenseNumber'));
            });

            await waitFor(() => {
                expect(getByTestId('businessLicenseNumber')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('deleteBusinessButton'));
            });

            await waitFor(() => {
                expect(getByTestId('businessLicenseNumber')).toBeDefined();
            });
        });
        it('should allow delete pdf document after selecting taxId document', async () => {
            setMockDocumentPickerResolve(true);
            const { getByTestId } = render(mockCompanyRegister);

            act(() => {
                fireEvent.press(getByTestId('taxID'));
            });

            await waitFor(() => {
                expect(getByTestId('taxID')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('deleteTaxIDButton'));
            });

            await waitFor(() => {
                expect(getByTestId('taxID')).toBeDefined();
            });
        });
        it('should error open image', async () => {
            setMockImagePickerResolve(false);
            const { getByTestId } = render(mockCompanyRegister);

            const imageField = getByTestId('imageField');

            act(() => {
                fireEvent.press(imageField);
            });

            await waitFor(() => {
                expect(imageField).toBeDefined();
            });
        });
        it('should failed submit form', async () => {
            const { getByTestId, getByPlaceholderText, getByText } =
                render(mockCompanyRegister);
            const companyRegister = getByTestId('CompanyRegisterScreen');

            expect(companyRegister).toBeTruthy();

            const imageField = getByTestId('imageField');

            act(() => {
                fireEvent.press(imageField);
            });

            await waitFor(() => {
                expect(imageField).toBeDefined();
            });
            //need image input
            const companyNameField = getByPlaceholderText(
                'placeholderCompanyName',
            );

            await act(async () => {
                fireEvent.changeText(companyNameField, 'mock company name');
            });

            await act(async () => {
                expect(companyNameField.props.value).toBe('mock company name');
            });

            const companyTypeField = getByPlaceholderText(
                'placeholderTypeofCompany',
            );

            await act(() => {
                fireEvent.changeText(companyTypeField, 'mock company type');
            });

            await act(async () => {
                expect(companyTypeField.props.value).toBe('mock company type');
            });

            const companyAddressField = getByPlaceholderText(
                'placeholderCompanyAddress',
            );

            await act(() => {
                fireEvent.changeText(
                    companyAddressField,
                    'mock company address',
                );
            });

            act(() => {
                expect(companyAddressField.props.value).toBe(
                    'mock company address',
                );
            });

            act(() => {
                fireEvent.press(getByTestId('businessLicenseNumber'));
            });

            await waitFor(() => {
                expect(getByTestId('businessLicenseNumber')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('taxID'));
            });

            setMockDocumentPickerResolve(false);

            await waitFor(() => {
                expect(getByTestId('taxID')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('submitButton'));
            });

            mockAdapter
                .onPost('/renter/submit-company-profile')
                .reply(500, { status: 'failed' });
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should failed submit form and handle error business', async () => {
            jest.useFakeTimers();
            const { getByTestId, getByPlaceholderText, getByText } =
                render(mockCompanyRegister);
            const companyRegister = getByTestId('CompanyRegisterScreen');

            expect(companyRegister).toBeTruthy();

            const imageField = getByTestId('imageField');

            act(() => {
                fireEvent.press(imageField);
            });

            await waitFor(() => {
                expect(imageField).toBeDefined();
            });

            const companyNameField = getByPlaceholderText(
                'placeholderCompanyName',
            );

            await act(async () => {
                fireEvent.changeText(companyNameField, 'mock company name');
            });

            await act(async () => {
                expect(companyNameField.props.value).toBe('mock company name');
            });

            const companyTypeField = getByPlaceholderText(
                'placeholderTypeofCompany',
            );

            await act(() => {
                fireEvent.changeText(companyTypeField, 'mock company type');
            });

            await act(async () => {
                expect(companyTypeField.props.value).toBe('mock company type');
            });

            const companyAddressField = getByPlaceholderText(
                'placeholderCompanyAddress',
            );

            await act(() => {
                fireEvent.changeText(
                    companyAddressField,
                    'mock company address',
                );
            });

            await act(async () => {
                expect(companyAddressField.props.value).toBe(
                    'mock company address',
                );
            });

            act(() => {
                fireEvent.press(getByTestId('taxID'));
            });

            await waitFor(() => {
                expect(getByTestId('taxID')).toBeDefined();
            });

            setMockDocumentPickerResolve(true);

            act(() => {
                fireEvent.press(getByTestId('submitButton'));
            });

            mockAdapter
                .onPost('/renter/submit-company-profile')
                .reply(400, { status: 'fail', error: 'No files found' });

            await waitFor(() => {
                const modalState = store.getState().modal;
                jest.advanceTimersByTime(4000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedBusinessLicenseNumber',
                });
            });
        });
        it('should failed submit form and handle error tax', async () => {
            jest.useFakeTimers();
            const { getByTestId, getByPlaceholderText, getByText } =
                render(mockCompanyRegister);
            const companyRegister = getByTestId('CompanyRegisterScreen');

            expect(companyRegister).toBeTruthy();

            const imageField = getByTestId('imageField');

            act(() => {
                fireEvent.press(imageField);
            });

            await waitFor(() => {
                expect(imageField).toBeDefined();
            });

            const companyNameField = getByPlaceholderText(
                'placeholderCompanyName',
            );

            await act(async () => {
                fireEvent.changeText(companyNameField, 'mock company name');
            });

            await act(async () => {
                expect(companyNameField.props.value).toBe('mock company name');
            });

            const companyTypeField = getByPlaceholderText(
                'placeholderTypeofCompany',
            );

            await act(() => {
                fireEvent.changeText(companyTypeField, 'mock company type');
            });

            await act(async () => {
                expect(companyTypeField.props.value).toBe('mock company type');
            });

            const companyAddressField = getByPlaceholderText(
                'placeholderCompanyAddress',
            );

            await act(() => {
                fireEvent.changeText(
                    companyAddressField,
                    'mock company address',
                );
            });

            await act(async () => {
                expect(companyAddressField.props.value).toBe(
                    'mock company address',
                );
            });

            act(() => {
                fireEvent.press(getByTestId('businessLicenseNumber'));
            });

            await waitFor(() => {
                expect(getByTestId('businessLicenseNumber')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('submitButton'));
            });

            mockAdapter
                .onPost('/renter/submit-company-profile')
                .reply(400, { status: 'fail', error: 'No files found' });

            await waitFor(() => {
                const modalState = store.getState().modal;
                jest.advanceTimersByTime(4000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedTaxIDNumber',
                });
            });
        });
        it('should failed submit form and handle error image', async () => {
            jest.useFakeTimers();

            const { getByTestId, getByPlaceholderText } =
                render(mockCompanyRegister);
            const companyRegister = getByTestId('CompanyRegisterScreen');

            expect(companyRegister).toBeTruthy();

            const companyNameField = getByPlaceholderText(
                'placeholderCompanyName',
            );

            await act(async () => {
                fireEvent.changeText(companyNameField, 'mock company name');
            });

            await act(async () => {
                expect(companyNameField.props.value).toBe('mock company name');
            });

            const companyTypeField = getByPlaceholderText(
                'placeholderTypeofCompany',
            );

            await act(() => {
                fireEvent.changeText(companyTypeField, 'mock company type');
            });

            await act(async () => {
                expect(companyTypeField.props.value).toBe('mock company type');
            });

            const companyAddressField = getByPlaceholderText(
                'placeholderCompanyAddress',
            );

            await act(() => {
                fireEvent.changeText(
                    companyAddressField,
                    'mock company address',
                );
            });

            await act(async () => {
                expect(companyAddressField.props.value).toBe(
                    'mock company address',
                );
            });

            act(() => {
                fireEvent.press(getByTestId('businessLicenseNumber'));
            });

            await waitFor(() => {
                expect(getByTestId('businessLicenseNumber')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('taxID'));
            });

            await waitFor(() => {
                expect(getByTestId('taxID')).toBeDefined();
            });

            act(() => {
                fireEvent.press(getByTestId('submitButton'));
            });

            mockAdapter
                .onPost('/renter/submit-company-profile')
                .reply(400, { status: 'fail', error: 'No files found' });

            await waitFor(() => {
                const modalState = store.getState().modal;
                jest.advanceTimersByTime(4000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedCompanyImage',
                });
            });
        });
    });
});
