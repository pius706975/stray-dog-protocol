import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CheckBox } from "@rneui/base";
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import React from "react";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { SignIn, SignUp } from "../";
import { Button, TextInput, TextInputError } from "../../../components";
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    CloseEyeIcon,
    Color,
    FontFamily,
    FontSize,
    OpenEyeIcon,
    PasswordIcon
} from "../../../configs";
import httpRequest from "../../../services/api";
import store from "../../../store";
import { AuthParamList } from "../../../types";

const queryClient = new QueryClient();
const AuthStack = createNativeStackNavigator<AuthParamList>()
const mockAdapter = new MockAdapter(httpRequest);

const signUpMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <AuthStack.Navigator>
                    <AuthStack.Screen name="SignUp" component={SignUp} />
                    <AuthStack.Screen name="SignIn" component={SignIn} />
                </AuthStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
)

const mockSignUpResponseSuccess = {
    status: 'success'
}

const mockSignUpResponseFail409 = {
    status: 'fail',
    message: 'Email already exist'
}

const mockSignUpResponseFail400 = {
    status: 'fail',
    message: 'Invalid email'
}

const mockSignUpResponseFail500 = {
    status: 'fail',
    message: 'Server error'
}

const mockInput = {
    name: "mock",
    email: "mock@email.com",
    invalidEmail: "mock-email",
    phoneNumber: "082155664499",
    password: "mockpassword123",
    confirmPassword: "mockpassword123",
    invalidPassword: "abc",
    mismatchPassword: "mockMismatchPassword"
}

beforeEach(() => {
    mockAdapter.reset();
});

describe("Testing Sign Up screen", () => {
    describe("Snapshot testing", () => {
        it('should render Sign Up screen correctly', () => {
            const signUpScreen = render(signUpMockComponent).toJSON()

            expect(signUpScreen).toMatchSnapshot()
        })
        describe("Component on SignUp screen", () => {
            describe("TextInput component", () => {
                it('should render correctly with password visible', () => {
                    const textInputComponent = render(
                        <TextInput
                            leftIcon={<PasswordIcon />}
                            rightIcon={<CloseEyeIcon />}
                            placeholder="Enter your password"
                            label="Password"
                            secureTextEntry={false}
                            onIconTouch={() => { }}
                            onBlur={() => { }}
                            onChange={() => { }}
                            error={""}
                            value={""}
                        />
                    ).toJSON()

                    expect(textInputComponent).toMatchSnapshot()
                })
                it('should render correctly with password hidden', () => {
                    const textInputComponent = render(
                        <TextInput
                            leftIcon={<PasswordIcon />}
                            rightIcon={<OpenEyeIcon />}
                            placeholder="Enter your password"
                            label="Password"
                            secureTextEntry={true}
                            onIconTouch={() => { }}
                            onBlur={() => { }}
                            onChange={() => { }}
                            error={""}
                            value={""}
                        />
                    ).toJSON()

                    expect(textInputComponent).toMatchSnapshot()
                })
            })
            describe('TextInputError Component', () => {
                it('should render correctly', () => {
                    const textInputErrorComponent = render(
                        <TextInputError errorText="Password is required" />
                    ).toJSON();
                    expect(textInputErrorComponent).toMatchSnapshot();
                });
            });
            describe('CheckBox Component', () => {
                it('should render correctly', () => {
                    render(signUpMockComponent)
                    const checkBoxComponent = render(
                        <CheckBox
                            checked={false}
                            checkedIcon={<CheckboxCheckedIcon />}
                            uncheckedIcon={<CheckboxIcon />}
                            onPress={() => { }}
                            wrapperStyle={{ gap: 12 }}
                            containerStyle={{
                                justifyContent: "center",
                                alignItems: "flex-start",
                                backgroundColor: Color.bgColor,
                                marginTop: -8,
                            }}
                            title={
                                <Text
                                    style={{
                                        fontFamily: FontFamily.regular,
                                        fontSize: FontSize.xs,
                                        color: Color.darkTextColor
                                    }}
                                >I have read and agree to the
                                    <Text
                                        style={{
                                            color: Color.primaryColor,
                                            borderBottomWidth: 1,
                                            borderColor: Color.primaryColor
                                        }}
                                        onPress={() => { }}
                                    > Terms & Policies </Text>
                                    of ShipHire.
                                </Text>
                            }
                        />
                    ).toJSON()

                    expect(checkBoxComponent).toMatchSnapshot()
                })
            })
            describe('Button Component', () => {
                it('should render correctly', () => {
                    const buttonComponent = render(
                        <Button
                            title="Sign Up"
                            isSubmitting={false}
                            onSubmit={() => { }}
                        />
                    ).toJSON()

                    expect(buttonComponent).toMatchSnapshot()
                })
            })
        })
    })

    describe("Unit testing", () => {
        it('should render form sign up input on screen', () => {
            render(signUpMockComponent)

            const inputName = screen.findByPlaceholderText('Enter your name')
            const inputEmail = screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = screen.findByPlaceholderText('Confirm your password')
            const tocCheckBox = screen.findByTestId("signUpCheckBox")
            const buttonSignUp = screen.findByText('Sign Up')

            expect(inputName).toBeDefined()
            expect(inputEmail).toBeDefined()
            expect(inputPhoneNumber).toBeDefined()
            expect(inputPassword).toBeDefined()
            expect(inputConfirmPassword).toBeDefined()
            expect(tocCheckBox).toBeDefined()
            expect(buttonSignUp).toBeDefined()
        })

        it('should render value after type on form text input', async () => {
            render(signUpMockComponent)

            const inputName = await screen.findByPlaceholderText('Enter your name')
            const inputEmail = await screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = await screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')

            fireEvent.changeText(inputName, mockInput.name)
            fireEvent.changeText(inputEmail, mockInput.email)
            fireEvent.changeText(inputPhoneNumber, mockInput.phoneNumber)
            fireEvent.changeText(inputPassword, mockInput.password)
            fireEvent.changeText(inputConfirmPassword, mockInput.confirmPassword)

            await waitFor(() => {
                expect(inputName.props.value).toBe(mockInput.name)
                expect(inputEmail.props.value).toBe(mockInput.email)
                expect(inputPhoneNumber.props.value).toBe(mockInput.phoneNumber)
                expect(inputPassword.props.value).toBe(mockInput.password)
                expect(inputConfirmPassword.props.value).toBe(mockInput.confirmPassword)
            })
        })

        it('should show validation errors for invalid inputs', async () => {
            render(signUpMockComponent)

            const inputName = await screen.findByPlaceholderText('Enter your name')
            const inputEmail = await screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = await screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')
            const buttonSignUp = await screen.findByText('Sign Up')

            fireEvent.changeText(inputName, "")
            fireEvent.changeText(inputEmail, mockInput.invalidEmail)
            fireEvent.changeText(inputPhoneNumber, "")
            fireEvent.changeText(inputPassword, mockInput.invalidPassword)
            fireEvent.changeText(inputConfirmPassword, mockInput.mismatchPassword)
            fireEvent.press(buttonSignUp)

            await waitFor(() => {
                expect(screen.queryByText('Name is required.')).toBeTruthy();
                expect(screen.queryByText('Invalid email.')).toBeTruthy();
                expect(screen.queryByText('Phone Number is required.')).toBeTruthy();
                expect(screen.queryByText('Password must be at least 6 characters.')).toBeTruthy();
                expect(screen.queryByText('Passwords not match.')).toBeTruthy();
            });
        })

        it('should show error modal when submitting form but not checked the TOC checkbox', async () => {
            jest.useFakeTimers()
            render(signUpMockComponent)

            const inputName = await screen.findByPlaceholderText('Enter your name')
            const inputEmail = await screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = await screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')
            const buttonSignUp = await screen.findByText('Sign Up')

            fireEvent.changeText(inputName, mockInput.name)
            fireEvent.changeText(inputEmail, mockInput.email)
            fireEvent.changeText(inputPhoneNumber, mockInput.phoneNumber)
            fireEvent.changeText(inputPassword, mockInput.password)
            fireEvent.changeText(inputConfirmPassword, mockInput.confirmPassword)
            fireEvent.press(buttonSignUp)

            await waitFor(() => {
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Please read the terms & policies.'
                })
            })

            await waitFor(() => {
                jest.advanceTimersByTime(5000)
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: false,
                    status: undefined,
                    text: ''
                })
            })

            jest.useRealTimers()
        })

        it('should toggles password visibility when show icon touched', async () => {
            render(signUpMockComponent)

            const eyeIcon = await screen.findByTestId("pwSignUpIcon")

            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            expect(inputPassword.props.secureTextEntry).toBe(true);

            fireEvent.press(eyeIcon)
            expect(inputPassword.props.secureTextEntry).toBe(false);

            fireEvent.press(eyeIcon)
            expect(inputPassword.props.secureTextEntry).toBe(true);
        })

        it('should toggles confirm password visibility when show icon touched', async () => {
            render(signUpMockComponent)

            const eyeIcon = await screen.findByTestId("confPwSignUpIcon")

            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')
            expect(inputConfirmPassword.props.secureTextEntry).toBe(true);

            fireEvent.press(eyeIcon)
            expect(inputConfirmPassword.props.secureTextEntry).toBe(false);

            fireEvent.press(eyeIcon)
            expect(inputConfirmPassword.props.secureTextEntry).toBe(true);
        })

        it('should toggles Checkbox status when Checkbox touched', async () => {
            render(signUpMockComponent)

            const checkBox = await screen.findByTestId('signUpCheckBox');
            expect(checkBox.props.accessibilityState.checked).toBe(false)

            fireEvent.press(checkBox);
            expect(checkBox.props.accessibilityState.checked).toBe(true);

            fireEvent.press(checkBox);
            expect(checkBox.props.accessibilityState.checked).toBe(false);
        })

        it('should navigate to Sign In screen when Sign In link pressed', async () => {
            render(signUpMockComponent)

            const navigateToSignIn = await screen.findByText("Sign in")

            fireEvent.press(navigateToSignIn)

            const signInScreen = await screen.findByText("Don't have an account yet?")

            expect(signInScreen).toBeTruthy()
        })

        it('should navigate to Terms & Policies screen when Terms & Policies link pressed', async () => {
            render(signUpMockComponent)

            const navigateToSignIn = await screen.findByText("Terms & Policies")

            fireEvent.press(navigateToSignIn)

            const signInScreen = await screen.findByText("Don't have an account yet?")

            expect(signInScreen).toBeTruthy()
        })
    })

    describe("Integration testing", () => {
        it("should show success modal and navigate to sign up screen after submitting valid form", async () => {
            mockAdapter.onPost('/auth/signup').reply(200, mockSignUpResponseSuccess)
            jest.useFakeTimers()

            render(signUpMockComponent)

            const inputName = await screen.findByPlaceholderText('Enter your name')
            const inputEmail = await screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = await screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')
            const checkBox = await screen.findByTestId('signUpCheckBox');
            const buttonSignUp = await screen.findByText('Sign Up')

            fireEvent.changeText(inputName, mockInput.name)
            fireEvent.changeText(inputEmail, mockInput.email)
            fireEvent.changeText(inputPhoneNumber, mockInput.phoneNumber)
            fireEvent.changeText(inputPassword, mockInput.password)
            fireEvent.changeText(inputConfirmPassword, mockInput.confirmPassword)
            fireEvent.press(checkBox);
            fireEvent.press(buttonSignUp)

            await waitFor(() => {
                const modalState = store.getState().modal
                const signInScreen = screen.findByText("Don't have an account yet?")

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Sign up successful! Try to sign in.'
                })
                expect(signInScreen).toBeTruthy()
            })

            await waitFor(() => {
                jest.advanceTimersByTime(5000)
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: false,
                    status: undefined,
                    text: ''
                })
            })

            jest.useRealTimers()
        })

        it("should show error modal when email already exist after submitting sign up form", async () => {
            mockAdapter.onPost('/auth/signup').reply(409, mockSignUpResponseFail409)
            jest.useFakeTimers()

            render(signUpMockComponent)

            const inputName = await screen.findByPlaceholderText('Enter your name')
            const inputEmail = await screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = await screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')
            const checkBox = await screen.findByTestId('signUpCheckBox');
            const buttonSignUp = await screen.findByText('Sign Up')

            fireEvent.changeText(inputName, mockInput.name)
            fireEvent.changeText(inputEmail, mockInput.email)
            fireEvent.changeText(inputPhoneNumber, mockInput.phoneNumber)
            fireEvent.changeText(inputPassword, mockInput.password)
            fireEvent.changeText(inputConfirmPassword, mockInput.confirmPassword)
            fireEvent.press(checkBox);
            fireEvent.press(buttonSignUp)

            await waitFor(() => {
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Email already exist!'
                })
            })

            await waitFor(() => {
                jest.advanceTimersByTime(5000)
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: false,
                    status: undefined,
                    text: ''
                })
            })

            jest.useRealTimers()
        })

        it("should show error modal when invalid email after submitting sign up form", async () => {
            mockAdapter.onPost('/auth/signup').reply(400, mockSignUpResponseFail400)

            render(signUpMockComponent)

            const inputName = await screen.findByPlaceholderText('Enter your name')
            const inputEmail = await screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = await screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')
            const checkBox = await screen.findByTestId('signUpCheckBox');
            const buttonSignUp = await screen.findByText('Sign Up')

            fireEvent.changeText(inputName, mockInput.name)
            fireEvent.changeText(inputEmail, mockInput.email)
            fireEvent.changeText(inputPhoneNumber, mockInput.phoneNumber)
            fireEvent.changeText(inputPassword, mockInput.password)
            fireEvent.changeText(inputConfirmPassword, mockInput.confirmPassword)
            fireEvent.press(checkBox);
            fireEvent.press(buttonSignUp)

            await waitFor(() => {
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Invalid email!'
                })
            })
        })

        it("should show error modal when server error", async () => {
            mockAdapter.onPost('/auth/signup').reply(500, mockSignUpResponseFail500)

            render(signUpMockComponent)

            const inputName = await screen.findByPlaceholderText('Enter your name')
            const inputEmail = await screen.findByPlaceholderText('Enter your email')
            const inputPhoneNumber = await screen.findByPlaceholderText('Enter your phone number')
            const inputPassword = await screen.findByPlaceholderText('Enter your password')
            const inputConfirmPassword = await screen.findByPlaceholderText('Confirm your password')
            const checkBox = await screen.findByTestId('signUpCheckBox');
            const buttonSignUp = await screen.findByText('Sign Up')

            fireEvent.changeText(inputName, mockInput.name)
            fireEvent.changeText(inputEmail, mockInput.email)
            fireEvent.changeText(inputPhoneNumber, mockInput.phoneNumber)
            fireEvent.changeText(inputPassword, mockInput.password)
            fireEvent.changeText(inputConfirmPassword, mockInput.confirmPassword)
            fireEvent.press(checkBox);
            fireEvent.press(buttonSignUp)

            await waitFor(() => {
                const modalState = store.getState().modal

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Server error'
                })
            })
        })

    })
})