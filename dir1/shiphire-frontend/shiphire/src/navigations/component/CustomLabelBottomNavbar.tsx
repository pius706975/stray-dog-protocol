import React from 'react';
import { Color, FontFamily, FontSize } from '../../configs';
import { Text } from 'react-native';
import { CustomLabelBottomNavType } from '../../types';
import { useTranslation } from 'react-i18next';

const CustomLabelBottomNavbar: React.FC<CustomLabelBottomNavType> = ({
    focused,
    route,
}) => {
    const { t } = useTranslation('common');
    return (
        <Text
            style={{
                display: focused ? 'flex' : 'none',
                fontSize: FontSize.xs,
                fontFamily: FontFamily.regular,
                color: Color.secColor,
            }}>
            {focused
                ? route.name === 'Home'
                    ? t('MainScreenTabNav.titleHome')
                    : route.name === 'Notification'
                    ? t('MainScreenTabNav.titleNotification')
                    : route.name === 'Account'
                    ? t('MainScreenTabNav.titleAccount')
                    : t('MainScreenOwnerTabNav.titleShips')
                : null}
        </Text>
    );
};

export default CustomLabelBottomNavbar;
