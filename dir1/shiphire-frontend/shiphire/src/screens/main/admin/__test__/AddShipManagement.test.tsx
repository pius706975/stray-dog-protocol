import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { AddShipManagement } from '../addShipDynamicForm/addShipManagement';
import { fireEvent, render } from '@testing-library/react-native';
import { AddShipSpecificInfo } from '../addShipDynamicForm/addShipSpecificInfo';
import { AddShipInputManagement } from '../addShipDynamicForm/addShipInputManagement';

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="AddShipManagement"
                        component={AddShipManagement}
                    />
                    <MainAdminStack.Screen
                        name="AddShipSpecificInfo"
                        component={AddShipSpecificInfo}
                    />
                    <MainAdminStack.Screen
                        name="AddShipInputManagement"
                        component={AddShipInputManagement}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);
const mockMenu = {
    id: '1',
    title: 'Specific Information',
    templateType: 'spesificAddShip',
};

describe('Testing add ship management screen', () => {
    describe('Snapshot testing', () => {
        it('Should render add ship management screen correctly', () => {
            const addShipManageScreen = render(adminStackMockComponent);
            expect(addShipManageScreen).toMatchSnapshot();
        });
    });
    describe('Unit test', () => {
        it('should navigate to addshipspesific when templateType is spesificaddship', () => {
            const { getByTestId } = render(adminStackMockComponent);

            const pressable = getByTestId('test-spesificAddShip');

            fireEvent.press(pressable);
            expect(getByTestId('addShipSpecInfo')).toBeDefined();
        });
        it('should navigate to addshipinputmanagement when templateType is other than spesificaddship', () => {
            const { getByTestId } = render(adminStackMockComponent);

            const pressable = getByTestId('test-generalAddShip');

            fireEvent.press(pressable);
            expect(getByTestId('addshipinputmanagement')).toBeDefined();
        });
    });
});
