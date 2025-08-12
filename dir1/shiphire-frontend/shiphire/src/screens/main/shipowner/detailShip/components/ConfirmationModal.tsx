import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { FontFamily, FontSize } from '../../../../../configs';
import { Button, CustomText } from '../../../../../components';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
    testID?: string;
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    onConfirm,
    onCancel,
    testID,
}) => {
    const { t } = useTranslation('detailship')
    return (
        <Modal
            testID={testID}
            visible={isVisible}
            onRequestClose={onCancel}
            transparent
            animationType="slide">
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        alignContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            marginBottom: 20,
                            textAlign: 'center',
                            color: 'red',
                        }}>
                        {t('ShipOwner.textParagraphDelete')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: FontFamily.semiBold,
                            fontSize: FontSize.md,
                            marginBottom: 20,
                            textAlign: 'center',
                            color: 'black',
                        }}>
                        {t('ShipOwner.textAreYouSure')}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Button
                            title={t('ShipOwner.textCancel')}
                            color="error"
                            onSubmit={onCancel}
                        />
                        <Button
                            title={t('ShipOwner.btnConfirm')}
                            color="primary"
                            onSubmit={onConfirm}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmationModal;
