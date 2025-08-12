import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CustomText, ScreenLayout } from '../../../../components';
import {
    AboutUsIcon,
    BlackContractIcon,
    BlackRFQIcon,
    BlackroposalIcon,
    BoatIcon,
    CheckboxIcon,
    Color,
    CompanyIcon,
    DeleteIcon,
    LanguageIcon,
    ProfileIcon,
    RFQFILEPATH,
    ROLES,
    SHIPOWNERDOCSUBMITTED,
    TOKEN,
    TrashIcon,
    USERDATA,
    VerifiedUserIcon,
    getDataFromLocalStorage,
    removeDataToLocalStorage,
    signOutGoogle,
} from '../../../../configs';
import {
    useGetUserNotif,
    useGetUserProfile,
    useSignOut,
} from '../../../../hooks';
import {
    modalSlice,
    notifBadgeSlice,
    progressIndicatorSlice,
    userStatusSlice,
} from '../../../../slices';
import { AccountProps, UserNotif } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import { AccountHeader, AccountMenuItem, DocumentMenuItem } from './components';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const Account: React.FC<AccountProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { t } = useTranslation('account');
    const { addNotifBadge } = notifBadgeSlice.actions;
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const { logout } = userStatusSlice.actions;
    const mutationSignOut = useSignOut();
    const mutationGetUserNotif = useGetUserNotif();
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const [isCompanySubmitted, setIsCompanySubmitted] =
        React.useState<boolean>(false);
    const [isPhoneNumberExist, setIsPhoneNumberExist] =
        React.useState<boolean>(false);
    const [firebaseId, setFirebaseId] = React.useState<string>('');
    const mutationGetUserProfile = useGetUserProfile();

    const onClickCompanyMenu = () => {
        navigation.navigate('CompanyRegister');
        isCompanySubmitted
            ? navigation.replace('Company')
            : navigation.replace('CompanyRegister');
    };

    const handleLogOut = async () => {
        await getDataFromLocalStorage(TOKEN).then(resp => {
            mutationSignOut.mutate(
                {
                    refreshToken: resp.refreshToken,
                },
                {
                    onSuccess: () => {
                        removeDataToLocalStorage(TOKEN);
                        removeDataToLocalStorage(ROLES);
                        removeDataToLocalStorage(SHIPOWNERDOCSUBMITTED);
                        removeDataToLocalStorage(RFQFILEPATH);
                        dispatch(
                            showModal({
                                status: 'success',
                                text: t('successSignOut'),
                            }),
                        );
                        dispatch(showProgressIndicator());
                        setTimeout(() => {
                            dispatch(hideModal());
                            dispatch(hideProgressIndicator());
                            dispatch(logout());
                        }, 2000);
                    },
                    onError: err => {
                        handleAxiosError(err);
                        setTimeout(() => {
                            dispatch(
                                showModal({
                                    status: 'failed',
                                    text: t('failedSignOut'),
                                }),
                            );
                        }, 2000);
                    },
                },
            );
            signOutGoogle();
        });
    };

    React.useEffect(() => {
        if (isFocused) {
            getDataFromLocalStorage(USERDATA).then(resp => {
                if (resp.isCompanySubmitted) {
                    setIsCompanySubmitted(true);
                } else {
                    setIsCompanySubmitted(false);
                }
            });
            getDataFromLocalStorage(USERDATA).then(resp => {
                if (resp.phoneNumber) {
                    setIsPhoneNumberExist(true);
                } else {
                    setIsPhoneNumberExist(false);
                    dispatch(
                        showModal({
                            status: 'info',
                            text: t('AccountHeader.infoAddPhoneNumber'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 3000);
                }
            });
            mutationGetUserProfile.mutate(undefined, {
                onSuccess: resp => {
                    setFirebaseId(resp.data.data.firebaseId);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });
        }
    }, [isFocused]);

    React.useEffect(() => {
        isFocused &&
            mutationGetUserNotif.mutate(undefined, {
                onSuccess: resp => {
                    if (resp.data && resp.data.data) {
                        dispatch(
                            addNotifBadge(
                                resp.data.data.filter(
                                    (notif: UserNotif) =>
                                        notif.isReaded === false,
                                ).length,
                            ),
                        );
                    }
                },
            });
    }, [isFocused]);

    return (
        <ScreenLayout
            testId="AccountScreen"
            backgroundColor="light"
            paddingV={30 + plusPaddingV}>
            <AccountHeader navigation={navigation} />
            <View
                style={{
                    margin: 6,
                    borderRadius: 8,
                    backgroundColor: Color.bgNeutralColor,
                }}>
                {/* <View
                    style={{
                        padding: 10,
                        margin: 5,
                        paddingTop: 0,
                        paddingBottom: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {t('textDocumentStatus')}
                    </CustomText>
                </View> */}
                <View>
                    {/* <View
                        style={{
                            padding: 5,
                            backgroundColor: Color.lightTextColor,
                            borderRadius: 40,
                            margin: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <DocumentMenuItem
                            onClick={() => navigation.navigate('RequestDetail')}
                            label={t('labelRequest')}
                            Icon={BlackRFQIcon}
                            paddingLeft={15}
                        />
                        <DocumentMenuItem
                            onClick={() =>
                                navigation.navigate('ProposalDetail')
                            }
                            label={t('labelProposal')}
                            Icon={BlackroposalIcon}
                            paddingLeft={20}
                        />
                        <DocumentMenuItem
                            onClick={() =>
                                navigation.navigate('ContractDetail')
                            }
                            label={t('labelContract')}
                            Icon={BlackContractIcon}
                            paddingLeft={17}
                        />
                    </View> */}
                </View>
                <AccountMenuItem
                    onClick={() => navigation.navigate('AccountVerification')}
                    label={t('labelAccountVerification')}
                    Icon={VerifiedUserIcon}
                />
                {isCompanySubmitted ? (
                    <AccountMenuItem
                        onClick={() => onClickCompanyMenu()}
                        label={t('labelCompanyProfile')}
                        Icon={CompanyIcon}
                    />
                ) : (
                    <AccountMenuItem
                        onClick={onClickCompanyMenu}
                        label={t('labelCompanyRegistration')}
                        Icon={CompanyIcon}
                    />
                )}
                {/* <AccountMenuItem
                    onClick={() => navigation.navigate('SavedShips')}
                    label={t('labelSavedShips')}
                    Icon={BoatIcon}
                /> */}
                <AccountMenuItem
                    onClick={() => navigation.navigate('RemindedShips')}
                    label={t('labelRemindedShips')}
                    Icon={BoatIcon}
                />
            </View>
            <View
                style={{
                    margin: 6,
                    borderRadius: 8,
                    backgroundColor: Color.bgNeutralColor,
                }}>
                {isPhoneNumberExist ? null : (
                    <AccountMenuItem
                        onClick={() => navigation.navigate('EditProfile')}
                        label={t('labelEditProfile')}
                        Icon={ProfileIcon}
                    />
                )}
                <AccountMenuItem
                    onClick={() => navigation.navigate('AboutUs')}
                    label={t('labelAboutUs')}
                    Icon={AboutUsIcon}
                />

                <AccountMenuItem
                    onClick={() => navigation.navigate('ChangeLanguage')}
                    label={t('labelChangeLanguage')}
                    Icon={LanguageIcon}
                />
                <AccountMenuItem
                    onClick={() => navigation.navigate('DeleteAccount')}
                    label={t('labelDeleteAccount')}
                    Icon={DeleteIcon}
                />
                {/* <AccountMenuItem
                    onClick={() => navigation.navigate('VerifyEmail')}
                    label={t('labelVerifyEmail')}
                    Icon={LanguageIcon}
                /> */}
            </View>
            <View
                style={{
                    alignSelf: 'center',
                }}>
                <View
                    style={{
                        marginTop: 16,
                        width: 150,
                    }}>
                    <Button title={t('buttonLogout')} onSubmit={handleLogOut} />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default Account;
