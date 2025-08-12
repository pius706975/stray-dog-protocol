import { Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import * as yup from 'yup';
import {
    Button,
    CustomText,
    HeaderLogo,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../components';
import { Color, EmailIcon } from '../../../configs';
import { useSendOTPForgotPass } from '../../../hooks';
import { ForgotPasswordProps } from '../../../types';
import { handleAxiosError } from '../../../utils';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
    const mutationSendOTP = useSendOTPForgotPass();
    const { t } = useTranslation('forgotpassword');
    const forgotPassInitialValues: { email: string } = {
        email: '',
    };

    const forgotPassValidationScheme: yup.ObjectSchema<{ email: string }> = yup
        .object()
        .shape({
            email: yup
                .string()
                .email(t('validationEmailRequired'))
                .required(t('validationEmailInvalid')),
        });

    const handleForgotPass = (
        values: { email: string },
        actions: FormikHelpers<{ email: string }>,
    ) => {
        mutationSendOTP.mutate(
            { email: values.email },
            {
                onSuccess: () => {
                    actions.setSubmitting(false);
                    navigation.replace('VerifyOTPForgotPass', {
                        email: values.email,
                    });
                },
                onError: err => {
                    handleAxiosError(err);
                },
            },
        );
    };

    return (
        <ScreenLayout backgroundColor="secondary" testId="ForgotPasswordScreen">
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
                }}>
                <View center>
                    <CustomText
                        fontFamily="bold"
                        fontSize="xl2"
                        color="primaryColor">
                        {t('textForgotPassword')}
                    </CustomText>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor"
                        textAlign="center">
                        {t('textPleaseEnterEmail')}
                    </CustomText>
                </View>
                <Formik
                    initialValues={forgotPassInitialValues}
                    onSubmit={handleForgotPass}
                    validationSchema={forgotPassValidationScheme}>
                    {({
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                    }: FormikProps<{ email: string }>) => (
                        <View>
                            <View marginT-40 marginB-30>
                                <TextInput
                                    leftIcon={<EmailIcon />}
                                    placeholder={t('placeholderEmail')}
                                    label={t('labelEmail')}
                                    onBlur={() => handleBlur('email')}
                                    onChange={handleChange('email')}
                                    error={touched.email && errors.email}
                                    value={values.email}
                                />
                                {touched.email && errors.email && (
                                    <TextInputError errorText={errors.email} />
                                )}
                            </View>
                            <View style={{ gap: 4 }}>
                                <View>
                                    <Button
                                        title={t('labelButtonSend')}
                                        onSubmit={() => handleSubmit()}
                                        isSubmitting={isSubmitting}
                                    />
                                </View>
                                <Pressable
                                    style={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() =>
                                        navigation.navigate('SignIn')
                                    }>
                                    <CustomText
                                        fontFamily="medium"
                                        fontSize="lg"
                                        color="primaryColor"
                                        borderBottomColor={Color.primaryColor}>
                                        {t('textBackToLogin')}
                                    </CustomText>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </ScreenLayout>
    );
};

export default ForgotPassword;
