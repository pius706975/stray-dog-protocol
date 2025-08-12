import React from 'react';
import { Pressable } from 'react-native';
import { CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { View } from 'react-native-ui-lib';
import moment from 'moment';

const DocumentField = ({ label, navigateFunc, proposeDate, acceptDate }) => {
    proposeDate = moment(proposeDate).format('DD/MM/YYYY');
    acceptDate =
        acceptDate === 'Not Accepted Yet'
            ? acceptDate
            : moment(acceptDate).format('DD/MM/YYYY');

    return (
        <View marginT-16>
            <CustomText fontSize="xl" fontFamily="medium" color="darkTextColor">
                {label} Details
            </CustomText>

            <View row>
                <View>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {label} Proposed
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {label} Accepted
                    </CustomText>
                </View>
                <View>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        : {proposeDate}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        : {acceptDate}
                    </CustomText>
                </View>
            </View>

            <CustomText fontSize="md" fontFamily="medium" color="darkTextColor">
                {label} Document
            </CustomText>
            <Pressable
                testID={`${label}-document-preview`}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    borderColor: Color.neutralColor,
                    marginTop: 8,
                    alignContent: 'space-between',
                }}
                onPress={() => navigateFunc()}>
                <View
                    style={{
                        flex: 1,
                        alignContent: 'center',
                    }}>
                    <CustomText
                        fontSize="xs"
                        fontFamily="medium"
                        color="darkTextColor">
                        Transaction {label} Document
                    </CustomText>
                </View>
                <CustomText
                    textAlign="right"
                    fontSize="md"
                    fontFamily="bold"
                    color="darkTextColor">
                    {'>'}
                </CustomText>
            </Pressable>
        </View>
    );
};

export default DocumentField;
