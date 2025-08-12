import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { Company } from '../renterCompany';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockCompanyProfile = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="Company" component={Company} />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockRenterData = {
    _id: '60f9b0c9e6b6f4001b9b9b9b',
    userId: {
        _id: '60f9b0c9e6b6f4001b9b9b9b',
        name: 'mock renter',
        email: 'mockrenter@email.com',
        phoneNumber: '081234567890',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        imageUrl: 'https://picsum.photos/id/237/200/300',
    },
    renterPreference: [],
    name: 'mock renter',
    company: {
        name: 'mock company',
        companyType: 'mock company type',
        address: 'mock company address',
        documentCompany: [
            {
                documentUrl: 'mock document url',
                documentType: 'mock document type',
            },
            {
                documentUrl: 'mock document url',
                documentType: 'mock document type',
            },
        ],
        isVerified: true,
        isRejected: false,
        imageUrl: 'https://picsum.photos/id/237/200/300',
    },
    shipReminded: [],
};

mockAdapter
    .onGet('/renter/get-renter-data')
    .reply(200, { status: 'success', data: mockRenterData });

describe('Testing Company Profile', () => {
    describe('snapshot testing', () => {
        it('should match snapshot', async () => {
            const wrapper = render(mockCompanyProfile).toJSON();
            await act(async () => {
                expect(wrapper).toMatchSnapshot();
            });
        });
    });
    describe('render testing', () => {
        it('should render company profile', async () => {
            const { findByText, getByTestId } = render(mockCompanyProfile);
            await act(async () => {
                expect(await findByText('mock company')).toBeTruthy();
                expect(await findByText('mock company type')).toBeTruthy();
                expect(await findByText('mock company address')).toBeTruthy();
                expect(
                    await findByText('CompanyProfile.labelDocumentBusiness'),
                ).toBeTruthy();
                expect(
                    await findByText('CompanyProfile.labelDocumentTaxID'),
                ).toBeTruthy();
            });

            fireEvent.press(
                getByTestId(
                    'DocumentMenu-CompanyProfile.labelDocumentBusiness',
                ),
            );

            expect(
                getByTestId(
                    'DocumentMenu-CompanyProfile.labelDocumentBusiness',
                ),
            ).toBeTruthy();
        });
        it('should handle error when get renter data', async () => {
            mockAdapter
                .onGet('/renter/get-renter-data')
                .reply(401, { status: 'failed' });

            render(mockCompanyProfile);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Token expired, please re-sign in',
                });

                jest.advanceTimersByTime(4000);
            });
        });
    });
});
