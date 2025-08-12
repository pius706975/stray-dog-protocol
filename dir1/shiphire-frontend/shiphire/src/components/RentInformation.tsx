import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Color, FontFamily, FontSize, RentIcon } from '../configs';
import { RentInformationTrackDetailProps } from '../types';

const RentInformation: React.FC<RentInformationTrackDetailProps> = ({
    sheetRef,
    departureLocation,
    destinationLocation,
    rentType,
    rentDuration,
    startDate,
    endDate,
}) => {
    const { t } = useTranslation('shiptracking');

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            enableDynamicSizing
            enablePanDownToClose
            backgroundStyle={{
                backgroundColor: Color.bgColor,
                borderWidth: 1,
            }}>
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <RentIcon />
                    <Text style={styles.headerText}>
                        {t('RentInformation.textFormTitle')}
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.infoLabel}>
                            {t('RentInformation.textDepartureLocation')}
                        </Text>
                        <Text style={styles.infoValue}>
                            {departureLocation}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.infoLabel}>
                            {t('RentInformation.textDestinationLocation')}
                        </Text>
                        <Text style={styles.infoValue}>
                            {destinationLocation}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.infoLabel}>
                            {t('RentInformation.textRentType')}
                        </Text>
                        <Text style={styles.infoValue}>{rentType}</Text>
                    </View>
                    <View>
                        <Text style={styles.infoLabel}>
                            {t('RentInformation.textRentDuration')}
                        </Text>
                        <Text style={styles.infoValue}>
                            {`${rentDuration} ${t('RentInformation.textDays')}`}
                        </Text>
                    </View>
                    <View style={styles.datesContainer}>
                        <View>
                            <Text style={styles.infoLabel}>
                                {t('RentInformation.textStartDate')}
                            </Text>
                            <Text style={styles.infoValue}>
                                {startDate
                                    ? moment(startDate).format('DD MMM YYYY')
                                    : ''}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>
                                {t('RentInformation.textEndDate')}
                            </Text>
                            <Text style={styles.infoValue}>
                                {endDate
                                    ? moment(endDate).format('DD MMM YYYY')
                                    : ''}
                            </Text>
                        </View>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
        borderRadius: 6,
        padding: 16,
    },
    headerContainer: {
        borderBottomWidth: 0.4,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerText: {
        fontSize: FontSize.xl,
        fontFamily: FontFamily.bold,
        color: Color.primaryColor,
    },
    infoContainer: {
        borderBottomWidth: 0.4,
        paddingVertical: 6,
        flexDirection: 'column',
        gap: 10,
    },
    infoLabel: {
        fontSize: FontSize.sm,
        fontFamily: FontFamily.medium,
        color: Color.darkTextColor,
    },
    infoValue: {
        fontSize: FontSize.sm,
        fontFamily: FontFamily.semiBold,
        color: Color.primaryColor,
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default RentInformation;
