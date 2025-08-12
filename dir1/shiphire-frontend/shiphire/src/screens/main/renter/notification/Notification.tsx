import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomText, ScreenLayout } from '../../../../components';
import { useGetUserNotif } from '../../../../hooks';
import { notifBadgeSlice } from '../../../../slices';
import { NotificationProps, UserNotif } from '../../../../types';
import NotifCard from './component/NotifCard';

const Notification: React.FC<NotificationProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { addNotifBadge } = notifBadgeSlice.actions;
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 0;
    const mutationGetUserNotif = useGetUserNotif();
    const [userNotif, setUserNotif] = React.useState<UserNotif[]>([]);
    const { t } = useTranslation('notification');

    const formattedTime = (time: Date) => {
        const timesDiff = moment().diff(moment(time));
        const hoursDiff = moment.duration(timesDiff).asHours();

        if (hoursDiff < 1) {
            if (moment.duration(timesDiff).asMinutes() < 1) {
                return 'Just now';
            } else {
                return `${moment
                    .duration(timesDiff)
                    .asMinutes()
                    .toFixed(0)}m ago`;
            }
        } else if (hoursDiff < 24) {
            return `${moment.duration(timesDiff).asHours().toFixed(0)}h ago`;
        } else {
            return `${moment.duration(timesDiff).asDays().toFixed(0)}d ago`;
        }
    };

    const sortArray = (array: UserNotif[]) => {
        return array.sort((a, b) => {
            const updatedAtA = new Date(a.updatedAt).getTime();
            const updatedAtB = new Date(b.updatedAt).getTime();
            return updatedAtB - updatedAtA;
        });
    };

    const openedNotif = sortArray(
        userNotif.filter(notif => notif.isReaded === true),
    );
    const newShipReminderNotif = sortArray(
        userNotif.filter(
            notif =>
                notif.notifType === 'shipReminder' ||
                (notif.notifType === 'paymentReminder' &&
                    notif.isReaded === false),
        ),
    );

    React.useEffect(() => {
        mutationGetUserNotif.mutate(undefined, {
            onSuccess: resp => {
                dispatch(
                    addNotifBadge(
                        resp.data.data.filter(
                            (notif: UserNotif) => notif.isReaded === false,
                        ).length,
                    ),
                );
                setUserNotif(resp.data.data);
            },
        });
    }, [isFocused]);

    return userNotif.length !== 0 ? (
        <ScreenLayout
            testId="NotificationScreen"
            backgroundColor="light"
            padding={10}
            gap={10}
            paddingV={plusPaddingV}>
            {newShipReminderNotif.length !== 0 && (
                <>
                    <CustomText
                        color="darkTextColor"
                        fontFamily="bold"
                        fontSize="lg">
                        {t('textShipHireInfo')}
                    </CustomText>
                    {newShipReminderNotif.map((notif, index) => {
                        return (
                            <NotifCard
                                testId={`notifCard-${index}`}
                                key={index}
                                body={notif.body}
                                docType="appInfo"
                                notifId={notif._id}
                                title={notif.title}
                                shipId={notif.shipId}
                                rentalId={notif.rentalId}
                                transactionId={notif.transactionId}
                                navigation={navigation}
                                time={formattedTime(new Date(notif.createdAt))}
                            />
                        );
                    })}
                </>
            )}
            {openedNotif.length !== 0 && (
                <>
                    <CustomText
                        color="darkTextColor"
                        fontFamily="bold"
                        fontSize="lg">
                        {t('textOpenedNotif')}
                    </CustomText>
                    {openedNotif.map((notif, index) => {
                        return (
                            <NotifCard
                                testId={`notifCardOpen-${index}`}
                                key={index}
                                docType="appInfo"
                                title={notif.title}
                                body={notif.body}
                                shipId={notif.shipId}
                                rentalId={notif.rentalId}
                                transactionId={notif.transactionId}
                                navigation={navigation}
                                notifId={notif._id}
                                time={formattedTime(new Date(notif.createdAt))}
                            />
                        );
                    })}
                </>
            )}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="NotificationEmptyScreen"
            backgroundColor="light"
            padding={10}
            gap={10}
            flex
            center
            paddingV={plusPaddingV}>
            <CustomText color="darkTextColor" fontFamily="bold" fontSize="lg">
                {t('textNoNotif')}
            </CustomText>
        </ScreenLayout>
    );
};

export default Notification;
