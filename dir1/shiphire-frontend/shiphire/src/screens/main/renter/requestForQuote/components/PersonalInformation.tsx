import React from 'react';
import { View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { AccountIcon, Color } from '../../../../../configs';
import { PersonalInformationProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const PersonalInformation: React.FC<PersonalInformationProps> = ({
    handlePressEditProfile,
    renterAddress,
    renterCompany,
    renterName,
    renterPhone,
    renterEmail,
    renterCompanyType,
}) => {
    const { t } = useTranslation('rfq');
    return (
        <View
            padding-16
            backgroundColor={Color.bgNeutralColor}
            br20
            flex
            testID="personalComp">
            <View
                row
                flex
                paddingB-16
                centerV
                style={{
                    borderBottomWidth: 0.4,
                    gap: 16,
                }}>
                <AccountIcon />
                <CustomText
                    fontSize="xl"
                    fontFamily="bold"
                    color="primaryColor">
                    {t('PersonalInformation.textPersonalInformation')}
                </CustomText>
            </View>
            <View
                row
                style={{
                    borderBottomWidth: 0.4,
                }}>
                <View>
                    <CustomText
                        fontSize="lg"
                        fontFamily="semiBold"
                        color="primaryColor">
                        {t('PersonalInformation.textRenterName')}
                    </CustomText>
                    <CustomText
                        fontSize="lg"
                        fontFamily="semiBold"
                        color="primaryColor">
                        {t('PersonalInformation.textCompany')}
                    </CustomText>
                    <CustomText
                        fontSize="lg"
                        fontFamily="semiBold"
                        color="primaryColor">
                        {t('PersonalInformation.textAddress')}
                    </CustomText>
                    <CustomText
                        fontSize="lg"
                        fontFamily="semiBold"
                        color="primaryColor">
                        {t('PersonalInformation.textPhoneNumber')}
                    </CustomText>
                    <CustomText
                        fontSize="lg"
                        fontFamily="semiBold"
                        color="primaryColor">
                        Email
                    </CustomText>
                </View>
                <View paddingL-16 flex>
                    <View style={{ paddingVertical: 2 }}>
                        <CustomText
                            fontSize="md"
                            fontFamily="medium"
                            color="darkTextColor"
                            ellipsizeMode
                            numberOfLines={1}>
                            : {renterName}
                        </CustomText>
                    </View>

                    <View style={{ paddingBottom: 2 }}>
                        <CustomText
                            fontSize="md"
                            fontFamily="medium"
                            color="darkTextColor"
                            ellipsizeMode
                            numberOfLines={1}>
                            : {renterCompanyType}. {renterCompany}
                        </CustomText>
                    </View>
                    <View style={{ paddingBottom: 2 }}>
                        <CustomText
                            fontSize="md"
                            fontFamily="medium"
                            color="darkTextColor"
                            ellipsizeMode
                            numberOfLines={1}>
                            : {renterAddress}
                        </CustomText>
                    </View>
                    <View style={{ paddingBottom: 2 }}>
                        <CustomText
                            fontSize="md"
                            fontFamily="medium"
                            color="darkTextColor"
                            ellipsizeMode
                            numberOfLines={1}>
                            : {renterPhone}
                        </CustomText>
                    </View>
                    <View style={{ paddingBottom: 2 }}>
                        <CustomText
                            fontSize="md"
                            fontFamily="medium"
                            color="darkTextColor"
                            ellipsizeMode
                            numberOfLines={1}>
                            : {renterEmail}
                        </CustomText>
                    </View>
                </View>
            </View>
            {/* <View
                row
                paddingT-16
                style={{
                    justifyContent: 'flex-end',
                }}>
                <Button
                    testID='editBtn'
                    onSubmit={handlePressEditProfile}
                    color="warning"
                    title={t('PersonalInformation.labelButtonEditProfile')}
                />
            </View> */}
        </View>
    );
};

export default PersonalInformation;
