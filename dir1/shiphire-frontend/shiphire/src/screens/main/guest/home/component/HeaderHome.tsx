import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';

const HeaderHome = () => {
    const { t } = useTranslation('home');

    return (
        <View row spread centerV marginB-26 testID="headerHome">
            <CustomText fontFamily="bold" fontSize="xxl" color="primaryColor">
                {t('textGreet')}
                {t('textGuest')}
            </CustomText>
        </View>
    );
};

export default HeaderHome;
