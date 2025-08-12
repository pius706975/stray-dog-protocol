import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainStackParamList } from '../../../../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { ShipByCategory } from '../shipByCategory';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockCategoryComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="ShipByCategory"
                        component={ShipByCategory}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing ShipByCategory Screen', () => {
    describe('Snapshots', () => {
        it('should render ShipByCategory screen correctly', () => {
            const shipByCategoryScreen = render(
                mockCategoryComponent(),
            ).toJSON();
            expect(shipByCategoryScreen).toMatchSnapshot();
        });
    });
    describe('render screen correctly', () => {
        const { getByTestId } = render(mockCategoryComponent());

        expect(getByTestId('ShipByCategoryScreen')).toBeTruthy();
    });
});
