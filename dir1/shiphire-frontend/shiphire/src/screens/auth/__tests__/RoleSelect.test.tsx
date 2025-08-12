import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { ROLES, TOKEN, USERDATA } from "../../../configs";
import httpRequest from "../../../services/api";
import store from "../../../store";
import { RootParamList } from "../../../types";
import RoleSelect from "../roleselect/RoleSelect";
import CustomCheckbox from "../roleselect/component/CustomCheckbox";

const queryClient = new QueryClient();
const RootStack = createNativeStackNavigator<RootParamList>()
const mockAdapter = new MockAdapter(httpRequest);

const rootStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <RootStack.Navigator>
                    <RootStack.Screen name="RoleSelect" component={RoleSelect} />
                </RootStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
)

const mockRoleSelectRespSuccess = {
    status: "success",
    data: {
        _id: "mockId",
        name: "mockName",
        email: "mockEmail",
        phoneNumber: "mockPhoneNumber",
        firebaseId: "mockFirebaseId",
        isVerified: false,
        roles: "renter",
    }
}

const mockRoleSelectRespfail = {
    status: 'fail',
    message: 'User not found'
}

beforeEach(() => {
    AsyncStorage.setItem(USERDATA, JSON.stringify({
        name: "Usmanul",
        email: "usman@email.com",
        password: "test",
        isVerified: false,
        isCompanySubmitted: false,
    }))
    AsyncStorage.setItem(TOKEN, JSON.stringify({
        accessToken: "test",
        refreshToken: "test"
    }))
    mockAdapter.reset();
});

describe("Testing Role Select screen", () => {
    describe("Snapshot Testing", () => {
        it('should render Role Select screen correctly', async () => {
            const roleSelectScreen = render(rootStackMockComponent).toJSON()

            expect(roleSelectScreen).toMatchSnapshot()
        })
        describe("Component on RoleSelect screen", () => {
            describe("CustomCheckBox component", () => {
                it('should render correctly', () => {
                    const customCheckBoxComponent = render(
                        <CustomCheckbox
                            checked
                            onPress={() => { }}
                            title=""
                            testId=""
                        />
                    ).toJSON()

                    expect(customCheckBoxComponent).toMatchSnapshot()
                })
            })
        })
    })

    describe("Unit test", () => {
        it("should render 2 Custom checkbox component with title Renter and Ship Owner at unchecked condition", async () => {
            render(rootStackMockComponent)

            const renterCheckBox = await screen.findByTestId("renterCB")
            const shipOwnerCheckBox = await screen.findByTestId("shipOwnerCB")

            expect(renterCheckBox.props.accessibilityState.checked).toBe(false)
            expect(shipOwnerCheckBox.props.accessibilityState.checked).toBe(false)
        })

        it("should checked renter checkbox and unchecked ship owner checkbox when renter checkbox pressed", async () => {
            render(rootStackMockComponent)

            const renterCheckBox = await screen.findByTestId("renterCB")
            const shipOwnerCheckBox = await screen.findByTestId("shipOwnerCB")

            expect(renterCheckBox.props.accessibilityState.checked).toBe(false)
            expect(shipOwnerCheckBox.props.accessibilityState.checked).toBe(false)

            fireEvent.press(renterCheckBox)
            expect(renterCheckBox.props.accessibilityState.checked).toBe(true)
            expect(shipOwnerCheckBox.props.accessibilityState.checked).toBe(false)
        })

        it("should checked ship owner checkbox and unchecked renter checkbox when ship owner checkbox pressed", async () => {
            render(rootStackMockComponent)

            const renterCheckBox = await screen.findByTestId("renterCB")
            const shipOwnerCheckBox = await screen.findByTestId("shipOwnerCB")

            expect(renterCheckBox.props.accessibilityState.checked).toBe(false)
            expect(shipOwnerCheckBox.props.accessibilityState.checked).toBe(false)

            fireEvent.press(shipOwnerCheckBox)
            expect(renterCheckBox.props.accessibilityState.checked).toBe(false)
            expect(shipOwnerCheckBox.props.accessibilityState.checked).toBe(true)
        })

        it("should show error modal when trying to submit role but not checked any checkbox", async () => {
            jest.useFakeTimers()
            render(rootStackMockComponent)

            const renterCheckBox = await screen.findByTestId("renterCB")
            const shipOwnerCheckBox = await screen.findByTestId("shipOwnerCB")
            const submitBtn = await screen.findByText("Confirm")

            expect(renterCheckBox.props.accessibilityState.checked).toBe(false)
            expect(shipOwnerCheckBox.props.accessibilityState.checked).toBe(false)

            fireEvent.press(submitBtn)

            await waitFor(() => {
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Please choose your role'
                })
            })

            await waitFor(() => {
                const modalState = store.getState().modal

                jest.advanceTimersByTime(4000)
                expect(modalState).toEqual({
                    visible: false,
                    status: undefined,
                    text: ''
                })
            })

            jest.useRealTimers()
        })

        it('should show success modal when trying to submit role and checked renter checkbox', async () => {
            mockAdapter.onPost('/user/submit-user-role').reply(200, mockRoleSelectRespSuccess)

            jest.useFakeTimers()

            render(rootStackMockComponent)

            const renterCheckBox = await screen.findByTestId("renterCB")
            const submitBtn = await screen.findByText("Confirm")

            fireEvent.press(renterCheckBox)
            fireEvent.press(submitBtn)

            await waitFor(() => {
                const modalState = store.getState().modal
                const isPreferencesSubmittedState = store.getState().userStatus.isPreferencesSubmitted
                const showProgressIndicatorState = store.getState().progressIndicator.visible

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: `Hello new ${mockRoleSelectRespSuccess.data.roles}`
                })

                expect(isPreferencesSubmittedState).toBe(false)
                expect(showProgressIndicatorState).toBe(true)
                expect(AsyncStorage.removeItem).toBeCalledWith(ROLES)
                expect(AsyncStorage.setItem).toBeCalledWith(ROLES, JSON.stringify({ roles: mockRoleSelectRespSuccess.data.roles }))
            })

            await waitFor(() => {
                const isRoleSubmittedState = store.getState().userStatus.isRoleSubmitted
                const showProgressIndicatorState = store.getState().progressIndicator.visible

                jest.advanceTimersByTime(2000)
                expect(isRoleSubmittedState).toBe(true)
                expect(showProgressIndicatorState).toBe(false)
            })

            jest.useRealTimers()
        })

        it('should handle axios error when some error happend while submitting role', async () => {
            mockAdapter.onPost('/user/submit-user-role').reply(404, mockRoleSelectRespfail)

            render(rootStackMockComponent)

            const renterCheckBox = await screen.findByTestId("renterCB")
            const submitBtn = await screen.findByText("Confirm")

            fireEvent.press(renterCheckBox)
            fireEvent.press(submitBtn)

            await waitFor(() => {
                const handleAxiosError = jest.spyOn(console, 'log')

                expect(handleAxiosError).toBeCalled()
            })
        })
    })
})