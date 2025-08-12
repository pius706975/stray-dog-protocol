import React from 'react';
import { Text } from 'react-native-ui-lib';
import { ScreenLayout } from '../../../../components';
import { ContractDetailProps } from '../../../../types';

const ContractDetail: React.FC<ContractDetailProps> = ({ navigation }) => {
    return (
        <ScreenLayout
            backgroundColor="light"
            testId="ContractDetailScreen"
            flex
            center>
            <Text>There is no Contract</Text>
        </ScreenLayout>
    );
};

export default ContractDetail;
