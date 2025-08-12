import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { EditGeneralForm, EditSpecificForm } from '../editShip';

const queryClient = new QueryClient();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const mockParams = {
    shipId: '65a8bda44b191011546c21b1',
};

const editGeneralFormComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="EditGeneralForm"
                        component={EditGeneralForm}
                        initialParams={mockParams}
                    />
                    <MainOwnerStack.Screen
                        name="EditSpecificForm"
                        component={EditSpecificForm}
                        initialParams={mockParams}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

describe('Testing Edit General Form Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render Edit General Form correctly', () => {
            const editGeneralForm = render(editGeneralFormComponent);
            expect(editGeneralForm).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should handle submit edit general form', async () => {
            const { getByTestId, getByPlaceholderText, getByText } = render(
                editGeneralFormComponent,
            );

            const shipname = getByPlaceholderText(
                'ShipOwner.EditGeneralForm.placeholderShipName',
            );
            const shipCategory = getByTestId('dropdown-shipCategory');
            const rentPrice = getByPlaceholderText(
                'ShipOwner.EditGeneralForm.placeholderRentPrice',
            );
            const shipDesc = getByPlaceholderText(
                'ShipOwner.EditGeneralForm.placeholderShipDescription',
            );
            const submitButton = getByTestId('submitButton');

            fireEvent.changeText(shipname, 'Barge Hauler');
            fireEvent.press(shipCategory);
            // await waitFor(() => {
            //     expect(getByText('Tugboat')).toBeDefined();
            //     expect(getByText('Barge')).toBeDefined();
            //     expect(getByText('Ferry')).toBeDefined();
            // });
            // const categoryToSelect = getByText('Barge');

            // fireEvent.press(categoryToSelect);
            // expect(shipCategory.props.value).toBe('Barge');
            fireEvent.changeText(rentPrice, '10000000');
            fireEvent.changeText(shipDesc, 'Barge Hauler Description');

            fireEvent.press(submitButton);

            await waitFor(() => {
                const modalState = store.getState().addShip;

                expect(modalState).toEqual({
                    name: 'Barge Hauler',
                    desc: 'Barge Hauler Description',
                    category: '',
                    pricePerMonth: '10000000',
                    length: '',
                    width: '',
                    height: '',
                    facilities: [],
                    specifications: [
                        {
                            name: '',
                            value: '',
                        },
                    ],
                    shipDocument: [
                        {
                            uri: '',
                            name: '',
                            fileCopyUri: '',
                            type: '',
                            size: 0,
                            docExpired: undefined,
                            label: '',
                        },
                    ],
                });
            });
        });
    });
});
