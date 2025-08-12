import React from 'react';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../../components';

const DetailInputSheet = ({
    bottomRef,
    initialIndex = -1,
    snapPoints = ['90%'],
    itemDetail,
}) => {
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
                        Input Information
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
                            {itemDetail?.label}
                        </CustomText>
                    </View>
                    <View>
                        <CustomText
                            fontFamily="bold"
                            fontSize="md"
                            color="darkTextColor">
                            Template Type
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="darkTextColor">
                            {itemDetail?.templateType}
                        </CustomText>
                    </View>
                    <View>
                        <CustomText
                            fontFamily="bold"
                            fontSize="md"
                            color="darkTextColor">
                            Input Type
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="darkTextColor">
                            {itemDetail?.inputType}
                        </CustomText>
                    </View>
                    {itemDetail?.inputType === 'docSelect' && (
                        <View>
                            <CustomText
                                fontFamily="bold"
                                fontSize="md"
                                color="darkTextColor">
                                Add Document Field
                            </CustomText>
                            <CustomText
                                fontFamily="regular"
                                fontSize="sm"
                                color="darkTextColor">
                                {itemDetail.expired ? 'yes' : 'no'}
                            </CustomText>
                        </View>
                    )}
                    {itemDetail?.inputType === 'numericInput' && (
                        <>
                            <View>
                                <CustomText
                                    fontFamily="bold"
                                    fontSize="md"
                                    color="darkTextColor">
                                    Unit
                                </CustomText>
                                <CustomText
                                    fontFamily="regular"
                                    fontSize="sm"
                                    color="darkTextColor">
                                    {itemDetail.unit}
                                </CustomText>
                            </View>
                            {itemDetail?.validate && (
                                <>
                                    {itemDetail?.validate.min && (
                                        <View>
                                            <CustomText
                                                fontFamily="bold"
                                                fontSize="md"
                                                color="darkTextColor">
                                                {itemDetail.validate.min &&
                                                    'Minimum'}
                                            </CustomText>
                                            <CustomText
                                                fontFamily="regular"
                                                fontSize="sm"
                                                color="darkTextColor">
                                                {itemDetail.validate.min}
                                            </CustomText>
                                        </View>
                                    )}
                                    <View>
                                        <CustomText
                                            fontFamily="bold"
                                            fontSize="md"
                                            color="darkTextColor">
                                            {itemDetail.validate.max &&
                                                'Maximum'}
                                        </CustomText>
                                        <CustomText
                                            fontFamily="regular"
                                            fontSize="sm"
                                            color="darkTextColor">
                                            {itemDetail.validate.max}
                                        </CustomText>
                                    </View>
                                </>
                            )}
                        </>
                    )}
                    {(itemDetail?.inputType === 'radioDropdown' ||
                        itemDetail?.inputType === 'selectDropDown') && (
                        <View>
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
                            {itemDetail?.validate && (
                                <View>
                                    <CustomText
                                        fontFamily="bold"
                                        fontSize="md"
                                        color="darkTextColor">
                                        {itemDetail.validate.min && 'Minimum'}
                                    </CustomText>
                                    <CustomText
                                        fontFamily="regular"
                                        fontSize="sm"
                                        color="darkTextColor">
                                        {itemDetail.validate.min}
                                    </CustomText>
                                </View>
                            )}
                        </View>
                    )}
                    {itemDetail?.inputType === 'textInput' &&
                        itemDetail?.validate && (
                            <View>
                                <CustomText
                                    fontFamily="bold"
                                    fontSize="md"
                                    color="darkTextColor">
                                    Multiline
                                </CustomText>
                                <CustomText
                                    fontFamily="regular"
                                    fontSize="sm"
                                    color="darkTextColor">
                                    {itemDetail.validate.multiline
                                        ? 'Yes'
                                        : 'No'}
                                </CustomText>
                            </View>
                        )}
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

export default DetailInputSheet;
