import { FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native-gesture-handler';
import { ProgressBar, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { CustomText, DynamicForm, ScreenLayout } from '../../../../components';
import { ArrowIcon, Color } from '../../../../configs';
import { useGetAddShipDynamicForm } from '../../../../hooks';
import { addShipSlice } from '../../../../slices';
import {
    DynamicFormType,
    GeneralFormAddShipRequest,
    GeneralFormProps,
} from '../../../../types';
import { useIsFocused } from '@react-navigation/native';

const GeneralForm: React.FC<GeneralFormProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('home');
    const mutationGetForm = useGetAddShipDynamicForm();
    const [dynamicForm, setDynamicForm] = React.useState<DynamicFormType[]>([]);
    const { addGeneralData } = addShipSlice.actions;
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            mutationGetForm.mutate(undefined, {
                onSuccess: data => {
                    setDynamicForm(data.data.data.dynamicForms);
                },
            });
        }
    }, [isFocused]);
    const filteredForm = dynamicForm.filter(
        item =>
            item.dynamicInput.active &&
            item.dynamicInput.templateType === 'generalAddShip',
    );
    const sortedForm = filteredForm.sort(
        (a, b) => a.dynamicInput.order - b.dynamicInput.order,
    );

    const onHandleSubmit = (
        values: any,
        actions: FormikHelpers<GeneralFormAddShipRequest>,
    ) => {
        actions.setSubmitting(true);
        dispatch(addGeneralData(values));
        actions.setSubmitting(false);
        navigation.navigate('SpecificForm');
    };

    return (
        <FlatList
            data={['']}
            keyExtractor={() => 'dummyKey'}
            renderItem={() => (
                <ScreenLayout
                    backgroundColor={'light'}
                    testId="generalFormAddShip">
                    <View marginH-20 marginV-26 flex style={{ gap: 20 }}>
                        <ProgressBar
                            progress={25}
                            style={{
                                backgroundColor: Color.secColor,
                                height: 10,
                            }}
                            progressColor={Color.primaryColor}
                        />
                        <View style={{ gap: 10 }}>
                            <CustomText
                                color="darkTextColor"
                                fontSize="xl2"
                                fontFamily="semiBold">
                                {t('ShipOwner.textAddGeneralForm')}
                            </CustomText>
                            <DynamicForm
                                data={sortedForm}
                                btnTitle={t('ShipOwner.buttonNext')}
                                rightIcon={<ArrowIcon />}
                                onSubmit={onHandleSubmit}
                            />
                        </View>
                    </View>
                </ScreenLayout>
            )}
        />
    );
};

export default GeneralForm;
