import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainOwnerStackParamList } from '../../../../types';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import {
    setMockImagePickerPathResolve,
    setMockImagePickerResolve,
} from '../../../../jest/setup';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { ShipPictures } from '../shipPictures';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useSubmitShipPicturesBeforeSailing } from '../../../../hooks';

jest.mock('../../../../hooks');
jest.mock('react-native-image-crop-picker', () => ({
    openPicker: jest.fn(() =>
        Promise.resolve([
            {
                creationDate: '1522437259',
                cropRect: null,
                data: null,
                duration: null,
                exif: null,
                filename: 'IMG_0006.HEIC',
                height: 3024,
                localIdentifier: 'CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001',
                mime: 'image/heic',
                modificationDate: '1530944178',
                path: '/Users/tabrezakhlaque/Library/Developer/CoreSimulator/Devices/3A21CC65-FCBF-4B7B-BE2C-87E18F17D6DC/data/Containers/Data/Application/C34290DF-2011-480C-9076-2B3CCFA8CD17/tmp/react-native-image-crop-picker/B02EB928-5871-4616-BA8F-05EF93037EB1.jpg',
                size: 2808983,
                sourceURL:
                    'file:///Users/tabrezakhlaque/Library/Developer/CoreSimulator/Devices/3A21CC65-FCBF-4B7B-BE2C-87E18F17D6DC/data/Media/DCIM/100APPLE/IMG_0006.HEIC',
                width: 4032,
            },
        ]),
    ),
    types: {
        image: 'image/jpg',
    },
}));

const queryClient = new QueryClient();
const MainOwner = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockSubmitImages = () => {
    mockAdapter
        .onPost('/ship-owner/submit-ship-pictures-before-sailing')
        .reply(200, {
            message: 'success',
        });
    (useSubmitShipPicturesBeforeSailing as jest.Mock).mockImplementation(
        () => ({
            mutate: jest.fn().mockImplementation((data, options) => {
                const { onSuccess } = options;
                const mockResponseData = {
                    message: 'success',
                };
                onSuccess(mockResponseData);
            }),
        }),
    );
};

const shipPicturesComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwner.Navigator>
                    <MainOwner.Screen
                        name="ShipPictures"
                        component={ShipPictures}
                        initialParams={{
                            transactionId: 'transactionId',
                            sailingStatus: 'beforeSailing',
                            beforeSailingPictures: {}[0],
                            afterSailingPictures: {}[0],
                        }}
                    />
                </MainOwner.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Ship Pictures Before Rent', () => {
    describe('Snapshot Testing', () => {
        it('should render Ship Pictures Before Rent', async () => {
            const shipPictures = render(shipPicturesComponent);
            expect(shipPictures).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should handle open image picker', async () => {
            const { getByTestId } = render(shipPicturesComponent);

            const selectImageButton = getByTestId('AddImageBtn');
            fireEvent.press(selectImageButton);
            setMockImagePickerResolve(true);
            await waitFor(() => {
                expect(ImageCropPicker.openPicker).toHaveBeenCalled();
            });
        });
        it('should handle success submit ship pictures before sailing', async () => {
            mockSubmitImages();
            const { getByTestId, getByPlaceholderText } = render(
                shipPicturesComponent,
            );
            const selectImageButton = getByTestId('AddImageBtn');
            fireEvent.press(selectImageButton);
            await waitFor(() => {
                setMockImagePickerPathResolve(true);
                const selectedImage = getByTestId('SelectedImage-0');
                expect(selectedImage).toBeTruthy();
            });
            const descriptionInput = getByPlaceholderText('Description 1');
            fireEvent.changeText(descriptionInput, 'Test Description');
            const submitButton = getByTestId('SubmitBtn');

            fireEvent.press(submitButton);
            const confirmButton = getByTestId('confirmButton');
            fireEvent.press(confirmButton);
            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'Ship pictures before sailing submitted successfully',
                    visible: true,
                });
                jest.advanceTimersByTime(2000);
            });
        });
        it('should handle error submit ship pictures before sailing', async () => {
            mockAdapter
                .onPost('/ship-owner/submit-ship-pictures-before-sailing')
                .reply(500, {
                    message: 'error',
                });
            (
                useSubmitShipPicturesBeforeSailing as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResponseData = {
                        message: 'error',
                    };
                    onError(mockResponseData);
                }),
            }));
            const { getByTestId, getByPlaceholderText } = render(
                shipPicturesComponent,
            );
            const selectImageButton = getByTestId('AddImageBtn');
            fireEvent.press(selectImageButton);
            await waitFor(() => {
                setMockImagePickerPathResolve(true);
                const selectedImage = getByTestId('SelectedImage-0');
                expect(selectedImage).toBeTruthy();
            });
            const descriptionInput = getByPlaceholderText('Description 1');
            fireEvent.changeText(descriptionInput, 'Test Description');
            const submitButton = getByTestId('SubmitBtn');

            fireEvent.press(submitButton);
            const confirmButton = getByTestId('confirmButton');
            fireEvent.press(confirmButton);
            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'Error submitting ship pictures',
                    visible: true,
                });
                jest.advanceTimersByTime(2000);
            });
        });
    });
});
