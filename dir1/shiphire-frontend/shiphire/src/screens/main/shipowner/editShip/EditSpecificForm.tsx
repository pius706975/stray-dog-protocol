import { Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import { ProgressBar, Text, View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { Button, CustomText, ScreenLayout } from '../../../../components';
import { ArrowIcon, Color, FontFamily, FontSize } from '../../../../configs';
import {
    EditGeneralFormProps,
    EditShipRequest,
    EditSpecificFormProps,
    GetShipFacilityRequest,
    RootState,
    SpecificFormAddShipRequest,
} from '../../../../types';

import {
    useEditShip,
    useGetShipFacility,
    useGetShipSpesification,
} from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';

import {
    EditCustomDropDownInput,
    SizeForm,
    SpecificFormInputField,
} from './components';

import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

const EditSpecificForm: React.FC<EditSpecificFormProps> = ({
    navigation,
    route,
}) => {
    const { t } = useTranslation('detailship');
    const shipData = useSelector((state: RootState) => state.addShip);
    const generalFormData = useSelector((state: RootState) => state.addShip);
    const SpesificFormInitialValues = {
        length: shipData.length,
        width: shipData.width,
        height: shipData.height,
    };
    const [shipFacility, setShipFacility] = React.useState(shipData.facilities);
    const [facilityItems, setFacilityItems] = React.useState([
        { label: '', value: '' },
    ]);
    const [specificationItems, setSpecificationItems] = React.useState([
        { label: '', value: '', units: '' },
    ]);
    const mutationGetShipFacility = useGetShipFacility();
    const mutationGetShipSpesification = useGetShipSpesification();
    const mutationEditShip = useEditShip();
    const isFocused = useIsFocused();

    // const SpesificFormValidationSchema: yup.ObjectSchema<SpesificFormAddShipRequest> =
    const SpesificFormValidationSchema = yup.object().shape({
        length: yup
            .string()
            .required(t('ShipOwner.EditSpecificForm.validationLength')),
        width: yup
            .string()
            .required(t('ShipOwner.EditSpecificForm.validationWidth')),
        height: yup
            .string()
            .required(t('ShipOwner.EditSpecificForm.validationHeight')),
    });

    const onHandleSubmit = (
        values: SpecificFormAddShipRequest,
        actions: FormikHelpers<SpecificFormAddShipRequest>,
    ) => {
        const valueWithGeneralData: EditShipRequest = {
            shipId: route.params.shipId,
            name: shipData.name,
            desc: shipData.desc,
            category: shipData.category,
            location: shipData.location,
            pricePerMonth: shipData.pricePerMonth,
            ...values,
            facilities: shipFacility,
            specifications: specificationItems.map(item => {
                return {
                    name: item.label,
                    value: item.value,
                };
            }),
        };

        mutationEditShip.mutate(valueWithGeneralData, {
            onSuccess: resp => {
                console.log('success');

                navigation.navigate('OwnerDetailShip', {
                    shipId: resp.data.data.shipId,
                });
            },
        });
    };

    const handleChangeSpesificationValue = item => newValue => {
        // Temukan index item yang sesuai dalam selectedItems
        const itemIndex = specificationItems.findIndex(
            shipSpesification => shipSpesification.label === item,
        );

        if (itemIndex !== -1) {
            // Salin array inputValues agar dapat dimutasi
            const newInputValues = [...specificationItems];
            newInputValues[itemIndex] = {
                label: item,
                value: newValue,
                units: newInputValues[itemIndex].units,
            };
            setSpecificationItems(newInputValues);
        }
    };
    React.useEffect(() => {
        if (isFocused) {
            const shipCategory: GetShipFacilityRequest = {
                shipType: generalFormData.category,
            };

            mutationGetShipFacility.mutate(shipCategory, {
                onSuccess: resp => {
                    const facilitiesItems = resp.data.data.map(item => {

                        return {
                            label: item.name,
                            value: item.name,
                            testID: `facilityItem-${item.name}`,
                        };
                    });
                    const newShipFacility = facilitiesItems
                        .filter(item => shipFacility?.includes(item.label))
                        .map(item => item.label);
                    setFacilityItems(facilitiesItems);
                    setShipFacility(newShipFacility);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });
            mutationGetShipSpesification.mutate(shipCategory, {
                onSuccess: resp => {
                    const specificationItems = resp.data.data.map(item => {
                        return {
                            label: item.name,
                            value: '0',
                            units: item.units,
                        };
                    });

                    const updatedSpecificationItems = specificationItems.map(
                        newItem => {
                            const existingItem = shipData!!.specifications!!.find(
                                item => item.name === newItem.label,
                            );

                            if (existingItem) {
                                return {
                                    label: newItem.label,
                                    value: existingItem.value.toString(),
                                    units: newItem.units,
                                };
                            } else {
                                return newItem;
                            }
                        },
                    );

                    setSpecificationItems(updatedSpecificationItems);
                },

                onError: err => {
                    handleAxiosError(err);
                },
            });
        }
    }, [isFocused]);

    return (
        <ScreenLayout backgroundColor={'light'} testId={'spesificFormAddShip'}>
            <View marginH-20 marginV-26 marginB-100>
                <ProgressBar
                    progress={50}
                    style={{ backgroundColor: Color.secColor, height: 10 }}
                    progressColor={Color.primaryColor}
                />
                <Formik
                    initialValues={SpesificFormInitialValues}
                    onSubmit={onHandleSubmit}
                    validationSchema={SpesificFormValidationSchema}>
                    {({
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                    }: FormikProps<SpecificFormAddShipRequest>) => (
                        <React.Fragment>
                            <View paddingL-10 marginT-40>
                                <CustomText
                                    fontSize="xl"
                                    fontFamily="medium"
                                    color="primaryColor">
                                    {generalFormData.category} Ship{' '}
                                    {t(
                                        'ShipOwner.EditSpecificForm.textSpecification',
                                    )}
                                </CustomText>

                                <CustomText
                                    fontSize="sm"
                                    fontFamily="medium"
                                    color="darkTextColor">
                                    {t('ShipOwner.EditSpecificForm.textSize')}
                                </CustomText>
                                <View row flex style={{ alignItems: 'center' }}>
                                    <SizeForm
                                        value={values.length}
                                        onChange={handleChange('length')}
                                        onBlur={handleBlur('length')}
                                        placeholder={t(
                                            'ShipOwner.EditSpecificForm.placeholderLength',
                                        )}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: FontFamily.bold,
                                            fontSize: FontSize.sm,
                                            color: Color.darkTextColor,
                                        }}>
                                        X
                                    </Text>
                                    <SizeForm
                                        value={values.width}
                                        onChange={handleChange('width')}
                                        onBlur={handleBlur('width')}
                                        placeholder={t(
                                            'ShipOwner.EditSpecificForm.placeholderWidth',
                                        )}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: FontFamily.bold,
                                            fontSize: FontSize.sm,
                                            color: Color.darkTextColor,
                                        }}>
                                        X
                                    </Text>
                                    <SizeForm
                                        value={values.height}
                                        onChange={handleChange('height')}
                                        onBlur={handleBlur('height')}
                                        placeholder={t(
                                            'ShipOwner.EditSpecificForm.placeholderHeight',
                                        )}
                                    />
                                </View>

                                {specificationItems &&
                                    specificationItems.map((item, index) => {
                                        return (
                                            <SpecificFormInputField
                                                testID={`specificFormInputField-${index}`}
                                                key={index}
                                                onChange={handleChangeSpesificationValue(
                                                    item.label,
                                                )}
                                                onBlur={handleBlur(item.label)}
                                                value={item.value}
                                                label={item.label}
                                                units={item.units}
                                            />
                                        );
                                    })}

                                <EditCustomDropDownInput
                                    testID="editCustomDropDownInput"
                                    label={t(
                                        'ShipOwner.EditSpecificForm.labelShipFacility',
                                    )}
                                    items={facilityItems}
                                    setItems={setFacilityItems}
                                    value={shipFacility}
                                    setValue={setShipFacility}
                                    elevation={90}
                                />

                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                    }}>
                                    <Button
                                        testID="submitButton"
                                        rightIcon={<ArrowIcon />}
                                        title={t(
                                            'ShipOwner.EditImageForm.labelButtonNext',
                                        )}
                                        onSubmit={() => handleSubmit()}
                                    />
                                </View>
                            </View>
                        </React.Fragment>
                    )}
                </Formik>
            </View>
        </ScreenLayout>
    );
};

export default EditSpecificForm;
