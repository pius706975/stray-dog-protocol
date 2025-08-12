import React from 'react';
import { ModalConfirmationCompanyProps } from '../../../../../types';
import { Modal, Text, View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { CustomText } from '../../../../../components';
import CustomButton from '../../../../../components/Button';
import { Pressable } from 'react-native';

const ModalConfirmation: React.FC<ModalConfirmationCompanyProps> = ({
    visible,
    onClose,
    onSubmit,
    isSubmittingApprove,
    isSubmittingReject,
}) => {
    return (
        <Modal
            testID="modalConfirmation"
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View
                flex-1
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                <View style={{ alignSelf: 'flex-end', marginRight: 30 }}>
                    <Pressable
                        onPress={onClose}
                        style={{
                            width: 28,
                            height: 28,
                            backgroundColor: 'white',
                            borderRadius: 50,
                            alignItems: 'center',
                            marginBottom: 8,
                        }}>
                        <Text
                            style={{
                                marginHorizontal: 4,
                                fontFamily: FontFamily.medium,
                                fontSize: FontSize.md,

                                color: Color.darkTextColor,
                            }}>
                            X
                        </Text>
                    </Pressable>
                </View>
                <View
                    style={{
                        backgroundColor: Color.bgColor,
                        padding: 16,
                        borderRadius: 8,
                        width: '83%',
                    }}>
                    <CustomText
                        fontSize="md"
                        textAlign="center"
                        fontFamily="regular"
                        color="darkTextColor">
                        You cant revert this action, once it's updated
                    </CustomText>
                    <View
                        marginT-20
                        row
                        style={{
                            justifyContent: 'space-evenly',
                            alignContent: 'center',
                            height: 40,
                        }}>
                        <CustomButton
                            testID="rejectBtn"
                            title={'Reject'}
                            onSubmit={() => onSubmit(true, false)}
                            color="error"
                            isSubmitting={isSubmittingReject}
                            disable={
                                isSubmittingApprove || isSubmittingReject
                                    ? true
                                    : false
                            }
                        />
                        <CustomButton
                            testID="approveBtn"
                            title={'Approve'}
                            onSubmit={() => onSubmit(false, true)}
                            isSubmitting={isSubmittingApprove}
                            disable={
                                isSubmittingApprove || isSubmittingReject
                                    ? true
                                    : false
                            }
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalConfirmation;
