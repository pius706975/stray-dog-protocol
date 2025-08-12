import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { FontFamily, FontSize } from '../../../../../configs';
import { Button } from '../../../../../components';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    testId?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    onConfirm,
    onCancel,
}) => {
    const { t } = useTranslation('saveship')
    return (
        <Modal
            testID="modalConfirm"
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
                    }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            marginBottom: 20,
                            textAlign: 'center',
                            color: 'red',
                        }}>
                       {t('ShipPictures.textModal')}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Button
                            title={t('ShipPictures.btnCancel')}
                            color="error"
                            onSubmit={onCancel}
                        />
                        <Button
                            testID="confirmButton"
                            title={t('ShipPictures.btnSubmit')}
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
