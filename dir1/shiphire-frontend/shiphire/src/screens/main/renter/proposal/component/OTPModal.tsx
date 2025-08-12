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
import { useVerifySignProposalOTP } from '../../../../../hooks';
import { modalSlice } from '../../../../../slices';
import { OTPModalProps } from '../../../../../types';
import { handleAxiosError } from '../../../../../utils';
import OTPField from './OTPField';

const OTPModal: React.FC<OTPModalProps> = ({
    visible,
    setVisible,
    parentProp,
    rentalId,
    renterEmail,
}) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const mutationVerifyOTP = useVerifySignProposalOTP();
    const [pinReady, setPinReady] = React.useState<boolean>(false);
    const [countdown, setCountdown] = React.useState<number>(0);
    const [code, setCode] = React.useState<number>(0);
    const [countdownActive, setCountdownActive] =
        React.useState<boolean>(false);
    const navigation = parentProp.navigation;

    const startCountdown = () => {
        setCountdown(60);
        setCountdownActive(true);
    };

    const handleVerifyPressed = () => {
        let errorText = 'Request Failed';
        mutationVerifyOTP.mutate(
            { signProposalOTP: code, rentalId },
            {
                onSuccess: () => {
                    setVisible(!visible);
                    // navigation.replace('Payment', { rentalId });
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Proposal signing success!',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                    if (err.response?.status === 422) {
                        errorText = 'Invalid OTP! Please re-check your email!';
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

    return (
        <Modal
            testID="OTPModal"
            animationType="slide"
            transparent={true}
            visible={visible}>
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
                        OTP Verification
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        Enter OTP Code sent to
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
                        Didn't receive OTP code?
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
                                Resend Code
                            </Text>
                        </Pressable>
                    ) : (
                        <Text
                            style={{
                                fontFamily: FontFamily.regular,
                                fontSize: FontSize.sm,
                                color: Color.darkTextColor,
                            }}>
                            Resend code again in{' '}
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
                                title="Verify OTP"
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
