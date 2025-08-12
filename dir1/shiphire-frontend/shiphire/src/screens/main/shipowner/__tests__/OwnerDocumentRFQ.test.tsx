import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { OwnerDocumentRFQ } from '../documentRFQ';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useUpdateTransactionAcceptRFQ } from '../../../../hooks';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    _id: '123',
    category: 'Barge',
    shipId: '234',
};
const mockAcceptRFQ = () => {
    mockAdapter.onPost('/admin/activation-dynamic-input').reply(200, {
        message: 'success',
    });
    (useUpdateTransactionAcceptRFQ as jest.Mock).mockImplementation(() => ({
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
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="OwnerDocumentRFQ"
                        component={OwnerDocumentRFQ}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('owner document RFQ ', () => {
    describe('Snapshot test', () => {
        it('should render owner document RFQ correctly', () => {
            const documentRFQScreen = render(ownerStackMockComponent);
            expect(documentRFQScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should update accept RFQ', async () => {
            mockAcceptRFQ();
            const { getByTestId } = render(ownerStackMockComponent);

            const acceptBtn = getByTestId('acceptRFQ-button');
            fireEvent.press(acceptBtn);
            await waitFor(() => {
                const progressInd = store.getState().progressIndicator;
                expect(progressInd).toEqual({
                    visible: false,
                });
            });
        });
    });
});
