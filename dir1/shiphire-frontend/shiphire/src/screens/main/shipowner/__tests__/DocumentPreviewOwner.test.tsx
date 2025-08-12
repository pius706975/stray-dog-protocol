import { QueryClient, QueryClientProvider } from 'react-query';
import { OwnerDocumentPreview } from '../documentPreview';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { render, waitFor } from '@testing-library/react-native';

jest.mock('react-native-view-pdf');

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: str => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
    initReactI18next: {
        type: '3rdParty',
        init: () => {},
    },
}));
const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mock = new MockAdapter(httpRequest);

const mockParams = {
    documentUrl: 'http://doc.com',
    shipId: '123',
    documentName: 'RFQ Document',
};

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="OwnerDocumentPreview"
                        component={OwnerDocumentPreview}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing document preview screen', () => {
    describe('Snapshot Testing', () => {
        it('should render document preview screen correctly', () => {
            const docPreviewScreen = render(ownerStackMockComponent);
            expect(docPreviewScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should show an alert when fail show document', async () => {
            render(ownerStackMockComponent);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'DocumentPreview.failedLoad',
                });
            });
        });
    });
});
