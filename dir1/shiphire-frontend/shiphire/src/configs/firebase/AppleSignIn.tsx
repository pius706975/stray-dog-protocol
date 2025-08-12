import React from 'react';
import { firebase } from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const signInWithApple = async () => {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const { identityToken, nonce } = appleAuthRequestResponse;

        if (identityToken) {
            const appleCredential = firebase.auth.AppleAuthProvider.credential(
                identityToken,
                nonce,
            );
            const userCredential = await firebase
                .auth()
                .signInWithCredential(appleCredential);
            // console.warn(
            //     `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
            // );

            return { userCredential, appleAuthRequestResponse };
        } else {
            throw new Error('Apple Sign-In failed');
        }
    } catch (error) {
        console.log('Error @signInWithApple: ', error);
    }
};
