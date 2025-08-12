import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RFQDocPreview, RequestForaQuote } from '../screens';
import { MainStackParamList, RequestForAQuoteParamList } from '../types';

const RootStack = createNativeStackNavigator<RequestForAQuoteParamList>();

const RequestForQuoteStack: React.FC<{
    route: RouteProp<MainStackParamList, 'RequestForAQuoteStack'>;
}> = ({ route }) => {
    const { categoryId, shipId, shipOwnerId, dynamicFormId } = route.params;

    return (
        <RootStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <RootStack.Screen
                name="ShipInformation"
                component={RequestForaQuote}
                initialParams={{
                    categoryId,
                    shipId,
                    shipOwnerId,
                    dynamicFormId,
                }}
            />
            <RootStack.Screen name="DocPreview" component={RFQDocPreview} />
        </RootStack.Navigator>
    );
};

export default RequestForQuoteStack;
