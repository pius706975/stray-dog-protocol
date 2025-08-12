import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import PDFView from 'react-native-view-pdf';
import { RenterDocumentPreview } from '../documentPreview';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { EditProfile } from '../editProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USERDATA } from '../../../../configs';
import { act } from 'react-test-renderer';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockScreen = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="EditProfile"
                        component={EditProfile}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Muhamad Fauzan',
        email: 'usman@email.com',
        googleId: 'renter@email.com',
        phoneNumber: '0808080',
        password: 'test',
        isVerified: false,
    }),
);

describe('Testing edit profile screen', () => {
    describe('Snapshot Testing', () => {
        it('should render edit profile screen correctly', () => {
            const editProfileScreen = render(mockScreen).toJSON();
            expect(editProfileScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should show an alert when success add phone number', async () => {
            const { getByTestId } = render(mockScreen);

            mockAdapter
                .onPost('/user/add-phone-number')
                .reply(200, { status: 'success' });

            const buttonSave = getByTestId('buttonSave');

            await act(async () => {
                fireEvent.press(buttonSave);
            });

            waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'EditProfile.successText',
                });
            });
        });
        it('should show an alert when failed add phone number', async () => {
            jest.useFakeTimers();
            const { getByTestId } = render(mockScreen);

            mockAdapter
                .onPost('/user/add-phone-number')
                .reply(500, { status: 'failed' });

            const buttonSave = getByTestId('buttonSave');

            await act(async () => {
                fireEvent.press(buttonSave);
            });
        });
    });
});
