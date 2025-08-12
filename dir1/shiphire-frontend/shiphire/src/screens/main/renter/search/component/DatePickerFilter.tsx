import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Color, FontFamily, FontSize } from '../../../../../configs';

interface DatePickerModalProps {
    visible: boolean;
    date: Date;
    onClose: () => void;
    onDateChange: (date: Date) => void;
    minDate: Date;
}

const DatePickerFilter: React.FC<DatePickerModalProps> = ({
    visible,
    date,
    onClose,
    onDateChange,
    minDate,
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.upper}>Pick a date </Text>
                    <DatePicker
                        mode="date"
                        date={date}
                        onDateChange={onDateChange}
                        minimumDate={minDate}
                        // !Note: Commented out because the following props no longer exist on the latest date picker version
                        // androidVariant="nativeAndroid"
                        // textColor={Color.darkTextColor}
                        theme="auto"
                    />
                    <Pressable
                        onPress={onClose}
                        style={{
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            backgroundColor: Color.boldSuccessColor,
                            alignSelf: 'flex-end',
                            borderRadius: 5,
                        }}>
                        <Text style={styles.closeButton}>Confirm</Text>
                    </Pressable>
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

export default DatePickerFilter;
