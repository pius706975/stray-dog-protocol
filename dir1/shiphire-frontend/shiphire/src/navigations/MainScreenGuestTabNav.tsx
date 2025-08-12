import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainScreenAdminParamList } from '../types';
import { Pressable, View } from 'react-native';
import {
    HomeActiveIcon,
    HomeIcon,
    MainAccountIconActiveIcon,
    MainAccountIcon,
    Color,
} from '../configs';
import { CustomIconBottomNavbar, CustomLabelBottomNavbar } from './component';
import { GuestHome, GuestAccount } from '../screens';

const Tab = createBottomTabNavigator<MainScreenAdminParamList>();

const MainScreenGuestTabNav: React.FC = () => {
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
                        route.name === 'Home' || route.name === 'Account'
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
                component={GuestHome}
                options={{ unmountOnBlur: true }}
            />
            <Tab.Screen
                name="Account"
                component={GuestAccount}
                options={{ unmountOnBlur: true }}
            />
        </Tab.Navigator>
    );
};

export default MainScreenGuestTabNav;
