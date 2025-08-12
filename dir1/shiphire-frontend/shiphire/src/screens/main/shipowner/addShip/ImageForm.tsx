import { FormikHelpers } from 'formik';
import mime from 'mime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToastAndroid } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { ProgressBar, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { DynamicForm, ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import {
    useGetAddShipDynamicForm,
    useGetShipCategories,
    useSubmitShip,
    useSubmitShipDocument,
    useSubmitShipImage,
} from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import {
    DynamicFormType,
    GetShipCategoriesOwnerResponse,
    ImageFormProps,
    RootState,
    ShipDatas,
} from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import { useIsFocused } from '@react-navigation/native';

const ImageForm: React.FC<ImageFormProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('home');
    const mutationGetForm = useGetAddShipDynamicForm();
    const mutationSubmitShip = useSubmitShip();
    const mutationSubmitShipDocument = useSubmitShipDocument();
    const mutationSubmitShipImage = useSubmitShipImage();
    const shipData = useSelector((state: RootState) => state.addShip);
    const [dynamicForm, setDynamicForm] = React.useState<DynamicFormType[]>([]);
    const { showModal, hideModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const documentFormData = new FormData();
    const imageFormData = new FormData();
    const isFocused = useIsFocused();

    const filteredForm = dynamicForm.filter(item => {
        return (
            item.dynamicInput.active &&
            item.dynamicInput.templateType === 'shipImage'
        );
    });

    const sortedForm = filteredForm.sort(
        (a, b) => a.dynamicInput.order - b.dynamicInput.order,
    );

    const submitShipImage = (shipId: string, selectedImage: ImageOrVideo) => {
        imageFormData.append('image', {
            uri: selectedImage?.path,
            type: mime.getType(selectedImage?.path),
            name: `Image Ship ${shipData.name}`,
        });
        imageFormData.append('shipId', shipId);
        mutationSubmitShipImage.mutate(
            { request: imageFormData, shipId },
            {
                onSuccess: () => {
                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('ShipOwner.textShipAddedSuccessfully'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 2000);
                },
                onError: err => {
                    console.log('kesini');

                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: t('ShipOwner.textShipAddedFailedImage'),
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

    const submitShipDocument = (shipId: string) => {
        shipData.shipDocument.forEach((document, index) => {
            documentFormData.append('document', {
                uri: document.uri,
                type: mime.getType(document.name),
                name: `Ship ${shipData.name} Owner ${document.label}`,
            });
            documentFormData.append('docExpired', document.docExpired || null);
        });

        documentFormData.append('shipId', shipId);

        mutationSubmitShipDocument.mutate(
            { request: documentFormData, shipId },
            {
                onSuccess: () => {
                    ToastAndroid.show(
                        t('ShipOwner.toastUploadingImage'),
                        ToastAndroid.SHORT,
                    );
                    navigation.navigate('RFQTemplateOwnerManagement', {
                        shipId: shipId,
                        shipCategory: shipData.category,
                    });
                },
                onError: err => {
                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: t('ShipOwner.textShipAddedFailedDocument'),
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

    const handleSubmit = (value: any, actions: FormikHelpers<any>) => {
        const hasErrors = Object.entries(value).some(([label, item]) => {
            return Object.keys(item as any).length === 0;
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
            Object.entries(value).map(([label, item]) => {
                const selectedImage: ImageOrVideo = item as ImageOrVideo;
                const shipDataWithoutDocument = {
                    name: shipData.name,
                    desc: shipData.desc,
                    category: shipData.category,
                    pricePerMonth: shipData.pricePerMonth,
                    location: shipData.location,
                    length: shipData.length,
                    width: shipData.width,
                    height: shipData.height,
                    facilities: shipData.facilities,
                    specifications: shipData.specifications,
                };
                dispatch(showProgressIndicator());
                return mutationSubmitShip.mutate(shipDataWithoutDocument, {
                    onSuccess: resp => {
                        ToastAndroid.show(
                            t('ShipOwner.toastUploading'),
                            ToastAndroid.SHORT,
                        );
                        submitShipDocument(resp.data.data.shipId);
                        submitShipImage(resp.data.data.shipId, selectedImage);
                        dispatch(hideProgressIndicator());
                        dispatch(
                            showModal({
                                status: 'success',
                                text: t('ShipOwner.textSuccessAdd'),
                            }),
                        );
                        actions.setSubmitting(true);

                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 5000);
                    },
                    onError: err => {
                        dispatch(hideProgressIndicator());
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: t('ShipOwner.textShipAddedFailedShip'),
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 2000);
                        handleAxiosError(err);
                    },
                });
            });
        }
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

    return (
        <ScreenLayout backgroundColor={'light'} testId={'imageFormAddShip'}>
            <View marginH-20 marginV-26>
                <ProgressBar
                    progress={99}
                    style={{
                        backgroundColor: Color.secColor,
                        height: 10,
                        marginBottom: 20,
                    }}
                    progressColor={Color.primaryColor}
                />
                <DynamicForm
                    btnTitle={t('ShipOwner.buttonAddNewShip')}
                    data={sortedForm}
                    onSubmit={handleSubmit}
                />
            </View>
        </ScreenLayout>
    );
};

export default ImageForm;
