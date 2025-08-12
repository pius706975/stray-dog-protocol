import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { CalendarAvailabilityProps } from '../../../../../types';
import { date } from 'yup';
import moment from 'moment';

export const CalendarAvailability: React.FC<CalendarAvailabilityProps> = ({
    shipHistory,
}) => {
    console.log('shipHistories', JSON.stringify(shipHistory, null, 2));
    const markedDates = {};
    const currentDate = new Date();
    const { t } = useTranslation('detailship');
    const legend = {
        startingDay: {
            startingDay: true,
            textColor: Color.softGreyBgPrimary,
            // text: 'Ship Not Available',
        },
    };

    // State untuk menyimpan bulan aktif
    const [activeMonth, setActiveMonth] = useState(
        new Date().toISOString().split('T')[0].substring(0, 7), // Format 'yyyy-MM' (tahun-bulan)
    );

    const events = {};

    const activeMonthDate = new Date(activeMonth + '-01'); // Convert activeMonth to Date object
    const activeMonthStart = moment(activeMonthDate)
        .startOf('month')
        .toISOString()
        .split('T')[0];
    const activeMonthEnd = moment(activeMonthDate)
        .endOf('month')
        .toISOString()
        .split('T')[0];

    shipHistory !== undefined &&
        shipHistory.forEach(item => {
            if (item.deleteStatus === 'approved') {
                return;
            }
            const startDate = item.rentStartDate.split('T')[0];
            const endDate = item.rentEndDate.split('T')[0];
            // Filter peristiwa berdasarkan bulan aktif
            if (
                startDate.startsWith(activeMonth) ||
                endDate.startsWith(activeMonth) ||
                (startDate < activeMonthEnd && endDate > activeMonthStart)
            ) {
                markedDates[startDate] = {
                    ...legend.startingDay,
                };

                const start = new Date(startDate);
                const end = new Date(endDate);

                while (start < end) {
                    start.setDate(start.getDate() + 1);
                    const currentDateString = start.toISOString().split('T')[0];

                    if (
                        (start > currentDate && start < end) ||
                        start.getTime() !== end.getTime()
                    ) {
                        markedDates[currentDateString] = {
                            textColor: Color.softGreyBgPrimary,
                            disableTouchEvent: true,
                        };
                    }
                }

                markedDates[endDate] = {
                    endingDay: true,
                    // color: Color.softGreyBgPrimary,
                    textColor: Color.softGreyBgPrimary,
                };

                // if (end > currentDate) {
                //     markedDates[endDate].color = Color.softGreyBgPrimary;
                // }

                if (!events[startDate]) {
                    events[startDate] = {
                        startDate: startDate,
                        endDate: endDate,
                        events: [],
                        status: '', // Tambahkan status
                    };
                }

                const startOri = new Date(startDate);
                // Tambahkan status berdasarkan tanggal start dan end
                if (end < currentDate) {
                    events[startDate].status = t('ShipAvailability.statusDone');
                } else if (startOri <= currentDate && end >= currentDate) {
                    events[startDate].status = t(
                        'ShipAvailability.statusOnProgress',
                    );
                } else {
                    events[startDate].status = t(
                        'ShipAvailability.statusUpcoming',
                    );
                }

                events[startDate].events.push({
                    locationDeparture: item.locationDeparture,
                    locationDestination: item.locationDestination,
                    needs: item.needs,
                    renterCompanyName: item.renterCompanyName,
                });
            }
        });

    const handleMonthChange = month => {
        setActiveMonth(month.dateString.substring(0, 7));
    };

    return (
        <View style={{ width: '90%' }}>
            <View style={styles.modalContent}>
                <Calendar
                    onDayPress={day => {
                        console.log('selected day', day);
                    }}
                    onMonthChange={handleMonthChange} // Menangani perubahan bulan
                    markingType={'period'}
                    markedDates={markedDates}
                    theme={{
                        arrowColor: Color.primaryColor,
                        todayTextColor: Color.primaryColor,
                        textDayFontFamily: FontFamily.regular,
                        textMonthFontFamily: FontFamily.regular,
                        textDayHeaderFontFamily: FontFamily.regular,
                        textDayFontSize: FontSize.sm,
                        textMonthFontSize: FontSize.md,
                        textDayHeaderFontSize: FontSize.sm,
                    }}
                />
                <View style={styles.legend}>
                    {Object.keys(legend).map((key, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View
                                style={[
                                    styles.legendColor,
                                    { backgroundColor: legend[key].color },
                                ]}
                            />
                            <Text style={styles.textItem}>
                                {legend[key].text}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.eventList}>
                <Text style={styles.eventListTitle}>
                    {t('ShipAvailability.textListShip')}
                </Text>
                {Object.keys(events).length === 0 ? (
                    <Text
                        style={{
                            textAlign: 'center',
                            color: Color.primaryColor,
                        }}>
                        {t('ShipAvailability.textListShipHistoryEmpty')}
                    </Text>
                ) : (
                    Object.keys(events).map(date => (
                        <View
                            style={[
                                styles.containerItem,
                                events[date].status ===
                                    t('ShipAvailability.statusDone') &&
                                    styles.doneBorder,
                                events[date].status ===
                                    t('ShipAvailability.statusOnProgress') &&
                                    styles.onProgressBorder,
                                events[date].status ===
                                    t('ShipAvailability.statusUpcoming') &&
                                    styles.upcomingBorder,
                            ]}
                            key={date}>
                            <Text style={{ color: Color.darkTextColor }}>
                                <Text
                                    style={{
                                        fontFamily: FontFamily.semiBold,
                                        color: Color.darkTextColor,
                                    }}>
                                    Status:{' '}
                                </Text>
                                {events[date].status}
                            </Text>
                            <Text style={styles.eventListDateRange}>
                                {t('ShipAvailability.textDate')}{' '}
                                {moment(date).format('DD MMM YYYY')}{' '}
                                {t('ShipAvailability.textUntil')}{' '}
                                {moment(events[date].endDate).format(
                                    'DD MMM YYYY',
                                )}
                            </Text>
                            {events[date].events.map((event, index) => (
                                <View key={index}>
                                    {event.needs && (
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        FontFamily.semiBold,
                                                    color: Color.darkTextColor,
                                                }}>
                                                {t(
                                                    'ShipAvailability.textNeeds',
                                                )}{' '}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: Color.darkTextColor,
                                                }}>
                                                {event.needs}
                                            </Text>
                                        </View>
                                    )}
                                    {event.locationDeparture &&
                                        event.locationDestination && (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}>
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            FontFamily.semiBold,
                                                        color: Color.darkTextColor,
                                                    }}>
                                                    {t(
                                                        'ShipAvailability.textRoute',
                                                    )}{' '}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: Color.darkTextColor,
                                                    }}>
                                                    {event.locationDeparture} to{' '}
                                                    {event.locationDestination}
                                                </Text>
                                            </View>
                                        )}
                                    {event.renterCompanyName && (
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        FontFamily.semiBold,
                                                    color: Color.darkTextColor,
                                                }}>
                                                {t(
                                                    'ShipAvailability.textCompanyName',
                                                )}{' '}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: Color.darkTextColor,
                                                }}>
                                                {event.renterCompanyName}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        marginTop: 16,
        backgroundColor: Color.bgColor,
        padding: 8,
        borderRadius: 8,
        elevation: 4,
    },
    upper: {
        alignSelf: 'center',
        fontSize: FontSize.xl,
        fontFamily: FontFamily.semiBold,
        color: Color.primaryColor,
        marginBottom: 8,
    },
    legend: {
        flexDirection: 'column',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    textItem: {
        color: Color.darkTextColor,
        fontFamily: FontFamily.semiBold,
    },
    legendColor: {
        borderRadius: 4,
        width: 20,
        height: 20,
        marginRight: 5,
    },
    eventListTitle: {
        color: Color.primaryColor,
        fontFamily: FontFamily.semiBold,
        textAlign: 'center',
        marginBottom: 8,
        fontSize: FontSize.md,
    },
    eventListDateRange: {
        color: Color.darkTextColor,
        fontFamily: FontFamily.semiBold,
    },
    containerItem: {
        backgroundColor: Color.bgColor,
        borderWidth: 2,
        borderColor: Color.softPrimaryColor,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    eventList: {
        paddingVertical: 10,
        marginVertical: 16,
        backgroundColor: Color.softSecBgPrimary,
        paddingHorizontal: 8,
        borderRadius: 8,
        elevation: 4,
    },
    doneBorder: {
        borderColor: Color.boldSuccessColor,
    },
    onProgressBorder: {
        borderColor: Color.boldInfoColor,
    },
    upcomingBorder: {
        borderColor: Color.boldWarningColor,
    },
});
