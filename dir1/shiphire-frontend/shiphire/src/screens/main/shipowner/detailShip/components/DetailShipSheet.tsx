import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { CloseIcon, Color } from '../../../../../configs';
import { DetailShipSheetProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const DetailShipSheet: React.FC<DetailShipSheetProps> = ({
    onClose,
    sheetRef,
    snapPoints,
    size,
    specifications,
    testId,
}) => {
    const { t } = useTranslation('detailship');
    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            index={-1}
            backgroundStyle={{
                backgroundColor: Color.bgColor,
                borderWidth: 1,
            }}
            enablePanDownToClose>
            <BottomSheetView
                style={{
                    paddingHorizontal: 10,
                    flex: 1,
                }}>
                <View row center>
                    <CustomText
                        fontFamily="regular"
                        fontSize="xl2"
                        color="darkTextColor">
                        {t('DetailShipSheet.textShipSpecification')}
                    </CustomText>
                </View>
                <View
                    testID={testId}
                    row
                    marginL-20
                    style={{
                        alignSelf: 'center',
                        marginTop: 20,
                    }}>
                    <View flex>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor">
                            {t('DetailShipSheet.textLength')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor">
                            {t('DetailShipSheet.textWidth')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor">
                            {t('DetailShipSheet.textHeight')}
                        </CustomText>
                        {specifications?.map((item, index) => (
                            <CustomText
                                key={index}
                                fontFamily="regular"
                                fontSize="md"
                                color="darkTextColor">
                                {item.name}
                            </CustomText>
                        ))}
                    </View>
                    <View flex>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor">
                            {size?.length} meter
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor">
                            {size?.width} meter
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor">
                            {size?.height} meter
                        </CustomText>
                        {specifications?.map((item, index) => (
                            <CustomText
                                key={index}
                                fontFamily="regular"
                                fontSize="md"
                                color="darkTextColor">
                                {item.value} {item.spesificationId.units}
                            </CustomText>
                        ))}
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

export default DetailShipSheet;
