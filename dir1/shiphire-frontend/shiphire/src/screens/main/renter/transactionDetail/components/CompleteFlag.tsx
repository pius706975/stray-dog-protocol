import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { Color, RFQDoneIcon } from '../../../../../configs';
import { CompleteFlagProps } from '../../../../../types';

const CompleteFlag: React.FC<CompleteFlagProps> = ({ visible }) => {
    const { width } = useWindowDimensions();
    const { t } = useTranslation('transactiondetail');
    return visible ? (
        <View flex backgroundColor={Color.successColor} padding-30 br20>
            <View flex row spread centerV>
                <View
                    style={{
                        width: width / 1.6,
                    }}>
                    <CustomText
                        fontSize="lg"
                        fontFamily="bold"
                        color="primaryColor">
                        {t('CompleteFlag.textTransactionDone')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="medium"
                        color="lightTextColor">
                        {t('CompleteFlag.textTransactionHistory')}
                    </CustomText>
                    <Pressable
                        style={{
                            borderBottomWidth: 2,
                            borderBottomColor: Color.softPrimaryColor,
                            width: 40,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <CustomText
                            fontSize="sm"
                            fontFamily="medium"
                            color="softSecColor">
                            {t('CompleteFlag.textHere')}
                        </CustomText>
                    </Pressable>
                </View>
                <RFQDoneIcon />
            </View>
        </View>
    ) : (
        <></>
    );
};

export default CompleteFlag;
