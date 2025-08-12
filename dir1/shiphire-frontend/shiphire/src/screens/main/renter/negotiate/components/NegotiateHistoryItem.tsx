import React from 'react';
import { View } from 'react-native-ui-lib';
import { Color } from '../../../../../configs';
import { CustomText } from '../../../../../components';
import { Pressable } from 'react-native';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import ModalPdf from './ModalPdf';
import ModalImage from './ModalImage';
import { AdditionalDocument, AdditionalImage } from '../../../../../types';

const NegotiateHistoryItem = ({ negotiateData, index, transaction }) => {
    const { t } = useTranslation('common');
    const { item } = negotiateData;
    const userTimeZone = moment.tz.guess();
    const [isReadMore, setReadMore] = React.useState(false);
    const toggleReadMore = () => {
        setReadMore(!isReadMore);
    };
    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });
    const [selectedImage, setSelectedImage] = React.useState<AdditionalImage>({
        id: 0,
        selectedImage: { path: '' },
        imageNotes: '',
    });
    const [price, setPrice] = React.useState<number | undefined>(
        transaction?.offeredPrice,
    );
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };

    const [visibleImage, setVisibleImage] = React.useState<boolean>(false);
    const handleShowModalImage = () => {
        setVisibleImage(!visibleImage);
    };

    const status = transaction?.status.filter(
        items => items.name === 'proposal 1' || items.name === 'proposal 2',
    );
    const text = item.notes;

    const displayText = isReadMore ? text : text.slice(0, 80);
    let userName = '';
    if (item.proposalUrl) {
        userName = transaction.ship.shipOwnerId.name;
    } else {
        userName = transaction.renterId.name;
    }
    return (
        <View
            testID={`negotiateHistoryItem-${index}`}
            key={index}
            marginT-10
            padding-10
            style={{ backgroundColor: Color.bgInfoColor, borderRadius: 5 }}>
            <View row style={{ justifyContent: 'space-between' }}>
                <CustomText
                    fontFamily="bold"
                    fontSize="md"
                    color="primaryColor">
                    {userName}
                </CustomText>
                {status && (
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {moment(status[index].date)
                            .tz(userTimeZone)
                            .format('HH:mm')}
                    </CustomText>
                )}
            </View>

            <CustomText
                fontFamily="regular"
                fontSize="sm"
                color="darkTextColor">
                {displayText}
            </CustomText>
            {text.length > 80 && (
                <Pressable
                    onPress={() => toggleReadMore()}
                    testID="pressReadMore">
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="primaryColor">
                        {isReadMore
                            ? t(
                                  'FormNegotiateRenter.NegotiateHistory.textReadLess',
                              )
                            : t(
                                  'FormNegotiateRenter.NegotiateHistory.textReadMore',
                              )}
                    </CustomText>
                </Pressable>
            )}
            {item.offeredPrice && (
                <View>
                    <CustomText
                        fontFamily="bold"
                        fontSize="sm"
                        color="darkTextColor">
                        {t(
                            'FormNegotiateRenter.NegotiateHistory.textOfferPrice',
                        )}
                    </CustomText>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {item.offeredPrice}
                    </CustomText>
                </View>
            )}
            {item.additionalImage.length > 0 && (
                <View testID={`modalImage-${index}`}>
                    <CustomText
                        fontFamily="bold"
                        fontSize="sm"
                        color="darkTextColor">
                        {t(
                            'FormNegotiateRenter.NegotiateHistory.textAttachment',
                        )}
                    </CustomText>
                    <View row style={{ flexWrap: 'wrap', flex: 1 }}>
                        {item.additionalImage.map((image, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    handleShowModalImage();
                                    setSelectedImage({
                                        id: item._id,
                                        selectedImage: {
                                            path: image.imageUrl,
                                        },
                                        imageNotes: image.imageDescription,
                                    });
                                }}
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: Color.primaryColor,
                                    padding: 5,
                                    paddingHorizontal: 8,
                                    borderRadius: 5,
                                    marginTop: 5,
                                    marginRight: 5,
                                }}>
                                <CustomText
                                    fontFamily="regular"
                                    fontSize="sm"
                                    color="lightTextColor">
                                    {`${t(
                                        'FormNegotiateRenter.NegotiateHistory.textImage',
                                    )} ${index + 1}`}
                                </CustomText>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            {item.proposalUrl && (
                <View marginT-5 testID={`modalPdf-${index}`}>
                    <CustomText
                        fontFamily="bold"
                        fontSize="sm"
                        color="darkTextColor">
                        {t(
                            'FormNegotiateRenter.NegotiateHistory.textDraftContract',
                        )}
                    </CustomText>
                    <View row style={{ flexWrap: 'wrap', flex: 1 }}>
                        <Pressable
                            onPress={() => {
                                handleShowModalPdf();
                                setSelectedDocument({
                                    id: item._id,
                                    name: item.proposalName,
                                    uri: item.proposalUrl,
                                    type: 'application/pdf',
                                });
                            }}
                            style={{
                                flexDirection: 'row',
                                backgroundColor: Color.primaryColor,
                                padding: 5,
                                paddingHorizontal: 8,
                                borderRadius: 5,
                                marginTop: 5,
                                marginRight: 5,
                            }}>
                            <CustomText
                                fontFamily="regular"
                                fontSize="sm"
                                color="lightTextColor">
                                {t(
                                    'FormNegotiateRenter.NegotiateHistory.textDraftContract',
                                )}
                            </CustomText>
                        </Pressable>
                    </View>
                </View>
            )}
            <ModalPdf
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedDocument={selectedDocument}
            />
            <ModalImage
                visible={visibleImage}
                onClose={handleShowModalImage}
                selectedImage={selectedImage}
            />
        </View>
    );
};
export default NegotiateHistoryItem;
