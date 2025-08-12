import React from 'react';
import { Modal, Text, View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';

import { Pressable } from 'react-native';
import { modalSlice } from '../../../../../slices';
import { Color, FontFamily, FontSize } from '../../../../../configs';

const ModalPdf = ({
    visible,
    onClose,
    selectedDocument,
    // setAdditionalDocList,
}) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const handleError = () => {
        dispatch(
            showModal({
                status: 'failed',
                text: 'Failed Open Document',
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 3000);
    };
    return (
        <Modal
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
                <View
                    style={{
                        backgroundColor: Color.bgColor,
                        padding: 16,
                        borderRadius: 8,
                        width: '100%',
                        height: '95%',
                    }}>
                    <PDFView
                        fadeInDuration={250.0}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            backgroundColor: Color.bgColor,
                        }}
                        resource={selectedDocument.uri}
                        resourceType={'url'}
                        onError={error => handleError()}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ModalPdf;
