import { Formik, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, View } from 'react-native';
import * as yup from 'yup';
import {
    Button,
    CustomText,
    TextInput,
    TextInputError,
} from '../../../../components';
import {
    CloseEyeIcon,
    EmailIcon,
    FontFamily,
    FontSize,
    GoogleIcon,
    OpenEyeIcon,
    PasswordIcon,
} from '../../../../configs';
import { FormSignInProps, SignInRequest } from '../../../../types';
import {
    AppleButton,
    appleAuth,
} from '@invertase/react-native-apple-authentication';

const FormSignIn: React.FC<FormSignInProps> = ({
    onSubmit,
    navigation,
    onGoogleSignIn,
    onAppleSignIn,
}) => {
    console.log('apple auth is support?', appleAuth.isSupported);
    const { t } = useTranslation('signin');
    const [isPasswordVisible, setPasswordVisible] =
        React.useState<boolean>(false);

    const handlePasswordIconTouch = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const signInInitialValues: SignInRequest = {
        email: '',
        password: '',
    };

    const signInValidationScheme: yup.ObjectSchema<SignInRequest> = yup
        .object()
        .shape({
            email: yup
                .string()
                .email(t('FormSignIn.validationEmailInvalid'))
                .required(t('FormSignIn.validationEmailRequired')),
            password: yup
                .string()
                .required(t('FormSignIn.validationPasswordRequired')),
        });

    return (
        <Formik
            initialValues={signInInitialValues}
            onSubmit={onSubmit}
            validationSchema={signInValidationScheme}>
            {({
                handleBlur,
                handleChange,
                handleSubmit,
                values,
                touched,
                errors,
                isSubmitting,
            }: FormikProps<SignInRequest>) => (
                <>
                    <View>
                        <TextInput
                            leftIcon={<EmailIcon />}
                            placeholder={t('FormSignIn.placeholderEmail')}
                            label="Email"
                            onBlur={() => handleBlur('email')}
                            onChange={handleChange('email')}
                            error={touched.email && errors.email}
                            value={values.email}
                        />
                        {touched.email && errors.email && (
                            <TextInputError errorText={errors.email} />
                        )}
                    </View>
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
                            placeholder={t('FormSignIn.placeholderPassword')}
                            label="Password"
                            onIconTouch={() => handlePasswordIconTouch()}
                            secureTextEntry={!isPasswordVisible}
                            onBlur={handleBlur('password')}
                            onChange={handleChange('password')}
                            error={touched.password && errors.password}
                            value={values.password}
                            rightIconTestId="showPasswordButton"
                        />
                        {touched.password && errors.password && (
                            <TextInputError errorText={errors.password} />
                        )}
                    </View>
                    <View
                        style={{
                            top: -10,
                            alignItems: 'flex-end',
                        }}>
                        <Pressable
                            onPress={() =>
                                navigation.navigate('ForgotPassword')
                            }>
                            <CustomText
                                fontSize="sm"
                                fontFamily="regular"
                                color="primaryDisableColor">
                                {t('FormSignIn.textForgotPassword')}
                            </CustomText>
                        </Pressable>
                    </View>
                    <View
                        style={{
                            gap: 10,
                            marginTop: 10,
                        }}>
                        <Button
                            title={t('FormSignIn.labelButtonSignIn')}
                            isSubmitting={isSubmitting}
                            onSubmit={() => handleSubmit()}
                        />

                        <Button
                            title={t('FormSignIn.labelButtonSignInGoogle')}
                            onSubmit={() => onGoogleSignIn()}
                            google
                            leftIcon={<GoogleIcon />}
                        />
                        {Platform.OS === 'ios' && appleAuth.isSupported && (
                            <AppleButton
                                cornerRadius={5}
                                style={{ width: '100%', height: 40 }}
                                textStyle={{
                                    fontSize: FontSize.md,
                                    fontFamily: FontFamily.medium,
                                    color: 'red',
                                }}
                                buttonText="DLASJDLASJDASL"
                                buttonStyle={AppleButton.Style.WHITE}
                                buttonType={AppleButton.Type.SIGN_IN}
                                onPress={() => onAppleSignIn()}
                            />
                        )}
                    </View>
                </>
            )}
        </Formik>
    );
};

export default FormSignIn;
