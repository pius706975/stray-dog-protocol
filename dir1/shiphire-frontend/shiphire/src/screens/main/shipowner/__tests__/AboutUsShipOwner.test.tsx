import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import {
    MainOwnerStackParamList,
    MainScreenOwnerParamList,
} from '../../../../types';
import { AboutUs } from '../../renter';

const queryClient = new QueryClient();
const MainScreenStack = createNativeStackNavigator<MainScreenOwnerParamList>();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);

const aboutUsMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainScreenStack.Navigator>
                    <MainOwnerStack.Screen name="AboutUs" component={AboutUs} />
                </MainScreenStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing About Us Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render About Us Screen correctly', async () => {
            const aboutUsScreen = render(aboutUsMockComponent);
            expect(aboutUsScreen).toMatchSnapshot();
        });
    });
    describe('Rendering Testing', () => {
        it('should render text welcome correctly', async () => {
            const { getByText } = render(aboutUsMockComponent);
            const textWelcome = getByText('AboutUs.textWelcome');
            expect(textWelcome).toBeTruthy();
        });
        it('should render text title our mission correctly', async () => {
            const { getByText } = render(aboutUsMockComponent);
            const textTitleOurMission = getByText(
                'AboutUs.textTitleOurMission',
            );
            expect(textTitleOurMission).toBeTruthy();
        });
        it('should render text content our mission correctly', async () => {
            const { getByText } = render(aboutUsMockComponent);
            const textContentOurMission = getByText(
                'AboutUs.textContentOurMission',
            );
            expect(textContentOurMission).toBeTruthy();
        });
    });
});
