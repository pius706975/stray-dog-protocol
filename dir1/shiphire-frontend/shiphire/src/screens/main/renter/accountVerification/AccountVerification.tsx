import React, { useCallback, useMemo } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    FontFamily,
    FontSize,
    USERDATA,
    setDataToLocalStorage,
    Color,
} from '../../../../configs';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import {
    AccountVerificationProps,
    GetRenterDataResponse,
} from '../../../../types';
import {
    useGetRenterData,
    useSendOTPEmailVerif,
    useSendOTPPhoneVerif,
} from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';

const AccountVerification: React.FC<AccountVerificationProps> = ({
    navigation,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('account');

    const [renterData, setRenterData] = React.useState<GetRenterDataResponse>();

    const mutationSendOTPEmailVerif = useSendOTPEmailVerif();
    const mutationSendOTPPhoneVerif = useSendOTPPhoneVerif();
    const mutationGetRenterData = useGetRenterData();

    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;

    const handleVerifyEmail = useCallback(() => {
        dispatch(showProgressIndicator());
        mutationSendOTPEmailVerif.mutate(undefined, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                navigation.navigate('VerifEmail');
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('AccountHeader.failedSendEmailVerif'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                handleAxiosError(err);
            },
            onSettled: () => {
                dispatch(hideProgressIndicator());
            },
        });
    }, [dispatch, mutationSendOTPEmailVerif, navigation, t]);

    const handleVerifyPhone = useCallback(() => {
        dispatch(showProgressIndicator());
        mutationSendOTPPhoneVerif.mutate(undefined, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                navigation.navigate('VerifPhone');
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('AccountHeader.failedSendPhoneVerif'),
                    }),
                );
                handleAxiosError(err);
            },
            onSettled: () => {
                dispatch(hideProgressIndicator());
            },
        });
    }, [dispatch, mutationSendOTPPhoneVerif, navigation, t]);

    useFocusEffect(
        useCallback(() => {
            mutationGetRenterData.mutate(undefined, {
                onSuccess: resp => {
                    setRenterData(resp.data);
                    setDataToLocalStorage(USERDATA, {
                        name: resp.data.data.userId.name,
                        email: resp.data.data.userId.email,
                        phoneNumber: resp.data.data.userId.phoneNumber,
                        imageUrl: resp.data.data.userId.imageUrl,
                        isVerified: resp.data.data.userId.isVerified,
                        isPhoneVerified: resp.data.data.userId.isPhoneVerified,
                        isCompanySubmitted:
                            resp.data.data.userId.isCompanySubmitted,
                        isCompanyVerified: resp.data.data.company.isVerified,
                        isCompanyRejected: resp.data.data.company.isRejected,
                    });
                },
            });
        }, []),
    );

    const verificationContent = useMemo(() => {
        if (!renterData) {
            return (
                <ActivityIndicator size="large" color={Color.primaryColor} />
            );
        }

        const isVerified = renterData.data.userId.isVerified;
        const isPhoneVerified = renterData.data.userId.isPhoneVerified;

        if (!isVerified || !isPhoneVerified) {
            return (
                <View>
                    <View style={styles.alignStart}>
                        <Text style={styles.infoText}>
                            {t('AccountVerification.textSelectVerification')}
                        </Text>
                    </View>
                    <View style={styles.buttonGroup}>
                        {!isVerified && (
                            <Button
                                testID="verifyButton"
                                title={t(
                                    'AccountVerification.labelButtonVerify',
                                )}
                                color="warning"
                                onSubmit={handleVerifyEmail}
                            />
                        )}
                        {!isPhoneVerified && (
                            <View>
                                <Button
                                    title={t(
                                        'AccountVerification.labelButtonVerifyPhone',
                                    )}
                                    color="error"
                                    onSubmit={handleVerifyPhone}
                                />
                            </View>
                        )}
                    </View>
                </View>
            );
        }

        return (
            <View>
                <Text style={styles.infoText}>
                    {t('AccountVerification.textAccountVerified')}
                </Text>
            </View>
        );
    }, [renterData, handleVerifyEmail, handleVerifyPhone, t]);

    return (
        <ScreenLayout
            testId="ChangeLanguageScreen"
            padding={20}
            backgroundColor="light">
            {verificationContent}
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    alignStart: {
        alignItems: 'flex-start',
    },
    infoText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
    },
    buttonGroup: {
        marginTop: 10,
        gap: 10,
    },
});

export default AccountVerification;
