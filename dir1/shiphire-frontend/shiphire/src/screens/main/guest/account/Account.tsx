import React from 'react';
import { Platform } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import { Button, ScreenLayout } from '../../../../components';
import { Color, LanguageIcon } from '../../../../configs';
import { GuestAccountProps } from '../../../../types';
import { AccountMenuItem } from './components';

const Account: React.FC<GuestAccountProps> = ({ navigation }) => {
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const { t } = useTranslation('account');

    return (
        <ScreenLayout
            backgroundColor="light"
            testId="guestHomeScreen"
            paddingV={plusPaddingV}>
            <View
                style={{
                    margin: 6,
                    borderRadius: 8,
                    backgroundColor: Color.bgNeutralColor,
                }}>
                <AccountMenuItem
                    onClick={() => navigation.navigate('ChangeLanguage')}
                    label={t('labelChangeLanguage')}
                    Icon={LanguageIcon}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                }}>
                <View
                    style={{
                        marginTop: 350,
                        width: 150,
                    }}>
                    <Button
                        title={t('labelSignIn')}
                        onSubmit={() => {
                            navigation.navigate('SignIn');
                        }}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default Account;
