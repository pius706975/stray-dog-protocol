import React from 'react';
import { DocumentShipShipOwerProps } from '../../../../../types';
import { Text, View } from 'react-native-ui-lib';
import { Pressable } from 'react-native';
import {
    Color,
    DocumentIcon,
    FontFamily,
    FontSize,
} from '../../../../../configs';

const ShipDocumentList: React.FC<DocumentShipShipOwerProps> = ({
    pdfUrl,
    label,
    documentName,
    handlePress,
    index,
}) => {
    return (
        <Pressable testID={`doc-${index}`} onPress={handlePress}>
            <View
                style={{
                    backgroundColor: Color.softPrimaryColor,
                    borderRadius: 6,
                    padding: 10,
                    alignItems: 'flex-start',
                    margin: 6,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                <View
                    row
                    style={{
                        alignItems: 'center',
                        gap: 16,
                    }}>
                    <DocumentIcon />
                    <View>
                        <Text
                            style={{
                                fontSize: FontSize.lg,
                                fontFamily: FontFamily.bold,
                                color: Color.lightTextColor,
                            }}>
                            {label}
                        </Text>
                        {/* {documentExpired && (
                            <Text
                                style={{
                                    fontSize: FontSize.xs,
                                    fontFamily: FontFamily.regular,
                                    color: Color.darkTextColor,
                                }}>
                                {t('ShipOwner.textExpiredDocument')} : {expired}
                            </Text>
                        )} */}
                    </View>
                </View>
                <View
                    row
                    style={{
                        gap: 6,
                        padding: 7,
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.xs,
                            fontFamily: FontFamily.regular,
                            color: Color.darkTextColor,
                        }}>
                        {'>'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ShipDocumentList;
