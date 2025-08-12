import React from 'react';
import moment from 'moment';
import { Text, View } from 'react-native-ui-lib';
import {
    CircleCheckIcon,
    Color,
    FontFamily,
    OnProressIcon,
} from '../../../../../configs';
import { CustomText } from '../../../../../components';
import StepIndicator from 'react-native-step-indicator';
import { TransactionProgresProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

const TransactionProgres: React.FC<TransactionProgresProps> = ({
    rentalId,
    status,
    statusDate,
    statusLength,
}) => {
    const { t } = useTranslation('common');
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 2,
        stepStrokeCurrentColor: Color.successColor,
        stepStrokeWidth: 1,
        stepStrokeFinishedColor: '#aaaaaa',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: '#aaaaaa',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: '#aaaaaa',
        stepIndicatorUnFinishedColor: '#aaaaaa',
        stepIndicatorCurrentColor:
            statusLength === 14 ? 'white' : Color.successColor,
        stepIndicatorLabelFontSize: 1,
        currentStepIndicatorLabelFontSize: 1,
        stepIndicatorLabelCurrentColor: Color.successColor,
        stepIndicatorLabelFinishedColor: Color.bgColor,
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: Color.darkTextColor,
        labelSize: 14,
        labelFontFamily: FontFamily.medium,
        currentStepLabelColor: Color.boldSuccessColor,
    };

    const customStyles2 = {
        stepStrokeCurrentColor: 'transparent',
        stepIndicatorUnFinishedColor: 'transparent',
        stepIndicatorCurrentColor: 'transparent',
        separatorStrokeWidth: 0,
        stepStrokeWidth: 0,
        labelColor: Color.neutralColor,
        labelSize: 14,
        labelFontFamily: FontFamily.regular,
        currentStepLabelColor: Color.neutralColor,
        stepIndicatorLabelCurrentColor: 'transparent',
        stepIndicatorLabelFinishedColor: 'transparent',
        stepIndicatorLabelUnFinishedColor: 'transparent',
    };

    const renderStepIndicator = (params: any) => {
        const { position, stepStatus } = params;
        if (position === 0 && stepStatus === 'current') {
            return statusLength === 14 ? (
                <CircleCheckIcon />
            ) : (
                <OnProressIcon />
            );
        }
        return (
            <Text
                style={{
                    color:
                        stepStatus === 'finished'
                            ? Color.lightTextColor
                            : stepStatus === 'unfinished'
                            ? '#aaaaaa'
                            : 'black',
                }}></Text>
        );
    };

    const times = statusDate.map(item => {
        return moment(item).format('DD MMM   HH:mm');
    });

    return (
        <ScrollView
            style={{
                height:
                    statusLength > 14
                        ? '100%'
                        : statusLength === 14
                        ? 1200
                        : statusLength === 12
                        ? 1000
                        : statusLength === 10
                        ? 800
                        : statusLength === 4
                        ? 400
                        : statusLength === 2
                        ? 200
                        : 600,
            }}>
            <View
                style={{
                    backgroundColor: Color.bgNeutralColor,
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    gap: 10,
                }}>
                <View row spread>
                    <CustomText
                        fontSize="sm"
                        fontFamily="medium"
                        color="neutralColor">
                        {t('TransactionProgress.textRentalID')}
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {rentalId}
                    </CustomText>
                </View>
                <View flex row spread>
                    <View
                        style={{
                            // position: 'absolute',
                            height: '100%',
                            width: '20%',
                            left: -40,
                        }}>
                        <StepIndicator
                            customStyles={customStyles2}
                            currentPosition={0}
                            labels={times ? times : ['']}
                            stepCount={statusLength ? statusLength : 1}
                            direction="vertical"
                        />
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: '100%',
                            width: '80%',
                            right: 0,
                        }}>
                        <StepIndicator
                            customStyles={{
                                labelAlign: 'flex-start',
                                ...customStyles,
                            }}
                            currentPosition={0}
                            labels={status ? status : ['']}
                            stepCount={statusLength ? statusLength : 1}
                            renderStepIndicator={renderStepIndicator}
                            direction="vertical"
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default TransactionProgres;
