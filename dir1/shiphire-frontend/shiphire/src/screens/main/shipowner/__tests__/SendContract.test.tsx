import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainOwnerStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { SendContract } from '../sendContract';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    shipId: '6583eca4b7b3908b33a876e1',
    rentalId: 'SH-09212023-63c96de3',
    renterId: '6583eca4b7b3908b33a8758b',
    renterCompanyName: 'Azis Company',
    renterCompanyAddress: 'Jl. Pramuka 6',
    renterName: 'Azis',
    shipName: 'Cargo Carrier',
    shipCategory: 'Barge',
    shipSize: {
        length: 350,
        width: 75,
        height: 15,
    },
    shipCompanyType: 'PT',
    shipCompanyName: 'Fauzan Company',
    shipDocuments: [
        {
            _id: '6583eca4b7b3908b33a876e2',
            documentName: 'Ship Cargo Carrier Owner Document1',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Cargo%20Carrier%20Owner%20Document%201?generation=1695180974620680&alt=media',
        },
        {
            _id: '6583eca4b7b3908b33a876e3',
            documentName: 'Ship Cargo Carrier Owner Document2',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Cargo%20Carrier%20Owner%20Document%202?generation=1695180987121517&alt=media',
        },
    ],
    shipImageUrl:
        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Cargo%20Carrier%20Owner%20Image?generation=1695180962100799&alt=media',
    draftContract: [
        {
            proposalId: {
                _id: '6584e7997916c1b2c9cfc37e',
                otherDoc: [],
            },
            proposalUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Proposal-6583eca4b7b3908b33a876e1-6583eca4b7b3908b33a876e1?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=q0TELuSnGuH7Dlqq1nNF0YxvAX0VWQfHx5UcHt9fhk1OXThetCRNVsJYLdKcRvx%2B3v%2BE8d4fdh0qaMVp1t9ohUdUzsTlMaHYRjpuLrO8pt%2Fyf2FTgGV%2FOvjDbWuj14jEJQ7u8P4ZJciCpSrpmE2ZDKT9FlUtKcGBuAsLJN91CvF%2BZAId503j%2BtlMJJzzLeXo15kN%2FZbMmRyii8anrctmxnLTHUpCNWPag7KMI6dir3xciSXOQDot2qfRAyzGtKSgf8PMk%2BWNFC%2BS9WrFD0OClGx%2FrQuKr8JEPnqO5uZqZRrhX5pSw27FySyRa%2B9gNPWi3pi1QBvFWlUdWn9qY8VLeA%3D%3D',
            notes: 'Notes',
            _id: '6584e7997916c1b2c9cfc380',
            additionalImage: [],
        },
        {
            proposalId: {
                _id: '6584e7a17916c1b2c9cfc381',
                otherDoc: [],
            },
            proposalUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Proposal-6583eca4b7b3908b33a876e1-6583eca4b7b3908b33a876e1?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=q0TELuSnGuH7Dlqq1nNF0YxvAX0VWQfHx5UcHt9fhk1OXThetCRNVsJYLdKcRvx%2B3v%2BE8d4fdh0qaMVp1t9ohUdUzsTlMaHYRjpuLrO8pt%2Fyf2FTgGV%2FOvjDbWuj14jEJQ7u8P4ZJciCpSrpmE2ZDKT9FlUtKcGBuAsLJN91CvF%2BZAId503j%2BtlMJJzzLeXo15kN%2FZbMmRyii8anrctmxnLTHUpCNWPag7KMI6dir3xciSXOQDot2qfRAyzGtKSgf8PMk%2BWNFC%2BS9WrFD0OClGx%2FrQuKr8JEPnqO5uZqZRrhX5pSw27FySyRa%2B9gNPWi3pi1QBvFWlUdWn9qY8VLeA%3D%3D',
            notes: 'Notes',
            _id: '6584e7a17916c1b2c9cfc382',
            additionalImage: [],
        },
    ],
};

const sendContractMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="SendContract"
                        component={SendContract}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing send contract screen', () => {
    describe('Snapshoot testing', () => {
        it('should render send contract screen corectly', async () => {
            const sendContractScreen = render(sendContractMockComponent);
            expect(sendContractScreen).toMatchSnapshot();
        });
    });
    describe('Unit testing', () => {
        it('should handle PDF selection', async () => {
            // Arrange
            const { getByText, getByTestId } = render(
                sendContractMockComponent,
            );
            // Act
            fireEvent.press(getByTestId('selectContractButton'));
            setMockDocumentPickerResolve(true);

            // Wait for the promise to resolve or reject (DocumentPicker.pick)
            await waitFor(() => {
                expect(getByTestId('selectContractButton')).toBeDefined();
            });
            const getDoc = getByText('dummy.pdf');
            expect(getDoc).toBeTruthy();
        });
        it('should handle submit contract successfully', async () => {
            // Arrange
            jest.useFakeTimers();
            const { getByText, getByTestId } = render(
                sendContractMockComponent,
            );

            // Act
            fireEvent.press(getByTestId('selectContractButton'));
            setMockDocumentPickerResolve(true);

            // Wait for the promise to resolve or reject (DocumentPicker.pick)
            await waitFor(() => {
                expect(getByTestId('selectContractButton')).toBeDefined();
            });

            const getDoc = getByText('dummy.pdf');
            expect(getDoc).toBeTruthy();

            fireEvent.press(getByTestId('submitButton'));
            mockAdapter
                .onPost('/ship-owner/submit-contract')
                .reply(200, { status: 'success' });
            // Simulate the passage of time for setTimeout
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Contract Sent! Check your transaction status frequently for renter response!',
                });
                jest.advanceTimersByTime(4000);

                const progressState = store.getState().progressIndicator;

                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should handle failed submit contract', async () => {
            // Arrange
            jest.useFakeTimers();
            const { getByText, getByTestId } = render(
                sendContractMockComponent,
            );

            // Act
            fireEvent.press(getByTestId('selectContractButton'));
            setMockDocumentPickerResolve(true);

            // Wait for the promise to resolve or reject (DocumentPicker.pick)
            await waitFor(() => {
                expect(getByTestId('selectContractButton')).toBeDefined();
            });

            const getDoc = getByText('dummy.pdf');
            expect(getDoc).toBeTruthy();

            fireEvent.press(getByTestId('submitButton'));
            mockAdapter
                .onPost('/ship-owner/submit-contract')
                .reply(500, { status: 'failed' });
            // Simulate the passage of time for setTimeout
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Failed to send contract! Please try again!',
                });

                jest.advanceTimersByTime(4000);

                const progressState = store.getState().progressIndicator;

                expect(progressState).toEqual({
                    visible: false,
                });
            });
        });
        it('should handle error when PDF selection is rejected', async () => {
            // Arrange
            setMockDocumentPickerResolve(false);
            const { getByTestId } = render(sendContractMockComponent);

            // Act
            fireEvent.press(getByTestId('selectContractButton'));

            // Wait for the promise to resolve or reject (DocumentPicker.pick)
            await waitFor(() => {
                expect(getByTestId('selectContractButton')).toBeDefined();
            });
        });
    });
    describe('Components testing', () => {
        it('should render modal pdf correctly', async () => {
            const { getByTestId } = render(sendContractMockComponent);
            const modalPdf = getByTestId('modalPdf');
            expect(modalPdf).toBeTruthy();
        });

        it('should render ship information correctly', async () => {
            const { getByText } = render(sendContractMockComponent);
            const shipName = getByText('Cargo Carrier');
            const shipCategory = getByText('Barge');
            const shipSize = getByText('350 x 75 x 15 meter');
            const shipCompany = getByText('PT. Fauzan Company');
            const documentNames = mockParams.shipDocuments.map(
                document => document.documentName,
            );
            const lastdraftContract =
                mockParams.draftContract[mockParams.draftContract.length - 1];

            expect(shipName).toBeTruthy();
            expect(shipCategory).toBeTruthy();
            expect(shipSize).toBeTruthy();
            expect(shipCompany).toBeTruthy();
            expect(documentNames).toContain(
                'Ship Cargo Carrier Owner Document1',
            );
            expect(lastdraftContract.proposalId._id).toBe(
                '6584e7a17916c1b2c9cfc381',
            );
        });
        it('handleDocumentPress should set selected document and show modal', () => {
            const mockItem = {
                _id: '1',
                documentName: 'Sample Document',
                documentUrl: 'sample-url',
            };
            const { getByTestId, getByText } = render(
                sendContractMockComponent,
            );

            fireEvent.press(getByText('Document 1'));
            const modal = getByTestId('modalPdf');
            expect(modal).toBeTruthy();
        });
    });
});
