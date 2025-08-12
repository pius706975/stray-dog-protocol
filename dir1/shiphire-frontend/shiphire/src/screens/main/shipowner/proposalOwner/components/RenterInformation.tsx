import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { AccountIcon, Color, FontFamily, FontSize } from '../../../../../configs';
import { Pressable } from 'react-native';
import { PersonalInformationProps, RenterInformationProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const RenterInformation: React.FC<RenterInformationProps> = ({
    renterName,
    renterCompany,
    renterAddress
}) => {
    const { t } = useTranslation('common')
    return (
        <View
            style={{
                backgroundColor: Color.bgNeutralColor,
                borderRadius: 6,
                padding: 16,
            }}>
            <View
                row
                style={{
                    borderBottomWidth: 0.4,
                    paddingBottom: 16,
                    gap: 16,
                    alignItems: 'center',
                }}>
                <AccountIcon />
                <Text
                    style={{
                        fontSize: FontSize.xl,
                        fontFamily: FontFamily.bold,
                        color: Color.primaryColor,
                    }}>
                    {t('RenterInformation.textRenterInformation')}
                </Text>
            </View>
            <View
                style={{
                    borderBottomWidth: 0.4,
                    paddingVertical: 6,
                    flexDirection: 'column',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.semiBold,
                            color: Color.primaryColor,
                        }}>
                        {t('RenterInformation.textRenterName')}
                    </Text>
                    <View
                        style={{
                            paddingLeft: 24,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.lg,
                                fontFamily: FontFamily.semiBold,
                                color: Color.primaryColor,
                            }}>
                            :
                        </Text>
                    </View>
                    <View
                        style={{
                            paddingLeft: 5,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.md,
                                fontFamily: FontFamily.medium,
                                color: Color.darkTextColor,
                            }}>
                            {renterName}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.semiBold,
                            color: Color.primaryColor,
                        }}>
                         {t('RenterInformation.textCompany')}
                    </Text>
                    <View
                        style={{
                            paddingLeft: 54,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.lg,
                                fontFamily: FontFamily.semiBold,
                                color: Color.primaryColor,
                            }}>
                            :
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: FontSize.md,
                            fontFamily: FontFamily.medium,
                            color: Color.darkTextColor,
                        }}>
                        {' '}
                        {renterCompany}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.semiBold,
                            color: Color.primaryColor,
                        }}>
                         {t('RenterInformation.textCompanyAddress')}
                    </Text>
                    <View
                        style={{
                            paddingLeft: 8,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.lg,
                                fontFamily: FontFamily.semiBold,
                                color: Color.primaryColor,
                            }}>
                            :
                        </Text>
                    </View>
                    <View   
                        style={{
                            paddingLeft: 5,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.md,
                                fontFamily: FontFamily.medium,
                                color: Color.darkTextColor,
                            }}>
                            {renterAddress}
                        </Text>
                    </View>
                </View>

            </View>
        </View>
    );
};

export default RenterInformation;
