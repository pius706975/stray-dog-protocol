import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import * as yup from 'yup';
import moment from 'moment';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
    Button,
    CustomText,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../components';
import {
    EditShipHistoryProps,
    EditShipHistoryRequest,
} from '../../../../types';
import { useDispatch } from 'react-redux';
import { useEditShipHistory } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { handleAxiosError } from '../../../../utils';
import { Color, FontFamily, FontSize, HistoryIcon } from '../../../../configs';
import NumericInput from 'react-native-numeric-input';
import { Pressable } from 'react-native';
import { Input } from '@rneui/base';
import {
    DatePickerModal,
    DocumentInput,
    ModalInput,
    ModalPdf,
} from './components';
import { useIsFocused } from '@react-navigation/native';
import CustomButton from '../../../../components/Button';
import { useTranslation } from 'react-i18next';

type AdditionalDocument = {
    id: number;
    name: string;
    uri: string;
    type: string;
};

const EditShipHistory: React.FC<EditShipHistoryProps> = ({
    route,
    navigation,
}) => {
    const { shipHistory } = route.params;
    console.log(JSON.stringify(shipHistory, null, 2));

    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const formData = new FormData();
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
    const [showPicker, setShowPicker] = React.useState<boolean>(false);
    const [showPickerEnd, setShowPickerEnd] = React.useState<boolean>(false);
    const [selectedDate, setSelectedDate] = React.useState<Date>(
        new Date(shipHistory.rentStartDate),
    );
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const [selectedDateEnd, setSelectedDateEnd] = React.useState<Date>(
        new Date(shipHistory.rentEndDate),
    );
    const [price, setPrice] = React.useState<number>(shipHistory.price);

    const [visible, setvisible] = React.useState<boolean>(false);
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const startDate = moment(selectedDate);
    const endDate = moment(selectedDateEnd);
    const start = moment(startDate).format('DD MMMM YYYY');
    const end = moment(endDate).format('DD MMMM YYYY');
    const { t } = useTranslation('detailship');
    const mutationEditShipHistory = useEditShipHistory();

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
    const handleShowModal = () => {
        setvisible(!visible);
    };
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };

    const EditFormInitialValues: EditShipHistoryRequest = {
        locationDeparture: shipHistory.locationDeparture,
        locationDestination: shipHistory.locationDestination,
    };

    const EditShipValidationScheme: yup.ObjectSchema<EditShipHistoryRequest> =
        yup.object().shape({
            locationDestination: yup
                .string()
                .required(
                    t(
                        'ShipOwner.EditTransactionHistory.placeholderLocationDestination',
                    ),
                ),
            locationDeparture: yup
                .string()
                .required(
                    t(
                        'ShipOwner.EditTransactionHistory.placeholderLocationDeparture',
                    ),
                ),
        });

    const handleForm = async (
        values: EditShipHistoryRequest,
        actions: FormikHelpers<EditShipHistoryRequest>,
    ) => {
        dispatch(showProgressIndicator());
        formData.append('price', price);
        formData.append('rentStartDate', start);
        formData.append('rentEndDate', end);
        formData.append('shipId', shipHistory.shipId);
        formData.append('locationDestination', values.locationDestination);
        formData.append('locationDeparture', values.locationDeparture);
        if (additionalDocList.length > 0) {
            additionalDocList.forEach(item => {
                formData.append('files', {
                    uri: item.uri,
                    type: item.type,
                    name: item.name,
                });
            });
        }
        console.log(additionalDocList);

        mutationEditShipHistory.mutate(
            { request: formData, id: shipHistory._id },
            {
                onSuccess: resp => {
                    const response = resp.data.data;
                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: t(
                                'ShipOwner.EditTransactionHistory.statusSuccess',
                            ),
                            text: t(
                                'ShipOwner.EditTransactionHistory.successEditHistory',
                            ),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    actions.setSubmitting(false);
                    navigation.pop();
                    navigation.navigate('ManageTransactionHistory', {
                        shipId: shipHistory.shipId,
                        shipHistory: response,
                    });
                },
                onError: err => {
                    console.log('err', err);

                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: t(
                                'ShipOwner.EditTransactionHistory.statusFailed',
                            ),
                            text: t(
                                'ShipOwner.EditTransactionHistory.failedEditHistory',
                            ),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 2000);
                    handleAxiosError(err);
                },
            },
        );
    };

    React.useEffect(() => {
        if (shipHistory.genericDocument) {
            const documents = shipHistory.genericDocument.map(
                (item, index) => ({
                    id: index + 1,
                    name: item.fileName,
                    uri: item.fileUrl,
                    type: 'application/pdf',
                }),
            );
            setAdditionalDocList(documents);
        }
    }, [shipHistory.genericDocument]);

    return (
        <ScreenLayout
            backgroundColor={'light'}
            testId={'EditHistory'}
            padding={10}
            gap={10}>
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
                            'ShipOwner.EditTransactionHistory.textTransactionHistory',
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
                        {t('ShipOwner.EditTransactionHistory.textComplete')}
                    </Text>
                </View>
                <View testID="edit-ship-history-form">
                    <Formik
                        initialValues={EditFormInitialValues}
                        onSubmit={handleForm}
                        validationSchema={EditShipValidationScheme}>
                        {({
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            values,
                            touched,
                            errors,
                            isSubmitting,
                        }: FormikProps<EditShipHistoryRequest>) => (
                            <>
                                <View>
                                    <View
                                        style={{
                                            paddingTop: 20,
                                        }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View
                                                style={{
                                                    alignSelf: 'center',
                                                }}>
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            FontFamily.medium,
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
                                                    textColor={
                                                        Color.darkTextColor
                                                    }
                                                    upDownButtonsBackgroundColor={
                                                        Color.softPrimaryColor
                                                    }
                                                    borderColor={
                                                        Color.primaryColor
                                                    }
                                                    onChange={price =>
                                                        setPrice(price)
                                                    }
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            paddingTop: 20,
                                            margin: -10,
                                        }}>
                                        <View>
                                            {/* <Pressable
                                                onPressIn={toggleDatePicker}>
                                                <Input
                                                    placeholder={t(
                                                        'ShipOwner.EditTransactionHistory.textPlaceholderRentalStart',
                                                    )}
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
                                                    placeholder={t(
                                                        'ShipOwner.EditTransactionHistory.textPlaceholderRentalEnd',
                                                    )}
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
                                                'ShipOwner.EditTransactionHistory.textPlaceholderDestination',
                                            )}
                                            label={t(
                                                'ShipOwner.EditTransactionHistory.textLabelDestination',
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
                                                'ShipOwner.EditTransactionHistory.textPlaceholderDeparture',
                                            )}
                                            label={t(
                                                'ShipOwner.EditTransactionHistory.textLabelDeparture',
                                            )}
                                            onBlur={handleBlur(
                                                'locationDeparture',
                                            )}
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
                                                'ShipOwner.EditTransactionHistory.textAdditionalDoc',
                                            )}
                                        </CustomText>
                                        <View
                                            marginT-10
                                            style={{ width: '50%' }}>
                                            <CustomButton
                                                testID="add-input-additional-doc"
                                                title={t(
                                                    'ShipOwner.EditTransactionHistory.textTitleAdditionalDoc',
                                                )}
                                                onSubmit={() =>
                                                    handleShowModal()
                                                }
                                            />
                                        </View>
                                    </View>
                                    <DocumentInput
                                        setSelectedDocument={
                                            setSelectedDocument
                                        }
                                        additionalDocList={additionalDocList}
                                        openModal={handleShowModalPdf}
                                        setAdditionalDocList={
                                            setAdditionalDocList
                                        }
                                    />
                                </View>
                                <View style={{ marginTop: 12 }}>
                                    <Button
                                        title={t(
                                            'ShipOwner.EditTransactionHistory.textButtonSubmit',
                                        )}
                                        isSubmitting={isSubmitting}
                                        onSubmit={handleSubmit}
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
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default EditShipHistory;
