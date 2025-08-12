import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    MainOwnerStackParamList,
    MainScreenOwnerParamList,
} from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SeeShipPictures } from '../seeShipPictures';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ShipPicturesAfterRent } from '../shipPicturesAfterRent';
import { setMockImagePickerResolve } from '../../../../jest/setup';
import { useSubmitShipPicturesAfterSailing } from '../../../../hooks';

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
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);

const mockSubmitImages = () => {
    mockAdapter
        .onPost('/ship-owner/submit-ship-pictures-after-sailing')
        .reply(200, {
            message: 'success',
        });
    (useSubmitShipPicturesAfterSailing as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const shipPicturesAfterRentComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="ShipPicturesAfterRent"
                        component={ShipPicturesAfterRent}
                        initialParams={{
                            transactionId: '123',
                            sailingStatus: 'afterSailing',
                            beforeSailingPictures: [
                                {
                                    documentName: 'Ships',
                                    documentUrl: 'http://ship.com',
                                    description: 'this are the ship pictures',
                                },
                            ],
                            afterSailingPictures: {}[0],
                        }}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Ship Pictures After Rent', () => {
    describe('Snapshot', () => {
        // it('should match snapshot', () => {
        //     const tree = render(shipPicturesAfterRentComponent).toJSON();
        //     expect(tree).toMatchSnapshot();
        // })
    });
    describe('render correctly', () => {
        it('should render correctly', () => {
            const { getByTestId } = render(shipPicturesAfterRentComponent);

            expect(getByTestId('ShipPicturesAfterRentScreen')).toBeDefined();
        });
        it('should get image description of before rent pictures', () => {
            const { getByTestId } = render(shipPicturesAfterRentComponent);

            const desc = getByTestId('beforeSailing-0');
            expect(desc).toBeTruthy();
        });
        it('should submit button', async () => {
            mockSubmitImages();
            const { getByTestId } = render(shipPicturesAfterRentComponent);

            const afterBtn = getByTestId('afterButton');

            fireEvent.press(afterBtn);
            await waitFor(() => {
                setMockImagePickerResolve(true);
            });
            const submitButton = getByTestId('submitButton');

            fireEvent.press(submitButton);

            fireEvent.press(getByTestId('confirmButton'));
        });
        it('should cancel submit button', async () => {
            const { getByTestId } = render(shipPicturesAfterRentComponent);

            const afterBtn = getByTestId('afterButton');
            const submitButton = getByTestId('submitButton');
            const modal = getByTestId('modalConfirm');

            expect(afterBtn).toBeTruthy();

            setMockImagePickerResolve(true);

            fireEvent.press(submitButton);

            expect(submitButton).toBeDefined();

            expect(getByTestId('modalConfirm')).toBeDefined();

            fireEvent.press(modal);

            modal.props.onRequestClose(true);
        });
    });
});
