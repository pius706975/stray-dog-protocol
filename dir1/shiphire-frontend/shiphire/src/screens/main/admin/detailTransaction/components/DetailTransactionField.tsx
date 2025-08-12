import React from 'react';
import { View } from 'react-native';
import { CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';

const DetailTransactionField = ({ label, textData }) => {
    return (
        <React.Fragment>
            <CustomText fontSize="md" fontFamily="medium" color="darkTextColor">
                {label}:
            </CustomText>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    borderColor: Color.neutralColor,
                }}>
                <CustomText
                    fontSize="xs"
                    fontFamily="medium"
                    color="darkTextColor">
                    {textData}
                </CustomText>
            </View>
        </React.Fragment>
    );
};

export default DetailTransactionField;
