import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { CloseIcon, Color } from '../../../../../configs';
import { DetailShipSheetProps } from '../../../../../types';

const DetailShipSheet: React.FC<DetailShipSheetProps> = ({
    onClose,
    sheetRef,
    snapPoints,
    size,
    specifications,
}) => {
    console.log(specifications);

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
                    row
                    style={{
                        marginLeft: 20,
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
                {/* <View
                    style={{
                        position: 'absolute',
                        width: width / 1.3,
                        left: width / 10,
                        bottom: 40,
                    }}>
                    <Button title="Ok" onSubmit={onClose} />
                </View> */}
            </BottomSheetView>
        </BottomSheet>
    );
};

export default DetailShipSheet;
