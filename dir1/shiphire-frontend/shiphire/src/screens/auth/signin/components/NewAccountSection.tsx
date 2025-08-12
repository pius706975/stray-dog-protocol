import React from 'react';
import { Pressable, View } from 'react-native';
import { CustomText } from '../../../../components';
import { Color } from '../../../../configs';
import { NewAccountSectionProps } from '../../../../types';
import { useTranslation } from 'react-i18next';

const NewAccountSection: React.FC<NewAccountSectionProps> = ({
    navigation,
}) => {
    const { t } = useTranslation('signin');
    return (
        <View
            style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <CustomText
                fontSize="sm"
                fontFamily="regular"
                color="darkTextColor">
                {t('NewAccountSection.textDontHaveAccount')}
            </CustomText>
            <Pressable
                testID="btnSignUp"
                onPress={() => {
                    navigation.navigate('SignUp');
                }}>
                <CustomText
                    fontFamily="regular"
                    fontSize="sm"
                    color="primaryColor"
                    borderBottomColor={Color.primaryColor}>
                    {t('NewAccountSection.textCreateOne')}
                </CustomText>
            </Pressable>
            <CustomText
                fontSize="sm"
                fontFamily="regular"
                color="darkTextColor">
                {t('NewAccountSection.textOr')}
            </CustomText>        
            <Pressable
                testID="btnSignUp"
                onPress={() => {
                    navigation.navigate('MainScreenGuestStack');
                }}>
                <CustomText
                    fontFamily="regular"
                    fontSize="sm"
                    color="primaryColor"
                    borderBottomColor={Color.primaryColor}>
                    {t('NewAccountSection.textContinueGuest')}
                </CustomText>
            </Pressable>
        </View>
    );
};

export default NewAccountSection;
