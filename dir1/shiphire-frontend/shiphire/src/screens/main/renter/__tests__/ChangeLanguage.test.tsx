import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { ChangeLanguage } from '../../../changeLanguage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN, USERLANGUAGE } from '../../../../configs';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
        i18n: { changeLanguage: jest.fn() },
    }),
}));

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainStackParamList>();

const stackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="ChangeLanguage"
                        component={ChangeLanguage}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
beforeEach(() => {
    AsyncStorage.setItem(USERLANGUAGE, JSON.stringify({ language: 'en' }));
    AsyncStorage.setItem(
        TOKEN,
        JSON.stringify({
            accessToken: 'test',
            refreshToken: 'test',
        }),
    );
});

describe('Testing ChangeLanguage Screen', () => {
    describe('Snapshots', () => {
        it('should render ChangeLanguage screen correctly', () => {
            const changeLanguageScreen = render(stackMockComponent).toJSON();
            expect(changeLanguageScreen).toMatchSnapshot();
        });
    });
});

describe('ChangeLanguage', () => {
    it('should call changeLanguage function with "id" when Bahasa Indonesia button is pressed', async () => {
        jest.useFakeTimers();
        const { getByTestId } = render(stackMockComponent);
        const bahasaButton = getByTestId('bahasaButton');
        fireEvent.press(bahasaButton);
        const progressState = store.getState().progressIndicator;
        expect(progressState).toEqual({ visible: true });
        await waitFor(() => {
            const modalState = store.getState().modal;
            expect(modalState).toEqual({
                visible: true,
                status: 'success',
                text: 'ChangeLanguage.successLanguageChanged',
            });
            jest.advanceTimersByTime(2000);
            const progressState = store.getState().progressIndicator;
            expect(progressState).toEqual({ visible: false });
        });
        jest.useRealTimers();
    });
    it('should call changeLanguage function with "en" when English button is pressed', async () => {
        jest.useFakeTimers();
        const { getByTestId } = render(stackMockComponent);
        const englishButton = getByTestId('englishButton');
        fireEvent.press(englishButton);

        const progressState = store.getState().progressIndicator;
        expect(progressState).toEqual({ visible: true });

        await waitFor(() => {
            const modalState = store.getState().modal;
            expect(modalState).toEqual({
                visible: true,
                status: 'success',
                text: 'ChangeLanguage.successLanguageChanged',
            });
            jest.advanceTimersByTime(2000);
            const progressState = store.getState().progressIndicator;
            expect(progressState).toEqual({ visible: false });
        });
        jest.useRealTimers();
    });
});
