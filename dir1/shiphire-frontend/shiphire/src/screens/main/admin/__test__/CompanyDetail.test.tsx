import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import httpRequest from '../../../../services/api';
import MockAdapter from 'axios-mock-adapter';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { CompanyDetail } from '../companyDetail';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { CompanyDocumentItem } from '../companyDetail/components';

const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);
const mockRoute = {
    companyInfo: {
        _id: '123',
        roles: 'renter',
        renterId: {
            company: {
                name: 'company 1',
                companyType: 'PT',
                address: 'address',
                documentCompany: [
                    {
                        documentName: 'doc 1',
                        documentUrl: '',
                        _id: '123',
                    },
                ],
                imageUrl: '',
                isRejected: false,
                isVerified: false,
            },
            _id: '1',
            name: 'Al',
        },
    },
};
const adminStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="CompanyDetail"
                        component={CompanyDetail}
                        initialParams={mockRoute}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing company detail screen', () => {
    describe('Snapshot testing', () => {
        it('should render company detail screen correctly', async () => {
            const companyDetailScreen = render(adminStackMockComponent);
            expect(companyDetailScreen).toMatchSnapshot();
        });
    });
});

describe('Unit Test', () => {
    it('pressed 1  document will showing pdf modal', () => {
        const setModalVisibleMock = jest.fn();
        const { getByTestId } = render(
            <CompanyDocumentItem
                index={0}
                label="dokumen 1"
                handlePress={() => {
                    setModalVisibleMock(true);
                }}
            />,
        );
        fireEvent.press(getByTestId('document-0'));

        expect(setModalVisibleMock).toHaveBeenCalledWith(true);
    });
    it('pressed verify button will showing confirmation modal', async () => {
        const { getByTestId, getByText } = render(adminStackMockComponent);
        fireEvent.press(getByTestId('verifyButton'));
        const modalConfirmation = await getByText(
            "You cant revert this action, once it's updated",
        );
        expect(modalConfirmation).toBeTruthy();
    });
    it('should update company data with status verified true', async () => {
        jest.useFakeTimers();

        const { getByTestId, getByText } = render(adminStackMockComponent);
        fireEvent.press(getByTestId('verifyButton'));
        const modalConfirmation = getByText(
            "You cant revert this action, once it's updated",
        );
        const approveBtn = getByTestId('approveBtn');
        fireEvent.press(approveBtn);
        mock.onPost('admin/activate-company').reply(200, { status: 'success' });

        await waitFor(() => {
            jest.advanceTimersByTime(2000);
            expect(getByText('Verified')).toBeTruthy();
            expect(modalConfirmation).toBeTruthy();
        });
    });
    it('should update company data with status rejected true', async () => {
        jest.useFakeTimers();

        const { getByTestId, getByText } = render(adminStackMockComponent);
        fireEvent.press(getByTestId('verifyButton'));
        const modalConfirmation = getByText(
            "You cant revert this action, once it's updated",
        );
        const rejectBtn = getByTestId('rejectBtn');
        fireEvent.press(rejectBtn);
        mock.onPost('admin/rejected-company').reply(200, { status: 'success' });

        await waitFor(() => {
            jest.advanceTimersByTime(2000);
            expect(getByText('Rejected')).toBeTruthy();
            expect(modalConfirmation).toBeTruthy();
        });
    });
    it('should show modal when update verified success ', async () => {
        jest.useFakeTimers();

        const { getByTestId } = render(adminStackMockComponent);
        fireEvent.press(getByTestId('verifyButton'));
        const approveBtn = getByTestId('approveBtn');
        fireEvent.press(approveBtn);
        mock.onPost('admin/activate-company').reply(200, { status: 'success' });

        await waitFor(() => {
            const modalState = store.getState().modal;

            expect(modalState).toEqual({
                visible: true,
                status: 'success',
                text: 'Approve company success',
            });
        });
    });
    it('should show modal when update rejected success ', async () => {
        jest.useFakeTimers();

        const { getByTestId } = render(adminStackMockComponent);
        fireEvent.press(getByTestId('verifyButton'));
        const rejectBtn = getByTestId('rejectBtn');
        fireEvent.press(rejectBtn);
        mock.onPost('admin/rejected-company').reply(200, { status: 'success' });

        await waitFor(() => {
            const modalState = store.getState().modal;

            expect(modalState).toEqual({
                visible: true,
                status: 'success',
                text: 'Approve company success',
            });
        });
    });
});
