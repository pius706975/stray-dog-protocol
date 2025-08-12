import { Formik, FormikHelpers } from "formik";
import React from "react";
import { View } from "react-native";
import * as yup from 'yup';
import { Button, TextInput, TextInputError } from "../../components";
import { EmailIcon, PasswordIcon } from "../../configs";

type ExFormProps = {
    onSubmit: (
        values: { email: string, password: string },
        actions: FormikHelpers<{ email: string, password: string }>
    ) => void
}

export const ExFormComponent: React.FC<ExFormProps> = ({ onSubmit }) => {
    const validationSchema = yup.object({
        email: yup.string().email('Please enter valid email').required('This field is required'),
        password: yup.string().required('This field is required'),
    });
    return (
        <View>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({
                    handleSubmit,
                    handleBlur,
                    handleChange,
                    touched,
                    values,
                    errors,
                    isSubmitting
                }) => (
                    <View>
                        <TextInput
                            leftIcon={<EmailIcon />}
                            placeholder="Enter your email"
                            label="Email"
                            onBlur={handleBlur('email')}
                            onChange={handleChange('email')}
                            error={touched.email && errors.email}
                            value={values.email}
                        />
                        {touched.email && errors.email && (
                            <TextInputError errorText={errors.email} />
                        )}
                        <TextInput
                            leftIcon={<PasswordIcon />}
                            placeholder="Enter your password"
                            label="Password"
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
                        <Button
                            title="Sign In"
                            isSubmitting={isSubmitting}
                            onSubmit={() => handleSubmit()}
                        />
                    </View>
                )}
            </Formik>
        </View>
    )
}

const ExampleTest: React.FC = () => {
    const onSubmitForm = (
        values: { email: string, password: string },
        actions: FormikHelpers<{ email: string, password: string }>
    ) => {
        console.log(JSON.stringify(values, null, 4));
        console.log('submitted')
    }

    return (
        <View>
            <ExFormComponent onSubmit={onSubmitForm} />
        </View>
    )
}

export default ExampleTest