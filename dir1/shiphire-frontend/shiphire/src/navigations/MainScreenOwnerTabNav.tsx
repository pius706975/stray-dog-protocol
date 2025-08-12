import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
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
    ShipMainActiveIcon,
    ShipMainIcon,
} from '../configs';
import {
    Account,
    OwnerNotification,
    ShipOwnerHome,
    Ships,
    proposalOwner,
} from '../screens';
import { MainScreenOwnerParamList } from '../types';
import { CustomIconBottomNavbar, CustomLabelBottomNavbar } from './component';
import ProposalOwner from '../screens/main/shipowner/proposalOwner/ProposalOwner';

const Tab = createBottomTabNavigator<MainScreenOwnerParamList>();

const MainScreenOwnerTabNav: React.FC = () => {
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
        Ships: {
            active: <ShipMainActiveIcon />,
            inactive: <ShipMainIcon />,
        },
        // Notification: {
        //     active: <NotifActiveIcon />,
        //     inactive: <NotifIcon />,
        // },
        Account: {
            active: <MainAccountIconActiveIcon />,
            inactive: <MainAccountIcon />,
        },
    };

    return (
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
                        route.name === 'Ships' ||
                        // route.name === 'Notification' ||
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
                component={ShipOwnerHome}
                options={{ unmountOnBlur: true }}
            />
            <Tab.Screen
                name="Ships"
                component={Ships}
                options={{ unmountOnBlur: true }}
            />
            {/* <Tab.Screen name="Notification" component={OwnerNotification} /> */}
            <Tab.Screen
                name="Account"
                component={Account}
                options={{ unmountOnBlur: true }}
            />
        </Tab.Navigator>
    );
};

export default MainScreenOwnerTabNav;
