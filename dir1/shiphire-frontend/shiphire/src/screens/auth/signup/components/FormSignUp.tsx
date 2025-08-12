import { Formik, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { Button, TextInput, TextInputError } from '../../../../components';
import {
    AccountIcon,
    CloseEyeIcon,
    EmailIcon,
    OpenEyeIcon,
    PasswordIcon,
    PhoneIcon,
} from '../../../../configs';
import { termsStatusSlice } from '../../../../slices';
import { FormSignUpProps, RootState, SignUpRequest } from '../../../../types';
import SignUpCheckBox from './SignUpCheckBox';

const FormSignUp: React.FC<FormSignUpProps> = ({
    onSubmit,
    setModalVisible,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('signup');
    const { checkTermsStatus } = termsStatusSlice.actions;
    const { status } = useSelector((state: RootState) => state.termsStatus);
    const [isPasswordVisible, setPasswordVisible] =
        React.useState<boolean>(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] =
        React.useState<boolean>(false);

    const signUpInitialValues: SignUpRequest & { checkbox: boolean } = {
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        checkbox: status,
    };

    const signUpValidationScheme: yup.ObjectSchema<
        SignUpRequest & { checkbox?: boolean }
    > = yup.object().shape({
        name: yup.string().required(t('FormSignUp.validationNameRequired')),
        email: yup
            .string()
            .email(t('FormSignUp.validationEmailInvalid'))
            .required(t('FormSignUp.validationEmailRequired')),
        phoneNumber: yup
            .string()
            .required(t('FormSignUp.validationPhoneNumberRequired')),
        password: yup
            .string()
            .min(6, t('FormSignUp.validationPasswordMustBe6Characters'))
            .matches(
                /(?=.*[0-9])/,
                t('FormSignUp.validationPasswordMustContainNumber'),
            )
            .required(t('FormSignUp.validationPasswordRequired')),
        confirmPassword: yup
            .string()
            .required(t('FormSignUp.validationConfirmPasswordRequired'))
            .oneOf(
                [yup.ref('password')],
                t('FormSignUp.validationConfirmPasswordNotMatch'),
            ),
        checkbox: yup.boolean(),
    });

    return (
        <Formik
            initialValues={signUpInitialValues}
            onSubmit={onSubmit}
            validationSchema={signUpValidationScheme}>
            {({
                handleBlur,
                handleChange,
                handleSubmit,
                values,
                touched,
                errors,
                isSubmitting,
                setFieldValue,
            }: FormikProps<SignUpRequest & { checkbox: boolean }>) => (
                <>
                    <View>
                        <TextInput
                            leftIcon={<AccountIcon />}
                            placeholder={t('FormSignUp.placeholderName')}
                            label={t('FormSignUp.labelName')}
                            onBlur={handleBlur('name')}
                            onChange={handleChange('name')}
                            error={touched.name && errors.name}
                            value={values.name}
                        />
                        {touched.name && errors.name && (
                            <TextInputError errorText={errors.name} />
                        )}
                    </View>
                    <View>
                        <TextInput
                            leftIcon={<EmailIcon />}
                            placeholder={t('FormSignUp.placeholderEmail')}
                            label={t('FormSignUp.labelEmail')}
                            onBlur={handleBlur('email')}
                            onChange={handleChange('email')}
                            error={touched.email && errors.email}
                            value={values.email}
                            keyboardType="email-address"
                        />
                        {touched.email && errors.email && (
                            <TextInputError errorText={errors.email} />
                        )}
                    </View>
                    <View>
                        <TextInput
                            leftIcon={<PhoneIcon />}
                            placeholder={t('FormSignUp.placeholderPhoneNumber')}
                            label={t('FormSignUp.labelPhoneNumber')}
                            onBlur={handleBlur('phoneNumber')}
                            onChange={handleChange('phoneNumber')}
                            error={touched.phoneNumber && errors.phoneNumber}
                            value={values.phoneNumber}
                            keyboardType="number-pad"
                        />
                        {touched.phoneNumber && errors.phoneNumber && (
                            <TextInputError errorText={errors.phoneNumber} />
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
                            placeholder={t('FormSignUp.placeholderPassword')}
                            label={t('FormSignUp.labelPassword')}
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
                            <TextInputError errorText={errors.password} />
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
                                'FormSignUp.placeholderConfirmPassword',
                            )}
                            label={t('FormSignUp.labelConfirmPassword')}
                            rightIconTestId="confPwSignUpIcon"
                            onIconTouch={() =>
                                setConfirmPasswordVisible(
                                    !isConfirmPasswordVisible,
                                )
                            }
                            secureTextEntry={!isConfirmPasswordVisible}
                            onBlur={handleBlur('confirmPassword')}
                            onChange={handleChange('confirmPassword')}
                            error={touched.password && errors.confirmPassword}
                            value={values.confirmPassword}
                        />
                        {touched.password && errors.confirmPassword && (
                            <TextInputError
                                errorText={errors.confirmPassword}
                            />
                        )}
                    </View>
                    <SignUpCheckBox
                        checked={status}
                        onPress={() => dispatch(checkTermsStatus())}
                        setModalVisible={setModalVisible}
                    />
                    <Button
                        title={t('FormSignUp.labelButtonSignUp')}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                </>
            )}
        </Formik>
    );
};

export default FormSignUp;
