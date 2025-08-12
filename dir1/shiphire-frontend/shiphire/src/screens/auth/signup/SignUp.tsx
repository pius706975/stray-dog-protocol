import { FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { CustomText, ScreenLayout } from '../../../components';
import { Color } from '../../../configs';
import { useSignUp } from '../../../hooks';
import { modalSlice, termsStatusSlice } from '../../../slices';
import { RootState, SignUpProps, SignUpRequest } from '../../../types';
import { FormSignUp, TermsModal } from './components';

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('signup');
    const { hideModal, showModal } = modalSlice.actions;
    const { restartTermsStatus } = termsStatusSlice.actions;
    const { status } = useSelector((state: RootState) => state.termsStatus);
    const mutationSignUp = useSignUp();
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);

    const handleSignUp = (
        values: SignUpRequest & { checkbox: boolean },
        actions: FormikHelpers<SignUpRequest & { checkbox: boolean }>,
    ) => {
        if (!status) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('failedPleaseReadTerms'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);

            actions.setSubmitting(false);
            return;
        }

        let errorText = 'Request Failed';
        mutationSignUp.mutate(values, {
            onSuccess: resp => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('successSignUp'),
                    }),
                );
                navigation.navigate('SignIn');
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);
                actions.setSubmitting(false);
            },
            onError: (err: any) => {
                if (err.response?.status === 409) {
                    if (err.response.data.data === 'email') {
                        errorText = t('failedEmailAlreadyExist');
                        actions.setErrors({
                            email: t('failedEmailAlreadyExist'),
                        });
                    } else {
                        errorText = t('failedPhoneNumberAlreadyExist');
                        actions.setErrors({
                            phoneNumber: t('failedPhoneNumberAlreadyExist'),
                        });
                    }
                }
                if (err.response?.status === 400) {
                    errorText = t('failedEmailInvalid');
                    actions.setErrors({ email: t('failedEmailInvalid') });
                }
                if (err.response?.status === 500) errorText = 'Server error';

                dispatch(showModal({ status: 'failed', text: errorText }));
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);
                actions.setSubmitting(false);
            },
        });
    };

    React.useEffect(() => {
        dispatch(restartTermsStatus());
    }, []);

    return (
        <ScreenLayout
            backgroundColor="light"
            testId="SignUpScreen"
            paddingV={10}>
            <View
                flex
                centerV
                style={{
                    backgroundColor: Color.bgColor,
                    paddingHorizontal: 40,
                }}>
                <FormSignUp
                    onSubmit={handleSignUp}
                    setModalVisible={setModalVisible}
                />
                <View
                    center
                    style={{
                        marginTop: 26,
                    }}>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {t('textAlreadyHaveAccount')}
                    </CustomText>
                    <Pressable onPress={() => navigation.navigate('SignIn')}>
                        <CustomText
                            fontSize="sm"
                            fontFamily="regular"
                            color="primaryColor"
                            borderBottomColor={Color.primaryColor}>
                            {t('textSignIn')}
                        </CustomText>
                    </Pressable>
                </View>
            </View>
            <TermsModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        </ScreenLayout>
    );
};

export default SignUp;
