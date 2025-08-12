import React from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button, CustomText, ScreenLayout } from '../../../../components';
import {
    Color,
    FontFamily,
    FontSize,
    OTPIcon,
    USERDATA,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from '../../../../configs';
import { useSendOTPEmailVerif, useVerifyEmailOTP } from '../../../../hooks';
import { modalSlice } from '../../../../slices';
import { VerifyEmailProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import { useTranslation } from 'react-i18next';

const VerifyEmail: React.FC<VerifyEmailProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('verifyemail');
    const { hideModal, showModal } = modalSlice.actions;
    const mutationSendOTPEmailVerif = useSendOTPEmailVerif();
    const mutationVerifEmailOTP = useVerifyEmailOTP();
    const [pinReady, setPinReady] = React.useState<boolean>(false);
    const [countdown, setCountdown] = React.useState<number>(0);
    const [userEmail, setUserEmail] = React.useState<string>('');
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
        setCountdownActive(true);
        mutationSendOTPEmailVerif.mutate(undefined, {
            onSuccess: () => {
                // hideProgressIndicator();

                dispatch(
                    showModal({
                        status: 'info',
                        text: t('infoNewCodeSent'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);
            },
            onError: err => {
                // hideProgressIndicator();
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('AccountHeader.failedSendEmailVerif'),
                    }),
                );
                handleAxiosError(err);
            },
        });
    };

    const handleVerifySent = () => {
        let errorText = 'Request Failed';
        mutationVerifEmailOTP.mutate(
            { emailVerifOTP: +code },
            {
                onSuccess: resp => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('successVerifyEmail'),
                        }),
                    );
                    getDataFromLocalStorage(USERDATA).then(resp => {
                        console.log('resp', resp);
                        setDataToLocalStorage(USERDATA, {
                            ...resp,
                            isVerified: true,
                        });
                        console.log('isVerifiedEmail', resp.isVerified);
                    });
                    setTimeout(() => {
                        dispatch(hideModal());
                        navigation.navigate('Account');
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                    if (err.response?.status === 422) {
                        errorText = t('failedInvalidOTP');
                    }
                    dispatch(showModal({ status: 'failed', text: errorText }));
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
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
                    color="darkTextColor"
                    textAlign="center">
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
        getDataFromLocalStorage(USERDATA).then(resp => {
            setUserEmail(resp.email);
        });
        dispatch(
            showModal({
                status: 'info',
                text: t('infoSentOTPCode'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 5000);
    }, []);

    return (
        <ScreenLayout
            flex
            center
            backgroundColor="light"
            testId="VerifyEmailScreen">
            <View
                center
                style={{
                    marginVertical: 30,
                }}>
                <OTPIcon />
                <CustomText
                    fontSize="xl"
                    fontFamily="bold"
                    color="darkTextColor">
                    {t('textEmailVerification')}
                </CustomText>
                <View paddingH-20>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor"
                        textAlign="center">
                        {t('textEnterOTP')}{' '}
                        <Text style={{ fontFamily: FontFamily.bold }}>
                            {userEmail}
                        </Text>{' '}
                        {t('textToVerify')}
                    </CustomText>
                </View>
                <View
                    center
                    style={{
                        marginVertical: 30,
                    }}>
                    <Pressable
                        testID='pressCode'
                        style={{
                            width: '70%',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                        onPress={handleOnPress}>
                        {codeDigitsArray.map(toCodeDigitInput)}
                    </Pressable>
                    <TextInput
                        testID='codeInput'
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
                    {t('textDidnt')}
                </CustomText>
                {countdown === 0 ? (
                    <Pressable onPress={startCountdown} testID='btnCount'>
                        <CustomText
                            fontSize="sm"
                            fontFamily="semiBold"
                            color="primaryColor"
                            borderBottomColor={Color.primaryColor}>
                            {t('textResend')}
                        </CustomText>
                    </Pressable>
                ) : (
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.sm,
                            color: Color.darkTextColor,
                        }}>
                        {t('textResendAgain')}{' '}
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
                        paddingHorizontal: 30,
                    }}>
                    <View flex>
                        <Button
                            testID='buttonVerify'
                            title={t('labelButtonVerify')}
                            disable={!pinReady}
                            onSubmit={handleVerifySent}
                        />
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

export default VerifyEmail;
