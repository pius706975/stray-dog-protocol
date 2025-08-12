import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, View, Text } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import { FontFamily, FontSize, Color } from '../../../../../configs';
import { Button } from '../../../../../components';
import { ConfirmationModalProps } from '../../../../../types';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    onConfirm,
    onCancel,
    testID,
    textBody,
    textCancelButton,
    textConfirmButton,
}) => {
    const { t } = useTranslation('account');

    return (
        <Modal
            testID={testID}
            visible={isVisible}
            onRequestClose={onCancel}
            transparent
            animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>
                        {textBody ||
                            t('AccountVerification.textContactAdminConfirm')}
                    </Text>
                    <View style={styles.buttonsContainer}>
                        <Button
                            title={
                                textCancelButton ||
                                t('AccountVerification.textCancel')
                            }
                            color="error"
                            onSubmit={onCancel}
                        />
                        <Button
                            title={
                                textConfirmButton ||
                                t('AccountVerification.textSend')
                            }
                            color="primary"
                            onSubmit={onConfirm}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    headerText: {
        fontFamily: FontFamily.semiBold,
        fontSize: FontSize.sm,
        marginBottom: 20,
        textAlign: 'center',
        color: Color.darkTextColor,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ConfirmationModal;
