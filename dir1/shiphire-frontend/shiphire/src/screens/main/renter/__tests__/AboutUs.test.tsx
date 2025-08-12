import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import AboutUs from '../aboutUs/AboutUs';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from '../../../../store';
import { RenterAccount } from '../account';
import { act } from 'react-test-renderer';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const mainScreenStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="AboutUs" component={AboutUs} />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
describe('Testing AboutUs Screen', () => {
    describe('Snapshots', () => {
        it('should render AboutUs screen correctly', () => {
            const aboutUsScreen = render(
                mainScreenStackNavMockComponent(),
            ).toJSON();
            expect(aboutUsScreen).toMatchSnapshot();
        });
    });
    it('should navigate to About Us screen when aboutUs icon clicked', async () => {
        const { getByTestId } = render(mainScreenStackNavMockComponent());

        expect(getByTestId('AboutUs')).toBeTruthy();
    });
    it('should render text correctly', async () => {
        const { getByTestId, getByText } = render(
            mainScreenStackNavMockComponent(),
        );
        expect(getByTestId('AboutUs')).toBeTruthy();

        expect(getByText('AboutUs.textWelcome')).toBeDefined();
    });
});
