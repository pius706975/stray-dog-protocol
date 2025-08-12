import React from 'react';
import { Image, Text, View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize, ShipIcon } from '../../../../../configs';
import {
    ShipInformationContractProps,
    ShipInformationProps,
} from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import ShipDocumentList from './ShipDocument';
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

const ShipInformation: React.FC<ShipInformationContractProps> = ({
    draftContract,
    shipImageUrl,
    shipName,
    shipSize,
    shipCategory,
    shipCompany,
    shipDocument,
}) => {
    const { t } = useTranslation('common');
    const formattedhipSize = `${shipSize.length} x ${shipSize.width} x ${shipSize.height} meter`;
    const [latestContract, setLatestContract] =
        React.useState<LatestContract>();
    const convertCamelCase = (input: string): string => {
        if (typeof input !== 'string' || input.trim() === '') {
            return '';
        }
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
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };
    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });

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
    return (
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
                spread
                style={{
                    borderBottomWidth: 0.4,
                    borderColor: Color.softGreyBgPrimary,
                    paddingVertical: 6,
                }}>
                <Text
                    style={{
                        fontSize: FontSize.lg,
                        fontFamily: FontFamily.regular,
                        color: Color.lightTextColor,
                    }}>
                    {shipCompany}
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
                            {t('ShipInformation.textType')}
                        </Text>
                        <Text
                            style={{
                                fontSize: FontSize.sm,
                                fontFamily: FontFamily.regular,
                                color: Color.secColor,
                            }}>
                            {shipCategory}
                        </Text>
                    </View>
                    <View
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
            <View marginT-10>
                <Text
                    marginB-10
                    style={{
                        fontFamily: FontFamily.medium,
                        fontSize: FontSize.xl,
                        color: Color.lightTextColor,
                        paddingRight: 10,
                    }}>
                    {t('ShipInformation.textDocument')}
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
                                handlePress={() => handleDocumentPress(item)}
                            />
                        );
                    }}
                    keyExtractor={item => item._id}
                    scrollEnabled={false}
                />
                <View
                    style={{
                        borderRadius: 6,
                    }}>
                    {latestContract && (
                        <ShipDocumentList
                            pdfUrl={latestContract?.proposalUrl}
                            label={'Draft Contract'}
                            documentName={latestContract?.proposalName}
                            handlePress={() =>
                                handleContractPress(latestContract)
                            }
                        />
                    )}
                </View>
            </View>
            <ModalPdf
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedDocument={selectedDocument}
            />
        </View>
    );
};

export default ShipInformation;
