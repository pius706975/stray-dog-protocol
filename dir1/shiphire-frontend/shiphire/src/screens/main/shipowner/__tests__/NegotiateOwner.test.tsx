import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import NegotiateOwner from '../negotiate/NegotiateOwner';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
    useGetTransactionForNegotiateOwner,
    useSendNegotiateContractOwner,
} from '../../../../hooks';
import NumericInput from 'react-native-numeric-input';
import { Color } from '../../../../configs';
import { Button, TextInput } from '../../../../components';
import DocumentPicker from 'react-native-document-picker';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';
import { ModalPdf, ShipDocumentList } from '../negotiate/components';
import { ReactTestInstance } from 'react-test-renderer';
import PDFView from 'react-native-view-pdf';

jest.mock('../../../../hooks');

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            structuralSharing: false,
        },
    },
});

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => mockNavigation,
    };
});

const mockNavigation = {
    reset: jest.fn(),
    navigate: jest.fn(),
    // Add other navigation methods as needed
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);

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
                additionalImage: [],
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
                proposalUrl: null,
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

const mockResponseData = {
    status: 'success',
    newProposal: {
        ship: '658bd61386dc089a0c799fd3',
        renter: '658bd61286dc089a0c799ed4',
        shipOwner: '658bd61286dc089a0c799ecb',
        draftContract:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/download.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=NM9B1c1qnQ6dmxoPDZXKDTxKZYWJ%2F%2FlId46Mev5gyGfBuIBbrP9B2EyIsgEx5xuC%2F4E%2BGkEOvV4KYIed3%2BlKGokY35MSDYjH7V92tv9z092h8PPJs6w%2FxW1RBmXbQBFvyAybs4Ttp7Q4sB5%2FgsVIlzImczEDlUON0GpT%2Fj2KVNYtZWjmicG3LVbsMW2fE7nkXeagBGZpB8Oytx8ZxpPS4ohWYzfOVMBFNaFoM18TLat6Gc4SuRKy4OjyNJf%2Fv2ATi%2FQ%2F4XrSRrjGrUorx0pH2eD0ARRRrymvEETZRFYzHUqOYmF1qMnsnK9Vis2GFf0ypIgz9OMw1R7ZGgAqMlz0pw%3D%3D',
        isAccepted: false,
        _id: '6596160890876240923fd296',
        otherDoc: [],
        createdAt: '2024-01-04T02:20:56.525Z',
        updatedAt: '2024-01-04T02:20:56.525Z',
        __v: 0,
    },
};

const negotiateOwnerMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="Negotiate"
                        component={NegotiateOwner}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Contract Screen', () => {
    describe('Snapshot testing', () => {
        it('should match snapshot', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const negotiateOwnerScreen = render(negotiateOwnerMockComponent());
            expect(negotiateOwnerScreen).toMatchSnapshot();
        });
    });
    describe('Components testing', () => {
        it('should render negotiate form', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(negotiateOwnerMockComponent());

            await act(async () => {
                await waitFor(() => {
                    expect(getByTestId('negotiateScreenOwner')).toBeDefined();
                });
            });
        });
        it('should show tab negotiate form after click', async () => {
            const { getByTestId } = render(negotiateOwnerMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-1'));
            });
            expect(getByTestId('tabButton-1')).toBeDefined();
        });
        it('should show tab document after click', async () => {
            const { getByTestId } = render(negotiateOwnerMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });
            expect(getByTestId('tabButton-2')).toBeDefined();
        });
        it('should show tab history after click', async () => {
            const { getByTestId } = render(negotiateOwnerMockComponent());
            act(() => {
                fireEvent.press(getByTestId('tabButton-3'));
            });
            expect(getByTestId('tabButton-3')).toBeDefined();
        });
        it('should render correctly form price negotiate', async () => {
            const priceComponent = render(
                <NumericInput
                    type="up-down"
                    totalWidth={210}
                    totalHeight={50}
                    step={100000}
                    valueType="integer"
                    editable={true}
                    minValue={100000}
                    maxValue={1000000000}
                    value={0}
                    rounded
                    textColor={Color.darkTextColor}
                    upDownButtonsBackgroundColor={Color.softPrimaryColor}
                    borderColor={Color.primaryColor}
                    onChange={() => {}}
                />,
            ).toJSON();

            expect(priceComponent).toBeDefined();
        });
        it('should render correctly form note negotiate', async () => {
            const noteComponent = render(
                <TextInput
                    leftIcon
                    placeholder={''}
                    label={''}
                    onBlur={() => {}}
                    onChange={() => {}}
                    error
                    value={''}
                />,
            ).toJSON();

            expect(noteComponent).toBeDefined();
        });
        it('should allow selecting a PDF document', async () => {
            setMockDocumentPickerResolve(true);
            const { getByTestId } = render(negotiateOwnerMockComponent());
            const documentPickerButton = getByTestId('documentPickerButton');
            act(() => {
                fireEvent.press(documentPickerButton);
            });
            // Wait for the document picker to resolve
            await waitFor(() => {
                expect(documentPickerButton).toBeDefined();
            });
        });
        it('should error selecting a PDF document', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId, getByText } = render(
                negotiateOwnerMockComponent(),
            );
            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });
            act(() => {
                fireEvent.press(getByText('Document 1'));
            });

            expect(getByText('Document 1')).toBeTruthy();

            const modal = render(
                <PDFView
                    resource={''}
                    onError={error => {
                        jest.fn();
                    }}
                />,
            ).toJSON();

            expect(modal).toBeDefined();

            //     const modalState = store.getState().modal;
            //     await waitFor(() => {
            //         jest.advanceTimersByTime(3000);
            //         expect(modalState).toEqual({
            //             visible: true,
            //             status: 'failed',
            //             text: 'Failed Open Document',
            //         });

            //   });
        });
        it('should allow delete pdf document after selecting a PDF document', async () => {
            setMockDocumentPickerResolve(true);
            const { getByTestId } = render(negotiateOwnerMockComponent());
            const documentPickerButton = getByTestId('documentPickerButton');
            act(() => {
                fireEvent.press(documentPickerButton);
            });

            await waitFor(() => {
                expect(documentPickerButton).toBeDefined();
            });
            const deleteDocumentButton = getByTestId('deleteDocumentButton');
            act(() => {
                fireEvent.press(deleteDocumentButton);
            });

            await waitFor(() => {
                expect(deleteDocumentButton).toBeDefined();
            });
        });

        it('should handle the button submit', async () => {
            jest.useFakeTimers();
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockDataTransaction,
                });
            (useSendNegotiateContractOwner as jest.Mock).mockImplementation(
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
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId, getByText, getByPlaceholderText } = render(
                negotiateOwnerMockComponent(),
            );

            await act(async () => {
                fireEvent.press(getByTestId('tabButton-1'));
            });

            expect(getByTestId('tabButton-1')).toBeDefined();

            const noteInput = getByPlaceholderText(
                'FormNegotiateOwner.NegotiateForm.placeholderNotes',
            );

            await act(async () => {
                fireEvent.changeText(noteInput, 'ini adalah catatan');
            });

            expect(noteInput.props.value).toBe('ini adalah catatan');

            act(() => {
                fireEvent.press(getByTestId('documentPickerButton'));
            });
            setMockDocumentPickerResolve(true);

            await waitFor(() => {
                expect(getByTestId('documentPickerButton')).toBeDefined();
            });

            const getDoc = getByText('dummy.pdf');
            expect(getDoc).toBeTruthy();

            await act(async () => {
                fireEvent.press(getByTestId('submitButton'));
            });

            mockAdapter
                .onPost('/ship-owner/submit-negotiate-contract')
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
                    text: 'FormNegotiateOwner.NegotiateForm.textSuccessForm',
                });
                const progressState = store.getState().progressIndicator;
                expect(progressState).toEqual({
                    visible: false,
                });
            });
            // expect(mockNavigation.reset).toHaveBeenCalledWith({
            //     index: 0,
            //     routes: [
            //         {
            //             name: 'ShipOwnerHome',
            //         },
            //     ],
            // });
        });
        // it('should handle the button submit and error', async () => {
        //     jest.useFakeTimers();
        //     mockAdapter
        //         .onGet('/ship-owner/get-transaction-for-negotiate/1')
        //         .reply(200, {
        //             message: 'success',
        //             data: mockDataTransaction,
        //         });
        //     (useSendNegotiateContractOwner as jest.Mock).mockImplementation(
        //         () => ({
        //             mutate: jest.fn().mockImplementation((data, options) => {
        //                 const { onSuccess } = options;
        //                 const mockResponseData = {
        //                     data: mockDataTransaction,
        //                 };
        //                 onSuccess(mockResponseData);
        //             }),
        //         }),
        //     );
        //     (
        //         useGetTransactionForNegotiateOwner as jest.Mock
        //     ).mockImplementation(() => ({
        //         mutate: jest.fn().mockImplementation((data, options) => {
        //             const { onSuccess } = options;
        //             const mockResponseData = {
        //                 data: mockDataTransaction,
        //             };
        //             onSuccess(mockResponseData);
        //         }),
        //     }));
        //     const { getByTestId, getByText, getByPlaceholderText } = render(
        //         negotiateOwnerMockComponent(),
        //     );

        //     await act(async () => {
        //         fireEvent.press(getByTestId('tabButton-1'));
        //     });

        //     expect(getByTestId('tabButton-1')).toBeDefined();

        //     const noteInput = getByPlaceholderText('Catatan');

        //     await act(async () => {
        //         fireEvent.changeText(noteInput, 'ini adalah catatan');
        //     });

        //     expect(noteInput).toBeDefined();

        //     act(() => {
        //         fireEvent.press(getByTestId('documentPickerButton'));
        //     });
        //     setMockDocumentPickerResolve(true);

        //     await waitFor(() => {
        //         expect(getByTestId('documentPickerButton')).toBeDefined();
        //     });

        //     const getDoc = getByText('dummy.pdf');
        //     expect(getDoc).toBeTruthy();

        //     await act(async () => {
        //         fireEvent.press(getByTestId('submitButton'));
        //     });

        //     mockAdapter
        //         .onPost('/ship-owner/submit-negotiate-contract')
        //         .reply(500, { status: 'fail' });

        //     await waitFor(() => {
        //         const modalState = store.getState().modal;

        //         expect(modalState).toEqual({
        //             visible: true,
        //             status: 'failed',
        //             text: 'Gagal mengirim respon negosiasi',
        //         });
        //         jest.advanceTimersByTime(3000);

        //         const progressState = store.getState().progressIndicator;
        //         expect(progressState).toEqual({
        //             visible: false,
        //         });
        //     });
        // });
        it('should open PDF picker', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId, getByText } = render(
                negotiateOwnerMockComponent(),
            );

            act(() => {
                fireEvent.press(getByTestId('documentPickerButton'));
            });
            setMockDocumentPickerResolve(true);
            await waitFor(() => {
                expect(getByTestId('documentPickerButton')).toBeDefined();
            });

            const getDoc = getByText('dummy.pdf');
            expect(getDoc).toBeTruthy();
        });
        it('should render button submit', async () => {
            const buttonComponent = render(
                <Button title={'Kirim'} onSubmit={() => {}} />,
            ).toJSON();

            expect(buttonComponent).toBeDefined();
        });

        it('should not show error messages when input are valid', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByPlaceholderText, getByText, queryAllByText } = render(
                negotiateOwnerMockComponent(),
            );

            const noteInput = getByPlaceholderText(
                'FormNegotiateOwner.NegotiateForm.placeholderNotes',
            );
            const submitButton = getByText(
                'FormNegotiateOwner.NegotiateForm.textSend',
            );
            await waitFor(() => {
                fireEvent.changeText(noteInput, 'catatan ini');
            });
            expect(noteInput.props.value).toBe('catatan ini');
            act(() => {
                fireEvent.press(submitButton);
            });
            await waitFor(() => {
                expect(queryAllByText('Must be filled')).toHaveLength(0);
            });
        });
        it('should render ship information', async () => {
            const { getByTestId, getByText } = render(
                negotiateOwnerMockComponent(),
            );
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
            const { getByTestId, getByText } = render(
                negotiateOwnerMockComponent(),
            );
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
            const { getByTestId } = render(negotiateOwnerMockComponent());
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
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(negotiateOwnerMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-2'));
            });

            const flatlistDoc = getByTestId('shipDocList');

            flatlistDoc.props.data.push(
                mockDataTransaction.data.proposal[0].proposalId?.otherDoc,
            );

            act(() => {
                fireEvent.press(getByTestId('shipDocList'));
            });

            const shipDocList = getByTestId('shipDocList');

            expect(shipDocList).toBeDefined();
        });
        it('should render additional document FlatList and can be clicked', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(negotiateOwnerMockComponent());

            act(async () => {
                fireEvent.press(getByTestId('tabButton-2'));
            });

            const flatlistDoc = getByTestId('shipDocList');

            flatlistDoc.props.data.push(
                mockDataTransaction.data.proposal[0].proposalId?.otherDoc,
            );

            act(() => {
                fireEvent.press(getByTestId('shipDocList'));
            });

            const shipDocList = getByTestId('shipDocList');

            expect(shipDocList).toBeDefined();

            act(() => {
                fireEvent.press(getByTestId('otherDocButton-0'));
            });
            expect(getByTestId('otherDocButton-0')).toBeDefined();
        });
        it('should render history and can click readmore', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(negotiateOwnerMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-3'));
            });

            const history = getByTestId('negotiateHistoryItem-1');

            expect(history).toBeDefined();

            act(() => {
                fireEvent.press(getByTestId('pressReadMore'));
            });
        });
        it('should render history and can click readmore', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(negotiateOwnerMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-3'));
            });

            const history = getByTestId('negotiateHistoryItem-1');

            expect(history).toBeDefined();

            act(() => {
                fireEvent.press(getByTestId('pressReadMore'));
            });
        });
        it('should render history and can click image', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId } = render(negotiateOwnerMockComponent());

            act(() => {
                fireEvent.press(getByTestId('tabButton-3'));
            });

            const history = getByTestId('negotiateHistoryItem-1');

            expect(history).toBeDefined();

            act(() => {
                fireEvent.press(getByTestId('modalImage-1'));
            });
        });
        it('should handle error when PDF selection is rejected', async () => {
            mockAdapter
                .onGet('/ship-owner/get-transaction-for-negotiate/1')
                .reply(200, {
                    message: 'success',
                    data: mockParams,
                });
            (
                useGetTransactionForNegotiateOwner as jest.Mock
            ).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: mockDataTransaction,
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            setMockDocumentPickerResolve(false);
            const { getByTestId } = render(negotiateOwnerMockComponent());
            act(() => {
                fireEvent.press(getByTestId('documentPickerButton'));
            });
            await waitFor(() => {
                expect(getByTestId('documentPickerButton')).toBeDefined();
            });
        });
        it('pressed 1  document will showing pdf modal', async () => {
            const setModalVisibleMock = jest.fn();
            const { getByTestId } = render(negotiateOwnerMockComponent());

            fireEvent.press(getByTestId('tabButton-2'));

            act(() => {
                fireEvent.press(getByTestId('otherDocButton-0'));
            });
            setMockDocumentPickerResolve(false);

            await waitFor(() => {
                expect(getByTestId('otherDocButton-0')).toBeDefined();
            });
        });
    });
});
