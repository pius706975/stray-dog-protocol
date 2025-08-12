import { FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { HeaderLogo, ScreenLayout } from '../../../components';
import {
    ADMINDATA,
    COMPANYDATA,
    Color,
    FCMTOKEN,
    ROLES,
    TOKEN,
    USERDATA,
    getDataFromLocalStorage,
    removeDataToLocalStorage,
    setDataToLocalStorage,
    signInWithGoogle,
} from '../../../configs';
import { useAppleSignIn, useGoogleSignIn, useSignIn, useUpdateFirebaseToken } from '../../../hooks';
import {
    modalSlice,
    progressIndicatorSlice,
    userStatusSlice,
} from '../../../slices';
import {
    GoogleSignInRequest,
    AppleSignInRequest,
    SignInProps,
    SignInRequest,
    SignInResponse,
} from '../../../types';
import { handleAxiosError } from '../../../utils';
import { FormSignIn, NewAccountSection } from './components';
import appleAuth from '@invertase/react-native-apple-authentication';
import { firebase } from '@react-native-firebase/auth';

const SignIn: React.FC<SignInProps> = ({ navigation }) => {
    const { t } = useTranslation('signin');
    const dispatch = useDispatch();
    const mutationSignIn = useSignIn();
    const mutationGoogleSignIn = useGoogleSignIn();
    const mutationAppleSignIn = useAppleSignIn();
    const mutationUpdateFirebaseToken = useUpdateFirebaseToken();
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const {
        login,
        setRoleSubmitted,
        setRoleNotSubmitted,
        setRoleOwner,
        setRoleRenter,
        setPreferencesSubmitted,
        setCompanySubmitted,
        setRoleAdmin,
        setCompanyVerif,
        setCompanyReject,
        setGoogleSignIn,
    } = userStatusSlice.actions;
    // const [credentialStateForUser, updateCredentialStateForUser] =
    //     React.useState(-1);

    // React.useEffect(() => {
    //     if (!appleAuth.isSupported) return;

    //     fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(
    //         error => updateCredentialStateForUser(error.code),
    //     );
    // }, []);

    React.useEffect(() => {
        if (!appleAuth.isSupported) return;

        return appleAuth.onCredentialRevoked(async () => {
            console.warn('Credential Revoked');
            // fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(
            //     error => updateCredentialStateForUser(error.code),
            // );
        });
    }, []);

    const saveDataUserToLocalStorage = (resp: SignInResponse) => {
        removeDataToLocalStorage(TOKEN);
        setDataToLocalStorage(TOKEN, {
            accessToken: resp.accessToken,
            refreshToken: resp.refreshToken,
        });
        setDataToLocalStorage(USERDATA, {
            name: resp.data.name,
            email: resp.data.email,
            phoneNumber: resp.data.phoneNumber,
            isVerified: resp.data.isVerified,
            isPhoneVerified: resp.data.isPhoneVerified,
            isCompanySubmitted: resp.data.isCompanySubmitted,
            imageUrl: resp.data.imageUrl,
            isCompanyVerified: resp.data.renterId
                ? resp.data.renterId?.company.isVerified
                : resp.data.shipOwnerId?.company.isVerified,
            isCompanyRejected: resp.data.renterId
                ? resp.data.renterId?.company.isRejected
                : resp.data.shipOwnerId?.company.isRejected,
        });

        if (resp.data.isCompanySubmitted) {
            if (resp.data.roles === 'shipOwner') {
                setDataToLocalStorage(COMPANYDATA, {
                    name: resp.data.shipOwnerId?.company.name,
                    companyType: resp.data.shipOwnerId?.company.companyType,
                    address: resp.data.shipOwnerId?.company.address,
                    isCompanySubmitted: resp.data.isCompanySubmitted,
                    bankName: resp.data.shipOwnerId?.company.bankName,
                    bankAccountName:
                        resp.data.shipOwnerId?.company.bankAccountName,
                    bankAccountNumber:
                        resp.data.shipOwnerId?.company.bankAccountNumber,
                    isCompanyVerified:
                        resp.data.shipOwnerId?.company.isVerified,
                    isCompanyRejected:
                        resp.data.shipOwnerId?.company.isRejected,
                });
            } else {
                setDataToLocalStorage(COMPANYDATA, {
                    name: resp.data.renterId?.company.name,
                    companyType: resp.data.renterId?.company.companyType,
                    address: resp.data.renterId?.company.address,
                    isCompanySubmitted: resp.data.isCompanySubmitted,
                    isCompanyVerified: resp.data.renterId?.company.isVerified,
                });
            }
        }
        setDataToLocalStorage(ROLES, { roles: resp.data.roles });
    };

    const saveAdminDataToLocalStorage = (resp: SignInResponse) => {
        removeDataToLocalStorage(TOKEN);
        setDataToLocalStorage(TOKEN, {
            accessToken: resp.accessToken,
            refreshToken: resp.refreshToken,
        });
        setDataToLocalStorage(ADMINDATA, {
            name: resp.data.name,
            email: resp.data.email,
            level: resp.data.level,
        });
        setDataToLocalStorage(ROLES, { roles: 'admin' });
    };

    const updateAdminFirebaseToken = () => {
        getDataFromLocalStorage(FCMTOKEN).then(resp => {
            const payload = {
                token: resp,
            };

            mutationUpdateFirebaseToken.mutate(payload, {
                onError: err => {
                    handleAxiosError(err);
                },
            });
        });
    };

    const handleSignIn = (
        values: SignInRequest,
        actions: FormikHelpers<SignInRequest>,
    ) => {
        let errorText = 'Request Failed';
        mutationSignIn.mutate(values, {
            onSuccess: resp => {
                dispatch(setGoogleSignIn(false));
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('successSignIn'),
                    }),
                );
                dispatch(showProgressIndicator());

                if (resp.data.data.level === undefined) {
                    saveDataUserToLocalStorage(resp.data);
                } else {
                    saveAdminDataToLocalStorage(resp.data);
                }

                setTimeout(() => {
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                    dispatch(login());

                    const {
                        roles,
                        isCompanySubmitted,
                        level,
                        shipOwnerId,
                    } = resp.data.data;

                    if (roles === 'user') {
                        dispatch(setRoleNotSubmitted());
                    } else if (roles === 'shipOwner') {
                        if (isCompanySubmitted) {
                            dispatch(setCompanySubmitted());
                            dispatch(setRoleOwner());
                            if (shipOwnerId?.company.isVerified) {
                                dispatch(setCompanyVerif());
                            } else if (shipOwnerId?.company.isRejected) {
                                dispatch(setCompanyReject());
                            }
                        } else {
                            dispatch(setRoleOwner());
                        }
                        dispatch(setRoleSubmitted());
                    } else if (roles === 'renter') {
                        dispatch(setRoleRenter());
                        dispatch(setPreferencesSubmitted());
                        dispatch(setRoleSubmitted());
                    } else if (roles === undefined && level) {
                        dispatch(setRoleAdmin());
                        dispatch(setRoleSubmitted());
                        updateAdminFirebaseToken();
                    }
                }, 3000);
                actions.setSubmitting(false);
                actions.resetForm();
            },
            onError: err => {
                console.log(err.response?.status);

                if (err.response?.status === 402) {
                    errorText = t('failedSignIn');
                    actions.setErrors({
                        email: t('failedSignIn'),
                        password: t('failedSignIn'),
                    });
                } else if (err.response?.status === 400) {
                    errorText = t('inactiveAccSignIn');
                } else if (err.response?.status === 401) {
                    errorText = t('failedSignIn');
                }
                if (err.response?.status === 500) errorText = 'Server error';
                dispatch(showModal({ status: 'failed', text: errorText }));
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);
                actions.setSubmitting(false);
                handleAxiosError(err);
            },
            onSettled: () => {
                actions.setSubmitting(false);
            }
        });
    };

    const handleGoogleSignIn = async () => {
        signInWithGoogle().then(data => {
            const googleSignInReq: GoogleSignInRequest = {
                email: data ? data.user.email : '',
                name: data
                    ? `${data.user.givenName} ${data.user.familyName}`
                    : '',
                googleId: data ? data.user.id : '',
                imageUrl: data ? data.user.photo : '',
            };

            let errorText = 'Request Failed';

            mutationGoogleSignIn.mutate(googleSignInReq, {
                onSuccess: resp => {
                    console.log(JSON.stringify(resp.data.data, null, 2));
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('successSignIn'),
                        }),
                    );
                    dispatch(showProgressIndicator());

                    if (resp.data.data.level === undefined) {
                        saveDataUserToLocalStorage(resp.data);
                    } else {
                        saveAdminDataToLocalStorage(resp.data);
                    }

                    setTimeout(() => {
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                        dispatch(login());

                        const {
                            roles,
                            isCompanySubmitted,
                            level,
                            shipOwnerId,
                        } = resp.data.data;

                        if (roles === 'user') {
                            dispatch(setRoleNotSubmitted());
                        } else if (roles === 'shipOwner') {
                            if (isCompanySubmitted) {
                                dispatch(setCompanySubmitted());
                                dispatch(setRoleOwner());
                                if (shipOwnerId?.company.isVerified) {
                                    dispatch(setCompanyVerif());
                                } else if (shipOwnerId?.company.isRejected) {
                                    dispatch(setCompanyReject());
                                }
                            } else {
                                dispatch(setRoleOwner());
                            }
                            dispatch(setRoleSubmitted());
                        } else if (roles === 'renter') {
                            dispatch(setRoleRenter());
                            dispatch(setPreferencesSubmitted());
                            dispatch(setRoleSubmitted());
                        } else if (roles === undefined && level) {
                            dispatch(setRoleAdmin());
                            dispatch(setRoleSubmitted());
                            updateAdminFirebaseToken();
                        }
                    }, 3000);
                },
                onError: err => {
                    if (err.response?.status === 500) {
                        errorText = 'Server error';
                    } else if (err.response?.status === 401) {
                        errorText = t('inactiveAccSignIn');
                    }
                    dispatch(showModal({ status: 'failed', text: errorText }));
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    handleAxiosError(err);
                },
            });
        });
    };

    // let user: string | null = null;

    // async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
    //     if (user === null) {
    //         updateCredentialStateForUser('N/A');
    //     } else {
    //         const credentialState = await appleAuth.getCredentialStateForUser(
    //             user,
    //         );
    //         if (credentialState === appleAuth.State.AUTHORIZED) {
    //             updateCredentialStateForUser('AUTHORIZED');
    //         } else {
    //             updateCredentialStateForUser(credentialState);
    //         }
    //     }
    // }

    async function onAppleButtonPress() {
        // console.warn('Beginning Apple Authentication');

        // start a login request
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [
                    appleAuth.Scope.FULL_NAME,
                    appleAuth.Scope.EMAIL,
                ],
            });

            const credentialState = await appleAuth.getCredentialStateForUser(
                appleAuthRequestResponse.user,
            );
            console.log('appleAuthRequestResponse', appleAuthRequestResponse);

            const {
                user: newUser,
                email,
                nonce,
                identityToken,
                realUserStatus /* etc */,
            } = appleAuthRequestResponse;

            // user = newUser;

            // fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(
            //     error => updateCredentialStateForUser(`Error: ${error.code}`),
            // );

            if (credentialState === appleAuth.State.AUTHORIZED) {
                console.log('AUTHORIZED');

                if (identityToken) {
                    const appleCredential =
                        firebase.auth.AppleAuthProvider.credential(
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
                    // no token - failed sign-in?
                    throw new Error('Apple Sign-In failed');
                }

                if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
                    console.log("I'm a real person!");
                }
            }

            // console.warn(`Apple Authentication Completed, ${user}, ${email}`);
        } catch (error) {
            if ((error as any).code === appleAuth.Error.CANCELED) {
                console.warn('User canceled Apple Sign in.');
            } else {
                console.error(error);
            }
        }
    }

    const handleAppleSignIn = async () => {
        onAppleButtonPress().then(data => {
            console.log(JSON.stringify(data, null, 2));
            const appleSignInReq: AppleSignInRequest = {
                email: data ? data.userCredential.user.email : '',
                name: data
                    ? `${data.appleAuthRequestResponse.fullName?.givenName} ${data.appleAuthRequestResponse.fullName?.familyName}`
                    : '',
                appleId: data ? data.appleAuthRequestResponse.user : '',
            };

            let errorText = 'Request Failed';
            mutationAppleSignIn.mutate(appleSignInReq, {
                onSuccess: resp => {
                    console.log(JSON.stringify(resp.data.data, null, 2));
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('successSignIn'),
                        }),
                    );
                    dispatch(showProgressIndicator());

                    if (resp.data.data.level === undefined) {
                        saveDataUserToLocalStorage(resp.data);
                    } else {
                        saveAdminDataToLocalStorage(resp.data);
                    }

                    setTimeout(() => {
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                        dispatch(login());

                        const {
                            roles,
                            isCompanySubmitted,
                            level,
                            shipOwnerId,
                        } = resp.data.data;

                        if (roles === 'user') {
                            dispatch(setRoleNotSubmitted());
                        } else if (roles === 'shipOwner') {
                            if (isCompanySubmitted) {
                                dispatch(setCompanySubmitted());
                                dispatch(setRoleOwner());
                                if (shipOwnerId?.company.isVerified) {
                                    dispatch(setCompanyVerif());
                                } else if (shipOwnerId?.company.isRejected) {
                                    dispatch(setCompanyReject());
                                }
                            } else {
                                dispatch(setRoleOwner());
                            }
                            dispatch(setRoleSubmitted());
                        } else if (roles === 'renter') {
                            dispatch(setRoleRenter());
                            dispatch(setPreferencesSubmitted());
                            dispatch(setRoleSubmitted());
                        } else if (roles === undefined && level) {
                            dispatch(setRoleAdmin());
                            dispatch(setRoleSubmitted());
                            updateAdminFirebaseToken();
                        }
                    }, 3000);
                },
                onError: err => {
                    if (err.response?.status === 500) {
                        errorText = 'Server error';
                    } else if (err.response?.status === 401) {
                        errorText = t('inactiveAccSignIn');
                    }
                    dispatch(showModal({ status: 'failed', text: errorText }));
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    handleAxiosError(err);
                },
            });
        });
    };

    return (
        <ScreenLayout testId="SignInScreen" backgroundColor="secondary">
            <HeaderLogo />
            <View
                flex
                style={{
                    backgroundColor: Color.bgColor,
                    borderTopStartRadius: 20,
                    borderTopEndRadius: 20,
                    elevation: 20,
                    paddingHorizontal: 40,
                    justifyContent: 'center',
                }}>
                <FormSignIn
                    onSubmit={handleSignIn}
                    navigation={navigation}
                    onGoogleSignIn={handleGoogleSignIn}
                    onAppleSignIn={handleAppleSignIn}
                />
                <NewAccountSection navigation={navigation} />
            </View>
        </ScreenLayout>
    );
};

export default SignIn;
