import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button } from '.';
import { Color, FontFamily, FontSize } from '../configs';
import { CustomCalendarProps } from '../types';

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
    visible,
    onClose,
    shipHistory,
    navigateToAddHistory,
    navigateToManageHistory,
    testID,
}) => {
    const markedDates = {};
    const currentDate = new Date();

    const { t } = useTranslation('detailship');

    shipHistory !== undefined &&
        shipHistory.forEach(item => {
            if (item.deleteStatus === 'approved') {
                return;
            }
            const startDate = item.rentStartDate.split('T')[0];
            const endDate = item.rentEndDate.split('T')[0];

            markedDates[startDate] = {
                startingDay: true,
                textColor: Color.softGreyBgPrimary,
            };

            const start = new Date(startDate);
            const end = new Date(endDate);

            while (start < end) {
                start.setDate(start.getDate() + 1);
                const currentDateString = start.toISOString().split('T')[0];

                if (start > currentDate && start < end) {
                    markedDates[currentDateString] = {
                        textColor: Color.softGreyBgPrimary,
                    };
                } else if (start.getTime() !== end.getTime()) {
                    markedDates[currentDateString] = {
                        textColor: Color.softGreyBgPrimary,
                    };
                }
            }

            markedDates[endDate] = {
                endingDay: true,
                textColor: Color.softGreyBgPrimary,
            };

            // if (end > currentDate) {
            //     markedDates[endDate].color = Color.softPrimaryColor;
            // }
        });

    const handleButtonClick = () => {
        onClose();
        navigateToAddHistory && navigateToAddHistory();
    };

    const hanldeButtonClickManage = () => {
        onClose();
        navigateToManageHistory && navigateToManageHistory();
    };

    return (
        <Modal
            testID={testID}
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View>
                    <Pressable
                        onPress={onClose}
                        style={{
                            width: 28,
                            height: 28,
                            backgroundColor: 'white',
                            borderRadius: 50,
                            alignItems: 'center',
                            marginBottom: 8,
                        }}>
                        <Text
                            style={{
                                marginHorizontal: 4,
                                fontFamily: FontFamily.medium,
                                fontSize: FontSize.md,

                                color: Color.darkTextColor,
                            }}>
                            X
                        </Text>
                    </Pressable>
                    <View style={styles.modalContent}>
                        <Text style={styles.upper}>
                            {t('CustomCalendar.textShipHistory')}
                        </Text>
                        <Calendar
                            onDayPress={day => {
                                console.log('selected day', day);
                            }}
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
                    </View>
                    {navigateToAddHistory !== undefined && (
                        <View style={{ marginTop: 16 }}>
                            <Button
                                testID="add-history-button"
                                title={t('CustomCalendar.textAddHistory')}
                                color="success"
                                onSubmit={handleButtonClick}
                            />
                        </View>
                    )}
                    {navigateToManageHistory !== undefined && (
                        <View style={{ marginTop: 16 }}>
                            <Button
                                testID="manage-history-button"
                                title={t('CustomCalendar.textManageHistory')}
                                color="primary"
                                onSubmit={hanldeButtonClickManage}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        backgroundColor: Color.bgColor,
        padding: 16,
        borderRadius: 8,
        width: '83%',
    },
    closeButton: {
        fontFamily: FontFamily.medium,
        alignSelf: 'flex-end',
        color: Color.lightTextColor,
    },
    upper: {
        alignSelf: 'center',
        fontSize: FontSize.xl,
        fontFamily: FontFamily.semiBold,
        color: Color.primaryColor,
    },
});
