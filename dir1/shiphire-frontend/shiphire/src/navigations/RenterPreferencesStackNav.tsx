import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Color, FontFamily } from '../configs';
import {
    CategoryPreferences,
    GeneralPreferences,
    SpesificPreferences,
} from '../screens';
import { RenterPreferenceParamList } from '../types';

const RootStack = createNativeStackNavigator<RenterPreferenceParamList>();

const RenterPreferencesStackNav: React.FC = () => {
    return (
        <RootStack.Navigator
            screenOptions={{
                headerTitle: 'Renter Preference',
                headerBackTitleVisible: false,
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: Color.primaryColor,
                headerTitleStyle: {
                    fontFamily: FontFamily.semiBold,
                },
            }}>
            <RootStack.Screen name="General" component={GeneralPreferences} />
            <RootStack.Screen name="Category" component={CategoryPreferences} />
            <RootStack.Screen name="Spesific" component={SpesificPreferences} />
        </RootStack.Navigator>
    );
};

export default RenterPreferencesStackNav;
