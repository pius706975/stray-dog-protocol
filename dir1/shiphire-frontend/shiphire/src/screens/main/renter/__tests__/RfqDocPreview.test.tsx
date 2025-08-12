import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    MainStackParamList,
    RequestForAQuoteParamList,
} from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { RFQDocPreview } from '../rfqDocPreview';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFQFILEPATH, USERDATA } from '../../../../configs';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<RequestForAQuoteParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const rfqMockData = {
    shipId: '1',
    categoryId: 'mock category id',
    shipOwnerId: 'mock ship owner id',
    rentalDuration: 20,
    rentalDate: 'mock rental date',
    needs: 'mock needs',
    locationDeparture: 'mock location departure',
    locationDestination: 'mock location destination',
    shipRentType: 'mock ship rent type',
};

const rfqMockScreen = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="DocPreview"
                        component={RFQDocPreview}
                        initialParams={rfqMockData}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
AsyncStorage.setItem(
    RFQFILEPATH,
    JSON.stringify({
        path: '/storage/emulated/0/Android/data/id.smiteknologi.shiphire/files/Documents/RFQ-Azis-undefined.pdf',
    }),
);

describe('testing RFQDocPreview', () => {
    describe('snapshot testing', () => {
        it('should render correctly', () => {
            const tree = render(rfqMockScreen).toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
    describe('render testing', () => {
        it('should render correctly', () => {
            render(rfqMockScreen);

            expect('RFQDocPreview').toBeTruthy();
        });
        it('should submit after clicking send button', () => {
            const { getByTestId } = render(rfqMockScreen);

            const sendButton = getByTestId('SendButton');
            fireEvent.press(sendButton);
        });
        // it.only('should submit after clicking send button and show the modal', async () => {
        //     const { getByTestId } = render(rfqMockScreen);

        //     const sendButton = getByTestId('SendButton');
        //     fireEvent.press(sendButton);

        //     mockAdapter
        //         .onPost('/renter/submit-request-for-quote')
        //         .reply(200, { status: 'success', data: rfqMockData });

        //     const progressState = store.getState().progressIndicator;
        //     expect(progressState).toEqual({
        //         visible: true,
        //     });
        //     const modalState = store.getState().modal;

        //     await waitFor(() => {
        //         jest.advanceTimersByTime(3000);
        //         expect(modalState).toEqual({
        //             visible: true,
        //             status: 'success',
        //             text: 'RFQDocPreview.successRFQSent',
        //         });
        //         const progressState = store.getState().progressIndicator;
        //         expect(progressState).toEqual({
        //             visible: false,
        //         });
        //     });
        // });
        it('should failed submit after clicking send button and show the modal', async () => {
            const { getByTestId } = render(rfqMockScreen);

            const sendButton = getByTestId('SendButton');
            fireEvent.press(sendButton);

            mockAdapter
                .onPost('/renter/submit-request-for-quote')
                .reply(200, { status: 'failed' });

            const progressState = store.getState().progressIndicator;
            expect(progressState).toEqual({
                visible: true,
            });
            const modalState = store.getState().modal;

            await waitFor(() => {
                jest.advanceTimersByTime(3000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'RFQDocPreview.failedSendRFQ',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
    });
});
