import React from 'react';
import { Modal, View } from 'react-native-ui-lib';
import { CloseIcon, Color } from '../../../../../configs';
import { Button, CustomText } from '../../../../../components';
import { Pressable } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const ReminderCountdown: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    reminderCountdown: number;
}> = ({ setVisible, visible, reminderCountdown }) => {
    const [timeLeft, setTimeLeft] = React.useState<number>(reminderCountdown);
    const { t } = useTranslation('detailship');
    const formatTimeLeft = (seconds: number): string => {
        const duration = moment.duration(seconds, 'seconds');
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const remainingSeconds = duration.seconds();

        return `${days} ${t('Reminder.textDay')} ${hours} ${t(
            'Reminder.textHours',
        )} ${minutes} ${t('Reminder.textMinutes')} ${remainingSeconds} ${t(
            'Reminder.textSeconds',
        )}`;
    };

    React.useEffect(() => {
        setTimeLeft(reminderCountdown);
        if (reminderCountdown > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [reminderCountdown]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            testID="countdown">
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
                    <CustomText
                        fontSize="xl"
                        fontFamily="medium"
                        color="darkTextColor">
                        {t('Reminder.textRemindedIn')}
                    </CustomText>
                    <CustomText
                        fontFamily="medium"
                        fontSize="md"
                        color="primaryColor">
                        {formatTimeLeft(timeLeft)}
                    </CustomText>
                    {/* <View marginT-20>
                        <Button
                            testID="cancelReminderBtn"
                            title="Cancel Reminder"
                            color="error"
                            onSubmit={() => console.log('cancel reminder')}
                        />
                    </View> */}
                </View>
            </View>
        </Modal>
    );
};

export default ReminderCountdown;
