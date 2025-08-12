import React from 'react';
import { Modal, Pressable } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button, CustomText } from '../../../../../components';
import {
    CloseIcon,
    Color,
    FontFamily,
    FontSize,
    OTPIcon,
} from '../../../../../configs';
import {
    useSendOTPSignContract,
    useVerifySignContractOTP,
} from '../../../../../hooks';
import { modalSlice } from '../../../../../slices';
import { OTPModalContractProps } from '../../../../../types';
import { handleAxiosError } from '../../../../../utils';
import OTPField from './OTPField';
import { useTranslation } from 'react-i18next';

const OTPModal: React.FC<OTPModalContractProps> = ({
    visible,
    setVisible,
    parentProp,
    rentalId,
    renterEmail,
}) => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const mutationSendOTP = useSendOTPSignContract();
    const mutationVerifyOTP = useVerifySignContractOTP();
    const [pinReady, setPinReady] = React.useState<boolean>(false);
    const [countdown, setCountdown] = React.useState<number>(0);
    const [code, setCode] = React.useState<number>(0);
    const [countdownActive, setCountdownActive] =
        React.useState<boolean>(false);
    const navigation = parentProp.navigation;

    const startCountdown = () => {
        setCountdown(60);
        setCountdownActive(true);
        mutationSendOTP.mutate(undefined, {
            onSuccess: () => {},
            onError: err => {
                handleAxiosError(err);
            },
        });
    };

    const handleVerifyPressed = () => {
        let errorText = 'Request Failed';
        mutationVerifyOTP.mutate(
            { signContractOTP: code, rentalId },
            {
                onSuccess: () => {
                    setVisible(!visible);
                    navigation.replace('TransactionStatusTab');
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('OTPModal.successContractSign'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                    if (err.response?.status === 422) {
                        errorText = t('OTPModal.failedInvalidOTP');
                    }
                    dispatch(showModal({ status: 'failed', text: errorText }));
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    setCode(0);
                },
            },
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
    console.log('masuk');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            testID="OTPModal">
            <View
                flex
                row
                center
                style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    paddingHorizontal: 10,
                }}>
                <Pressable
                    style={{
                        borderRadius: 10,
                        paddingVertical: 30,
                        backgroundColor: Color.bgColor,
                        flex: 1,
                        alignItems: 'center',
                    }}>
                    <Pressable
                        testID="pressVisible"
                        style={{
                            position: 'absolute',
                            right: '6%',
                            top: '3%',
                        }}
                        onPress={() => setVisible(!visible)}>
                        <CloseIcon />
                    </Pressable>
                    <OTPIcon />
                    <CustomText
                        fontSize="xl"
                        fontFamily="bold"
                        color="darkTextColor"
                        lineHeight={50}>
                        {t('OTPModal.textOTPVerif')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {t('OTPModal.textEnterOTP')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="bold"
                        color="darkTextColor">
                        {renterEmail}
                    </CustomText>
                    <OTPField
                        testId="OTPField"
                        setPinReady={setPinReady}
                        setModalCode={setCode}
                        modalCode={code}
                    />
                    <Text
                        style={{
                            fontSize: FontSize.sm,
                            fontFamily: FontFamily.semiBold,
                            color: Color.darkTextColor,
                        }}>
                        {t('OTPModal.textDidnt')}
                    </Text>
                    {countdown === 0 ? (
                        <Pressable onPress={startCountdown} testID="pressCount">
                            <Text
                                style={{
                                    fontSize: FontSize.sm,
                                    fontFamily: FontFamily.semiBold,
                                    color: Color.primaryColor,
                                    borderBottomWidth: 1,
                                    borderColor: Color.primaryColor,
                                }}>
                                {t('OTPModal.textResend')}
                            </Text>
                        </Pressable>
                    ) : (
                        <Text
                            style={{
                                fontFamily: FontFamily.regular,
                                fontSize: FontSize.sm,
                                color: Color.darkTextColor,
                            }}>
                            {t('OTPModal.textResendAgain')}{' '}
                            <Text
                                style={{
                                    fontFamily: FontFamily.semiBold,
                                    color: Color.primaryColor,
                                }}>
                                {countdown}s
                            </Text>
                        </Text>
                    )}
                    <View row marginT-20 paddingH-30>
                        <View flex>
                            <Button
                                testID="verifyButton"
                                title={t('OTPModal.labelButtonVerify')}
                                disable={!pinReady}
                                onSubmit={handleVerifyPressed}
                                isSubmitting={mutationVerifyOTP.isLoading}
                            />
                        </View>
                    </View>
                </Pressable>
            </View>
        </Modal>
    );
};

export default OTPModal;
