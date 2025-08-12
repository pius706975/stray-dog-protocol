import React from 'react';
import {
    render,
    fireEvent,
    waitFor,
    screen,
} from '@testing-library/react-native';
import DetailShip from '../detailShip/DetailShip';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import {
    useGetRenterData,
    useGetShipById,
    useSetShipReminderNotif,
} from '../../../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN, USERDATA } from '../../../../configs';
import { act } from 'react-test-renderer';
import PDFView from 'react-native-view-pdf';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';
import { ShipAvailability } from '../shipAvailability';
import { date } from 'yup';

jest.mock('../../../../hooks');
jest.mock('@gorhom/bottom-sheet', () => ({
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
}));

const queryClient = new QueryClient();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const mock = new MockAdapter(httpRequest);

const mockShipData = {
    _id: '456',
    size: {
        length: 12,
        width: 34,
        height: 56,
    },
    shipOwnerId: {
        _id: '123',
        company: {
            name: 'Ship company',
            companyType: '',
            address: '',
            isVerified: true,
            isRejected: false,
        },
    },
    name: 'Ship 2',
    desc: 'ship desc',
    tags: [],
    pricePerMonth: 1200000,
    category: {
        _id: '12121',
        name: 'barge',
    },
    facilities: [
        {
            _id: '1222',
            name: 'ddd',
            type: '',
        },
    ],
    specifications: [
        {
            _id: '5466',
            name: 'spec 1',
            spesificationId: { units: 'spec 1' },
            value: 'spec 1',
        },
    ],
    rating: 5,
    totalRentalCount: 12,
    shipDocuments: [
        {
            documentName: 'document1',
            documentUrl: 'http://document.com',
            _id: '1',
        },
        {
            documentName: 'document2',
            documentUrl: 'http://document.com',
            _id: '2',
        },
    ],
    __v: 1,
    imageUrl: 'http://image.com',
    shipHistory: [
        {
            _id: '',
            rentStartDate: '2024-01-25T08:49:43.158+00:00',
            rentEndDate: '2024-05-31T08:49:43.158+00:00',
            locationDeparture: '',
            locationDestination: '',
            needs: '',
            renterCompanyName: '',
            deleteStatus: '',
            price: '',
            genericDocument: [
                {
                    fileName: '',
                    fileUrl: '',
                },
            ],
        },
    ],
    rfqDynamicForm: '',
    shipApproved: true,
};
const mockShipData2 = {
    _id: '456',
    size: {
        length: 12,
        width: 34,
        height: 56,
    },
    shipOwnerId: {
        _id: '123',
        company: {
            name: 'Ship company',
            companyType: '',
            address: '',
            isVerified: true,
            isRejected: false,
        },
    },
    name: 'Ship 2',
    desc: 'ship desc',
    tags: [],
    pricePerMonth: 1200000,
    category: {
        _id: '12121',
        name: 'barge',
    },
    facilities: [
        {
            _id: '1222',
            name: 'ddd',
            type: '',
        },
    ],
    specifications: [],
    rating: 5,
    totalRentalCount: 12,
    shipDocuments: [],
    __v: 1,
    imageUrl: 'http://image.com',
    shipHistory: [
        {
            _id: '',
            rentStartDate: '2024-01-17T08:49:43.158+00:00',
            rentEndDate: '2024-02-25T08:49:43.158+00:00',
            locationDeparture: '',
            locationDestination: '',
            needs: '',
            renterCompanyName: '',
            deleteStatus: '',
            price: '',
            genericDocument: [
                {
                    fileName: '',
                    fileUrl: '',
                },
            ],
        },
    ],
    rfqDynamicForm: 'sadasd',
    shipApproved: true,
};
const mockShipData3 = {
    _id: '456',
    size: {
        length: 12,
        width: 34,
        height: 56,
    },
    shipOwnerId: {
        _id: '123',
        company: {
            name: 'Ship company',
            companyType: '',
            address: '',
            isVerified: true,
            isRejected: false,
        },
    },
    name: 'Ship 2',
    desc: 'ship desc',
    tags: [],
    pricePerMonth: 1200000,
    category: {
        _id: '12121',
        name: 'barge',
    },
    facilities: [
        {
            _id: '1222',
            name: 'ddd',
            type: '',
        },
    ],
    specifications: [],
    rating: 5,
    totalRentalCount: 12,
    shipDocuments: [],
    __v: 1,
    imageUrl: 'http://image.com',
    shipHistory: [],
    rfqDynamicForm: 'sadasd',
    shipApproved: true,
};

const renterData = {
    company: {
        isRejected: false,
        name: 'Azis Company',
        companyType: 'CV',
        address: 'Jl. Pramuka 6',
        documentCompany: [
            {
                documentName: 'Azis Corp Business License',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
                _id: '659faba8c42a651dc03e47b8',
            },
            {
                documentName: 'Azis Corp Deed of Establishment',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
                _id: '659faba8c42a651dc03e47b9',
            },
        ],
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
        isVerified: true,
    },
    _id: '659faba8c42a651dc03e47b2',
    userId: {
        _id: '659faba7c42a651dc03e4792',
        name: 'Usmanul',
        email: 'usman@email.com',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        phoneNumber: '12313123',
    },
    name: 'Usmanul',
    renterPreference: [
        'Reputation and Track Record',
        'Cargo Capacity',
        'Experience',
    ],
    shipReminded: [
        {
            ship: {
                id: {
                    _id: '234',
                    name: 'Ship 1',
                    imageUrl: 'http://image.com',
                },
                reminderDate: '2024-02-28T08:49:43.158+00:00',
            },
        },
    ],
    __v: 0,
};

const renterStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainStack.Navigator>
                    <MainStack.Screen
                        name="DetailShip"
                        component={DetailShip}
                        initialParams={{ shipId: mockShipData._id }}
                    />
                    <MainStack.Screen
                        name="ShipAvailability"
                        component={ShipAvailability}
                    />
                </MainStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

beforeEach(() => {
    mock.onGet('/ship/get-ship-by-id/456').reply(200, {
        message: 'success',
        data: mockShipData,
    });
    (useGetShipById as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockShipData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

beforeEach(() => {
    mock.onGet('/renter/get-renter-data').reply(200, {
        message: 'success',
        data: renterData,
    });
    (useGetRenterData as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: renterData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

beforeEach(async () => {
    act(() => {
        AsyncStorage.setItem(
            USERDATA,
            JSON.stringify({
                name: 'Usmanul',
                email: 'usman@email.com',
                password: 'test',
                phoneNumber: '12313123',
                isVerified: true,
                isCompanySubmitted: true,
            }),
        );
        AsyncStorage.setItem(
            TOKEN,
            JSON.stringify({
                accessToken: 'test',
                refreshToken: 'test',
            }),
        );
    });
});

describe('DetailShip', () => {
    describe('snapshot testing', () => {
        it('renders correctly', () => {
            const detailShipScreen = render(renterStackMockComponent).toJSON();
            expect(detailShipScreen).toMatchSnapshot();
        });
    });

    describe('unit testing', () => {
        it('render correctly', async () => {
            const { getByTestId } = render(renterStackMockComponent);
            const detailShip = getByTestId('DetailShipScreen');
            await act(async () => {
                expect(detailShip).toBeTruthy();
            });
        });
        it('pressed ship spesification', async () => {
            const { getByTestId } = render(renterStackMockComponent);

            const shipSpesification = getByTestId('specificationButton');

            act(() => {
                fireEvent.press(shipSpesification);
            });

            await act(async () => {
                expect(shipSpesification).toBeTruthy();
            });

            const shipSpesificationModal = getByTestId('modalPdf');

            await act(async () => {
                expect(shipSpesificationModal).toBeTruthy();
            });
        });
        it('pressed ship document and failed render document', async () => {
            jest.useFakeTimers();
            mock.onGet('/ship/get-ship-by-id/456').reply(200, {
                message: 'success',
                data: mockShipData2,
            });
            (useGetShipById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockShipData2,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            setMockDocumentPickerResolve(false);

            const { getByTestId } = render(renterStackMockComponent);

            act(() => {
                fireEvent.press(getByTestId('document-0'));
            });

            await waitFor(() => {
                expect(getByTestId('document-0')).toBeDefined();
            });

            // await waitFor(() => {
            //     const modalState = store.getState().modal;

            //     expect(modalState).toEqual({
            //         visible: true,
            //         status: 'failed',
            //         text: 'Failed Open Document',
            //     });
            // });
        });
        it('handles request quote button press', async () => {
            const { getByTestId } = render(renterStackMockComponent);
            const requestQuoteButton = getByTestId('requestQuoteButton');

            act(() => {
                fireEvent.press(requestQuoteButton);
            });

            await act(async () => {
                expect(requestQuoteButton).toBeTruthy();
            });
        });
        it('handles document press category container', async () => {
            const { getByTestId } = render(renterStackMockComponent);
            const documentButton = getByTestId('document-2');

            act(() => {
                fireEvent.press(documentButton);
            });
            await act(async () => {
                expect(documentButton).toBeTruthy();
            });

            act(() => {
                fireEvent.press(getByTestId('categoryContainer-0'));
            });

            const pdfView = render(
                <PDFView
                    resource="http://www.africau.edu/images/default/sample.pdf"
                    resourceType="url"
                />,
            );
            expect(pdfView).toBeTruthy();
        });
        it('handles document press error', async () => {
            const { getByTestId } = render(renterStackMockComponent);
            const documentButton = getByTestId('document-2');

            act(() => {
                fireEvent.press(documentButton);
            });
            await act(async () => {
                expect(documentButton).toBeTruthy();
            });

            const pdfView = render(
                <PDFView
                    resource={''}
                    onError={error => {
                        expect(error).toBeTruthy();
                    }}
                />,
            );

            // await waitFor(() => {
            //     const modalState = store.getState().modal;
            //     expect(modalState).toEqual({
            //         visible: true,
            //         status: 'failed',
            //         text: 'failedSentPaymentReceipt',
            //     });

            //     jest.advanceTimersByTime(3000);
            // });
            expect(pdfView).toBeTruthy();
        });

        it('should render ship history', async () => {
            const { getByTestId } = render(renterStackMockComponent);

            fireEvent.press(getByTestId('shipHistoryButton'));

            const shipHistoryScreen = await screen.findByTestId(
                'ShipAvailabilityScreen',
            );

            expect(shipHistoryScreen).toBeTruthy();
        });
        it('should render ship history and clicked to navigate', async () => {
            const { getByTestId, findByTestId } = render(
                renterStackMockComponent,
            );

            fireEvent.press(getByTestId('shipHistoryButton'));

            expect(findByTestId('ShipAvailabilityScreen')).toBeTruthy();
        });
        // it('should render cannot made rfq cause the ship is doesnt have dynamicform', async () => {
        //     AsyncStorage.setItem(
        //         USERDATA,
        //         JSON.stringify({
        //             name: 'Usmanul',
        //             email: 'usman@email.com',
        //             password: 'test',
        //             phoneNumber: '12313123',
        //             isVerified: false,
        //             isCompanySubmitted: false,
        //         }),
        //     );
        //     AsyncStorage.setItem(
        //         TOKEN,
        //         JSON.stringify({
        //             accessToken: 'test',
        //             refreshToken: 'test',
        //         }),
        //     );
        //     const { getByTestId } = render(renterStackMockComponent);

        //     fireEvent.press(getByTestId('requestQuoteButton'));

        //     await waitFor(() => {
        //         const modalState = store.getState().modal;
        //         expect(modalState).toEqual({
        //             visible: true,
        //             status: 'info',
        //             text: `Sorry, this ship's Request for a quote has not been submitted by the ship owner yet, this form will be available soon`,
        //         });

        //         jest.advanceTimersByTime(2000);
        //     });
        // });
        it('should render cannot made rfq cause phone number not added yet', async () => {
            mock.onGet('/ship/get-ship-by-id/456').reply(200, {
                message: 'success',
                data: mockShipData3,
            });
            (useGetShipById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockShipData3,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            AsyncStorage.setItem(
                USERDATA,
                JSON.stringify({
                    name: 'Usmanul',
                    email: 'usman@email.com',
                    password: 'test',
                    phoneNumber: '',
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
            const { getByTestId } = render(renterStackMockComponent);

            fireEvent.press(getByTestId('requestQuoteButton'));

            await waitFor(() => {
                const modalState = store.getState().modal;
                expect(modalState).toEqual({
                    visible: true,
                    status: 'info',
                    text: `infoAddPhoneFirst`,
                });

                jest.advanceTimersByTime(2000);
            });
        });

        it('handles reminder countdown visibility', async () => {
            mock.onGet('/ship/get-ship-by-id/456').reply(200, {
                message: 'success',
                data: mockShipData2,
            });
            (useGetShipById as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockShipData2,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            mock.onGet('/renter/get-renter-data').reply(200, {
                message: 'success',
                data: renterData,
            });
            (useGetRenterData as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: renterData,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId, getByText } = render(renterStackMockComponent);

            const reminderButton = getByTestId('iconReminderButtonBefore');

            await act(async () => {
                expect(reminderButton).toBeTruthy();
            });
            act(() => {
                fireEvent.press(reminderButton);
            });

            await act(async () => {
                const countdownModal = getByTestId('countdown');
                expect(countdownModal).toBeTruthy();
            });

            await act(async () => {
                jest.advanceTimersByTime(5000);
            });

            await act(async () => {
                const formattedTimeLeft = getByText('1 day');
                expect(formattedTimeLeft).toBeTruthy();

                expect(formattedTimeLeft.props.children).toContain('1 day');
            });

            const modal = getByTestId('modalDropdown');

            fireEvent.press(modal);

            // const radio = getByTestId('radio-dropdown');
            const radioChoose = getByTestId('dropdown');

            fireEvent.press(radioChoose);

            await waitFor(() => {
                expect(radioChoose).toBeDefined();
            });

            //     fireEvent.press(getByTestId('setButton'));

            //     mock.onPost('/renter/set-ship-reminder-notif').reply(200, {
            //         status: 'success',
            //     });
            //     (useSetShipReminderNotif as jest.Mock).mockImplementation(() => ({
            //         mutate: jest.fn().mockImplementation((data, options) => {
            //             const { onSuccess } = options;
            //             const mockResponseData = {
            //                 status: 'success',
            //             };
            //             onSuccess(mockResponseData);
            //         }),
            //     }));

            //     await waitFor(() => {
            //         const modalState = store.getState().modal;
            //         expect(modalState).toEqual({
            //             visible: true,
            //             status: 'success',
            //             text: `Reminder set on  01 February 2024`,
            //         });

            //         jest.advanceTimersByTime(2000);
            //     });
        });
    });
});
