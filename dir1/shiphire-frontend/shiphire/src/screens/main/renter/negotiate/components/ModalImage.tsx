import React from 'react';
import { Image, Modal, Text, View } from 'react-native-ui-lib';

import { Pressable, ScrollView } from 'react-native';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { CustomText } from '../../../../../components';
import { useTranslation } from 'react-i18next';

const ModalImage = ({ visible, onClose, selectedImage }) => {
    const image = selectedImage.selectedImage;
    const { t } = useTranslation('common');
    return (
        <Modal
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
                <ScrollView
                    style={{
                        backgroundColor: Color.softSecBgPrimary,
                        padding: 16,
                        borderRadius: 8,
                        width: '100%',
                    }}>
                    <View>
                        <CustomText
                            color="primaryColor"
                            fontFamily="bold"
                            fontSize="sm">
                            {t(
                                'FormNegotiateRenter.NegotiateForm.labelimageCaption',
                            )}
                        </CustomText>
                        <CustomText
                            color="darkTextColor"
                            fontFamily="regular"
                            fontSize="sm">
                            {selectedImage.imageNotes}
                        </CustomText>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default ModalImage;
