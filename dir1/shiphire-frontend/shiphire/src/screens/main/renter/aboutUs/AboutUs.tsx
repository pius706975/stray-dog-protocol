import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { ScreenLayout } from '../../../../components';
import { Color, FontFamily, FontSize } from '../../../../configs';
import { useTranslation } from 'react-i18next';

const AboutUs: React.FC = () => {
    const { t } = useTranslation('account');
    return (
        <ScreenLayout testId="AboutUs" padding={20} backgroundColor="light">
            <View
                style={{
                    alignItems: 'flex-start',
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.sm,
                    }}>
                    {t('AboutUs.textWelcome')}
                </Text>
            </View>

            <View
                style={{
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.xl,
                        color: Color.primaryColor,
                    }}>
                    {t('AboutUs.textTitleOurMission')}
                </Text>
                <View
                    style={{
                        alignItems: 'flex-start',
                    }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                        }}>
                        {t('AboutUs.textContentOurMission')}
                    </Text>
                </View>
            </View>

            <View
                style={{
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.xl,
                        color: Color.primaryColor,
                    }}>
                    {t('AboutUs.textTitleOurValues')}
                </Text>
                <View
                    style={{
                        alignItems: 'flex-start',
                    }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                        }}>
                        {t('AboutUs.textContentOurValues1')}
                    </Text>

                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                        }}>
                        {t('AboutUs.textContentOurValues2')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                        }}>
                        {t('AboutUs.textContentOurValues3')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                        }}>
                        {t('AboutUs.textContentOurValues4')}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.xl,
                        color: Color.primaryColor,
                    }}>
                    {t('AboutUs.textTitleGetInTouch')}
                </Text>
                <View
                    style={{
                        alignItems: 'flex-start',
                    }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                        }}>
                        {t('AboutUs.textContentGetInTouch')}
                        <Text
                            style={{
                                fontFamily: FontFamily.regular,
                                fontSize: FontSize.sm,
                                color: Color.primaryColor,
                            }}>
                            {' '}
                            support@shiphire.com.
                        </Text>
                    </Text>
                </View>
            </View>
            <View
                style={{
                    alignSelf: 'center',
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: Color.primaryColor,
                    }}>
                    {'\u00A9'}ShipHire 2023
                </Text>
            </View>
        </ScreenLayout>
    );
};

export default AboutUs;
