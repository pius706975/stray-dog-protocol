import React from 'react';
import { View, Text, Image } from 'react-native-ui-lib';
import { SeeShipPicturesProps } from '../../../../types';
import { ScreenLayout, TextInput } from '../../../../components';
import { FontFamily, FontSize } from '../../../../configs';
import { useTranslation } from 'react-i18next';

const SeeShipPictures: React.FC<SeeShipPicturesProps> = ({
    navigation,
    route,
}) => {
    const {
        transactionId,
        sailingStatus,
        beforeSailingPictures,
        afterSailingPictures,
    } = route.params;
    const { t } = useTranslation('saveship');
    console.log('SeeShipPictures', JSON.stringify(route.params, null, 2));
    return (
        <ScreenLayout
            testId="ShipOwnerSeeShipPicturesScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <View
                style={{
                    padding: 10,
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                    }}>
                    {t('SeeShipPictures.PicturesHaveBeenSubmit')}
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            marginBottom: 10,
                            textAlign: 'center',
                        }}>
                        {t('SeeShipPictures.textBefore')}
                    </Text>
                    {beforeSailingPictures &&
                        beforeSailingPictures.map((image, index) => (
                            <View key={index}>
                                <Image
                                    source={{ uri: image.documentUrl }}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: 100 / 2,
                                        marginBottom: 10,
                                        alignSelf: 'center',
                                    }}
                                />
                                {beforeSailingPictures &&
                                    beforeSailingPictures[index] && (
                                        <TextInput
                                            placeholder="Description"
                                            value={
                                                beforeSailingPictures[index]
                                                    .description
                                            }
                                            editable={false}
                                        />
                                    )}
                            </View>
                        ))}
                </View>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            marginBottom: 10,
                            textAlign: 'center',
                        }}>
                        {t('SeeShipPictures.textAfter')}
                    </Text>
                    {afterSailingPictures &&
                        afterSailingPictures.map((image, index) => (
                            <View key={index}>
                                <Image
                                    source={{ uri: image.documentUrl }}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: 100 / 2,
                                        marginBottom: 10,
                                        alignSelf: 'center',
                                    }}
                                />
                                {beforeSailingPictures &&
                                    beforeSailingPictures[index] && (
                                        <TextInput
                                            placeholder="Description"
                                            value={
                                                beforeSailingPictures[index]
                                                    .description
                                            }
                                            editable={false}
                                        />
                                    )}
                            </View>
                        ))}
                </View>
            </View>
        </ScreenLayout>
    );
};

export default SeeShipPictures;
