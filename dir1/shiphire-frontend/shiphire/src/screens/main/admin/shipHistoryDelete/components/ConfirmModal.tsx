import React from 'react';
import { Modal, View, Text } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';

const ConfirmModal = ({ isVisible, onConfirm, onCancel }) => {
    return (
        <Modal
            testID="confirm-modal"
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
                    <View style={{}}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="semiBold"
                            color="darkTextColor">
                            Are you sure want to approve delete this ship
                            history?
                        </CustomText>
                    </View>
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
                            testID="confirm-delete-button"
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
