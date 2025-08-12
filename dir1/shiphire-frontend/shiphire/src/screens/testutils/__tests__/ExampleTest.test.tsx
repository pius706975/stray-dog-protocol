import { fireEvent, render, screen, waitFor } from "@testing-library/react-native"
import ExampleTest from "../ExampleTest"

describe("Example test", () => {
    it.only("Should submit form when input validation valid", async () => {

        render(<ExampleTest />)

        const inputEmail = await screen.findByPlaceholderText('Enter your email')
        const inputPassword = await screen.findByPlaceholderText('Enter your password')
        const buttonSubmit = await screen.findByText("Sign In")

        fireEvent.changeText(inputEmail, 'gabriel@email.com')
        fireEvent.changeText(inputPassword, '123')
        fireEvent.press(buttonSubmit)

        await waitFor(() => {
            // console.log("handleSubmit", handleSubmit.mock.results[0].value)
            // expect(handleSubmit.mock.results[0].value).toMatchObject({ email: "gabriel@email.com", password: "123" });
            const mockConsoleLog = jest.spyOn(console, 'log');
            expect(mockConsoleLog).toHaveBeenCalledWith('submitted');

            mockConsoleLog.mockRestore();
        })

    })
})