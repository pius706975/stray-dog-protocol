import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {configureStore} from '@reduxjs/toolkit';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import {RenterPreferencesStackNav} from '../../../navigations';
import httpRequest from '../../../services/api';
import {modalSlice, renterPreferenceSlice} from '../../../slices';
import {RenterPreferenceParamList} from '../../../types';
import CategoryPreferences from '../CategoryPreferences';
import SpesificPreferences from '../SpesificPreferences';

const queryClient = new QueryClient();
const mock = new MockAdapter(httpRequest);

let store;

describe('RenterPreferencesStackNav Component', () => {
    describe('GeneralPreferences Component', () => {
        beforeEach(() => {
            store = configureStore({
                reducer: {
                    modal: modalSlice.reducer,
                    renterPreference: renterPreferenceSlice.reducer,
                },
            });
        });

        const renderScreen = component => {
            return render(
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        <NavigationContainer>{component}</NavigationContainer>,
                    </QueryClientProvider>
                </Provider>,
            );
        };

        const mockResponse = {
            status: 'success',
            data: {
                _id: '60f1b6c9e6b6f40015a1d1a5',
                renterPreference: [],
            },
        };

        mock.onGet('/renter/get-renter-data').reply(200, mockResponse);

        it('renders correctly', async () => {
            const {getByText} = renderScreen(<RenterPreferencesStackNav />);

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'info',
                    text: 'Please fill the renter preference, so we can serve you better',
                });
            });

            // Verify that important text elements are rendered
            expect(
                getByText('Choose Your General Ship Rental Preference!'),
            ).toBeTruthy();
            expect(
                getByText(
                    'When searching for a ship rental, which aspect is your top priority? (Choose 1)',
                ),
            ).toBeTruthy();
        });

        it('should show warning modal when no preference is selected', async () => {
            const {getByText} = renderScreen(<RenterPreferencesStackNav />);

            // Simulate button press
            fireEvent.press(getByText('Next'));

            // Verify that the warning modal is shown
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Please choose your General Preference',
                });
            });
        });

        it('should add "security" in renter preference when selected', async () => {
            const {getByText} = renderScreen(<RenterPreferencesStackNav />);

            // Simulate preference selections
            fireEvent.press(getByText('Security'));
            fireEvent.press(getByText('Next'));

            await waitFor(() => {
                // Verify that the next screen is rendered
                expect(
                    getByText(
                        'Which category of ship are you currently looking for? (Choose 1)',
                    ),
                ).toBeTruthy();

                // Verify that data in redux store is updated
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: ['security'],
                });
            });
        });

        it('should add "certification and permits" in renter preference when selected', async () => {
            const {getByText} = renderScreen(<RenterPreferencesStackNav />);

            // Simulate preference selections
            fireEvent.press(getByText('Certification and permits'));
            fireEvent.press(getByText('Next'));

            await waitFor(() => {
                // Verify that the next screen is rendered
                expect(
                    getByText('Choose Your General Ship Rental Preference!'),
                ).toBeTruthy();
                // Verify that data in redux store is updated
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: ['certification and permits'],
                });
            });
        });

        it('should add "reputation and track record" in renter preference when selected', async () => {
            const {getByText} = renderScreen(<RenterPreferencesStackNav />);

            // Simulate preference selections
            fireEvent.press(getByText('Reputation and track record'));
            fireEvent.press(getByText('Next'));

            await waitFor(() => {
                // Verify that the next screen is rendered
                expect(
                    getByText(
                        'Which category of ship are you currently looking for? (Choose 1)',
                    ),
                ).toBeTruthy();
                // Verify that data in redux store is updated
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: ['reputation and track record'],
                });
            });
        });
    });

    describe('CategoryPreferences Component', () => {
        const RootStack =
            createNativeStackNavigator<RenterPreferenceParamList>();

        const mockResponse = {
            status: 'success',
            data: {
                _id: '60f1b6c9e6b6f40015a1d1a5',
                renterPreference: ['security'],
            },
        };

        //membuat store dengan initial state renterPreference: ['security'],
        beforeEach(() => {
            store = configureStore({
                reducer: {
                    modal: modalSlice.reducer,
                    renterPreference: renterPreferenceSlice.reducer,
                },
                preloadedState: {
                    renterPreference: {
                        renterPreference: ['security'],
                    },
                },
            });
        });

        mock.onGet('/renter/get-renter-data').reply(200, mockResponse);

        const renderScreen = () => {
            return render(
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        <NavigationContainer>
                            <RootStack.Navigator>
                                <RootStack.Screen
                                    name="Category"
                                    component={CategoryPreferences}
                                />
                                <RootStack.Screen
                                    name="Spesific"
                                    component={SpesificPreferences}
                                />
                            </RootStack.Navigator>
                        </NavigationContainer>
                        ,
                    </QueryClientProvider>
                </Provider>,
            );
        };

        it('renders correctly', async () => {
            const {getByText} = renderScreen();

            // Verify that important text elements are rendered
            expect(
                getByText('Choose Your General Ship Rental Preference!'),
            ).toBeTruthy();
            expect(
                getByText(
                    'Which category of ship are you currently looking for? (Choose 1)',
                ),
            ).toBeTruthy();
        });

        it('should show warning modal when no preference is selected', async () => {
            const {getByText} = renderScreen();

            // Simulate button press
            fireEvent.press(getByText('Next'));

            // Verify that the warning modal is shown
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Please choose your Category Preference',
                });
            });
        });

        it('should add "barge" in renter preference when selected', async () => {
            const {getByText} = renderScreen();

            // Simulate preference selections
            fireEvent.press(getByText('Barge'));
            fireEvent.press(getByText('Next'));

            // Verify that the next screen is rendered
            expect(
                getByText(
                    'Choose Your Spesific Ship Rental Preferences ! (Barge)',
                ),
            ).toBeTruthy();

            // Verify that data in redux store is updated
            await waitFor(() => {
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: ['security', 'barge', ''],
                });
            });
        });

        it('should add "tugboat" in renter preference when selected', async () => {
            const {getByText} = renderScreen();

            // Simulate preference selections
            fireEvent.press(getByText('Tugboat'));
            fireEvent.press(getByText('Next'));

            // Verify that the next screen is rendered
            expect(
                getByText(
                    'Choose Your Spesific Ship Rental Preferences ! (Barge)',
                ),
            ).toBeTruthy();

            // Verify that data in redux store is updated
            await waitFor(() => {
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: ['security', 'tugboat', ''],
                });
            });
        });

        it('should add "tanker" in renter preference when selected', async () => {
            const {getByText} = renderScreen();

            // Simulate preference selections
            fireEvent.press(getByText('Ferry'));
            fireEvent.press(getByText('Next'));

            // Verify that the next screen is rendered
            expect(
                getByText(
                    'Choose Your Spesific Ship Rental Preferences ! (Barge)',
                ),
            ).toBeTruthy();

            // Verify that data in redux store is updated
            await waitFor(() => {
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: ['security', 'ferry', ''],
                });
            });
        });
    });

    describe('SpesificPreferences Component', () => {
        const RootStack =
            createNativeStackNavigator<RenterPreferenceParamList>();

        //membuat store dengan initial state renterPreference: ['security', 'barge'],
        beforeEach(() => {
            store = configureStore({
                reducer: {
                    modal: modalSlice.reducer,
                    renterPreference: renterPreferenceSlice.reducer,
                },
                preloadedState: {
                    renterPreference: {
                        renterPreference: ['security', 'barge'],
                    },
                },
            });
        });

        const renderScreen = () => {
            return render(
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        <NavigationContainer>
                            <RootStack.Navigator>
                                <RootStack.Screen
                                    name="Spesific"
                                    component={SpesificPreferences}
                                />
                            </RootStack.Navigator>
                        </NavigationContainer>
                        ,
                    </QueryClientProvider>
                </Provider>,
            );
        };

        const mockResponse = {
            status: 'success',
            data: {
                _id: '60f1b6c9e6b6f40015a1d1a5',
                renterPreference: ['security', 'certification and permits'],
            },
        };

        mock.onGet('/renter/get-renter-data').reply(200, mockResponse);

        it('renders correctly', async () => {
            const {getByText} = renderScreen();

            // Verify that important text elements are rendered
            expect(
                getByText(
                    'Choose Your Spesific Ship Rental Preferences ! (Barge)',
                ),
            ).toBeTruthy();
            expect(
                getByText(
                    'When selecting a barge, which feature is your main priority? (Choose 1)',
                ),
            ).toBeTruthy();
        });

        it('should show warning modal when no preference is selected', async () => {
            const {getByText} = renderScreen();

            // Simulate button press
            fireEvent.press(getByText('Confirm'));

            // Verify that the warning modal is shown
            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'Please choose your Spesific Preference',
                });
            });
        });

        it('should add "cargo capacity" in renter preference when selected', async () => {
            const {getByText} = renderScreen();

            // Simulate preference selections
            fireEvent.press(getByText('Cargo capacity'));
            fireEvent.press(getByText('Confirm'));

            // Verify that data in redux store is updated
            await waitFor(() => {
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: ['security', 'barge', 'cargo capacity'],
                });
            });
        });

        it('should add "loading-unloading capability" in renter preference when selected', async () => {
            // jest.useFakeTimers();
            const {getByText} = renderScreen();

            // Simulate preference selections
            fireEvent.press(getByText('Loading-unloading capability'));
            fireEvent.press(getByText('Confirm'));

            mock.onPost('/renter/submit-renter-preference').reply(200, {
                status: 'success',
                data: {
                    _id: '60f1b6c9e6b6f40015a1d1a5',
                    renterPreference: [
                        'security',
                        'barge',
                        'loading-unloading capability',
                    ],
                },
            });

            // Verify that data in redux store is updated
            await waitFor(() => {
                const state = store.getState().renterPreference;
                expect(state).toEqual({
                    renterPreference: [
                        'security',
                        'barge',
                        'loading-unloading capability',
                    ],
                });

                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'success',
                    text: 'Renter Preference Submitted!',
                });
            });
        });
    });
});
