import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreenParamList, MainStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color, TOKEN, USERDATA } from '../../../../configs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { Negotiate } from '../negotiate';
import {
    useCompleteNegotiate,
    useGetTransactionForNegotiate,
    useSendRespondNegotiateContract,
} from '../../../../hooks';
import {
    setMockDocumentPickerResolve,
    setMockImagePickerResolve,
} from '../../../../jest/setup';
import ImagePicker from 'react-native-image-crop-picker';

jest.mock('../../../../hooks');

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
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

const MainStack = createNativeStackNavigator<MainStackParamList>();
const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<MainScreenParamList>();
const mockAdapter = new MockAdapter(httpRequest);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        _id: 'test',
        firebaseId: 'test',
        name: 'Usmanul',
        email: 'usman@email.com',
        password: 'test',
        isVerified: false,
        isCompanySubmitted: false,
    }),
);
AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
        accessToken: 'test',
        refreshToken: 'test',
    }),
);

const mockParams = {
    transactionId: '1',
    status: [
        {
            name: 'dad',
            desc: 'dad',
            date: new Date(),
            isOpened: true,
            _id: '1',
        },
    ],
};

const mockDataTransaction = {
    status: 'success',
    data: {
        ship: {
            shipId: {
                size: {
                    length: 400,
                    width: 75,
                    height: 20,
                },
                _id: '123',
                name: 'Barge Hauler',
                imageUrl: 'https://storage.googleapis.com/',
                shipDocuments: [
                    {
                        documentName: 'Ship Barge Hauler Document1',
                        documentUrl: '',
                        _id: '3211233',
                    },
                    {
                        documentName: 'Ship Barge Hauler Document2',
                        documentUrl:
                            'https://storage.googleapis.com/download/storage/v1',
                        _id: '4433222',
                    },
                ],
            },
            shipOwnerId: {
                _id: '1231231',
                name: 'Fauzan',
            },
            shipDocument: [],
        },
        _id: '5647587683452542',
        rentalId: 'SH-12282023-1231sdds',
        renterId: {
            _id: '1233478007',
            name: 'Azis',
        },
        rentalDuration: 30,
        rentalStartDate: '2023-12-29T16:00:00.000Z',
        rentalEndDate: '2024-01-28T16:00:00.000Z',
        needs: 'Transport',
        locationDestination: 'Sulsel',
        locationDeparture: 'Palu',
        status: [
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: '2023-12-28T07:36:03.347Z',
                isOpened: false,
                _id: '44215346373733hf2',
            },
            {
                name: 'proposal 1',
                desc: 'Negotiate draft contact sent',
                date: '2023-12-28T07:34:25.821Z',
                isOpened: false,
                _id: 'sdf1355fth6211',
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: '2023-12-28T07:33:02.338Z',
                isOpened: true,
                _id: '445622fbgr114',
            },
            {
                name: 'rfq 2',
                desc: 'RFQ accepted',
                date: '2023-12-28T07:32:34.417Z',
                isOpened: false,
                _id: '1231dgfh644',
            },
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: '2023-12-28T07:31:50.798Z',
                isOpened: true,
                _id: 'vgfd2224512278',
            },
        ],
        shipRentType: 'Monthly Rent',
        sailingStatus: 'beforeSailing',
        proposal: [
            {
                proposalId: {
                    _id: '123131ghtykd6',
                    otherDoc: [
                        {
                            documentName: 'dasda',
                            documentUrl: 'dasdasd',
                            _id: '1213123',
                        },
                    ],
                },
                proposalUrl: 'https://storage.googleapis.com/',
                notes: 'Harganya segini',
                offeredPrice: 50000000,
                _id: '453462sgsgvbqwv',
                additionalImage: [
                    {
                        imageUrl: 'https://storage.googleapis.com/',
                        imageDescription: 'Nih',
                        _id: 'awvefa3r454265136',
                    },
                ],
            },
            {
                notes: 'murahin lagi',
                additionalImage: [
                    {
                        imageUrl: 'https://storage.googleapis.com/',
                        imageDescription: 'Nih',
                        _id: 'awvefa3r454265136',
                    },
                ],
                offeredPrice: 40000000,
                _id: '1231fsdfvazsdv',
            },
            {
                proposalId: {
                    _id: 'cdsa134',
                    otherDoc: [
                        {
                            documentName: 'dasda',
                            documentUrl: 'dasdasd',
                            _id: '1213123',
                        },
                    ],
                },
                proposalUrl: 'https://storage.googleapis.com/',
                notes: 'Saya berharap agar penawaran harga dapat disesuaikan karena angka yang diajukan terlalu tinggi bagi saya. Saya sangat menghargai usaha Anda, namun saya membutuhkan penyesuaian harga yang lebih sesuai dengan anggaran yang telah ditetapkan. Harga yang diajukan terlalu tinggi dan tidak sesuai dengan perkiraan saya. Mohon pertimbangkan untuk menyusun kembali penawaran agar dapat mencapai kesepakatan yang lebih menguntungkan kedua belah pihak.',
                offeredPrice: 45000000,
                _id: 'fsdfv341414',
                additionalImage: [
                    {
                        imageUrl: 'https://storage.googleapis.com/',
                        imageDescription: 'Nih',
                        _id: 'awvefa3r454265136',
                    },
                ],
            },
        ],
        beforeSailingPictures: [],
        afterSailingPictures: [],
        createdAt: '2023-12-28T07:31:50.812Z',
        updatedAt: '2023-12-28T07:36:03.356Z',
        offeredPrice: 50000000,
    },
};

const mockDataTransactionFailed = {
    ship: {
        shipId: {
            size: {
                length: 400,
                width: 75,
                height: 20,
            },
            _id: '123',
            name: 'Barge Hauler',
            imageUrl: 'https://storage.googleapis.com/',
            shipDocuments: [
                {
                    documentName: 'Ship Barge Hauler Document1',
                    documentUrl: '',
                    _id: '3211233',
                },
                {
                    documentName: 'Ship Barge Hauler Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1',
                    _id: '4433222',
                },
            ],
        },
        shipOwnerId: {
            _id: '1231231',
            name: 'Fauzan',
        },
        shipDocument: [],
    },
    _id: '5647587683452542',
    rentalId: 'SH-12282023-1231sdds',
    renterId: {
        _id: '1233478007',
        name: 'Azis',
    },
    rentalDuration: 30,
    rentalStartDate: '2023-12-29T16:00:00.000Z',
    rentalEndDate: '2024-01-28T16:00:00.000Z',
    needs: 'Transport',
    locationDestination: 'Sulsel',
    locationDeparture: 'Palu',
    status: [],
    shipRentType: 'Monthly Rent',
    sailingStatus: 'beforeSailing',
    proposal: [],
    beforeSailingPictures: [],
    afterSailingPictures: [],
    createdAt: '2023-12-28T07:31:50.812Z',
    updatedAt: '2023-12-28T07:36:03.356Z',
    offeredPrice: 50000000,
};

const mockResponseData = {
    status: 'success',
    data: {
        ship: {
            shipId: {
                size: {
                    length: 12,
                    width: 21,
                    height: 12,
                },
                _id: '123',
                name: 'Barge Hauler',
                imageUrl: 'testtt',
                shipDocuments: {
                    documentName: 'testtt',
                    documentUrl: 'testtt',
                    _id: 'testtt',
                },
            },
            shipOwnerId: {
                _id: 'testtt',
                name: 'testtt',
            },
        },
        _id: 'testtt',
        rentalId: 'testtt',
        renterId: {
            _id: 'testtt',
            name: 'testtt',
        },
        rentalDuration: 13,
        rentalStartDate: 'testtt',
        rentalEndDate: 'testtt',
        proposal: {
            proposalId: {
                _id: 'testtt',
                otherDoc: {
                    documentName: 'testtt',
                    documentUrl: 'testtt',
                    _id: 'testtt',
                },
            },
            _id: 'testtt',
            proposalUrl: 'testtt',
            notes: 'testtt',
            proposalName: 'testtt',
            additionalImage: {
                imageUrl: 'testtt',
                imageDescription: 'testtt',
            },
            offeredPrice: 13,
        },
        status: {
            name: 'testtt',
            desc: 'testtt',
            date: 'testtt',
            isOpened: true,
            _id: 'testtt',
        },
        shipRentType: 'testtt',
        createdAt: 'testtt',
        updatedAt: 'testtt',
        offeredPrice: 130000,
    },
};

const negotiateMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="Negotiate"
                        component={Negotiate}
                        initialParams={mockParams}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Negotiate Screen', () => {
    describe('Snapshots', () => {
        it('should match snapshot', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, { message: 'success', data: mockParams });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: mockDataTransaction,
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            const negotiateScreen = render(negotiateMockComponent()).toJSON();
            expect(negotiateScreen).toMatchSnapshot();
        });
    });
    describe('Render Component', () => {
        it('should render negotiate form', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(negotiateMockComponent());

            await act(async () => {
                await waitFor(() => {
                    expect(getByTestId('NegotiateScreen')).toBeTruthy();
                });
            });
        });
        it('should show tab negotiate form after click', async () => {
            const { getByTestId } = render(negotiateMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-1'));
            });
            expect(getByTestId('tabButton-1')).toBeDefined();
        });
        it('should show tab document after click', async () => {
            const { getByTestId } = render(negotiateMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });
            expect(getByTestId('tabButton-2')).toBeDefined();
        });
        it('should show tab history after click', async () => {
            const { getByTestId } = render(negotiateMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-3'));
            });
            expect(getByTestId('tabButton-3')).toBeDefined();
        });
        it('should render ship information', async () => {
            const { getByTestId, getByText } = render(negotiateMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });
            const shipInformationComponent = getByTestId(
                'shipInformationComponent',
            );

            expect(shipInformationComponent).toBeDefined();

            const shipNameText = getByText('Barge Hauler');

            expect(shipNameText).toBeDefined();
        });
        it('should render ship information and document can be click', async () => {
            const { getByTestId } = render(negotiateMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });
            const shipInformationComponent = getByTestId(
                'shipInformationComponent',
            );

            expect(shipInformationComponent).toBeDefined();
            act(() => {
                fireEvent.press(getByTestId('documentButton'));
            });
            expect(getByTestId('documentButton')).toBeDefined();
        });
        it('should render flatlist on shipInformation', async () => {
            const { getByTestId } = render(negotiateMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });
            const shipInformationComponent = getByTestId(
                'shipInformationComponent',
            );

            expect(shipInformationComponent).toBeDefined();

            const flatlistShipDocument = getByTestId('flatlistShipDocument');
            expect(flatlistShipDocument).toBeDefined();
        });
        it('should render additional document FlatList', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(negotiateMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });

            const flatlistDoc = getByTestId('shipDocList');

            flatlistDoc.props.data.push(
                mockDataTransaction.data.proposal[0].proposalId?.otherDoc,
            );

            await act(async () => {
                fireEvent.press(getByTestId('shipDocList'));
            });

            const shipDocList = getByTestId('shipDocList');

            expect(shipDocList).toBeDefined();
        });
        it('should render additional document FlatList and can be clicked', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(negotiateMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });

            const flatlistDoc = getByTestId('shipDocList');

            flatlistDoc.props.data.push(
                mockDataTransaction.data.proposal[0].proposalId?.otherDoc,
            );

            await act(async () => {
                fireEvent.press(getByTestId('shipDocList'));
            });

            const shipDocList = getByTestId('shipDocList');

            expect(shipDocList).toBeDefined();

            await act(async () => {
                fireEvent.press(getByTestId('otherDocButton-0'));
            });
            expect(getByTestId('otherDocButton-0')).toBeDefined();
        });
        it('should render history and can click readmore', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(negotiateMockComponent());

            await act(async () => {
                fireEvent.press(getByTestId('tabButton-3'));
            });

            const history = getByTestId('negotiateHistoryItem-1');

            expect(history).toBeDefined();

            await act(async () => {
                fireEvent.press(getByTestId('pressReadMore'));
            });
        });
        it('should render history and can click readmore', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(negotiateMockComponent());

            await act(async () => {
                fireEvent.press(getByTestId('tabButton-3'));
            });

            const history = getByTestId('negotiateHistoryItem-1');

            expect(history).toBeDefined();

            await act(async () => {
                fireEvent.press(getByTestId('pressReadMore'));
            });
        });
        it('should render history and can click image', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId } = render(negotiateMockComponent());

            await act(async () => {
                fireEvent.press(getByTestId('tabButton-3'));
            });

            const history = getByTestId('negotiateHistoryItem-1');

            expect(history).toBeDefined();

            act(() => {
                fireEvent.press(getByTestId('modalImage-1'));
            });
        });
        it('pressed 1  document will showing pdf modal', async () => {
            const { getByTestId } = render(negotiateMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });

            await act(async () => {
                fireEvent.press(getByTestId('otherDocButton-0'));
            });
            setMockDocumentPickerResolve(false);

            await waitFor(() => {
                expect(getByTestId('otherDocButton-0')).toBeDefined();
            });
        });
        test('submit negotiate form', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useSendRespondNegotiateContract as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: mockDataTransaction,
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId, getByPlaceholderText } = render(
                negotiateMockComponent(),
            );

            act(() => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            const noteInput = getByPlaceholderText(
                'FormNegotiateRenter.NegotiateForm.placeholderNotes',
            );

            await act(async () => {
                fireEvent.changeText(noteInput, 'ini adalah catatan');
            });

            expect(noteInput.props.value).toBe('ini adalah catatan');

            const imageInput = getByTestId('imageInputButton');
            act(() => {
                fireEvent.press(imageInput);
            });
            //image not inputyet
            await waitFor(() => {
                expect(imageInput).toBeDefined();
            });

            expect(getByTestId('modalInputId')).toBeDefined();

            const inputImageName = getByPlaceholderText(
                'FormNegotiateRenter.NegotiateForm.placeholderImageCaption',
            );

            await act(async () => {
                fireEvent.changeText(inputImageName, 'this are the image');
            });

            expect(noteInput.props.value).toBe('ini adalah catatan');

            setMockImagePickerResolve(true);

            const numer = getByTestId('numericInput');

            act(() => {
                fireEvent.press(numer);
            });

            await act(async () => {
                fireEvent.changeText(numer, 100000);
            });

            await act(async () => {
                fireEvent.press(getByTestId('negoButton'));
            });

            mockAdapter
                .onPost('/renter/respond-draft-contract')
                .reply(200, mockResponseData);

            const modalState = store.getState().modal;

            const progressState = store.getState().progressIndicator;
            expect(progressState).toEqual({
                visible: true,
            });

            await waitFor(() => {
                jest.advanceTimersByTime(3000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'FormNegotiateRenter.NegotiateForm.textSuccessForm',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        test('image delete', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId, getByPlaceholderText, getByText } = render(
                negotiateMockComponent(),
            );

            await act(async () => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            const imageInput = getByTestId('imageInputButton');

            await act(async () => {
                fireEvent.press(imageInput);
            });

            expect(getByTestId('modalInputId')).toBeDefined();

            const inputImageName = getByPlaceholderText(
                'FormNegotiateRenter.NegotiateForm.placeholderImageCaption',
            );

            await act(async () => {
                fireEvent.changeText(inputImageName, 'this are the image');
            });

            const inputImage = getByText(
                'FormNegotiateRenter.NegotiateForm.textSelectImage',
            );

            await act(async () => {
                fireEvent.press(inputImage);
            });

            setMockImagePickerResolve(true);

            fireEvent.press(getByTestId('buttonDelete'));

            await waitFor(() => {
                expect(getByTestId('modalInputId')).toBeTruthy();
            });
        });
        test('add image', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId, getByPlaceholderText, getByText } = render(
                negotiateMockComponent(),
            );

            await act(async () => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            const imageInput = getByTestId('imageInputButton');

            await act(async () => {
                fireEvent.press(imageInput);
            });

            expect(getByTestId('modalInputId')).toBeDefined();

            const inputImageName = getByPlaceholderText(
                'FormNegotiateRenter.NegotiateForm.placeholderImageCaption',
            );

            await act(async () => {
                fireEvent.changeText(inputImageName, 'this are the image');
            });

            const inputImage = getByText(
                'FormNegotiateRenter.NegotiateForm.textSelectImage',
            );

            await act(async () => {
                fireEvent.press(inputImage);
            });

            setMockImagePickerResolve(true);

            fireEvent.press(getByTestId('buttonDelete'));

            await waitFor(() => {
                expect(getByTestId('modalInputId')).toBeTruthy();
            });

            fireEvent.press(getByTestId('buttonAddImage'));

            await waitFor(() => {
                expect(getByTestId('modalInputId')).toBeTruthy();
            });
            //masih belum
        });
        //masih belum kena
        test('image error', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId, getByPlaceholderText, getByText } = render(
                negotiateMockComponent(),
            );

            await act(async () => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            const imageInput = getByTestId('imageInputButton');

            await act(async () => {
                fireEvent.press(imageInput);
            });

            expect(getByTestId('modalInputId')).toBeDefined();

            fireEvent.press(getByTestId('buttonImage'));

            setMockImagePickerResolve(false);

            await waitFor(() => {
                expect(getByTestId('modalInputId')).toBeTruthy();
            });
        });
        test('submit negotiate form', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useSendRespondNegotiateContract as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: mockDataTransaction,
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId, getByPlaceholderText } = render(
                negotiateMockComponent(),
            );

            act(() => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            const noteInput = getByPlaceholderText(
                'FormNegotiateRenter.NegotiateForm.placeholderNotes',
            );

            await act(async () => {
                fireEvent.changeText(noteInput, 'ini adalah catatan');
            });

            expect(noteInput.props.value).toBe('ini adalah catatan');

            const imageInput = getByTestId('imageInputButton');
            act(() => {
                fireEvent.press(imageInput);
            });

            await waitFor(() => {
                expect(imageInput).toBeDefined();
            });

            expect(getByTestId('modalInputId')).toBeDefined();

            const inputImageName = getByPlaceholderText(
                'FormNegotiateRenter.NegotiateForm.placeholderImageCaption',
            );

            await act(async () => {
                fireEvent.changeText(inputImageName, 'this are the image');
            });

            fireEvent.press(getByTestId('buttonImage'));

            setMockImagePickerResolve(true);

            fireEvent.press(getByTestId('buttonAddImage'));

            expect(getByTestId('buttonAddImage')).toBeDefined();

            expect(noteInput.props.value).toBe('ini adalah catatan');

            const numer = getByTestId('numericInput');

            act(() => {
                fireEvent.press(numer);
            });

            await act(async () => {
                fireEvent.changeText(numer, 100000);
            });

            await act(async () => {
                fireEvent.press(getByTestId('negoButton'));
            });

            mockAdapter
                .onPost('/renter/respond-draft-contract')
                .reply(200, mockResponseData);

            const modalState = store.getState().modal;

            const progressState = store.getState().progressIndicator;
            expect(progressState).toEqual({
                visible: true,
            });

            await waitFor(() => {
                jest.advanceTimersByTime(3000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'FormNegotiateRenter.NegotiateForm.textSuccessForm',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        test('complete negotiate form', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction.data,
                });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: {
                                data: mockDataTransaction.data,
                            },
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            (useCompleteNegotiate as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            rentalId: 'SH-12282023-1231sdds',
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId, getByText } = render(negotiateMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            const buttonn = getByTestId('submitButton');

            await act(async () => {
                fireEvent.press(buttonn);
            });

            await waitFor(() => {
                expect(buttonn).toBeDefined();
            });

            const modalComplete = getByText('Confirm');

            fireEvent.press(modalComplete);

            await waitFor(() => {
                expect(modalComplete).toBeDefined();
            });

            mockAdapter
                .onPost('/renter/complete-negotiate')
                .reply(200, { status: 'success' });

            const modalState = store.getState().modal;
            await waitFor(() => {
                jest.advanceTimersByTime(3000);
                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Negotiation completed successfully',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should error open pdfpicker', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction,
                });
            (useCompleteNegotiate as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: mockDataTransaction,
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId, getByText } = render(negotiateMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            jest.spyOn(ImagePicker, 'openPicker').mockRejectedValue(
                new Error('Failed to open PDF picker'),
            );
            const imageInput = getByTestId('imageInputButton');
            act(() => {
                fireEvent.press(imageInput);
            });

            console.log('Event triggered');

            jest.spyOn(ImagePicker, 'openPicker').mockRejectedValue('error');
        });
        it('should error on selected document', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction,
                });
            (useSendRespondNegotiateContract as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: mockDataTransaction,
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onSuccess } = options;
                        const mockResponseData = {
                            data: mockDataTransaction,
                        };
                        onSuccess(mockResponseData);
                    }),
                }),
            );

            const { getByTestId, getByText } = render(negotiateMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            const buttonn = getByText(
                'FormNegotiateRenter.NegotiateForm.textSend',
            );

            act(() => {
                fireEvent.press(buttonn);
            });

            mockAdapter
                .onPost('/renter/complete-negotiate')
                .reply(200, { status: 'failed' });

            // const modalState = store.getState().modal;

            // const progressState = store.getState().progressIndicator;
            // expect(progressState).toEqual({
            //     visible: true,
            // });

            // await waitFor(() => {
            //     jest.advanceTimersByTime(3000);
            //     expect(modalState).toEqual({
            //         visible: true,
            //         status: 'success',
            //         text: 'FormNegotiateRenter.NegotiateForm.textSuccessForm',
            //     });
            //     const progressState = store.getState().progressIndicator;
            //     expect(progressState).toEqual({
            //         visible: false,
            //     });
            // });
        });
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Render Component Failed', () => {
        it('should not render negotiate form and failed', async () => {
            mockAdapter
                .onGet('/renter/get-transaction-for-negotiate/1')
                .reply(400, { message: 'fail' });
            (useGetTransactionForNegotiate as jest.Mock).mockImplementation(
                () => ({
                    mutate: jest.fn().mockImplementation((data, options) => {
                        const { onError } = options;
                        const mockResponseData = {
                            data: mockDataTransactionFailed,
                        };
                        onError(mockResponseData);
                    }),
                }),
            );

            render(negotiateMockComponent());

            await waitFor(() => {
                expect(useGetTransactionForNegotiate).toHaveBeenCalled();
            });
        });
    });
});
