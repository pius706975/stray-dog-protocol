import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { EditImageForm } from '../editShip';
import {
    setMockImagePickerPathResolve,
    setMockImagePickerResolve,
} from '../../../../jest/setup';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    shipId: '65a8bda44b191011546c21b1',
    shipName: 'Barge Hauler',
};

const editImageFormComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="EditImageForm"
                        component={EditImageForm}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Edit Image Form Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Edit Image Form correctly', () => {
            const editImageForm = render(editImageFormComponent);
            expect(editImageForm).toMatchSnapshot();
        });
    });

    describe('Unit Testing', () => {
        it('should handle success edit image ship', async () => {
            const { getByTestId } = render(editImageFormComponent);

            const selectImageButton = getByTestId('selectImageButton');
            const submitButton = getByTestId('submitButton');

            fireEvent.press(selectImageButton);
            setMockImagePickerPathResolve(true);

            fireEvent.press(submitButton);

            mockAdapter
                .onPost(`/ship-owner/edit-ship-image/${mockParams.shipId}`)
                .reply(200, {
                    message: 'Success',
                });

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'ShipOwner.EditImageForm.successShipImageEdited',
                    visible: true,
                });

                jest.advanceTimersByTime(2000);
            });
        });

        it('should handle error edit image ship', async () => {
            const { getByTestId } = render(editImageFormComponent);

            const selectImageButton = getByTestId('selectImageButton');
            const submitButton = getByTestId('submitButton');

            fireEvent.press(selectImageButton);
            setMockImagePickerPathResolve(true);

            fireEvent.press(submitButton);

            mockAdapter
                .onPost(`/ship-owner/edit-ship-image/${mockParams.shipId}`)
                .reply(500, {
                    message: 'Failed',
                });

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'ShipOwner.EditImageForm.failedEditShipImage',
                    visible: true,
                });

                jest.advanceTimersByTime(2000);
            });
        });
    });
});
