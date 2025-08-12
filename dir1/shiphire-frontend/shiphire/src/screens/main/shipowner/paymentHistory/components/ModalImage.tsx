import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Image, Modal } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize } from '../../../../../configs';

const ModalImage = ({ visible, onClose, selectedImage }) => {
    const image = selectedImage.selectedImage;
    return (
        <Modal
            testID="modalImage"
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View
                style={{
                    flex: 1,
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
                        padding: 16,
                        borderRadius: 8,
                        width: '100%',
                        height: '70%',
                    }}>
                    <Image
                        source={{
                            uri:
                                image?.path ||
                                'https://picsum.photos/id/237/200/300',
                        }}
                        style={{ flex: 1 }}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ModalImage;
