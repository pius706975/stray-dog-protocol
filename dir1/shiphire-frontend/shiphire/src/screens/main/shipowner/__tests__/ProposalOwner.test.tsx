import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainOwnerStackParamList } from '../../../../types';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import ProposalOwner from '../proposalOwner/ProposalOwner';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { COMPANYDATA, USERDATA } from '../../../../configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import {
    useGetRenterDataByOwner,
    useGetRenterUserData,
    useGetShipById,
    useSubmitProposalOwner,
} from '../../../../hooks';
import { act } from 'react-test-renderer';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);

const params = {
    shipId: '123',
    categoryId: '345',
    shipOwnerId: '567',
    renterId: '5678',
    rentalId: '890',
    rentalDuration: '5',
    rentalStartDate: '22 december 2024',
    rentalEndDate: '25 december 2025',
};

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="ProposalOwner"
                        component={ProposalOwner}
                        initialParams={params}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

mockAdapter;

const mockRenter = {
    _id: '',
    user: '',
    name: '',
    company: {
        name: '',
        companyType: '',
        address: '',
    },
};
const mockUser = {
    name: 'aaa',
    email: 'aa@email.com',
    phoneNumber: '0836446538',
    imageUrl: 'http://image.com',
    isVerified: true,
    isPhoneVerified: true,
    isCompanySubmitted: true,
    isCompanyRejected: false,
    isCompanyVerified: true,
};

const mockShip = {
    name: 'Ship 1',
    category: {
        name: 'Barge',
    },
    imageUrl: 'http://image.com',
    size: {
        height: 12,
        length: 20,
        width: 4399,
    },
    shipOwnerId: {
        company: {
            companyType: 'PT',
            name: 'Shiphire',
        },
    },
    shipDocuments: [
        {
            documentUrl: 'http://document-url',
            documentName: 'Document 1',
            _id: '1',
        },
        {
            documentUrl: 'http://document-url',
            documentName: 'Document 2',
            _id: '2',
        },
    ],
    pricePerMonth: 500000,
};

const mockFormSubmit = () => {
    mockAdapter.onPost('/ship-owner/submit-proposal').reply(200, {
        message: 'success',
    });
    (useSubmitProposalOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
            };
            onSuccess(mockResponseData);
        }),
    }));
};
const mockFormSubmitError = () => {
    mockAdapter.onPost('/ship-owner/submit-proposal').reply(500, {
        message: 'failed',
    });
    (useSubmitProposalOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onError } = options;
            const mockResponseData = {
                message: 'failed',
            };
            onError(mockResponseData);
        }),
    }));
};

beforeEach(() => {
    AsyncStorage.setItem(
        USERDATA,
        JSON.stringify({
            name: 'Usmanul',
            email: 'usman@email.com',
            password: 'test',
            isVerified: false,
            isCompanySubmitted: false,
        }),
    );
    AsyncStorage.setItem(
        COMPANYDATA,
        JSON.stringify({
            name: 'mock',
            companyType: 'PT',
            address: 'jljl',
        }),
    );

    mockAdapter.onGet('/ship-owner/get-renter-data/5678').reply(200, {
        message: 'success',
        data: mockRenter,
    });
    (useGetRenterDataByOwner as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
                data: {
                    data: mockRenter,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
    mockAdapter.onGet('/ship-owner/get-renter-user-data/5678').reply(200, {
        message: 'success',
        data: mockUser,
    });
    (useGetRenterUserData as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
                data: {
                    data: mockUser,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
    mockAdapter.onGet('/shipowner/get-ship-data').reply(200, {
        message: 'success',
        data: mockShip,
    });
    (useGetShipById as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                message: 'success',
                data: {
                    data: mockShip,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

describe('proposal owner screen', () => {
    describe('snapshot testing', () => {
        it('should render proposal owner screen correctly', () => {
            const proposalOwnerScreen = render(ownerStackMockComponent);
            expect(proposalOwnerScreen).toMatchSnapshot();
        });
    });
    describe('unit testing', () => {
        it('should show modal when failed send proposal', async () => {
            mockFormSubmitError();
            const { getByTestId, getByPlaceholderText, getByDisplayValue } =
                render(ownerStackMockComponent);

            const offeredPrice = getByDisplayValue('500000');
            const note = getByPlaceholderText(
                'FormProposalOwner.textInsertNote',
            );
            const pdfPicker = getByTestId('proposalPicker');
            const btnSubmit = getByTestId('btn-submit-proposal');
            act(() => {
                fireEvent.changeText(offeredPrice, '499999');
                fireEvent.changeText(note, 'notes for renter');
                fireEvent.press(pdfPicker);
                setMockDocumentPickerResolve(true);
            });

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'failed',
                    text: 'FormProposalOwner.textFailedSentProposal',
                    visible: true,
                });
            });
        });
        it('should send proposal without additional file', async () => {
            mockFormSubmit();
            const { getByTestId, getByPlaceholderText, getByDisplayValue } =
                render(ownerStackMockComponent);

            const offeredPrice = getByDisplayValue('500000');
            const note = getByPlaceholderText(
                'FormProposalOwner.textInsertNote',
            );
            const pdfPicker = getByTestId('proposalPicker');
            const btnSubmit = getByTestId('btn-submit-proposal');
            act(() => {
                fireEvent.changeText(offeredPrice, '499999');
                fireEvent.changeText(note, 'notes for renter');
                fireEvent.press(pdfPicker);
                setMockDocumentPickerResolve(true);
            });

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'FormProposalOwner.textProposalSent',
                    visible: true,
                });
            });
        });
        it('should save form with additional document ', async () => {
            mockFormSubmit();
            const { getByTestId, getByPlaceholderText, getByDisplayValue } =
                render(ownerStackMockComponent);

            const offeredPrice = getByDisplayValue('500000');
            const note = getByPlaceholderText(
                'FormProposalOwner.textInsertNote',
            );
            const btnProposalPicker = getByTestId('proposalPicker');
            const btnModalAdditional = getByTestId('add-input-additional-doc');
            const btnSubmit = getByTestId('btn-submit-proposal');

            act(() => {
                fireEvent.changeText(offeredPrice, '499999');
                fireEvent.changeText(note, 'notes for renter');
                fireEvent.press(btnProposalPicker);
                setMockDocumentPickerResolve(true);
                fireEvent.press(btnModalAdditional);
            });

            const docName = getByPlaceholderText('Document Name');
            const additionalDoc = getByTestId('additional-doc-pressable');
            act(() => {
                fireEvent.changeText(docName, 'document 1');
            });
            await waitFor(() => {
                fireEvent.press(additionalDoc);
                setMockDocumentPickerResolve(true);
            });
            fireEvent.press(getByTestId('btn-submit-additional'));
            fireEvent.press(getByTestId('additional-doc-0'));

            fireEvent.press(btnSubmit);

            await waitFor(() => {
                const modal = store.getState().modal;
                expect(modal).toEqual({
                    status: 'success',
                    text: 'FormProposalOwner.textProposalSent',
                    visible: true,
                });
            });
        });
        it('should show modal pdf when press ship document', async () => {
            const { getByTestId } = render(ownerStackMockComponent);

            const document1 = getByTestId('doc-1');
            fireEvent.press(document1);

            expect(getByTestId('modalPdfView')).toBeDefined();
        });
    });
});
