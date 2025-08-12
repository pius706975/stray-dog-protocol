import moment from 'moment';
import React from 'react';
import { Modal, Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import {
    Button,
    CustomText,
    DynamicRadioDropdown,
} from '../../../../../components';
import { CloseIcon, Color } from '../../../../../configs';
import { useSetShipReminderNotif } from '../../../../../hooks';
import { modalSlice } from '../../../../../slices';
import { handleAxiosError } from '../../../../../utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    MainScreenParamList,
    MainStackParamList,
    RequestForAQuoteParamList,
} from '../../../../../types';
import { useTranslation } from 'react-i18next';

const ReminderModal: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    lastRentEndDate: Date;
    shipId: string;
    token: string;
    navigation: NativeStackNavigationProp<
        MainStackParamList & RequestForAQuoteParamList & MainScreenParamList,
        'DetailShip',
        undefined
    >;
}> = ({ visible, setVisible, lastRentEndDate, shipId, token, navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('detailship');
    const { hideModal, showModal } = modalSlice.actions;
    const mutationSetShipReminder = useSetShipReminderNotif();
    const [dropDownValue, setDropDownValue] = React.useState<string>('');

    const dropdownItem = [
        { label: t('Reminder.text1Day'), value: '1' },
        { label: t('Reminder.text3Day'), value: '3' },
        { label: t('Reminder.text7Day'), value: '7' },
    ];

    const onReminderSet = () => {
        const selectedDate = moment(lastRentEndDate);
        let reminderDate = selectedDate.subtract(+dropDownValue, 'days');
        let formattedReminderDate = reminderDate.format('DD MMMM YYYY');

        if (dropDownValue === '') {
            reminderDate = selectedDate.subtract(1, 'days');
            formattedReminderDate = reminderDate.format('DD MMMM YYYY');

            mutationSetShipReminder.mutate(
                {
                    scheduleTime: reminderDate.toDate(),
                    shipId,
                    token,
                },
                {
                    onSuccess: () => {
                        setVisible(!visible);
                        dispatch(
                            showModal({
                                status: 'success',
                                text: `${t(
                                    'Reminder.textReminderSetOn',
                                )} ${formattedReminderDate}`,
                            }),
                        );

                        navigation.navigate('RemindedShips');

                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                    },
                    onError: err => {
                        handleAxiosError(err);
                    },
                },
            );

            return;
        }

        mutationSetShipReminder.mutate(
            {
                scheduleTime: reminderDate.toDate(),
                shipId,
                token,
            },
            {
                onSuccess: () => {
                    setVisible(!visible);
                    dispatch(
                        showModal({
                            status: 'success',
                            text: `${t(
                                'Reminder.textReminderSetAt',
                            )} ${formattedReminderDate}`,
                        }),
                    );

                    navigation.navigate('RemindedShips');

                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            },
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            testID="modalDropdown">
            <View
                flex
                centerV
                style={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    paddingHorizontal: 10,
                    gap: 10,
                }}>
                <View
                    style={{
                        borderRadius: 10,
                        paddingVertical: 30,
                        backgroundColor: Color.bgColor,
                        alignItems: 'center',
                    }}>
                    <Pressable
                        style={{
                            position: 'absolute',
                            right: '4%',
                            top: '12%',
                        }}
                        onPress={() => setVisible(!visible)}>
                        <CloseIcon />
                    </Pressable>
                    <View row centerV style={{ gap: 30 }}>
                        <CustomText
                            fontSize="lg"
                            fontFamily="medium"
                            color="darkTextColor">
                            {t('Reminder.textRemindMe')}
                        </CustomText>
                        <View
                            testID="radio-dropdown"
                            marginT-10
                            style={{
                                width: '22%',
                                alignItems: 'center',
                            }}>
                            <DynamicRadioDropdown
                                testID="dropdown"
                                items={dropdownItem}
                                onSetValue={value => {
                                    setDropDownValue(value);
                                }}
                                placeholder={dropdownItem[0].label}
                                fullBorder
                            />
                        </View>
                    </View>
                    <View marginB-6>
                        <CustomText
                            fontSize="lg"
                            fontFamily="medium"
                            color="darkTextColor">
                            {t('Reminder.textBeforeAvailable')}
                        </CustomText>
                    </View>
                </View>
                <Button
                    onSubmit={onReminderSet}
                    title={t('Reminder.btnSetReminder')}
                    testID="setButton"
                />
            </View>
        </Modal>
    );
};

export default ReminderModal;
