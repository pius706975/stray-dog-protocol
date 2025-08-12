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
import { render, waitFor } from '@testing-library/react-native';

jest.mock('react-native-view-pdf');

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockScreen = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="RenterDocumentPreview"
                        component={RenterDocumentPreview}
                        initialParams={{
                            documentUrl: 'mock document url',
                            isEditable: true,
                        }}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing document preview screen', () => {
    describe('Snapshot Testing', () => {
        it('should render document preview screen correctly', () => {
            const docPreviewScreen = render(mockScreen);
            expect(docPreviewScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should show an alert when fail show document', async () => {
            render(mockScreen);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'RenterDocPreview.failedLoad',
                });
            });
        });
    });
});
