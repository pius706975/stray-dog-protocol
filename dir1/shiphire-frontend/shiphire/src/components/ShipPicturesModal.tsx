import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, View, Image } from 'react-native-ui-lib';
import { FlatList } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { Color } from '../configs';
import { Button, CustomText } from '../components';
import { ShipPicturesModalProps } from '../types';

const ShipPicturesModal: React.FC<ShipPicturesModalProps> = ({
    isVisible,
    shipPictures,
    onCloseModal,
    testID,
}) => {
    const { t } = useTranslation('shiptracking');

    const styles = StyleSheet.create({
        list: {
            paddingHorizontal: 10,
        },
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
            alignItems: 'center',
            width: '80%',
            maxHeight: '80%',
        },
        imageContainer: {
            paddingBottom: 5,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: Color.darkTextColor,
        },
        image: {
            width: '100%',
            maxHeight: 200,
            aspectRatio: 2,
            borderRadius: 10,
        },
        closeButtonContainer: {
            marginVertical: 10,
        },
    });

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item.documentUrl }}
                style={styles.image}
                resizeMode="contain"
            />
            <CustomText
                fontFamily="regular"
                fontSize="sm"
                textAlign="justify"
                color="darkTextColor">
                {item.description}
            </CustomText>
        </View>
    );

    return (
        <Modal
            testID={testID}
            visible={isVisible}
            onRequestClose={onCloseModal}
            transparent
            animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <CustomText
                            fontFamily="semiBold"
                            fontSize="sm"
                            textAlign="left"
                            color="primaryColor">
                            {t('ShipPicturesModal.textShipPictures')}
                        </CustomText>
                    </View>
                    {shipPictures.length > 0 ? (
                        <FlatList
                            data={shipPictures}
                            renderItem={renderItem}
                            keyExtractor={(_, index) => `${index}`}
                            contentContainerStyle={styles.list}
                        />
                    ) : (
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            textAlign="center"
                            color="darkTextColor">
                            {t('ShipPicturesModal.textNoPictures')}
                        </CustomText>
                    )}

                    <View style={styles.closeButtonContainer}>
                        <Button
                            title={t('ShipPicturesModal.textClose')}
                            color="error"
                            onSubmit={onCloseModal}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ShipPicturesModal;
