import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { CompanyDocumentItemProps } from '../../../../../types';
import { Pressable } from 'react-native';
import {
    Color,
    DocumentIcon,
    FontFamily,
    FontSize,
} from '../../../../../configs';

const CompanyDocumentItem: React.FC<CompanyDocumentItemProps> = ({
    index,
    label,
    handlePress,
}) => {
    return (
        <Pressable onPress={handlePress} testID={`document-${index}`}>
            <View
                style={{
                    backgroundColor: Color.softGreyBgPrimary,
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
                                fontFamily: FontFamily.regular,
                                color: Color.darkTextColor,
                            }}>
                            {label}
                        </Text>
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

export default CompanyDocumentItem;
