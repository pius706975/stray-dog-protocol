import React from 'react';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../../components';
import { useTranslation } from 'react-i18next';

const DetailInputSheet = ({
    bottomRef,
    initialIndex = -1,
    snapPoints = ['90%'],
    itemDetail,
}) => {
    const {t} = useTranslation('rfq');
    return (
        <BottomSheet
            ref={bottomRef}
            index={initialIndex}
            snapPoints={snapPoints}
            // eslint-disable-next-line react/jsx-props-no-spreading
            backdropComponent={props => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.25}
                />
            )}
            enablePanDownToClose>
            <BottomSheetView style={{ flex: 1 }}>
                <View margin-10>
                    <CustomText
                        textAlign="center"
                        fontFamily="bold"
                        fontSize="lg"
                        color="primaryColor">
                        {t('RFQFormInputView.labelInformation')}
                    </CustomText>
                    <View>
                        <CustomText
                            fontFamily="bold"
                            fontSize="md"
                            color="darkTextColor">
                            Label
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="darkTextColor">
                            {itemDetail?.dynamicInput.label}
                        </CustomText>
                    </View>
                    <View>
                        <CustomText
                            fontFamily="bold"
                            fontSize="md"
                            color="darkTextColor">
                            {t('RFQFormInputView.labelTemplateType')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="darkTextColor">
                            {itemDetail?.dynamicInput.templateType}
                        </CustomText>
                    </View>
                    <View>
                        <CustomText
                            fontFamily="bold"
                            fontSize="md"
                            color="darkTextColor">
                            {t('RFQFormInputView.labelInputType')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="darkTextColor">
                            {itemDetail?.dynamicInput.inputType}
                        </CustomText>
                    </View>
                    {itemDetail?.dynamicInput.inputType === 'numericInput' && (
                        <View>
                            <CustomText
                                fontFamily="bold"
                                fontSize="md"
                                color="darkTextColor">
                                {t('RFQFormInputView.labelUnit')}
                            </CustomText>
                            <CustomText
                                fontFamily="regular"
                                fontSize="sm"
                                color="darkTextColor">
                                {itemDetail.dynamicInput.unit}
                            </CustomText>
                        </View>
                    )}
                    {itemDetail?.dynamicInput.inputType === 'radioDropdown' ||
                    itemDetail?.dynamicInput.inputType === 'selectDropDown' ? (
                        <View>
                            <CustomText
                                fontFamily="bold"
                                fontSize="md"
                                color="darkTextColor">
                                Options
                            </CustomText>
                            <View>
                                {itemDetail?.option.map((item, index) => (
                                    <CustomText
                                        key={index}
                                        fontFamily="regular"
                                        fontSize="sm"
                                        color="darkTextColor">
                                        - {item.value}
                                    </CustomText>
                                ))}
                            </View>
                        </View>
                    ) : (
                        ''
                    )}
                    {itemDetail?.validation && (
                        <View>
                            <CustomText
                                fontFamily="bold"
                                fontSize="md"
                                color="darkTextColor">
                                {itemDetail.validation.min
                                    ? 'Minimum'
                                    : 'Multiline'}
                            </CustomText>
                            <CustomText
                                fontFamily="regular"
                                fontSize="sm"
                                color="darkTextColor">
                                {itemDetail.validation.min
                                    ? itemDetail.validation.min
                                    : itemDetail.validation.multiline && 'Yes'}
                            </CustomText>
                        </View>
                    )}
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

export default DetailInputSheet;
