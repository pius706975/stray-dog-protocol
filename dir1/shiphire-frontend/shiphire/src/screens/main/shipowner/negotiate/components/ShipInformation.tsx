import React from 'react';
import { ShipInformationNegoProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize, ShipIcon } from '../../../../../configs';
import { FlatList } from 'react-native';
import ShipDocumentList from './ShipDocumentList';
import ModalPdf from './ModalPdf';

type AdditionalDocument = {
    id: number;
    name: string;
    uri: string;
    type: string;
};

type LatestContract = {
    proposalId: {
        _id: string;
        otherDoc: {
            documentName: string;
            documentUrl: string;
            _id: string;
        }[];
    };
    _id: string;
    proposalUrl: string;
    notes: string;
    proposalName: string;
};

const ShipInformation: React.FC<ShipInformationNegoProps> = ({
    draftContract,
    shipImageUrl,
    shipName,
    shipSize,
    shipDocument,
}) => {
    const { t } = useTranslation('common');
    const formattedhipSize = `${shipSize.length} x ${shipSize.width} x ${shipSize.height} meter`;
    const [latestContract, setLatestContract] =
        React.useState<LatestContract>();
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };

    React.useEffect(() => {
        const urlObjects = draftContract.filter(item => item.proposalUrl);

        // Find the one with the highest index (assuming higher index means the latest)
        const latestUrlObject = urlObjects.reduce(
            (prev: any, current) =>
                draftContract.indexOf(prev) > draftContract.indexOf(current)
                    ? prev
                    : current,
            {},
        );
        setLatestContract(latestUrlObject);
    }, []);

    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });

    const handleDocumentPress = item => {
        setSelectedDocument({
            id: item._id,
            name: item.documentName,
            uri: item.documentUrl,
            type: 'application/pdf',
        });
        handleShowModalPdf();
    };
    const handleContractPress = (draftContract: LatestContract) => {
        setSelectedDocument({
            id: 1,
            name: draftContract.proposalName,
            uri: draftContract.proposalUrl,
            type: 'application/pdf',
        });
        handleShowModalPdf();
    };
    const convertCamelCase = (input: string): string => {
        const lastWord = input.split(' ').pop() || '';

        const converted = lastWord
            .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
            .toLowerCase();

        // Capitalize each word
        const capitalized = converted
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return capitalized;
    };
    return (
        <View>
            <View
                testID="documentButton"
                marginB-20
                style={{
                    borderRadius: 6,
                }}>
                {latestContract && (
                    <ShipDocumentList
                        pdfUrl={latestContract?.proposalUrl}
                        label={t(
                            'FormNegotiateOwner.NegotiateForm.textLabelContract',
                        )}
                        documentName={latestContract?.proposalName}
                        handlePress={() => handleContractPress(latestContract)}
                    />
                )}
            </View>
            <View
                style={{
                    backgroundColor: Color.primaryColor,
                    borderRadius: 6,
                    padding: 16,
                }}>
                <View
                    row
                    style={{
                        borderBottomWidth: 0.4,
                        borderColor: Color.softGreyBgPrimary,
                        paddingBottom: 16,
                        gap: 16,
                        alignItems: 'center',
                    }}>
                    <ShipIcon />
                    <Text
                        style={{
                            fontSize: FontSize.xl,
                            fontFamily: FontFamily.bold,
                            color: Color.lightTextColor,
                        }}>
                        {t('ShipInformation.textShipInformation')}
                    </Text>
                </View>

                <View
                    row
                    style={{
                        alignItems: 'flex-start',
                        gap: 16,
                        paddingVertical: 10,
                        borderBottomWidth: 0.5,
                        borderColor: Color.softGreyBgPrimary,
                    }}>
                    {shipImageUrl ? (
                        <Image
                            source={{ uri: `${shipImageUrl}` }}
                            style={{
                                height: 80,
                                width: 100,
                            }}
                        />
                    ) : null}
                    <View flex>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                fontSize: FontSize.lg,
                                fontFamily: FontFamily.medium,
                                color: Color.lightTextColor,
                            }}>
                            {shipName}
                        </Text>

                        <View
                            marginT-4
                            row
                            style={{
                                gap: 8,
                            }}>
                            <Text
                                style={{
                                    fontSize: FontSize.sm,
                                    fontFamily: FontFamily.regular,
                                    color: Color.secColor,
                                }}>
                                {t('ShipInformation.textSize')}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FontSize.sm,
                                    fontFamily: FontFamily.regular,
                                    color: Color.secColor,
                                }}>
                                {formattedhipSize}
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    testID="flatlistShipDocument"
                    marginT-10
                    style={{
                        borderBottomWidth: 0.5,
                        borderColor: Color.softGreyBgPrimary,
                    }}>
                    <Text
                        marginB-10
                        style={{
                            fontFamily: FontFamily.medium,
                            fontSize: FontSize.xl,
                            color: Color.lightTextColor,
                            paddingRight: 10,
                        }}>
                        {t(
                            'FormNegotiateRenter.NegotiateDocument.textShipDocument',
                        )}
                    </Text>
                    <FlatList
                        data={shipDocument}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const documentName = convertCamelCase(
                                item.documentName,
                            );
                            return (
                                <ShipDocumentList
                                    pdfUrl={item.documentUrl}
                                    label={documentName}
                                    documentName={item.documentName}
                                    handlePress={() =>
                                        handleDocumentPress(item)
                                    }
                                />
                            );
                        }}
                        keyExtractor={item => item._id}
                        scrollEnabled={false}
                    />
                </View>
                <ModalPdf
                    visible={visiblePdf}
                    onClose={handleShowModalPdf}
                    selectedDocument={selectedDocument}
                />
            </View>

            {draftContract[0].proposalId.otherDoc.length > 0 && (
                <View
                    testID={`otherDoc${draftContract[0].proposalId.otherDoc[0]._id}`}
                    marginT-20
                    style={{
                        backgroundColor: Color.primaryColor,
                        borderRadius: 6,
                        padding: 16,
                    }}>
                    <View>
                        <Text
                            marginB-10
                            style={{
                                fontFamily: FontFamily.medium,
                                fontSize: FontSize.xl,
                                color: Color.lightTextColor,
                                paddingRight: 10,
                            }}>
                            {t(
                                'FormNegotiateRenter.NegotiateDocument.textAdditionalDocument',
                            )}
                        </Text>

                        <FlatList
                            testID="shipDocList"
                            data={draftContract[0].proposalId.otherDoc}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <ShipDocumentList
                                        pdfUrl={item.documentUrl}
                                        label={item.documentName}
                                        documentName={item.documentName}
                                        handlePress={() =>
                                            handleDocumentPress(item)
                                        }
                                        index={index}
                                    />
                                );
                            }}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

export default ShipInformation;
