import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import {
    Button,
    CustomText,
    HeaderLogo,
    ScreenLayout,
} from '../../../components';
import { Color, FontFamily, FontSize } from '../../../configs';
import { useSendOTPForgotPass, useVerifyForgotPassOTP } from '../../../hooks';
import { modalSlice } from '../../../slices';
import { VerifyOTPForgotPassProps } from '../../../types';
import { handleAxiosError } from '../../../utils';

const VerifyOTPForgotPass: React.FC<VerifyOTPForgotPassProps> = ({
    navigation,
    route,
}) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { email } = route.params;
    const { t } = useTranslation('forgotpassword');
    const mutationVerifOTP = useVerifyForgotPassOTP();
    const mutationSendOTP = useSendOTPForgotPass();
    const [pinReady, setPinReady] = React.useState<boolean>(false);
    const [countdown, setCountdown] = React.useState<number>(0);
    const [countdownActive, setCountdownActive] =
        React.useState<boolean>(false);
    const [code, setCode] = React.useState<string>('');
    const [inputContainerIsFocused, setInputContainerIsFocused] =
        React.useState<boolean>(false);
    const textInputRef = React.useRef<any>(null);
    const codeDigitsArray = new Array(4).fill(0);

    const handleOnPress = () => {
        setInputContainerIsFocused(true);
        textInputRef?.current?.focus();
    };

    const handleOnBlur = () => {
        setInputContainerIsFocused(false);
    };

    const startCountdown = () => {
        setCountdown(60);
        mutationSendOTP.mutate(
            { email },
            {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'info',
                            text: t('VerifyOTPForgotPass.infoNewCodeSent'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            },
        );
        setCountdownActive(true);
    };

    const handleVerifySent = () => {
        mutationVerifOTP.mutate(
            { email, forgotPassOTP: +code },
            {
                onSuccess: () => {
                    navigation.replace('ResetPassword', { email });
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
                style={{
                    borderColor:
                        inputContainerIsFocused && isDigitFocused
                            ? Color.secColor
                            : Color.primaryColor,
                    backgroundColor:
                        inputContainerIsFocused && isDigitFocused
                            ? Color.softSecColor
                            : Color.bgColor,
                    minWidth: '15%',
                    borderWidth: 3,
                    borderRadius: 5,
                    padding: 12,
                }}>
                <CustomText
                    fontSize="md"
                    fontFamily="semiBold"
                    color="darkTextColor">
                    {digit}
                </CustomText>
            </View>
        );
    };

    React.useEffect(() => {
        let countdownInterval: any;
        if (countdownActive) {
            countdownInterval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }

        if (countdown === 0 || !countdownActive) {
            clearInterval(countdownInterval);
            setCountdownActive(false);
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [countdown, countdownActive]);

    React.useEffect(() => {
        setPinReady(code.length === 4);
        return () => setPinReady(false);
    }, [code]);

    React.useEffect(() => {
        dispatch(
            showModal({
                status: 'info',
                text: t('VerifyOTPForgotPass.infoSentOTPCode'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 5000);
    }, []);

    return (
        <ScreenLayout
            backgroundColor="secondary"
            testId="VerifyOTPForgotPassScreen">
            <HeaderLogo />
            <View
                flex
                center
                style={{
                    backgroundColor: Color.bgColor,
                    borderTopStartRadius: 20,
                    borderTopEndRadius: 20,
                    elevation: 20,
                    paddingHorizontal: 40,
                }}>
                <View center>
                    <CustomText
                        fontSize="xl2"
                        fontFamily="bold"
                        color="primaryColor">
                        {t('VerifyOTPForgotPass.textEmailVerification')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor"
                        textAlign="center">
                        {t('VerifyOTPForgotPass.textEnterOTP')}{' '}
                        <Text style={{ fontFamily: FontFamily.bold }}>
                            {email}
                        </Text>{' '}
                        {t('VerifyOTPForgotPass.textToChange')}
                    </CustomText>
                </View>
                <View
                    center
                    style={{
                        marginVertical: 40,
                    }}>
                    <Pressable
                        style={{
                            width: '70%',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                        onPress={handleOnPress}>
                        {codeDigitsArray.map(toCodeDigitInput)}
                    </Pressable>
                    <TextInput
                        style={{
                            position: 'absolute',
                            width: '70%',
                            height: 10,
                            opacity: 0,
                        }}
                        value={code}
                        onChangeText={text => setCode(text)}
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
                    {t('VerifyOTPForgotPass.textDidnt')}
                </CustomText>
                {countdown === 0 ? (
                    <Pressable onPress={startCountdown}>
                        <CustomText
                            fontSize="sm"
                            fontFamily="semiBold"
                            color="primaryColor"
                            borderBottomColor={Color.primaryColor}>
                            {t('VerifyOTPForgotPass.textResend')}
                        </CustomText>
                    </Pressable>
                ) : (
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                            color: Color.darkTextColor,
                        }}>
                        {t('VerifyOTPForgotPass.textResendAgain')}{' '}
                        <Text
                            style={{
                                fontFamily: FontFamily.semiBold,
                                color: Color.primaryColor,
                            }}>
                            {countdown}s
                        </Text>
                    </Text>
                )}
                <View
                    row
                    style={{
                        marginTop: 20,
                    }}>
                    <View flex>
                        <Button
                            title={t('VerifyOTPForgotPass.labelButtonVerify')}
                            disable={!pinReady}
                            onSubmit={handleVerifySent}
                            isSubmitting={mutationVerifOTP.isLoading}
                        />
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

export default VerifyOTPForgotPass;
