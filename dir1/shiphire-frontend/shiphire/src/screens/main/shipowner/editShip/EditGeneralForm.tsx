import React, { useEffect } from 'react';
import {
    Button,
    CustomText,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../components';
import { ProgressBar, View } from 'react-native-ui-lib';
import { ArrowIcon, Color, FontFamily, FontSize } from '../../../../configs';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
    GeneralFormAddShipRequest,
    RootState,
    EditGeneralFormProps,
} from '../../../../types';
import * as yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import { addShipSlice } from '../../../../slices';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useGetShipLocations } from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';
import { useIsFocused } from '@react-navigation/native';

const EditGeneralForm: React.FC<EditGeneralFormProps> = ({
    navigation,
    route,
}) => {
    console.log('route.params', route.params);
    const { t } = useTranslation('detailship');
    const mutationGetShipLocations = useGetShipLocations();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = React.useState(false);
    const shipData = useSelector((state: RootState) => state.addShip);
    const [shipCategory, setShipCategory] = React.useState(shipData.category);
    const [shipLocation, setShipLocation] = React.useState(shipData.location);
    const { addGeneralData } = addShipSlice.actions;
    const isFocused = useIsFocused();

    const [items, setItems] = React.useState([
        {
            label: t('ShipOwner.EditGeneralForm.categoryShip1'),
            value: 'Tugboat',
            testID: 'Tugboat',
        },
        {
            label: t('ShipOwner.EditGeneralForm.categoryShip2'),
            value: 'Barge',
            testID: 'Barge',
        },
        {
            label: t('ShipOwner.EditGeneralForm.categoryShip3'),
            value: 'Ferry',
            testID: 'Ferry',
        },
    ]);

    const [shipLocations, setShipLocations] = React.useState([
        {
            label: '',
            value: '',
            testID: '',
        },
    ]);

    useEffect(() => {
        if (isFocused) {
            mutationGetShipLocations.mutate(undefined, {
                onSuccess: data => {
                    const shipLocations = data.data.data.map(item => ({
                        label: item.value,
                        value: item.value,
                        testID: item._id,
                    }));

                    setShipLocations(shipLocations);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });
        }
    }, [isFocused]);

    const GeneralFormInitialValues: GeneralFormAddShipRequest = {
        shipName: shipData.name,
        rentPrice: +shipData.pricePerMonth,
        shipDescription: shipData.desc,
    };

    const GeneralFormValidationScheme: yup.ObjectSchema<GeneralFormAddShipRequest> =
        yup.object().shape({
            shipName: yup
                .string()
                .required(t('ShipOwner.EditGeneralForm.validationShipName')),
            rentPrice: yup
                .number()
                .required(
                    t('ShipOwner.EditGeneralForm.validationShipRentPrice'),
                ),
            shipCategory: yup.string(),
            shipDescription: yup
                .string()
                .required(
                    t('ShipOwner.EditGeneralForm.validationShipDescription'),
                ),
            shipLocation: yup.string(),
        });

    const onHandleSubmit = (
        values: GeneralFormAddShipRequest,
        actions: FormikHelpers<GeneralFormAddShipRequest>,
    ) => {
        const valueWithCategory: GeneralFormAddShipRequest = {
            ...values,
            shipCategory: shipCategory,
            shipLocation,
        };
        dispatch(addGeneralData(valueWithCategory));
        navigation.navigate('EditSpecificForm', {
            shipId: route.params.shipId,
        });
    };

    return (
        <FlatList
            data={['']}
            keyExtractor={() => 'dummyKey'}
            renderItem={() => (
                <ScreenLayout
                    backgroundColor={'light'}
                    testId={'generalFormAddShip'}>
                    <View marginH-20 marginV-26 flex>
                        <ProgressBar
                            progress={25}
                            style={{
                                backgroundColor: Color.secColor,
                                height: 10,
                            }}
                            progressColor={Color.primaryColor}
                        />
                        <Formik
                            initialValues={GeneralFormInitialValues}
                            onSubmit={onHandleSubmit}
                            validationSchema={GeneralFormValidationScheme}>
                            {({
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                values,
                                touched,
                                errors,
                                isSubmitting,
                            }: FormikProps<GeneralFormAddShipRequest>) => (
                                <React.Fragment>
                                    <View marginT-36>
                                        <TextInput
                                            leftIcon
                                            label={t(
                                                'ShipOwner.EditGeneralForm.labelShipName',
                                            )}
                                            placeholder={t(
                                                'ShipOwner.EditGeneralForm.placeholderShipName',
                                            )}
                                            onChange={handleChange('shipName')}
                                            onBlur={handleBlur('shipName')}
                                            value={values.shipName}
                                            error={
                                                touched.shipName &&
                                                errors.shipName
                                            }
                                        />
                                        {touched.shipName &&
                                            errors.shipName && (
                                                <TextInputError
                                                    errorText={errors.shipName}
                                                />
                                            )}
                                    </View>

                                    <View style={{ zIndex: 100 }}>
                                        <View style={{ paddingLeft: 10 }}>
                                            <CustomText
                                                fontSize="xl"
                                                fontFamily="medium"
                                                color="primaryColor">
                                                {t(
                                                    'ShipOwner.EditGeneralForm.labelShipCategory',
                                                )}
                                            </CustomText>
                                        </View>
                                        <DropDownPicker
                                            onPress={setOpen}
                                            testID="dropdown-shipCategory"
                                            style={{
                                                marginStart: 4,
                                                width: '98%',
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderColor: Color.primaryColor,
                                                backgroundColor: Color.bgColor,
                                            }}
                                            placeholderStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: '#4D596399',
                                                textAlign: 'center',
                                            }}
                                            labelStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: Color.darkTextColor,
                                            }}
                                            dropDownContainerStyle={{
                                                marginHorizontal: 10,
                                                borderWidth: 2,
                                                borderColor: Color.primaryColor,
                                                backgroundColor: Color.secColor,
                                            }}
                                            listItemLabelStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: Color.darkTextColor,
                                            }}
                                            itemSeparatorStyle={{
                                                backgroundColor: '#216DAB',
                                            }}
                                            selectedItemLabelStyle={{
                                                fontWeight: 'bold',
                                            }}
                                            itemSeparator={true}
                                            open={open}
                                            value={shipCategory}
                                            items={items}
                                            setOpen={setOpen}
                                            setValue={setShipCategory}
                                            setItems={setItems}
                                        />
                                    </View>

                                    <View marginT-20>
                                        <View style={{ paddingLeft: 10 }}>
                                            <CustomText
                                                fontSize="xl"
                                                fontFamily="medium"
                                                color="primaryColor">
                                                {t(
                                                    'ShipOwner.EditGeneralForm.labelShipLocation',
                                                )}
                                            </CustomText>
                                        </View>
                                        <DropDownPicker
                                            onPress={setIsLocationDropdownOpen}
                                            testID="dropdown-shipLocation"
                                            style={{
                                                marginStart: 4,
                                                width: '98%',
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderColor: Color.primaryColor,
                                                backgroundColor: Color.bgColor,
                                            }}
                                            placeholderStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: '#4D596399',
                                                textAlign: 'center',
                                            }}
                                            labelStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: Color.darkTextColor,
                                            }}
                                            dropDownContainerStyle={{
                                                marginHorizontal: 10,
                                                borderWidth: 2,
                                                borderColor: Color.primaryColor,
                                                backgroundColor: Color.secColor,
                                            }}
                                            listItemLabelStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: Color.darkTextColor,
                                            }}
                                            itemSeparatorStyle={{
                                                backgroundColor: '#216DAB',
                                            }}
                                            selectedItemLabelStyle={{
                                                fontWeight: 'bold',
                                            }}
                                            itemSeparator={true}
                                            open={isLocationDropdownOpen}
                                            value={shipLocation}
                                            items={shipLocations}
                                            setOpen={setIsLocationDropdownOpen}
                                            setValue={setShipLocation}
                                            setItems={setShipLocations}
                                            listMode="MODAL"
                                            searchable={true}
                                        />
                                    </View>

                                    <View marginT-20>
                                        <TextInput
                                            leftIcon
                                            label={t(
                                                'ShipOwner.EditGeneralForm.labelRentPrice',
                                            )}
                                            placeholder={t(
                                                'ShipOwner.EditGeneralForm.placeholderRentPrice',
                                            )}
                                            onChange={handleChange('rentPrice')}
                                            onBlur={handleBlur('rentPrice')}
                                            value={values.rentPrice.toString()}
                                            error={
                                                touched.rentPrice &&
                                                errors.rentPrice
                                            }
                                            keyboardType="numeric"
                                        />
                                        {touched.rentPrice &&
                                            errors.rentPrice && (
                                                <TextInputError
                                                    errorText={errors.rentPrice}
                                                />
                                            )}
                                    </View>

                                    <View>
                                        <TextInput
                                            multiline={true}
                                            leftIcon
                                            label={t(
                                                'ShipOwner.EditGeneralForm.labelShipDescription',
                                            )}
                                            placeholder={t(
                                                'ShipOwner.EditGeneralForm.placeholderShipDescription',
                                            )}
                                            onChange={handleChange(
                                                'shipDescription',
                                            )}
                                            onBlur={handleBlur(
                                                'shipDescription',
                                            )}
                                            value={values.shipDescription}
                                            error={
                                                touched.shipDescription &&
                                                errors.shipDescription
                                            }
                                        />
                                    </View>

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
                                </React.Fragment>
                            )}
                        </Formik>
                    </View>
                </ScreenLayout>
            )}
        />
    );
};

export default EditGeneralForm;
