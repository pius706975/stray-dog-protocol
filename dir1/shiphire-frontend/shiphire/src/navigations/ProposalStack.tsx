import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RFQDocPreview, RequestForaQuote } from '../screens';
import { MainOwnerStackParamList, MainStackParamList, ProposalOwnerParamList, RequestForAQuoteParamList } from '../types';
import ProposalOwner from '../screens/main/shipowner/proposalOwner/ProposalOwner';
import { ProposalDocPreview } from '../screens/main/shipowner/proposalDocPreview';

const RootStack = createNativeStackNavigator<ProposalOwnerParamList>();

const RequestForQuoteStack: React.FC<{
    route: RouteProp<MainOwnerStackParamList, 'ProposalOwnerStack'>;
}> = ({ route }) => {
    const { categoryId, shipId, shipOwnerId, rentalId, renterId } = route.params;

    return (
        <RootStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <RootStack.Screen
                name="RFQData"
                component={ProposalOwner}
                initialParams={{ categoryId, shipId, shipOwnerId, rentalId, renterId }}
            />
            {/* <RootStack.Screen name="DocPreviewProposalOwner" component={ProposalDocPreview} /> */}
        </RootStack.Navigator>
    );
};

export default RequestForQuoteStack;
