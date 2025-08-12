import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import { Text } from 'react-native-ui-lib';
import { CircleCheckIcon, Color, FontFamily, OnProressIcon } from '../../../../../configs';
import { WizardProps } from '../../../../../types';

const Wizard: React.FC<WizardProps> = ({ label, complete = true }) => {
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 5,
        stepStrokeCurrentColor: Color.successColor,
        stepStrokeWidth: 1,
        stepStrokeFinishedColor: '#aaaaaa',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: '#aaaaaa',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: '#aaaaaa',
        stepIndicatorUnFinishedColor: '#aaaaaa',
        stepIndicatorCurrentColor: complete ? "white" : Color.successColor,
        stepIndicatorLabelFontSize: 1,
        currentStepIndicatorLabelFontSize: 1,
        stepIndicatorLabelCurrentColor: Color.successColor,
        stepIndicatorLabelFinishedColor: Color.bgColor,
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: Color.darkTextColor,
        labelSize: 16,
        labelFontFamily: FontFamily.semiBold,
        currentStepLabelColor: Color.boldSuccessColor,
    };

    const renderStepIndicator = (params: any) => {
        const { position, stepStatus } = params;
        if (position === currentPosition && stepStatus === 'current') {
            return complete ? <CircleCheckIcon /> : <OnProressIcon />;
        }
        return <Text style={{
            color: stepStatus === 'finished' ? Color.lightTextColor : stepStatus === 'unfinished' ? "#aaaaaa" : "black"
        }}>
        </Text>
    };

    const labels = [". . .", ". . .", label]

    const currentPosition = 2

    return (
        <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            labels={labels}
            stepCount={3}
            renderStepIndicator={renderStepIndicator}
        />
    );
};


export default Wizard;
