import React from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-ui-lib';
import { Color } from '../../configs';
import { CustomIconBottomNavType, RootState } from '../../types';
import { useSelector } from 'react-redux';

const CustomIconBottomNavbar: React.FC<CustomIconBottomNavType> = ({
    source,
    route,
    focused,
}) => {
    const { totalNotif } = useSelector(
        (state: RootState) => state.notifBadgeSlice,
    );

    return (
        <View
            style={{
                justifyContent: 'center',
            }}>
            {source}
            {route.name === 'Notification' && totalNotif > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        right: -4,
                        top: -4,
                    }}>
                    <Badge
                        label={totalNotif.toString()}
                        size={14}
                        backgroundColor={Color.boldErrorColor}
                        containerStyle={{
                            marginTop: focused ? 0 : -10,
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default CustomIconBottomNavbar;
