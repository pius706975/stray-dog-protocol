import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { ScreenLayout } from '../../../../components';
import { ShipAvailabilityProps } from '../../../../types';
import { CalendarAvailability } from './components/CalendarAvailability';

const ShipAvailability: React.FC<ShipAvailabilityProps> = ({ route }) => {
    const { shipId, shipHistory } = route.params;
    return (
        <ScreenLayout testId="ShipAvailabilityScreen" backgroundColor="light">
            <View
                style={{
                    alignItems: 'center',
                }}>
                <CalendarAvailability shipHistory={shipHistory} />
            </View>
        </ScreenLayout>
    );
};

export default ShipAvailability;
