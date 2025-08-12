import React from 'react';
import { Modal, View, Text } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../../components';

const ConfirmModal = ({
    isVisible,
    onConfirm,
    onCancel,
    confirmationMessage,
}) => {
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
                            title="Cancel"
                            color="primary"
                            onSubmit={onCancel}
                        />
                        <Button
                            testID="btn-confirm"
                            title="Confirm"
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
