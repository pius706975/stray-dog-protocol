import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { DateTimePickerModalProps } from '../../../../../types';

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
    title,
    visible,
    onConfirmPress,
    onCancelPress,
    testID,
    mode = 'date',
    ...props
}) => {
    const { t } = useTranslation('shiptracking');

    const [state, setState] = useState('idle');
    const [date, setDate] = useState(new Date());

    return (
        <Modal
            testID={testID}
            animationType="slide"
            transparent={true}
            visible={visible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{title || ''}</Text>
                    <DatePicker
                        mode={mode}
                        theme="auto"
                        onDateChange={setDate}
                        onStateChange={setState}
                        {...props}
                    />
                    <View style={styles.buttonsContainer}>
                        <Pressable
                            onPress={onCancelPress}
                            style={[styles.pressable, styles.cancelButton]}>
                            <Text style={styles.buttonText}>
                                {t('DateTimePickerModal.textCancelButton')}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => onConfirmPress(date)}
                            style={{
                                ...styles.pressable,
                                backgroundColor:
                                    state === 'spinning'
                                        ? Color.neutralColor
                                        : Color.boldSuccessColor,
                            }}
                            disabled={state === 'spinning'}>
                            <Text style={styles.buttonText}>
                                {t('DateTimePickerModal.textConfirmButton')}
                            </Text>
                        </Pressable>
                    </View>
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    pressable: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: Color.errorColor,
    },
    buttonText: {
        fontFamily: FontFamily.medium,
        color: Color.lightTextColor,
    },
    title: {
        alignSelf: 'center',
        fontSize: FontSize.xl,
        fontFamily: FontFamily.semiBold,
        color: Color.primaryColor,
        marginBottom: 16,
    },
});

export default DateTimePickerModal;
