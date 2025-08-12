import React from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, View } from 'react-native-ui-lib';
import { Modal, Pressable } from 'react-native';
import CustomButton from '../../../../../components/Button';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { CalendarPickerModalProps } from '../../../../../types';
import moment from 'moment';
import { modalSlice } from '../../../../../slices';
import { useDispatch } from 'react-redux';
import { color } from '@rneui/base';
import { useTranslation } from 'react-i18next';

type DateObject = {
    [date: string]: {
        selected?: boolean;
        marked?: boolean;
        color?: string;
        textColor?: string;
        endingDay?: boolean;
        startingDay?: boolean;
    };
};

const CalendarPickerModal: React.FC<CalendarPickerModalProps> = ({
    visible,
    onClose,
    shipHistory,
    date,
    handleSubmit,
    shipRentType,
}) => {
    const { t } = useTranslation('common');
    const dateState = ['startDate', 'endDate'];
    const dispatch = useDispatch();
    const currentDate = new Date();
    const dateText = moment(currentDate).format('YYYY-MM-DD');
    const [markedDates, setmarkedDates] = React.useState<DateObject>({});
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const [buttonState, setButtonState] = React.useState<string>(dateState[0]);
    const { hideModal, showModal } = modalSlice.actions;
    const [dateValue, setDateValue] = React.useState<{
        startDate: string;
        endDate: string;
    }>({ startDate: '', endDate: '' });
    const [selectedDate, setSelectedDate] = React.useState<Array<string>>([]);
    const filteredShipHistory =
        shipHistory?.filter(item => item.deleteStatus !== 'approved') || [];

    React.useEffect(() => {
        handleReset();
    }, [shipRentType]);

    filteredShipHistory &&
        filteredShipHistory.forEach(item => {
            if (item.deleteStatus === 'approved') {
                return;
            }
            const startDate = item.rentStartDate.split('T')[0];
            const endDate = item.rentEndDate.split('T')[0];

            const start = new Date(startDate);
            const end = new Date(endDate);

            while (start < end) {
                const currentDateString = start.toISOString().split('T')[0];

                start.setDate(start.getDate() + 1);

                if (start >= currentDate && start <= end) {
                    markedDates[currentDateString] = {
                        textColor: Color.softGreyBgPrimary,
                    };
                }
            }
            const isDateAfterEnd = moment(endDate).isSameOrAfter(dateText);
            if (isDateAfterEnd) {
                markedDates[endDate] = {
                    endingDay: true,
                    textColor: Color.softGreyBgPrimary,
                };
            }
            const isDateAfterStart = moment(startDate).isSameOrAfter(dateText);
            if (isDateAfterStart) {
                markedDates[startDate] = {
                    startingDay: true,
                    textColor: Color.softGreyBgPrimary,
                };
            }
        });

    const handleRangeDate = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (selectedDate.length > 0) {
            selectedDate.forEach(item => {
                markedDates[item] = {
                    selected: false,
                    marked: false,
                    textColor: Color.darkTextColor,
                };
            });

            setSelectedDate([]);
        }
        while (start < end) {
            start.setDate(start.getDate() + 1);
            const currentDateString = start.toISOString().split('T')[0];
            if (start < end) {
                selectedDate.push(currentDateString);
                markedDates[currentDateString] = {
                    color: Color.primaryColor,
                    textColor: 'white',
                };
            }
        }
    };

    const handleSubmitted = () => {
        if (dateValue.startDate && dateValue.endDate) {
            const start = new Date(dateValue.startDate);
            const end = new Date(dateValue.endDate);

            const dateFormattedStart = moment(dateValue.startDate).format(
                'DD MMM YYYY',
            );
            const dateFormattedEnd = moment(dateValue.endDate).format(
                'DD MMM YYYY',
            );
            const selectedDateText = `${dateFormattedStart} to ${dateFormattedEnd}`;

            const isDateValid = validateDateRange(start, end);
            if (isDateValid) {
                showSuccessMessage(selectedDateText);
                handleReset();
            } else {
                showErrorMessageOnSubmit(
                    t('DynamicCalendar.errorDateNotAvail'),
                );
            }
        } else {
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('DynamicCalendar.errorRequired'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
                setSubmitting(false);
            }, 2000);
        }
    };

    const validateDateRange = (start: Date, end: Date) => {
        const isDateBetweenRentDates = filteredShipHistory.some(item => {
            const rentStart = new Date(item.rentStartDate.split('T')[0]);
            return moment(rentStart).isBetween(start, end, null, '[]');
        });

        return !isDateBetweenRentDates;
    };

    const showSuccessMessage = (message: string) => {
        handleSubmit(message);
        dispatch(
            showModal({
                status: 'success',
                text: t('DynamicCalendar.errorDateAvail'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
            setSubmitting(false);
            onClose();
        }, 2500);
    };

    const showErrorMessageOnSubmit = (message: string) => {
        dispatch(
            showModal({
                status: 'failed',
                text: message,
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
            setSubmitting(false);
            handleReset();
        }, 2000);
    };

    const showErrorMessage = (message: string) => {
        dispatch(
            showModal({
                status: 'failed',
                text: message,
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 2000);
    };
    const handleReset = () => {
        // Reset all marked dates
        Object.keys(markedDates).forEach(date => {
            markedDates[date] = {
                selected: false,
                marked: false,
                color: undefined,
                textColor: Color.darkTextColor,
            };
        });

        setSelectedDate([]); // Clear the selectedDate array
        dateValue.startDate = '';
        dateValue.endDate = '';
        setButtonState(dateState[0]);
    };

    // const handleReset = () => {
    //     if (selectedDate.length > 0) {
    //         selectedDate.forEach(item => {
    //             markedDates[item] = {
    //                 selected: false,
    //                 marked: false,
    //                 textColor: Color.darkTextColor,
    //             };
    //         });
    //     }
    //     markedDates[dateValue.startDate] = {
    //         selected: false,
    //         marked: false,
    //         textColor: Color.darkTextColor,
    //     };
    //     markedDates[dateValue.endDate] = {
    //         selected: false,
    //         marked: false,
    //         textColor: Color.darkTextColor,
    //     };
    //     setSelectedDate([]); // Clear the selectedDate array
    //     dateValue.startDate = '';
    //     dateValue.endDate = '';
    // };
    const dateAvailability = (day: string) => {
        const available = filteredShipHistory.some(item => {
            const rentStart = new Date(item.rentStartDate.split('T')[0]);
            const rentEnd = new Date(item.rentEndDate.split('T')[0]);
            return (
                day >= rentStart.toISOString().split('T')[0] &&
                day <= rentEnd.toISOString().split('T')[0]
            );
        });
        return available;
    };

    const handleDayPressed = day => {
        if (buttonState === dateState[0]) {
            const isDateUnavailable = dateAvailability(day.dateString);

            if (isDateUnavailable) {
                showErrorMessage(t('DynamicCalendar.errorDateUnavailable'));
            } else {
                handleReset(); //reset start date
                markedDates[day.dateString] = {
                    selected: true,
                    color: Color.primaryColor,
                    startingDay: true,
                };
                dateValue.startDate = day.dateString;

                // Set end date automatically if Monthly Rent
                // if (shipRentType === 'Monthly Rent') {
                //     const endDate = moment(dateValue.startDate)
                //         .add(30, 'days')
                //         .format('YYYY-MM-DD');
                //     dateValue.endDate = endDate;
                //     markedDates[endDate] = {
                //         selected: true,
                //         color: Color.primaryColor,
                //         textColor: 'white',
                //         endingDay: true,
                //     };
                //     setButtonState(dateState[0]); // Automatically move to next selection
                //     handleRangeDate(dateValue.startDate, endDate);
                //     // handleSubmitted();
                // } else {
                setButtonState(dateState[1]);
                // }
            }
        } else if (buttonState === dateState[1]) {
            const start = new Date(dateValue.startDate);
            const end = new Date(day.dateString);
            const isDateUnavailable = dateAvailability(day.dateString);
            const dayDifference = moment(end).diff(moment(start), 'days');
            if (isDateUnavailable) {
                showErrorMessage(t('DynamicCalendar.errorDateUnavailable'));
            }

            if (
                dayDifference < 60 &&
                dayDifference > 0 &&
                shipRentType === 'Monthly Rent'
            ) {
                showErrorMessage(t('DynamicCalendar.errorDateMonthly'));
            } else if (start < end) {
                const startDate = dateValue.startDate;
                markedDates[day.dateString] = {
                    selected: true,
                    color: Color.primaryColor,
                    textColor: 'white',
                    endingDay: true,
                };
                dateValue.endDate = day.dateString;
                handleRangeDate(startDate, day.dateString);
                setButtonState(dateState[0]);
            } else {
                showErrorMessage(t('DynamicCalendar.errordateBeforeStart'));
            }
        }
    };

    return (
        <Modal
            testID="calendarModal"
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => onClose()}>
            <View
                flex
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                }}>
                <View>
                    <Pressable
                        testID="closeButton"
                        onPress={() => onClose()}
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
                    <View
                        backgroundColor={Color.bgColor}
                        padding-16
                        style={{ borderRadius: 8, width: '83%' }}>
                        <Text
                            color={Color.primaryColor}
                            style={{
                                alignSelf: 'center',
                                fontSize: FontSize.xl,
                                fontFamily: FontFamily.semiBold,
                            }}>
                            {t('DynamicCalendar.textSelectDate')}
                        </Text>
                        <Calendar
                            onDayPress={day => {
                                handleDayPressed(day);
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
                            minDate={dateText}
                            disableAllTouchEventsForDisabledDays
                        />
                    </View>
                    <View style={{ marginTop: 16 }}>
                        <CustomButton
                            testID="selectButton"
                            title={t('DynamicCalendar.textSelect')}
                            color="success"
                            onSubmit={() => {
                                setSubmitting(true);
                                handleSubmitted();
                            }}
                            isSubmitting={submitting}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
export default CalendarPickerModal;
