import React from 'react';
import { Modal, View, Text } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../../components';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({
    isVisible,
    onConfirm,
    onCancel,
    confirmationMessage,
}) => {
    const { t } = useTranslation('rfq');
    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        elevation: 4,
                    }}>
                    <CustomText
                        fontSize="xs"
                        fontFamily="semiBold"
                        color="darkTextColor">
                        {confirmationMessage}
                    </CustomText>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 20,
                        }}>
                        <Button
                            title={t('RFQFormInputView.buttonModalCancel')}
                            color="primary"
                            onSubmit={onCancel}
                        />
                        <Button
                            title={t('RFQFormInputView.buttonModalConfirm')}
                            color="error"
                            onSubmit={onConfirm}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmModal;
