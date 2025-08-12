import React from 'react';
import { Modal, View, Text } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';

const ConfirmModal = ({ isVisible, onConfirm, onCancel, testID }) => {
    return (
        <Modal
            testID={testID}
            visible={isVisible}
            transparent
            animationType="slide">
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
                        Are you sure you want to delete this ship history?
                    </CustomText>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 20,
                        }}>
                        <Button
                            testID="cancel-delete-ship-history"
                            title="Cancel"
                            color="primary"
                            onSubmit={onCancel}
                        />
                        <Button
                            testID="confirm-delete-ship-history"
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
