import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {
    Color,
    FCMTOKEN,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from '../configs';

export const registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
}

export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission({
        badge: false,
    });
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        getFCMToken();
    }
};

const getFCMToken = async () => {
    let fcmToken = await getDataFromLocalStorage(FCMTOKEN);
    console.log('old token', fcmToken);

    if (!fcmToken) {
        try {
            await messaging().registerDeviceForRemoteMessages();
            const fcmToken = await messaging().getToken();

            if (fcmToken) {
                console.log('new token', fcmToken);
                await setDataToLocalStorage(FCMTOKEN, fcmToken);
            }
        } catch (error) {
            console.log('error', error);
        }
    }
};

export const notificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

    messaging().onMessage(async remoteMessage => {
        // Request permissions (required for iOS)
        await notifee.requestPermission();

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: `<p style="color: #216dab;"><b>${remoteMessage.notification?.title} &#128674</b></p>`,
            body: ` <p style="color: #000;">${remoteMessage.notification?.body}</p>`,
            android: {
                channelId,
                color: Color.bgColor,
                smallIcon: 'ic_stat_name', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });

        console.log(
            'A new FCM message arrived!',
            JSON.stringify(remoteMessage),
        );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });
};

export const checkNotificationPermission = async () => {
    const authStatus = await messaging().hasPermission();

    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        console.log('Izin notifikasi diberikan.');
    } else {
        console.log('Izin notifikasi tidak diberikan.');
    }
};
