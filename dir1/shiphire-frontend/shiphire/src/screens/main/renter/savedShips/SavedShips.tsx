import React from 'react';
import { Text } from 'react-native-ui-lib';
import { ScreenLayout } from '../../../../components';
import { useTranslation } from 'react-i18next';

const SavedShips: React.FC = () => {
    const { t } = useTranslation('account');
    return (
        <ScreenLayout
            flex
            center
            testId="SavedShipsScreen"
            backgroundColor="light">
            <Text>{t('SavedShips.textSavedShips')}</Text>
        </ScreenLayout>
    );
};

export default SavedShips;
