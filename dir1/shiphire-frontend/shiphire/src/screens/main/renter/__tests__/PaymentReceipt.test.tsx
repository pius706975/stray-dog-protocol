import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TOKEN, USERDATA } from '../../../../configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { act } from 'react-test-renderer';
import { PaymetReceiptPreview } from '../paymentReceipt';
import { Image } from 'react-native';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<MainScreenParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

const mockParams = {
    paymentReceiptUrl: 'https://example.com/contract.pdf',
};

const mockPaymentComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="PaymentReceipt"
                        component={PaymetReceiptPreview}
                        initialParams={mockParams}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Usmanul',
        email: 'usman@email.com',
        password: 'test',
        phoneNumber: '12313123',
        isVerified: false,
        isCompanySubmitted: true,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

describe('Payment Receipt Preview', () => {
    it('should render the screen correctly', async () => {
        const paymentReceiptPreview = render(mockPaymentComponent()).toJSON();
        expect(paymentReceiptPreview).toMatchSnapshot();
    });
});
describe('Receipt Preview', () => {
    it('should render the receipt', async () => {
        render(mockPaymentComponent());
        const imageView = render(
            <Image source={{ uri: 'https://example.com/contract.pdf' }} />,
        );
        await act(() => {
            expect(imageView).toBeTruthy();
        });
    });
    it('should render the receipt and show the indicator', async () => {
        const { getByTestId } = render(mockPaymentComponent());

        const imageView = getByTestId('imageComponent');

        imageView.props.onLoadStart();
        const progressState = store.getState().progressIndicator;
        expect(progressState).toEqual({
            visible: true,
        });
    });
});
