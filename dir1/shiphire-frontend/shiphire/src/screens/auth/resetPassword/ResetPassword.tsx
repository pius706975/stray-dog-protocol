import { Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import {
    Button,
    CustomText,
    HeaderLogo,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../components';
import {
    CloseEyeIcon,
    Color,
    OpenEyeIcon,
    PasswordIcon,
} from '../../../configs';
import { useResetPassword } from '../../../hooks';
import { modalSlice } from '../../../slices';
import { ResetPasswordProps } from '../../../types';

const ResetPassword: React.FC<ResetPasswordProps> = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { email } = route.params;
    const { t } = useTranslation('forgotpassword');
    const mutationResetPassword = useResetPassword();
    const [isPasswordVisible, setPasswordVisible] =
        React.useState<boolean>(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] =
        React.useState<boolean>(false);

    const resetPassInitialValues: {
        password: string;
        confirmPassword: string;
    } = {
        password: '',
        confirmPassword: '',
    };

    const resetPassValidationScheme: yup.ObjectSchema<{
        password: string;
        confirmPassword: string;
    }> = yup.object().shape({
        password: yup
            .string()
            .min(6, t('ResetPassword.validationPasswordMustBe6Characters'))
            .matches(
                /(?=.*[0-9])/,
                t('ResetPassword.validationPasswordMustContainNumber'),
            )
            .required(t('ResetPassword.validationPasswordRequired')),
        confirmPassword: yup
            .string()
            .required(t('ResetPassword.validationConfirmPasswordRequired'))
            .oneOf(
                [yup.ref('password')],
                t('ResetPassword.validationConfirmPasswordNotMatch'),
            ),
    });

    const handleResetPassword = (
        values: { password: string; confirmPassword: string },
        actions: FormikHelpers<{ password: string; confirmPassword: string }>,
    ) => {
        mutationResetPassword.mutate(
            { email, newPassword: values.password },
            {
                onSuccess: () => {
                    actions.setSubmitting(false);
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('ResetPassword.successResetPassword'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    navigation.replace('SignIn');
                },
            },
        );
    };

    React.useEffect(() => {
        dispatch(
            showModal({
                status: 'info',
                text: t('ResetPassword.infoVerificationSuccess'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 4000);
    }, []);

    return (
        <ScreenLayout backgroundColor="secondary" testId="ResetPasswordScreen">
            <HeaderLogo />
            <View
                style={{
                    backgroundColor: Color.bgColor,
                    borderTopStartRadius: 20,
                    borderTopEndRadius: 20,
                    elevation: 20,
                    paddingHorizontal: 40,
                    justifyContent: 'center',
                    flex: 1,
                    gap: 30,
                }}>
                <View center>
                    <CustomText
                        fontFamily="bold"
                        fontSize="xl2"
                        color="primaryColor">
                        {t('ResetPassword.textResetPassword')}
                    </CustomText>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor"
                        textAlign="center">
                        {t('ResetPassword.textPleaseEnterNewPassword')}
                    </CustomText>
                </View>
                <Formik
                    initialValues={resetPassInitialValues}
                    onSubmit={handleResetPassword}
                    validationSchema={resetPassValidationScheme}>
                    {({
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                    }: FormikProps<{
                        password: string;
                        confirmPassword: string;
                    }>) => (
                        <View>
                            <View>
                                <TextInput
                                    leftIcon={<PasswordIcon />}
                                    rightIcon={
                                        isPasswordVisible ? (
                                            <CloseEyeIcon />
                                        ) : (
                                            <OpenEyeIcon />
                                        )
                                    }
                                    placeholder={t(
                                        'ResetPassword.placeholderPassword',
                                    )}
                                    label={t('ResetPassword.labelPassword')}
                                    rightIconTestId="pwSignUpIcon"
                                    onIconTouch={() =>
                                        setPasswordVisible(!isPasswordVisible)
                                    }
                                    secureTextEntry={!isPasswordVisible}
                                    onBlur={handleBlur('password')}
                                    onChange={handleChange('password')}
                                    error={touched.password && errors.password}
                                    value={values.password}
                                />
                                {touched.password && errors.password && (
                                    <TextInputError
                                        errorText={errors.password}
                                    />
                                )}
                            </View>
                            <View>
                                <TextInput
                                    leftIcon={<PasswordIcon />}
                                    rightIcon={
                                        isConfirmPasswordVisible ? (
                                            <CloseEyeIcon />
                                        ) : (
                                            <OpenEyeIcon />
                                        )
                                    }
                                    placeholder={t(
                                        'ResetPassword.placeholderConfirmPassword',
                                    )}
                                    label={t(
                                        'ResetPassword.labelConfirmPassword',
                                    )}
                                    rightIconTestId="confPwSignUpIcon"
                                    onIconTouch={() =>
                                        setConfirmPasswordVisible(
                                            !isConfirmPasswordVisible,
                                        )
                                    }
                                    secureTextEntry={!isConfirmPasswordVisible}
                                    onBlur={handleBlur('confirmPassword')}
                                    onChange={handleChange('confirmPassword')}
                                    error={
                                        touched.password &&
                                        errors.confirmPassword
                                    }
                                    value={values.confirmPassword}
                                />
                                {touched.password && errors.confirmPassword && (
                                    <TextInputError
                                        errorText={errors.confirmPassword}
                                    />
                                )}
                            </View>
                            <View marginT-30 style={{ gap: 4 }}>
                                <View>
                                    <Button
                                        title={t(
                                            'ResetPassword.textResetPassword',
                                        )}
                                        onSubmit={() => handleSubmit()}
                                        isSubmitting={isSubmitting}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </ScreenLayout>
    );
};

export default ResetPassword;
