import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider, useSelector } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { ImageForm } from '../addShip';
import {
    useGetAddShipDynamicForm,
    useSubmitShip,
    useSubmitShipDocument,
    useSubmitShipImage,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { setMockImagePickerResolve } from '../../../../jest/setup';
import { RFQTemplateOwnerManagement } from '../rfqDynamicFormOwner/rfqTemplateManagement';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

jest.mock('react-native-image-crop-picker', () => ({
    openPicker: jest.fn(() =>
        Promise.resolve({
            cropRect: { height: 1080, width: 1513, x: 204, y: 0 },
            height: 1000,
            mime: 'image/jpeg',
            modificationDate: '1706166538000',
            path: 'file:///storage/emulated/0/Android/data/id.smiteknologi.shiphire/files/Pictures/553466d2-3a3e-441d-941b-5206a52646fc.jpg',
            size: 303593,
            width: 1400,
        }),
    ),
    types: {
        image: 'image/jpg',
    },
}));

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="ImageForm"
                        component={ImageForm}
                    />
                    <MainOwnerStack.Screen
                        name="RFQTemplateOwnerManagement"
                        component={RFQTemplateOwnerManagement}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockDynamicData = {
    dynamicForms: [
        {
            _id: '65a737c476517457909c4d74',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d9f',
                active: true,
                fieldName: 'shipImage',
                fieldType: 'image',
                formType: 'addShipForm',
                inputType: 'imageSelect',
                label: 'Ship Image',
                order: 1,
                templateType: 'shipImage',
            },
            option: [],
            required: true,
        },
    ],
};

const addShipState = {
    name: 'Ship 123',
    desc: 'Ship Desc',
    category: 'Barge',
    pricePerMonth: '12345',
    length: 1234,
    width: 1234,
    height: 1234,
    facilities: ['facility1'],
    specifications: [
        {
            name: 'Capacity',
            value: '',
        },
    ],
    shipDocument: [
        {
            docExpired: undefined,
            label: 'certificateOfRegister',
            name: 'dummy.pdf',
            uri: 'dummy.pdf',
        },
        {
            docExpired: undefined,
            label: 'seaworthyCertificate',
            name: 'dummy.pdf',
            uri: 'dummy.pdf',
        },
        {
            docExpired: undefined,
            label: 'safetyCertificate',
            name: 'dummy.pdf',
            uri: 'dummy.pdf',
        },
        {
            docExpired: undefined,
            label: 'derattingCertificate',
            name: 'dummy.pdf',
            uri: 'dummy.pdf',
        },
    ],
};

const mockSubmitShip = () => {
    mockAdapter.onPost('/admin/save-ship').reply(200, {
        message: 'success',
    });
    (useSubmitShip as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockDynamicData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
};

const mockSubmitDocument = () => {
    mockAdapter.onPost('/admin/save-ship-document').reply(200, {
        message: 'success',
    });
    (useSubmitShipDocument as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockDynamicData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockSubmitDocumentError = () => {
    mockAdapter.onPost('/admin/save-ship-document').reply(500, {
        message: 'failed',
    });
    (useSubmitShipDocument as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
            };
            onError(mockResponseData);
        }),
    }));
};

const mockSubmitImage = () => {
    mockAdapter.onPost('/admin/save-ship-image').reply(200, {
        message: 'success',
    });
    (useSubmitShipImage as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockDynamicData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockSubmitImageError = () => {
    mockAdapter.onPost('/admin/save-ship-image').reply(500, {
        message: 'failed',
    });
    (useSubmitShipImage as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'error',
            };
            onError(mockResponseData);
        }),
    }));
};

beforeEach(() => {
    (useSelector as jest.Mock).mockReturnValue(addShipState);
    mockAdapter.onGet('/admin/get-dynamic-input').reply(200, {
        message: 'success',
        data: mockDynamicData,
    });
    (useGetAddShipDynamicForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockDynamicData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

describe('add ship image screen', () => {
    describe('Snapshot testing', () => {
        it('should render add ship image screen correctly', () => {
            const imageScreen = render(ownerStackMockComponent);
            expect(imageScreen).toMatchSnapshot();
        });
    });
    describe('Unit testing', () => {
        it('should save image, save document and save ship data', async () => {
            mockSubmitShip();
            mockSubmitDocument();
            mockSubmitImage();
            const { getByTestId } = render(ownerStackMockComponent);
            const image = getByTestId('image-shipImage');
            const btnSubmit = getByTestId('dynamic-button');
            fireEvent.press(image);

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'Kapal sedang ditambahkan, mohon jangan tinggalkan halaman ini',
                    visible: true,
                });
            });
        });
        it('should handle error when save image error', async () => {
            mockSubmitImageError();
            const { getByTestId } = render(ownerStackMockComponent);
            const image = getByTestId('image-shipImage');
            const btnSubmit = getByTestId('dynamic-button');
            fireEvent.press(image);

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'Kapal sedang ditambahkan, mohon jangan tinggalkan halaman ini',
                    visible: true,
                });
            });
        });
        it('should handle error when save document error', async () => {
            mockSubmitDocumentError();
            const { getByTestId } = render(ownerStackMockComponent);
            const image = getByTestId('image-shipImage');
            const btnSubmit = getByTestId('dynamic-button');
            fireEvent.press(image);

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'Kapal sedang ditambahkan, mohon jangan tinggalkan halaman ini',
                    visible: true,
                });
            });
        });
    });
});
