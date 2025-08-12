import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import mime from 'mime';
import { Formik } from 'formik';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import * as yup from 'yup';

import { ShipTrackingFormProps, Transaction } from '../../../../types';
import {
    Button,
    ConfirmationModal,
    RentInformation,
    ScreenLayout,
    ShipInformation,
    TextInput,
    TextInputError,
} from '../../../../components';
import {
    useGetTransactionByRentalId,
    useUpdateRenterShipTracking,
} from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { Color } from '../../../../configs';
import { DateTimePickerModal, ImageInput } from './components';

const ShipTrackingForm: React.FC<ShipTrackingFormProps> = ({
    navigation,
    route,
}) => {
    const { t } = useTranslation('shiptracking');
    const sheetRef = useRef<BottomSheet>(null);

    const { rentalId } = route.params;
    const { hideModal, showModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const mutationGetTransactionById = useGetTransactionByRentalId();
    const mutationUseUpdateShipTracking = useUpdateRenterShipTracking();

    const [transaction, setTransaction] = useState<Transaction>();
    const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [statusDate, setStatusDate] = useState<Date>(new Date());
    const [statusTime, setStatusTime] = useState<Date>(new Date());

    const handleGetTransactionById = useCallback(() => {
        mutationGetTransactionById.mutate(rentalId, {
            onSuccess: resp => {
                setTransaction(resp.data.data);
            },
            onError: err => {
                handleAxiosError(err);
            },
        });
    }, [rentalId, mutationGetTransactionById]);

    const handleUpdateShipTrackingStatus = useCallback(
        (values: any) => {
            dispatch(showProgressIndicator());

            const date = (
                values.date ? moment(values.date, 'DD MMMM YYYY') : moment()
            ).format('DD-MM-YYYY');

            const formData = new FormData();

            formData.append('status', 'sailing');
            formData.append('desc', values.desc);
            formData.append('date', date);
            formData.append('time', values.time);

            values.images.forEach((image: ImageOrVideo, index: number) => {
                const timestamp = Date.now();
                const filePath = image?.path || '';
                const match = filePath.match(/([^/]+)(?=\.\w+$)/);
                const fileNameWithoutExtension = match ? match[0] : '';
                const fileName = `Ship-Image-Status-${index}-${fileNameWithoutExtension}-${date}-${values.time}-${timestamp}`;

                formData.append('files', {
                    uri: image?.path,
                    type: mime.getType(image?.path),
                    name: fileName,
                });
            });

            values.descriptions.forEach((description: string) => {
                formData.append('imgDesc', description);
            });

            mutationUseUpdateShipTracking.mutate(
                { request: formData, rentalId },
                {
                    onSuccess: _ => {
                        dispatch(
                            showModal({
                                status: 'success',
                                text: t(
                                    'ShipTrackingDetail.textSuccessStatusUpdate',
                                ),
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                        navigation.navigate('ShipTrackingDetail', {
                            rentalId,
                        });
                    },
                    onError: err => {
                        handleAxiosError(err);
                    },
                    onSettled: () => {
                        dispatch(hideProgressIndicator());
                    },
                },
            );

            setIsShowConfirmModal(false);
        },
        [dispatch, mutationUseUpdateShipTracking, rentalId, t, navigation],
    );

    const getFormattedDate = useCallback((date: Date) => {
        return moment(date).format('DD MMMM YYYY');
    }, []);

    const getFormattedTime = useCallback((date: Date) => {
        return moment(date).format('HH:mm');
    }, []);

    const formValidationScheme = useMemo(
        () =>
            yup.object().shape({
                desc: yup
                    .string()
                    .required(t('ShipTrackingForm.textValidationStatus')),
            }),
        [t],
    );

    React.useEffect(() => {
        if (isFocused) {
            handleGetTransactionById();
        }
    }, [isFocused]);

    return (
        <ScreenLayout
            testId="shipTrackingDetailsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <ShipInformation
                shipName={transaction?.ship?.name}
                shipDestination={transaction?.locationDestination}
                shipDeparture={transaction?.locationDeparture}
                shipImageUrl={transaction?.ship?.imageUrl}
                shipCompanyName={transaction?.ship?.companyName}
                shipCompanyType={transaction?.ship?.companyType}
                onRenterBtnPress={() => {
                    sheetRef.current?.expand();
                }}
            />
            <Formik
                initialValues={{
                    status: 'sailing',
                    desc: '',
                    date: getFormattedDate(new Date()),
                    time: getFormattedTime(new Date()),
                    images: [],
                    descriptions: [],
                }}
                onSubmit={handleUpdateShipTrackingStatus}
                validationSchema={formValidationScheme}>
                {({
                    handleBlur,
                    handleChange,
                    isSubmitting,
                    handleSubmit,
                    setFieldValue,
                    touched,
                    errors,
                    values,
                }) => (
                    <>
                        <View
                            style={{
                                backgroundColor: Color.bgNeutralColor,
                                borderRadius: 6,
                                padding: 16,
                                marginBottom: 25,
                            }}>
                            <View>
                                <View>
                                    <TextInput
                                        leftIcon
                                        label={t(
                                            'ShipTrackingForm.textStatusLabel',
                                        )}
                                        placeholder={t(
                                            'ShipTrackingForm.textStatusPlaceholder',
                                        )}
                                        onChange={handleChange('desc')}
                                        onBlur={handleBlur('desc')}
                                        value={values.desc}
                                        error={touched.desc && errors.desc}
                                    />
                                    {touched.desc && errors.desc && (
                                        <TextInputError
                                            errorText={errors.desc}
                                        />
                                    )}
                                </View>
                                <View row>
                                    <View style={{ width: '60%' }}>
                                        <TextInput
                                            leftIcon
                                            placeholder={t(
                                                'ShipTrackingForm.textDatePlaceholder',
                                            )}
                                            label={t(
                                                'ShipTrackingForm.textDateLabel',
                                            )}
                                            value={values.date}
                                            editable={false}
                                            onPress={() =>
                                                setShowPicker(!showPicker)
                                            }
                                            onChange={handleChange('date')}
                                            onBlur={handleBlur('date')}
                                            error={touched.date && errors.date}
                                        />
                                    </View>
                                    <View style={{ width: '40%' }}>
                                        <TextInput
                                            leftIcon
                                            placeholder={t(
                                                'ShipTrackingForm.textTimePlaceholder',
                                            )}
                                            label={t(
                                                'ShipTrackingForm.textTimeLabel',
                                            )}
                                            value={values.time}
                                            editable={false}
                                            onPress={() =>
                                                setShowTimePicker(
                                                    !showTimePicker,
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                                <ImageInput
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    touched={touched}
                                    errors={errors}
                                />
                                <ConfirmationModal
                                    testID="shipTrackingConfirmModal"
                                    isVisible={isShowConfirmModal}
                                    onConfirm={() => {
                                        handleSubmit();
                                    }}
                                    onCancel={() => {
                                        setIsShowConfirmModal(false);
                                    }}
                                />
                            </View>
                        </View>

                        <Button
                            testID="SubmitBtn"
                            title={t('ShipTrackingForm.textSubmitButton')}
                            onSubmit={() => {
                                setIsShowConfirmModal(true);
                            }}
                        />
                        <DateTimePickerModal
                            visible={showPicker}
                            date={statusDate || new Date()}
                            onCancelPress={() => {
                                setShowPicker(!showPicker);
                            }}
                            onConfirmPress={dateTime => {
                                setShowPicker(!showPicker);
                                setStatusDate(dateTime);
                                setFieldValue(
                                    'date',
                                    getFormattedDate(dateTime),
                                );
                            }}
                            title={t('ShipTrackingForm.textDatePlaceholder')}
                        />
                        <DateTimePickerModal
                            visible={showTimePicker}
                            date={statusTime || new Date()}
                            onCancelPress={() => {
                                setShowTimePicker(!showTimePicker);
                            }}
                            onConfirmPress={dateTime => {
                                setShowTimePicker(!showTimePicker);
                                setStatusTime(dateTime);
                                setFieldValue(
                                    'time',
                                    getFormattedTime(dateTime),
                                );
                            }}
                            mode="time"
                            title={t('ShipTrackingForm.textTimePlaceholder')}
                        />
                    </>
                )}
            </Formik>
            <RentInformation
                sheetRef={sheetRef}
                departureLocation={transaction?.locationDeparture}
                destinationLocation={transaction?.locationDestination}
                rentType={transaction?.shipRentType}
                rentDuration={transaction?.rentalDuration}
                startDate={transaction?.rentalStartDate}
                endDate={transaction?.rentalEndDate}
            />
        </ScreenLayout>
    );
};

export default ShipTrackingForm;
