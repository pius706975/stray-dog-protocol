import React from 'react';
import { Pressable, Text } from 'react-native';
import {
    Color,
    DocumentIcon,
    FontSize,
    FontFamily,
} from '../../../../../configs';
import { View } from 'react-native-ui-lib';
import { DocumentMenuProps } from '../../../../../types';
import { useDispatch } from 'react-redux';
import { documentNameSlice } from '../../../../../slices';

const DocumentMenu: React.FC<DocumentMenuProps> = ({
    navigation,
    pdfUrl,
    label,
}) => {
    const dispatch = useDispatch();
    const { setDocumentScreenName } = documentNameSlice.actions;
    return (
        <Pressable
            testID={`DocumentMenu-${label}`}
            onPress={() => {
                dispatch(setDocumentScreenName({ text: label }));
                navigation.navigate('RenterDocumentPreview', {
                    documentUrl: pdfUrl!!,
                });
            }}>
            <View
                style={{
                    backgroundColor: Color.bgNeutralColor,
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
                    <Text
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.bold,
                            color: Color.primaryColor,
                        }}>
                        {label}
                    </Text>
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
                        Detail
                    </Text>
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

export default DocumentMenu;
