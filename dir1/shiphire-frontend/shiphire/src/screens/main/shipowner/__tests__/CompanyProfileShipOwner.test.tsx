import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import {
    MainOwnerStackParamList,
    MainScreenOwnerParamList,
} from '../../../../types';
import { ShipOwnerCompany } from '../shipownerCompany';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);

const companyProfileMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="ShipOwnerCompany"
                        component={ShipOwnerCompany}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockGetShipOwnerDataResponse = {
    status: 'success',
    data: {
        company: {
            name: 'Fauzan Company',
            companyType: 'PT',
            address: 'Jl. Raudah',
            bankName: 'BRI',
            bankAccountName: 'Fauzan Corp',
            bankAccountNumber: 123456789,
            documentCompany: [
                {
                    documentName: 'Fauzan Corp Business License',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
                    _id: '65a4d4184fa531643fc8cdb5',
                },
                {
                    documentName: 'Fauzan Corp Deed of Establishment',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
                    _id: '65a4d4184fa531643fc8cdb6',
                },
            ],
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
            isVerified: true,
        },
        _id: '65a4d4184fa531643fc8cdb2',
        userId: '65a4d4174fa531643fc8cd9a',
        name: 'Fauzan',
        ships: [
            {
                shipId: '65a4d4184fa531643fc8ceba',
                shipName: 'Barge Hauler',
                _id: '65a4d4184fa531643fc8cec2',
            },
            {
                shipId: '65a4d4184fa531643fc8ced3',
                shipName: 'Swift Tow',
                _id: '65a4d4184fa531643fc8cedf',
            },
            {
                shipId: '65a4d4184fa531643fc8cef2',
                shipName: 'Island Hopper',
                _id: '65a4d4184fa531643fc8cefe',
            },
            {
                shipId: '65a4d4184fa531643fc8cf11',
                shipName: 'Cargo Carrier',
                _id: '65a4d4184fa531643fc8cf1b',
            },
            {
                shipId: '65a4d4184fa531643fc8cf32',
                shipName: 'Mighty Tug',
                _id: '65a4d4184fa531643fc8cf3e',
            },
            {
                shipId: '65a4d4184fa531643fc8cf57',
                shipName: 'Coastal Cruiser',
                _id: '65a4d4184fa531643fc8cf63',
            },
            {
                shipId: '65a4d4184fa531643fc8cf80',
                shipName: 'Ferry Cruiser',
                _id: '65a4d4184fa531643fc8cf8e',
            },
            {
                shipId: '65a4d4184fa531643fc8cfad',
                shipName: 'MV Seaside Voyager',
                _id: '65a4d4184fa531643fc8cfbb',
            },
        ],
        __v: 0,
    },
};

describe('Testing Company Profile Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Company Profile Screen correctly', async () => {
            const companyProfileScreenOwner = render(
                companyProfileMockComponent,
            );
            expect(companyProfileScreenOwner).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should handle succes when get ship owner company', async () => {
            mockAdapter
                .onGet('/ship-owner/get-ship-owner-data')
                .reply(200, mockGetShipOwnerDataResponse);
            const { getByTestId } = render(companyProfileMockComponent);
            await waitFor(() => {
                expect(getByTestId('ShipOwnerCompanyScreen')).toBeTruthy();
            });
        });
        it('should handle error when get ship owner company error', async () => {
            mockAdapter
                .onGet('/ship-owner/get-ship-owner-data')
                .reply(401, { status: 'error' });
            const { getByTestId } = render(companyProfileMockComponent);
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
