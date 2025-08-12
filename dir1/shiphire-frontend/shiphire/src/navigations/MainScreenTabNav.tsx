import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
    Color,
    HomeActiveIcon,
    HomeIcon,
    MainAccountIcon,
    MainAccountIconActiveIcon,
    NotifActiveIcon,
    NotifIcon,
} from '../configs';
import { RenterAccount, RenterHome, RenterNotification } from '../screens';
import { MainScreenParamList } from '../types';
import { CustomIconBottomNavbar, CustomLabelBottomNavbar } from './component';
import { RequestLocationPermission } from './component/RequestLocationPermission';

const Tab = createBottomTabNavigator<MainScreenParamList>();

const MainScreenTabNav: React.FC = () => {
    const { t } = useTranslation('common');
    const iconMapping: {
        [key: string]: {
            active: any;
            inactive: any;
        };
    } = {
        Home: {
            active: <HomeActiveIcon />,
            inactive: <HomeIcon />,
        },
        Notification: {
            active: <NotifActiveIcon />,
            inactive: <NotifIcon />,
        },
        Account: {
            active: <MainAccountIconActiveIcon />,
            inactive: <MainAccountIcon />,
        },
    };

    return (
        <>
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    const { active, inactive } = iconMapping[route.name] || {};

                    if (active && inactive) {
                        const source = focused ? active : inactive;

                        return (
                            <CustomIconBottomNavbar
                                source={source}
                                route={route}
                                focused={focused}
                            />
                        );
                    }

                    return null;
                },
                tabBarIconStyle: { maxWidth: 20 },
                tabBarLabel: ({ focused }) => (
                    <CustomLabelBottomNavbar route={route} focused={focused} />
                ),
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: Color.primaryColor,
                    display:
                        route.name === 'Home' ||
                        route.name === 'Notification' ||
                        route.name === 'Account'
                            ? 'flex'
                            : 'none',
                },
                tabBarButton: ({ onPress, children, accessibilityState }) => (
                    <Pressable
                        onPress={onPress}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: accessibilityState!!.selected
                                ? Color.softPrimaryColor
                                : Color.primaryColor,
                            borderRadius: 20,
                        }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {children}
                        </View>
                    </Pressable>
                ),
            })}>
            <Tab.Screen
                name="Home"
                component={RenterHome}
                options={{
                    unmountOnBlur: true,
                }}
            />
            <Tab.Screen name="Notification" component={RenterNotification} />
            <Tab.Screen
                name="Account"
                component={RenterAccount}
                options={{
                    unmountOnBlur: true,
                }}
            />
        </Tab.Navigator>
        <RequestLocationPermission />
        </>
    );
};

export default MainScreenTabNav;
