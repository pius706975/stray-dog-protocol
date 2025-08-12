import React from 'react';
import {
    Button,
    CustomText,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../components';
import { AddTransactionHistoryProps } from '../../../../types';
import {
    DatePickerModal,
    ShipInformation,
} from '../../renter/requestForQuote/components';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { AddTransactionHistoryRequest } from '../../../../types';
import moment from 'moment';
import * as yup from 'yup';
import { Text, View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize, HistoryIcon } from '../../../../configs';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Input } from '@rneui/base';
import { Pressable } from 'react-native';
import { useSubmitTransactionHistory } from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';
import NumericInput from 'react-native-numeric-input';
import { useTranslation } from 'react-i18next';
import { DocumentInput, ModalInput, ModalPdf } from './components';
import CustomButton from '../../../../components/Button';

type AdditionalDocument = {
    id: number;
    name: string;
    uri: string;
    type: string;
};

const AddTransactionHistory: React.FC<AddTransactionHistoryProps> = ({
    navigation,
    route,
}) => {
    const {
        shipId,
        shipName,
        shipCategory,
        shipImageUrl,
        shipSize,
        shipCompany,
    } = route.params;
    const dispatch = useDispatch();
    const { t } = useTranslation('detailship');
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;

    const mutationSubmitTransactionHistory = useSubmitTransactionHistory();
    const [showPicker, setShowPicker] = React.useState<boolean>(false);
    const [showPickerEnd, setShowPickerEnd] = React.useState<boolean>(false);
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [price, setPrice] = React.useState<number>(50000000);
    const [selectedDateEnd, setSelectedDateEnd] = React.useState<Date>(
        new Date(),
    );
    const [visible, setvisible] = React.useState<boolean>(false);

    const [showDocumentInput, setShowDocumentInput] =
        React.useState<boolean>(false);
    const formData = new FormData();
    const startDate = moment(selectedDate);
    const endDate = moment(selectedDateEnd);
    // console.log('startDate', startDate);
    // console.log('endDate', endDate);
    const daysInRange = endDate.diff(startDate, 'days');

    const start = moment(startDate).format('DD MMMM YYYY');
    const end = moment(endDate).format('DD MMMM YYYY');
    // console.log('end', end);
    const [additionalDocList, setAdditionalDocList] = React.useState<
        AdditionalDocument[]
    >([]);
    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
        console.log('pressed');
    };

    const toggleDatePickerEnd = () => {
        setShowPickerEnd(!showPickerEnd);
    };

    const getFormattedDate = (date: Date) => {
        return moment(date).format('DD MMMM YYYY');
    };

    const formValidationScheme: yup.ObjectSchema<AddTransactionHistoryRequest> =
        yup.object().shape({
            locationDestination: yup
                .string()
                .required(
                    t(
                        'ShipOwner.AddTransactionHistory.validationLocationDestination',
                    ),
                ),
            locationDeparture: yup
                .string()
                .required(
                    t(
                        'ShipOwner.AddTransactionHistory.validationLocationDeparture',
                    ),
                ),
        });

    const formInitialValues: AddTransactionHistoryRequest = {
        locationDestination: '',
        locationDeparture: '',
    };

    const handleShowModal = () => {
        setvisible(!visible);
    };
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };

    const handleForm = async (
        values: AddTransactionHistoryRequest,
        actions: FormikHelpers<AddTransactionHistoryRequest>,
    ) => {
        console.log(additionalDocList);

        dispatch(showProgressIndicator());
        formData.append('locationDestination', values.locationDestination);
        formData.append('locationDeparture', values.locationDeparture);
        formData.append('shipId', shipId);
        formData.append('price', price);
        formData.append('rentStartDate', start);
        formData.append('rentEndDate', end);
        if (additionalDocList.length > 0) {
            additionalDocList.forEach(item => {
                formData.append('files', {
                    uri: item.uri,
                    type: item.type,
                    name: item.name,
                });
            });
        }
        // const payload = {
        //     ...values,
        //     shipId: shipId,
        //     price: price,
        //     rentStartDate: start,
        //     rentEndDate: end,
        // };
        mutationSubmitTransactionHistory.mutate(formData, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'success',
                        text: t(
                            'ShipOwner.AddTransactionHistory.successAddHistory',
                        ),
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                navigation.navigate('OwnerDetailShip', {
                    shipId,
                });
                actions.setSubmitting(false);
            },
            onError: err => {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t(
                            'ShipOwner.AddTransactionHistory.failedAddHistory',
                        ),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                console.log('err', err);
                handleAxiosError(err);
            },
        });
    };

    return (
        <ScreenLayout
            backgroundColor={'light'}
            testId={'addTransactionHistory'}
            padding={10}
            gap={10}>
            <ShipInformation
                shipName={shipName || ''}
                shipCategory={shipCategory || ''}
                shipImageUrl={shipImageUrl || ''}
                shipSize={{
                    length: shipSize?.length ?? 0,
                    width: shipSize?.width ?? 0,
                    height: shipSize?.height ?? 0,
                }}
                shipCompany={
                    shipCompany
                        ? `${shipCompany.companyType || ''}. ${
                              shipCompany.name || ''
                          }`
                        : ''
                }
            />
            <View
                style={{
                    backgroundColor: Color.bgNeutralColor,
                    borderRadius: 6,
                    padding: 16,
                }}>
                <View
                    row
                    style={{
                        borderBottomWidth: 0.4,
                        paddingBottom: 16,
                        gap: 16,
                        alignItems: 'center',
                    }}>
                    <HistoryIcon />
                    <Text
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.bold,
                            color: Color.primaryColor,
                        }}>
                        {t(
                            'ShipOwner.AddTransactionHistory.textTransactionHistory',
                        )}
                    </Text>
                </View>

                <View>
                    <Text
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.regular,
                            color: Color.darkTextColor,
                        }}>
                        {t('ShipOwner.AddTransactionHistory.textComplete')}
                    </Text>
                </View>

                <Formik
                    initialValues={formInitialValues}
                    onSubmit={handleForm}
                    validationSchema={formValidationScheme}>
                    {({
                        handleBlur,
                        handleChange,
                        isSubmitting,
                        handleSubmit,
                        touched,
                        errors,
                        values,
                    }: FormikProps<AddTransactionHistoryRequest>) => (
                        <>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View
                                        style={{
                                            alignSelf: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: FontFamily.medium,
                                                fontSize: FontSize.xl,
                                                color: Color.primaryColor,
                                                paddingRight: 10,
                                            }}>
                                            Rp
                                        </Text>
                                    </View>
                                    <View
                                        testID="numericInput"
                                        style={{
                                            marginTop: 10,
                                        }}>
                                        <NumericInput
                                            type="up-down"
                                            totalWidth={210}
                                            totalHeight={50}
                                            step={10000000}
                                            valueType="integer"
                                            editable={true}
                                            minValue={50000000}
                                            maxValue={1000000000}
                                            value={price}
                                            rounded
                                            textColor={Color.darkTextColor}
                                            upDownButtonsBackgroundColor={
                                                Color.softPrimaryColor
                                            }
                                            borderColor={Color.primaryColor}
                                            onChange={price => setPrice(price)}
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        paddingTop: 20,
                                        margin: -10,
                                    }}>
                                    <View>
                                        {/* <Pressable onPressIn={toggleDatePicker}>
                                            <Input
                                                placeholder="Rental Start"
                                                editable={false}
                                                value={getFormattedDate(
                                                    selectedDate,
                                                )}
                                            />
                                        </Pressable> */}
                                        <TextInput
                                            leftIcon
                                            placeholder={t('ShipOwner.EditTransactionHistory.textPlaceholderRentalStart')}
                                            label={t('ShipOwner.EditTransactionHistory.textPlaceholderRentalStart')}
                                            value={getFormattedDate(
                                                selectedDate,
                                            )}
                                            editable={false}
                                            onPress={toggleDatePicker}
                                        />
                                        <DatePickerModal
                                            testID="datePicker"
                                            visible={showPicker}
                                            date={selectedDate}
                                            onClose={toggleDatePicker}
                                            onDateChange={date =>
                                                setSelectedDate(date)
                                            }
                                            minDate={
                                                new Date(
                                                    new Date().getFullYear(),
                                                    0,
                                                    1,
                                                )
                                            }
                                        />
                                    </View>

                                    <View>
                                        {/* <Pressable
                                            onPressIn={toggleDatePickerEnd}>
                                            <Input
                                                placeholder="Rental End"
                                                editable={false}
                                                value={getFormattedDate(
                                                    selectedDateEnd,
                                                )}
                                            />
                                        </Pressable> */}
                                        <TextInput
                                            leftIcon
                                            placeholder={t('ShipOwner.EditTransactionHistory.textPlaceholderRentalEnd')}
                                            label={t('ShipOwner.EditTransactionHistory.textPlaceholderRentalEnd')}
                                            value={getFormattedDate(
                                                selectedDateEnd,
                                            )}
                                            editable={false}
                                            onPress={toggleDatePickerEnd}
                                        />
                                        <DatePickerModal
                                            testID="datePickerEnd"
                                            visible={showPickerEnd}
                                            date={selectedDateEnd}
                                            onClose={toggleDatePickerEnd}
                                            onDateChange={date =>
                                                setSelectedDateEnd(date)
                                            }
                                            minDate={selectedDate}
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        paddingTop: 20,
                                        margin: -10,
                                    }}>
                                    <TextInput
                                        leftIcon
                                        placeholder={t(
                                            'ShipOwner.AddTransactionHistory.placeholderLocationDestination',
                                        )}
                                        label={t(
                                            'ShipOwner.AddTransactionHistory.labelLocationDestination',
                                        )}
                                        onBlur={handleBlur(
                                            'locationDestination',
                                        )}
                                        onChange={handleChange(
                                            'locationDestination',
                                        )}
                                        error={
                                            touched.locationDestination &&
                                            errors.locationDestination
                                        }
                                        value={values.locationDestination}
                                    />
                                    {touched.locationDestination &&
                                        errors.locationDestination && (
                                            <TextInputError
                                                errorText={
                                                    errors.locationDestination
                                                }
                                            />
                                        )}
                                </View>

                                <View
                                    style={{
                                        paddingTop: 20,
                                        margin: -10,
                                    }}>
                                    <TextInput
                                        leftIcon
                                        placeholder={t(
                                            'ShipOwner.AddTransactionHistory.placeholderLocationDeparture',
                                        )}
                                        label={t(
                                            'ShipOwner.AddTransactionHistory.labelLocationDeparture',
                                        )}
                                        onBlur={handleBlur('locationDeparture')}
                                        onChange={handleChange(
                                            'locationDeparture',
                                        )}
                                        error={
                                            touched.locationDeparture &&
                                            errors.locationDeparture
                                        }
                                        value={values.locationDeparture}
                                    />
                                    {touched.locationDeparture &&
                                        errors.locationDeparture && (
                                            <TextInputError
                                                errorText={
                                                    errors.locationDeparture
                                                }
                                            />
                                        )}
                                </View>
                            </View>
                            <View>
                                <View
                                    marginB-20
                                    style={{
                                        justifyContent: 'space-between',
                                    }}>
                                    <CustomText
                                        color="primaryColor"
                                        fontSize="xl"
                                        fontFamily="medium">
                                        {t(
                                            'ShipOwner.AddTransactionHistory.textAdditionalDocument',
                                        )}
                                    </CustomText>
                                    <View marginT-10 style={{ width: '50%' }}>
                                        <CustomButton
                                            testID="add-input-additional-doc"
                                            title={t(
                                                'ShipOwner.AddTransactionHistory.textAddDocument',
                                            )}
                                            onSubmit={() => handleShowModal()}
                                        />
                                    </View>
                                </View>
                                <DocumentInput
                                    setSelectedDocument={setSelectedDocument}
                                    additionalDocList={additionalDocList}
                                    openModal={handleShowModalPdf}
                                    setAdditionalDocList={setAdditionalDocList}
                                />
                            </View>
                            <View style={{ marginTop: 12 }}>
                                <Button
                                    title={t(
                                        'ShipOwner.AddTransactionHistory.labelSubmit',
                                    )}
                                    isSubmitting={isSubmitting}
                                    onSubmit={() => handleSubmit()}
                                />
                            </View>
                        </>
                    )}
                </Formik>
                <ModalInput
                    visible={visible}
                    onClose={handleShowModal}
                    additionalDocList={additionalDocList}
                    setAdditionalDocList={setAdditionalDocList}
                />
                <ModalPdf
                    visible={visiblePdf}
                    onClose={handleShowModalPdf}
                    selectedDocument={selectedDocument}
                    setAdditionalDocList={setAdditionalDocList}
                />
            </View>
        </ScreenLayout>
    );
};

export default AddTransactionHistory;
