import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const signInWithGoogle = async () => {
    try {
        GoogleSignin.configure({
            offlineAccess: false,
            webClientId:
                '577322848989-ll2erp81ln71n8f95ru4ljmk3bf98o49.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        });

        await GoogleSignin.hasPlayServices();

        const userInfo = await GoogleSignin.signIn();
        const { idToken } = userInfo;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        await auth().signInWithCredential(googleCredential);

        return userInfo;
    } catch (error) {
        console.log('Error @signInWithGoogle: ', error);
    }
};

export const signOutGoogle = async () => {
    try {
        GoogleSignin.configure({
            offlineAccess: false,
            webClientId:
                '577322848989-ll2erp81ln71n8f95ru4ljmk3bf98o49.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        });

        await GoogleSignin.signOut();
    } catch (error) {
        console.log('Error @signOutGoogle: ', error);
    }
};
