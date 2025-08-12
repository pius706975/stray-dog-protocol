import { CheckBox } from '@rneui/base';
import React from 'react';
import { Alert, Modal, Pressable, useWindowDimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CustomText } from '../../../../components';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    CloseIcon,
    Color,
} from '../../../../configs';
import { termsStatusSlice } from '../../../../slices';
import { RootState, TermsModalProps } from '../../../../types';
import { TermsText } from './';

const TermsModal: React.FC<TermsModalProps> = ({
    modalVisible,
    setModalVisible,
}) => {
    const { width, height } = useWindowDimensions();
    const dispatch = useDispatch();
    const { checkTermsStatus } = termsStatusSlice.actions;
    const { status } = useSelector((state: RootState) => state.termsStatus);

    return modalVisible ? (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: height,
                backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
                style={{
                    borderWidth: 1,
                }}>
                <View flex center paddingH-20 paddingV-140>
                    <View
                        centerV
                        padding-20
                        backgroundColor={Color.bgColor}
                        style={{
                            borderRadius: 14,
                            gap: 10,
                        }}>
                        <View
                            row
                            style={{
                                justifyContent: 'flex-end',
                            }}>
                            <Pressable
                                onPress={() => setModalVisible(!modalVisible)}>
                                <View
                                    center
                                    width={30}
                                    height={30}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: Color.darkTextColor,
                                        borderRadius: 8,
                                    }}>
                                    <CloseIcon />
                                </View>
                            </Pressable>
                        </View>
                        <View height={'60%'}>
                            <TermsText />
                        </View>
                        <View>
                            <CheckBox
                                checked={status}
                                checkedIcon={<CheckboxCheckedIcon />}
                                uncheckedIcon={<CheckboxIcon />}
                                onPress={() => dispatch(checkTermsStatus())}
                                testID="signUpCheckBox"
                                wrapperStyle={{
                                    gap: 12,
                                }}
                                containerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    backgroundColor: Color.bgColor,
                                }}
                                title={
                                    <CustomText
                                        fontFamily={'regular'}
                                        fontSize="xs"
                                        color="darkTextColor">
                                        I have read and agree to the Terms &
                                        Policies of ShipHire.
                                    </CustomText>
                                }
                            />
                        </View>
                        <View>
                            <Button
                                title="Selesai"
                                onSubmit={() => setModalVisible(!modalVisible)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    ) : (
        <></>
    );
};

export default TermsModal;
