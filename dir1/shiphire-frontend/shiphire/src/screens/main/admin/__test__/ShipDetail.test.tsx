import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { DetailShipAdmin } from '../detailShipAdmin';
import {
    useApproveShip,
    useGetShipById,
    useUnapproveShip,
} from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { ShipManagement } from '../shipManagement';

jest.mock('../../../../hooks');

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: str => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

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
            rentStartDate: '',
            rentEndDate: '',
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
    shipApproved: false,
};

const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="DetailShipAdmin"
                        component={DetailShipAdmin}
                        initialParams={{ shipId: mockShipData._id }}
                    />
                    <MainAdminStack.Screen
                        name="ShipManagement"
                        component={ShipManagement}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

beforeEach(() => {
    useTranslation('detailship');
    mock.onGet('/admin/get-ship-by-id').reply(200, {
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

describe('Testing ship detail screen ', () => {
    describe('Snapshot testing', () => {
        it('should render ship detail screen correctly', () => {
            const shipDetailScreen = render(adminStackMockComponent);

            expect(shipDetailScreen).toMatchSnapshot();
        });
    });
    describe('unit test', () => {
        it('Should show modal confimation when press approval button', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-approval-button');

            fireEvent.press(confirmButton);

            expect(
                ' Are you sure you want to approve this ship?',
            ).toBeDefined();
        });
        it('Should show modal confimation when press approval button', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-approval-button');

            fireEvent.press(confirmButton);

            const modal = getByTestId('modalApproveConfirm');
            const cancelBtn = getByTestId('cancel-approve-btn');

            fireEvent.press(cancelBtn);
            expect(modal.props.visible).toBeFalsy();
        });
        it('Should update ship approval when press approval button', async () => {
            mock.onPost('admin/approve-ship').reply(200, {
                status: 'success',
            });
            (useApproveShip as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: {
                                isActive: false,
                            },
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const { getByTestId, rerender } = render(adminStackMockComponent);
            rerender(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-approval-button');

            fireEvent.press(confirmButton);
            const approveButton = getByTestId('approve-button');
            fireEvent.press(approveButton);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Ship has been approved',
                });
            });
        });
        it('Should failed update ship approval when press approval button', async () => {
            mock.onPost('admin/approve-ship').reply(200, {
                status: 'success',
            });
            (useApproveShip as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResponseData = {
                        status: 'error',
                    };
                    onError(mockResponseData);
                }),
            }));
            const { getByTestId, rerender } = render(adminStackMockComponent);
            rerender(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-approval-button');

            fireEvent.press(confirmButton);
            const approveButton = getByTestId('approve-button');
            fireEvent.press(approveButton);
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'fail to approve',
                });
            });
        });
        it('Should show modal confimation when press unapprove button', () => {
            mockShipData.shipApproved = true;
            mock.onGet('/admin/get-ship-by-id').reply(200, {
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
            const { getByTestId } = render(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-unapprove-button');

            fireEvent.press(confirmButton);

            expect(
                'Are you sure you want to Unapprove this ship?',
            ).toBeDefined();
        });
        it('Should closed modal confimation when press cancel button ', () => {
            mockShipData.shipApproved = true;
            mock.onGet('/admin/get-ship-by-id').reply(200, {
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
            const { getByTestId } = render(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-unapprove-button');
            fireEvent.press(confirmButton);

            const modal = getByTestId('modal-unapprove');
            const cancelBtn = getByTestId('unapprove-cancel-btn');
            fireEvent.press(cancelBtn);

            expect(modal.props.visible).toBeFalsy();
        });
        it('Should update ship unapprove when press unapprove button', async () => {
            mockShipData.shipApproved = true;
            mock.onGet('/admin/get-ship-by-id').reply(200, {
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
            mock.onPost('admin/unaprove-ship').reply(200, {
                status: 'success',
            });
            (useUnapproveShip as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: {
                                isActive: false,
                            },
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));

            const { getByTestId, rerender } = render(adminStackMockComponent);
            rerender(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-unapprove-button');

            fireEvent.press(confirmButton);
            const unapproveBtn = getByTestId('unapprove-button');
            fireEvent.press(unapproveBtn);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Ship has been unapproved',
                });
            });
        });
        it('Should fail update ship unapprove when press unapprove button', async () => {
            mockShipData.shipApproved = true;
            mock.onGet('/admin/get-ship-by-id').reply(200, {
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
            mock.onPost('admin/unaprove-ship').reply(200, {
                status: 'success',
            });
            (useUnapproveShip as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onError } = options;
                    const mockResponseData = {
                        status: 'error',
                    };
                    onError(mockResponseData);
                }),
            }));

            const { getByTestId, rerender } = render(adminStackMockComponent);
            rerender(adminStackMockComponent);
            const confirmButton = getByTestId('confirmation-unapprove-button');

            fireEvent.press(confirmButton);
            const unapproveBtn = getByTestId('unapprove-button');
            fireEvent.press(unapproveBtn);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'fail to unapproved',
                });
            });
        });
        it('should open modal pdf when press ship document', () => {
            const { getByTestId } = render(adminStackMockComponent);
            const shipDocPress = getByTestId('category-0');

            fireEvent.press(shipDocPress);

            expect(getByTestId('modalPdf')).toBeDefined();
        });
    });
});
