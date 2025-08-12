import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider, useMutation } from 'react-query';
import { MainAdminStackParamList } from '../../../../types';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import { Provider } from 'react-redux';
import store from '../../../../store';
import { NavigationContainer } from '@react-navigation/native';
import { CompanyManagement } from '../companyManagement';
import { render, waitFor } from '@testing-library/react-native';
import { FlatList } from 'react-native';
import { act } from 'react-test-renderer';
import { CompanyItem } from '../companyManagement/components';
import React from 'react';
import { useGetCompany } from '../../../../hooks';

jest.mock('../../../../hooks');
const queryClient = new QueryClient();
const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const mock = new MockAdapter(httpRequest);

const adminStackMockComponent = () => (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainAdminStack.Navigator>
                    <MainAdminStack.Screen
                        name="CompanyManagement"
                        component={CompanyManagement}
                    />
                </MainAdminStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockCompanies = [
    {
        _id: '1',
        renterId: {
            company: {
                name: 'Company 1',
                imageUrl: 'image1.jpg',
                isVerified: 'true',
            },
        },
        roles: 'shipOwner',
    },
    {
        _id: '2',
        renterId: {
            company: {
                name: 'Company 2',
                imageUrl: 'image2.jpg',
                isVerified: false,
            },
        },
        roles: 'renter',
    },
    {
        _id: '3',
        shipOwnerId: {
            company: {
                name: 'Company 3',
                imageUrl: 'image2.jpg',
                isVerified: false,
            },
        },
        roles: 'shipOwner',
    },
];

describe('Testing company management screen', () => {
    describe('Snapshot testing', () => {
        it('should render company management screen corectly', async () => {
            mock.onGet('/admin/get-companies').reply(200, {
                message: 'success',
                data: mockCompanies,
            });
            (useGetCompany as jest.Mock).mockImplementation(() => ({
                mutate: jest.fn().mockImplementation((data, options) => {
                    const { onSuccess } = options;
                    const mockResponseData = {
                        data: {
                            data: mockCompanies,
                        },
                    };
                    onSuccess(mockResponseData);
                }),
            }));
            const companyManagementScreen = render(adminStackMockComponent());

            expect(companyManagementScreen).toMatchSnapshot();
        });
    });
    describe('flatlist component', () => {
        it('should render correctly', () => {
            const flatlist = render(
                <FlatList
                    data={[]}
                    renderItem={item => <></>}
                    scrollEnabled={false}
                />,
            ).toJSON();
            expect(flatlist).toMatchSnapshot();
        });
    });
});

describe('Unit test', () => {
    it('should render a list of companies', async () => {
        mock.onGet('/admin/get-companies').reply(200, mockCompanies);

        const { getByTestId } = render(adminStackMockComponent());

        let flatListComponent;
        act(() => {
            flatListComponent = getByTestId('flatlistCompany');
            flatListComponent.props.data.push(mockCompanies);
        });
        await waitFor(() => {
            const flatList = getByTestId('flatlistCompany');
            expect(flatList).toBeTruthy();
        });
    });

    it('renders company item correctly with company verified', () => {
        const { getByTestId, getByText } = render(
            <CompanyItem item={mockCompanies[0]} index={0} navigation={mock} />,
        );

        expect(getByTestId(`company-0`)).toBeTruthy();
        expect(getByText('Company 1')).toBeTruthy();
        expect(getByText('Ship Owner')).toBeTruthy();
        expect(getByText('✓')).toBeTruthy();
    });
    it('renders company item correctly with renters company not verified', () => {
        const { getByTestId, getByText } = render(
            <CompanyItem item={mockCompanies[1]} index={1} navigation={mock} />,
        );

        expect(getByTestId(`company-1`)).toBeTruthy();
        expect(getByText('Company 2')).toBeTruthy();
        expect(getByText('Renter')).toBeTruthy();
    });
    it('renders company item correctly with shipowner company not verified', () => {
        const { getByTestId, getByText } = render(
            <CompanyItem item={mockCompanies[2]} index={2} navigation={mock} />,
        );

        expect(getByTestId(`company-2`)).toBeTruthy();
        expect(getByText('Company 3')).toBeTruthy();
        expect(getByText('Ship Owner')).toBeTruthy();
    });
});
