import { Formik, FormikProps } from 'formik';
import React from 'react';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button } from '.';
import { DynamicFormProps } from '../types';
import { getDynamicField, initDynamicForm } from '../utils';

const DynamicForm: React.FC<DynamicFormProps> = ({
    data,
    btnTitle,
    onSubmit,
    rightIcon,
    shipId,
}) => {
    const [dynamicInitialValue, setDynamicInitialValue] = React.useState<any>(
        {},
    );
    const [dynamicValidationSchema, setDynamicValidationSchema] =
        React.useState<any>({});

    const dispatch = useDispatch();

    React.useEffect(() => {
        initDynamicForm(
            setDynamicInitialValue,
            setDynamicValidationSchema,
            data,
        );
    }, [data]);

    return (
        data.length > 0 && (
            <Formik
                initialValues={dynamicInitialValue}
                validationSchema={dynamicValidationSchema}
                onSubmit={onSubmit}>
                {(props: FormikProps<any>) => {
                    return (
                        <>
                            {data.map((item, index) => {
                                return (
                                    <View key={index}>
                                        {getDynamicField(
                                            item,
                                            props,
                                            dispatch,
                                            shipId,
                                        )}
                                    </View>
                                );
                            })}
                            <View marginT-16>
                                <Button
                                    testID="dynamic-button"
                                    rightIcon={rightIcon}
                                    title={btnTitle}
                                    isSubmitting={props.isSubmitting}
                                    onSubmit={() => props.handleSubmit()}
                                />
                            </View>
                        </>
                    );
                }}
            </Formik>
        )
    );
};

export default DynamicForm;
