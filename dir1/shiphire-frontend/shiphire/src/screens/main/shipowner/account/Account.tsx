import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import {
    AboutUsIcon,
    COMPANYDATA,
    Color,
    CompanyIcon,
    DeleteIcon,
    LanguageIcon,
} from '../../../../configs';
import {
    modalSlice,
    progressIndicatorSlice,
    userStatusSlice,
} from '../../../../slices';
import { useGetUserProfile, useSignOut } from '../../../../hooks';
import {
    ROLES,
    SHIPOWNERDOCSUBMITTED,
    TOKEN,
    getDataFromLocalStorage,
    removeDataToLocalStorage,
} from '../../../../configs';
import { Button, CustomText, ScreenLayout } from '../../../../components';
import { handleAxiosError } from '../../../../utils';
import { useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { AccountProps, ShipOwnerAccountProps } from '../../../../types';
import { AccountHeader, AccountMenuItem } from './components';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

const Account: React.FC<ShipOwnerAccountProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('account');
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const { logout } = userStatusSlice.actions;
    const mutationSignOut = useSignOut();
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const [isCompanySubmitted, setIsCompanySubmitted] =
        React.useState<boolean>(false);
    const [firebaseId, setFirebaseId] = React.useState<string>('');
    const mutationGetUserProfile = useGetUserProfile();
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            getDataFromLocalStorage(COMPANYDATA).then(resp => {
                if (resp.isCompanySubmitted) {
                    setIsCompanySubmitted(true);
                } else {
                    setIsCompanySubmitted(false);
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
        });
    };

    return (
        <ScreenLayout
            testId="AccountScreen"
            backgroundColor="light"
            paddingV={30 + plusPaddingV}>
            <AccountHeader />
            <View
                marginT-16
                style={{
                    margin: 6,
                    borderRadius: 8,
                    backgroundColor: Color.bgNeutralColor,
                }}>
                <AccountMenuItem
                    testID="CompanyAfterSubmitted"
                    onClick={() => navigation.navigate('ShipOwnerCompany')}
                    label={t('labelCompanyProfile')}
                    Icon={CompanyIcon}
                />

                <AccountMenuItem
                    testID="ChangeLanguage"
                    onClick={() => navigation.navigate('ChangeLanguage')}
                    label={t('labelChangeLanguage')}
                    Icon={LanguageIcon}
                />
                <AccountMenuItem
                    testID="AboutUs"
                    onClick={() => navigation.navigate('AboutUs')}
                    label={t('labelAboutUs')}
                    Icon={AboutUsIcon}
                />
                <AccountMenuItem
                    onClick={() => navigation.navigate('DeleteAccount')}
                    label={t('labelDeleteAccount')}
                    Icon={DeleteIcon}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                }}>
                <View
                    style={{
                        marginTop: 200,
                        width: 150,
                    }}>
                    <Button
                        testID="Logout"
                        title={t("buttonLogout")}
                        onSubmit={handleLogOut}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default Account;
