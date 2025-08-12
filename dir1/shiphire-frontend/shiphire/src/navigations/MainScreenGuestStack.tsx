import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Color, FontFamily } from '../configs';
import { MainGuestStackParamList } from '../types';
import { ChangeLanguage, Search } from '../screens';
import { useTranslation } from 'react-i18next';
import MainScreenGuestTabNav from './MainScreenGuestTabNav';

const MainGuestStack = createNativeStackNavigator<MainGuestStackParamList>();

const MainScreenGuestStack = () => {
    const { t } = useTranslation('common');

    const screens: {
        name: keyof MainGuestStackParamList;
        title: string;
        component: any;
        headerShown?: boolean;
    }[] = [
        {
            name: 'Search',
            title: t('MainScreenStack.titleSearch'),
            component: Search,
        },
        {
            name: 'ChangeLanguage',
            title: t('MainScreenStack.titleChangeLanguage'),
            component: ChangeLanguage,
        },
    ];

    return (
        <MainGuestStack.Navigator screenOptions={{ headerShown: false }}>
            <MainGuestStack.Screen
                name="GuestHome"
                component={MainScreenGuestTabNav}
            />
            {screens.map(screen => (
                <MainGuestStack.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        headerTitle: screen.title,
                        headerBackTitleVisible: false,
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerTintColor: Color.primaryColor,
                        headerTitleStyle: {
                            fontFamily: FontFamily.semiBold,
                        },
                    }}
                />
            ))}
        </MainGuestStack.Navigator>
    );
};

export default MainScreenGuestStack;
