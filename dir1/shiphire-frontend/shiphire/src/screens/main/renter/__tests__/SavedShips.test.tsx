import React from 'react';
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { SavedShips } from '../savedShips';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const mockSavedShipsComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="SavedShips"
                        component={SavedShips}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Saved Ships Screen', () => {
    describe('Snapshots', () => {
        it('should render Saved Ships screen correctly', () => {
            const savedShipsScreen = render(mockSavedShipsComponent()).toJSON();
            expect(savedShipsScreen).toMatchSnapshot();
        });
    });
    describe('render screen correctly', () => {
        const { getByTestId } = render(mockSavedShipsComponent());

        expect(getByTestId('SavedShipsScreen')).toBeTruthy();
    });
});
