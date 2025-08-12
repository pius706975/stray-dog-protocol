import { FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { ProgressBar, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { DynamicForm, ScreenLayout } from '../../../../components';
import { ArrowIcon, Color } from '../../../../configs';
import { useGetAddShipDynamicForm } from '../../../../hooks';
import { addShipSlice, progressIndicatorSlice } from '../../../../slices';
import { DocumentFormProps, DynamicFormType } from '../../../../types';
import { useIsFocused } from '@react-navigation/native';

const DocumentForm: React.FC<DocumentFormProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('home');
    const mutationGetForm = useGetAddShipDynamicForm();
    const [dynamicForm, setDynamicForm] = React.useState<DynamicFormType[]>([]);
    const { addDocument, removeDocument } = addShipSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const isFocused = useIsFocused();

    const filteredForm = dynamicForm.filter(item => {
        return (
            item.dynamicInput.active &&
            item.dynamicInput.templateType === 'shipDoc'
        );
    });
    const sortedForm = filteredForm.sort(
        (a, b) => a.dynamicInput.order - b.dynamicInput.order,
    );

    const handleSubmit = async (value: any, actions: FormikHelpers<any>) => {
        const hasErrors = Object.entries(value).some(([label, item]) => {
            return (
                Object.keys(item as any).length === 0 ||
                Object.keys(item as any).length === 1
            );
        });

        if (hasErrors) {
            Object.entries(value).forEach(([label, item]) => {
                if (
                    Object.keys(item as any).length === 0 ||
                    Object.keys(item as any).length === 1
                ) {
                    actions.setFieldError(label, t('ShipOwner.textSelectFile'));
                }
            });
        } else {
            await Promise.all(
                Object.entries(value).map(([label, item]) => {
                    console.log(item);

                    return dispatch(
                        addDocument({
                            ...(item as DocumentPickerResponse & {
                                docExpired?: string | undefined;
                            }),
                            label,
                        } as DocumentPickerResponse & { label: string }),
                    );
                }),
            );

            navigation.navigate('ImageForm');
        }

        actions.setSubmitting(false);
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', event => {
            event.preventDefault();
            dispatch(removeDocument());
            navigation.dispatch(event.data.action);
        });

        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        if (isFocused) {
            dispatch(removeDocument());
            dispatch(showProgressIndicator());
            mutationGetForm.mutate(undefined, {
                onSuccess: data => {
                    setDynamicForm(data.data.data.dynamicForms);
                    dispatch(hideProgressIndicator());
                },
            });
        }
    }, [isFocused]);

    return (
        <ScreenLayout backgroundColor={'light'} testId={'documentFormAddShip'}>
            <View marginH-20 marginV-26>
                <ProgressBar
                    progress={75}
                    style={{
                        backgroundColor: Color.secColor,
                        height: 10,
                        marginBottom: 20,
                    }}
                    progressColor={Color.primaryColor}
                />
                <DynamicForm
                    btnTitle={t('ShipOwner.buttonNext')}
                    data={sortedForm}
                    onSubmit={handleSubmit}
                    rightIcon={<ArrowIcon />}
                />
            </View>
        </ScreenLayout>
    );
};

export default DocumentForm;
