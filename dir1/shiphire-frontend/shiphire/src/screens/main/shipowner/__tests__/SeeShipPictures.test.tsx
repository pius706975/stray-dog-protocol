import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "react-query";
import { MainOwnerStackParamList, MainScreenOwnerParamList } from "../../../../types";
import MockAdapter from "axios-mock-adapter";
import httpRequest from "../../../../services/api";
import store from "../../../../store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SeeShipPictures } from "../seeShipPictures";
import { render } from "@testing-library/react-native";

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);

const shipPicturesComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="SeeShipPictures"
                        component={SeeShipPictures}
                        initialParams={{
                            transactionId: '',
                            sailingStatus: '',
                            beforeSailingPictures: [
                                {
                                    documentName: 'Ships',
                                    documentUrl: 'http://ship.com',
                                    description: 'this are the ship pictures',
                                }
                            ],
                            afterSailingPictures: [
                                {
                                    documentName: 'aftership',
                                    documentUrl: 'http://ship.com'
                                }
                            ]
                        }}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('See Ship Pictures', () => {
    describe('Snapshot', () => {
        it('should match snapshot', () => {
            const tree = render(shipPicturesComponent).toJSON();

            expect(tree).toMatchSnapshot();
        })
    })
})