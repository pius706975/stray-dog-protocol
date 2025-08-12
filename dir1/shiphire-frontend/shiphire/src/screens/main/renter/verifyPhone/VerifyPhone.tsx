import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, CustomText, ScreenLayout } from '../../../../components';
import {
    Color,
    FCMTOKEN,
    FontFamily,
    FontSize,
    OTPIcon,
    USERDATA,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from '../../../../configs';
import {
    useSendOTPPhoneVerif,
    useVerifyPhoneByAdmin,
    useVerifyPhoneOTP,
} from '../../../../hooks';
import { modalSlice } from '../../../../slices';
import { VerifyPhoneProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import ConfirmationModal from './components/ConfirmationModal';

const VerifyPhone: React.FC<VerifyPhoneProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { t } = useTranslation('verifyemail');
    const { hideModal, showModal } = modalSlice.actions;

    const mutationVerifyPhoneOTP = useVerifyPhoneOTP();
    const mutationSendOTPPhoneVerif = useSendOTPPhoneVerif();
    const mutationVerifyPhoneByAdmin = useVerifyPhoneByAdmin();

    const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
    const [pinReady, setPinReady] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const [token, setToken] = useState<string>('');
    const [isContactAdminBtnDisabled, setIsContactAdminBtnDisabled] =
        useState<boolean>(false);
    const [isShowConfirmModal, setIsShowConfirmModal] =
        useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [inputContainerIsFocused, setInputContainerIsFocused] =
        useState<boolean>(false);
    const [timer, setTimer] = useState<number>(60);

    const textInputRef = useRef<any>(null);
    const codeDigitsArray = Array(4).fill(0);

    const handleOnPress = () => {
        setInputContainerIsFocused(true);
        textInputRef?.current?.focus();
    };

    const handleOnBlur = () => {
        setInputContainerIsFocused(false);
    };

    const startCountdown = () => {
        setCountdown(60);
        mutationSendOTPPhoneVerif.mutate(undefined, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'info',
                        text: t('infoSentOTPCodeVerifyPhone'),
                    }),
                );
                setTimeout(() => dispatch(hideModal()), 4000);
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('failedSendPhoneVerif'),
                    }),
                );
                handleAxiosError(err);
            },
        });
    };

    const handleVerifyPhoneByAdmin = useCallback(() => {
        if (!isContactAdminBtnDisabled) {
            mutationVerifyPhoneByAdmin.mutate(
                { token },
                {
                    onSuccess: () => {
                        setIsShowConfirmModal(false);
                        dispatch(
                            showModal({
                                status: 'success',
                                text: t('textVerificationReqSent'),
                            }),
                        );
                        setTimeout(() => dispatch(hideModal()), 4000);
                    },
                    onError: handleAxiosError,
                },
            );
            setIsContactAdminBtnDisabled(true);
        }
    }, [
        isContactAdminBtnDisabled,
        dispatch,
        mutationVerifyPhoneByAdmin,
        token,
    ]);

    const handleVerifySent = () => {
        let errorText = 'Request Failed';
        mutationVerifyPhoneOTP.mutateAsync(
            { phoneVerifOTP: +code },
            {
                onSuccess: _ => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('successVerifyPhone'),
                        }),
                    );
                    getDataFromLocalStorage(USERDATA).then(resp => {
                        setDataToLocalStorage(USERDATA, {
                            ...resp,
                            isPhoneVerified: true,
                        });
                    });
                    setTimeout(() => {
                        dispatch(hideModal());
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'MainScreenTab',
                                    params: { screen: 'Account' },
                                },
                            ],
                        });
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                    if (err.response?.status === 422) {
                        errorText = t('failedInvalidOTPVerifyPhone');
                    }
                    dispatch(showModal({ status: 'failed', text: errorText }));
                    setTimeout(() => dispatch(hideModal()), 4000);
                    setCode('');
                },
            },
        );
    };

    const toCodeDigitInput = (_value: number, index: number) => {
        const emptyInputChar = ' ';
        const digit = code[index] || emptyInputChar;
        const isCurrentDigit = index === code.length;
        const isLastDigit = index === 3;
        const isCodeFull = code.length === 3;
        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        return (
            <View
                key={index}
                style={[
                    styles.codeDigitContainer,
                    inputContainerIsFocused &&
                        isDigitFocused &&
                        styles.codeDigitFocused,
                ]}>
                <CustomText
                    fontSize="md"
                    fontFamily="semiBold"
                    color="darkTextColor"
                    textAlign="center">
                    {digit}
                </CustomText>
            </View>
        );
    };

    useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(resp =>
            setUserPhoneNumber(resp.phoneNumber),
        );
        dispatch(
            showModal({
                status: 'info',
                text: t('infoSentOTPCodeVerifyPhone'),
            }),
        );
        setTimeout(() => dispatch(hideModal()), 5000);
    }, [dispatch, t]);

    useEffect(() => {
        let countdownInterval: any;
        if (countdown > 0) {
            countdownInterval = setInterval(
                () => setCountdown(prevCountdown => prevCountdown - 1),
                1000,
            );
        }
        return () => clearInterval(countdownInterval);
    }, [countdown]);

    useEffect(() => {
        setPinReady(code.length === 4);
        return () => setPinReady(false);
    }, [code]);

    useEffect(() => {
        getDataFromLocalStorage(FCMTOKEN).then(resp => resp && setToken(resp));
    }, [isFocused]);

    useEffect(() => {
        if (isContactAdminBtnDisabled) {
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer === 1) {
                        clearInterval(interval);
                        setIsContactAdminBtnDisabled(false);
                        return 60;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isContactAdminBtnDisabled]);

    return (
        <ScreenLayout
            flex
            center
            backgroundColor="light"
            testId="VerifyPhoneScreen">
            <View center style={styles.container}>
                <OTPIcon />
                <CustomText
                    fontSize="xl"
                    fontFamily="bold"
                    color="darkTextColor">
                    {t('textPhoneNumberVerification')}
                </CustomText>
                <View paddingH-20>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor"
                        textAlign="center">
                        {t('textEnterOTP')}{' '}
                        <Text style={styles.boldText}>{userPhoneNumber}</Text>{' '}
                        {t('textToVerifyPhone')}
                    </CustomText>
                </View>
                <View center style={styles.codeInputContainer}>
                    <Pressable
                        testID="pressCode"
                        style={styles.pressableCodeInput}
                        onPress={handleOnPress}>
                        {codeDigitsArray.map(toCodeDigitInput)}
                    </Pressable>
                    <TextInput
                        testID="codeInput"
                        style={styles.hiddenCodeInput}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={4}
                        returnKeyType="done"
                        textContentType="oneTimeCode"
                        onBlur={handleOnBlur}
                    />
                </View>
                <CustomText
                    fontSize="sm"
                    fontFamily="semiBold"
                    color="darkTextColor">
                    {t('textDidnt')}
                </CustomText>
                {countdown === 0 ? (
                    <Pressable onPress={startCountdown} testID="btnCount">
                        <CustomText
                            fontSize="sm"
                            fontFamily="semiBold"
                            color="primaryColor"
                            borderBottomColor={Color.primaryColor}>
                            {t('textResend')}
                        </CustomText>
                    </Pressable>
                ) : (
                    <Text style={styles.countdownText}>
                        {t('textResendAgain')}{' '}
                        <Text style={styles.countdownNumber}>{countdown}s</Text>
                    </Text>
                )}
                <View style={styles.centerContent}>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {t('textOr')}
                    </CustomText>
                    {isContactAdminBtnDisabled ? (
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="primaryColor">
                            <Text style={styles.verificationReqText}>
                                {t('textVerificationReqSentAgain')}{' '}
                            </Text>
                            {timer}s
                        </CustomText>
                    ) : (
                        <Pressable
                            testID="anchorContactAdmin"
                            onPress={() => setIsShowConfirmModal(true)}>
                            <CustomText
                                fontFamily="regular"
                                fontSize="sm"
                                color="primaryColor"
                                borderBottomColor={Color.primaryColor}>
                                {t('textContactAdmin')}
                            </CustomText>
                        </Pressable>
                    )}
                </View>
                <View row style={styles.verifyButtonContainer}>
                    <View flex>
                        <Button
                            testID="buttonVerify"
                            title={t('labelButtonVerify')}
                            disable={!pinReady}
                            onSubmit={handleVerifySent}
                        />
                    </View>
                </View>
            </View>
            <ConfirmationModal
                testID="shipTrackingConfirmModal"
                isVisible={isShowConfirmModal}
                onConfirm={handleVerifyPhoneByAdmin}
                onCancel={() => setIsShowConfirmModal(false)}
            />
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
    },
    codeDigitContainer: {
        minWidth: '15%',
        borderWidth: 3,
        borderRadius: 5,
        padding: 12,
        borderColor: Color.primaryColor,
        backgroundColor: Color.bgColor,
    },
    codeDigitFocused: {
        borderColor: Color.secColor,
        backgroundColor: Color.softSecColor,
    },
    boldText: {
        fontFamily: FontFamily.bold,
    },
    codeInputContainer: {
        marginVertical: 30,
    },
    pressableCodeInput: {
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    hiddenCodeInput: {
        position: 'absolute',
        width: '70%',
        height: 10,
        opacity: 0,
    },
    countdownText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Color.darkTextColor,
    },
    countdownNumber: {
        fontFamily: FontFamily.semiBold,
        color: Color.primaryColor,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    verificationReqText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Color.darkTextColor,
    },
    verifyButtonContainer: {
        marginTop: 20,
        paddingHorizontal: 30,
    },
});

export default VerifyPhone;
