import { FormikHelpers } from 'formik';
import React from 'react';
import { ProgressBar, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { CustomText, DynamicForm, ScreenLayout } from '../../../../components';
import { ArrowIcon, Color } from '../../../../configs';
import {
    DynamicFormType,
    RootState,
    SpecificFormAddShipRequest,
    SpecificFormProps,
} from '../../../../types';

import { useGetAddShipDynamicForm } from '../../../../hooks';

import { useTranslation } from 'react-i18next';
import { addShipSlice, progressIndicatorSlice } from '../../../../slices';
import { useIsFocused } from '@react-navigation/native';

const SpecificForm: React.FC<SpecificFormProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('home');
    const mutationGetForm = useGetAddShipDynamicForm();
    const generalFormData = useSelector((state: RootState) => state.addShip);
    const shipSpecData = useSelector((state: RootState) => state.shipSpecSlice);
    const [dynamicForm, setDynamicForm] = React.useState<DynamicFormType[]>([]);
    const { addSpesificData } = addShipSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const isFocused = useIsFocused();

    const filteredForm = dynamicForm.filter(item => {
        const camelCaseSpecName = generalFormData.category
            .split(' ')
            .map((word, index) =>
                index === 0
                    ? word.toLowerCase()
                    : word.charAt(0).toUpperCase() +
                      word.slice(1).toLowerCase(),
            )
            .join('');
        return (
            (item.dynamicInput.templateType === 'spesificAddShip' ||
                item.dynamicInput.templateType ===
                    `${camelCaseSpecName}Spesific`) &&
            item.dynamicInput.active
        );
    });

    const sortedForm = filteredForm.sort(
        (a, b) => a.dynamicInput.order - b.dynamicInput.order,
    );

    const handleSubmit = (value: any, actions: FormikHelpers<any>) => {
        const specifications = value.shipSpec.map((specName: string) => {
            const camelCaseSpecName = specName
                .split(' ')
                .map((word, index) =>
                    index === 0
                        ? word.toLowerCase()
                        : word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                )
                .join('');

            const specValue = value[camelCaseSpecName];

            return {
                name: specName,
                value: specValue || '',
            };
        });

        const spesificDataValue: SpecificFormAddShipRequest = {
            height: value.height,
            length: value.length,
            width: value.width,
            facilities: value.shipFacility,
            specifications: specifications,
        };

        dispatch(addSpesificData(spesificDataValue));
        navigation.navigate('DocumentForm');

        actions.setSubmitting(false);
    };

    React.useEffect(() => {
        if (isFocused) {
            dispatch(showProgressIndicator());
            mutationGetForm.mutate(undefined, {
                onSuccess: data => {
                    setDynamicForm(data.data.data.dynamicForms);
                    dispatch(hideProgressIndicator());
                },
            });
        }
    }, [isFocused]);

    React.useEffect(() => {
        let adjustedBargeSpecSpec: Record<string, DynamicFormType> = {};

        shipSpecData.shipSpecSlice.forEach(label => {
            // Cari item dalam filteredForm yang sesuai dengan label
            const matchingItem = dynamicForm.find(
                item => item.dynamicInput.label === label,
            );

            // Jika ada item yang sesuai, salin data ke objek adjustedBargeSpecSpec
            if (matchingItem) {
                adjustedBargeSpecSpec[label] = matchingItem;
            }
        });

        Object.entries(adjustedBargeSpecSpec).forEach(([label, item]) => {
            const index = sortedForm.findIndex(
                formItem => formItem.dynamicInput.label === label,
            );

            if (index !== -1) {
                sortedForm[index] = item as DynamicFormType;
            } else {
                // Jika item dengan label tersebut tidak ada dalam filteredForm, tambahkan item baru
                sortedForm.push(item as DynamicFormType);
            }
        });
    }, [shipSpecData]);

    return (
        <ScreenLayout backgroundColor={'light'} testId={'spesificFormAddShip'}>
            <View marginH-20 marginV-26 style={{ gap: 20 }}>
                <ProgressBar
                    progress={50}
                    style={{ backgroundColor: Color.secColor, height: 10 }}
                    progressColor={Color.primaryColor}
                />
                <View style={{ gap: 10 }}>
                    <CustomText
                        color="darkTextColor"
                        fontSize="xl2"
                        fontFamily="semiBold">
                        2. {generalFormData.category}{' '}
                        {t('ShipOwner.textAddSpecificForm')}
                    </CustomText>
                    <DynamicForm
                        btnTitle={t('ShipOwner.buttonNext')}
                        data={sortedForm}
                        onSubmit={handleSubmit}
                        rightIcon={<ArrowIcon />}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default SpecificForm;
