import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "react-query";
import { MainStackParamList } from "../../../../types";
import MockAdapter from "axios-mock-adapter";
import httpRequest from "../../../../services/api";
import { Provider } from "react-redux";
import store from "../../../../store";
import { NavigationContainer } from "@react-navigation/native";
import { VerifyEmail } from "../verifyEmail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN, USERDATA } from "../../../../configs";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { act } from "react-test-renderer";

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const verifStackNavMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen name="VerifEmail" component={VerifyEmail} />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Muhamad Fauzan',
        email: 'usman@email.com',
        password: 'test',
        isVerified: false,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

describe('Verif email screen', () => {
    it('should renders correctly',async () => {
        const tree = render(verifStackNavMockComponent()).toJSON();
        await act(async() => {
            expect(tree).toMatchSnapshot();
        })
    });
});

describe('Verif email component', () => {
    it('should render the screen',async () => {
        const {getByTestId} = render(verifStackNavMockComponent());

        await act(async() => {
            expect(getByTestId('VerifyEmailScreen')).toBeDefined();
        })
    })
    it('should pressCode on the screen', async () => {
        const {getByTestId} = render(verifStackNavMockComponent());

        const pressCode = getByTestId('pressCode')

        await act(async() => {
            fireEvent.press(pressCode)
        })

        const code = getByTestId('codeInput')

        expect(code).toBeDefined();
        await act(async () => {
            fireEvent.changeText(code, '1234')
        }) 
    })
    it('should show hide the modal after render API', async () => {
        jest.useFakeTimers();
        const {getByTestId} = render(verifStackNavMockComponent());

        const pressCode = getByTestId('pressCode')

        await act(async() => {
            fireEvent.press(pressCode)
        })

        const code = getByTestId('codeInput')

        expect(code).toBeDefined();
        await act(async () => {
            fireEvent.changeText(code, '1234')
        }) 

        await waitFor(async () => {
            const modalState = store.getState().modal;
            jest.advanceTimersByTime(4000);
            expect(modalState).toEqual({
                visible: false,
                status: undefined,
                text: ''
            });
        });
    })
    it('should verify the code', async () => {
        jest.useFakeTimers();
        const {getByTestId} = render(verifStackNavMockComponent());

        const pressCode = getByTestId('pressCode')

        await act(async () => {
            fireEvent.press(pressCode)
        })

        const code = getByTestId('codeInput')

        expect(code).toBeDefined();
        await act(async () => {
            fireEvent.changeText(code, '1234')
        }) 

        fireEvent.press(getByTestId('buttonVerify'))

        mockAdapter
            .onPost('/renter/verify-email-otp')
            .reply(200, { status: 'success' })

            await waitFor(async () => {
                const modalState = store.getState().modal;
                jest.advanceTimersByTime(4000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'successVerifyEmail'
                });
            });
    })
    it('should failed verify the code', async () => {
        jest.useFakeTimers();
        const {getByTestId} = render(verifStackNavMockComponent());

        await act(async () => {
            fireEvent.press(getByTestId('buttonVerify'))
        })

        mockAdapter
            .onPost('/renter/verify-email-otp')
            .reply(500, { status: 'failed' })
    })
    it('should resend code', async () => {
        jest.useFakeTimers();
        const {getByTestId} = render(verifStackNavMockComponent());

        await act(async() => {
            fireEvent.press(getByTestId('btnCount'))
        })

        mockAdapter
            .onGet('/renter/send-otp-email-verif')
            .reply(200, {status: 'success'})
    })
})