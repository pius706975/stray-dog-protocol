import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { FontFamily, FontSize } from '../../../../../configs';
import { Button } from '../../../../../components';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    onConfirm,
    onCancel,
}) => {
    const { t } = useTranslation('common');
    return (
        <Modal
            visible={isVisible}
            onRequestClose={onCancel}
            transparent
            animationType="fade">
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
                            fontSize: FontSize.lg,
                            marginBottom: 20,
                            textAlign: 'center',
                        }}>
                        {t(
                            'FormNegotiateRenter.NegotiateForm.textConfirmation',
                        )}
                    </Text>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.xs,
                            marginBottom: 8,
                            textAlign: 'center',
                            color: 'red',
                        }}>
                        {t('FormNegotiateRenter.NegotiateForm.textConfirmDesc')}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Button
                            title={t(
                                'FormNegotiateRenter.NegotiateForm.textCancel',
                            )}
                            color="error"
                            onSubmit={onCancel}
                        />
                        <Button
                            title={t(
                                'FormNegotiateRenter.NegotiateForm.btnComplete',
                            )}
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
