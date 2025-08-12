import React from 'react';
import { Button, ScreenLayout } from '../../../../components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import {
    getDataFromLocalStorage,
    TOKEN,
    removeDataToLocalStorage,
    ROLES,
    Color,
    LanguageIcon,
    ADMINDATA,
} from '../../../../configs';
import { handleAxiosError } from '../../../../utils';
import { useSignOut, useUpdateFirebaseToken } from '../../../../hooks';
import { useDispatch } from 'react-redux';
import {
    modalSlice,
    progressIndicatorSlice,
    userStatusSlice,
} from '../../../../slices';
import { View } from 'react-native-ui-lib';
import { AccountMenuItem } from './components';
import { AccountProps } from '../../../../types';
import { useTranslation } from 'react-i18next';

const Account: React.FC<AccountProps> = ({ navigation }) => {
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const { t } = useTranslation('account');
    const mutationSignOut = useSignOut();
    const mutationUpdateFirebaseToken = useUpdateFirebaseToken();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const { logout } = userStatusSlice.actions;

    const updateAdminFirebaseToken = async () => {
        const payload = {
            token: '',
        };

        await mutationUpdateFirebaseToken.mutateAsync(payload, {
            onError: err => {
                handleAxiosError(err);
            },
        });
    };

    const handleLogOut = async () => {
        await getDataFromLocalStorage(TOKEN).then(resp => {
            mutationSignOut.mutate(
                {
                    refreshToken: resp.refreshToken,
                },
                {
                    onSuccess: async () => {
                        await updateAdminFirebaseToken();
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
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: t('failedSignOut'),
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 2000);
                        handleAxiosError(err);
                    },
                },
            );
        });
    };
    return (
        <ScreenLayout
            backgroundColor="light"
            testId="adminHomeScreen"
            paddingV={plusPaddingV}>
            <View
                style={{
                    margin: 6,
                    borderRadius: 8,
                    backgroundColor: Color.bgNeutralColor,
                }}>
                <AccountMenuItem
                    onClick={() => navigation.navigate('ChangeLanguage')}
                    label={t('labelChangeLanguage')}
                    Icon={LanguageIcon}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                }}>
                <View
                    style={{
                        marginTop: 350,
                        width: 150,
                    }}>
                    <Button title="Logout" onSubmit={handleLogOut} />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default Account;
