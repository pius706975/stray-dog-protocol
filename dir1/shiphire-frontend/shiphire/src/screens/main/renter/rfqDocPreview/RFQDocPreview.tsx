import mime from 'mime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    Color,
    RFQFILEPATH,
    SendIcon,
    getDataFromLocalStorage,
} from '../../../../configs';
import { useSubmitRequestForQuote } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { RFQDocPreviewProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';

const RFQDocPreview: React.FC<RFQDocPreviewProps> = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const {
        shipId,
        categoryId,
        shipOwnerId,
        rentalDuration,
        rentalDate,
        needs,
        locationDeparture,
        locationDestination,
        shipRentType,
    } = route.params;
    const mutationSubmitRFQ = useSubmitRequestForQuote();
    const { hideModal, showModal } = modalSlice.actions;
    const [pdfFilePath, setPdfFilePath] = React.useState<string>('');
    const [pdfFilePathiOS, setPdfFilePathiOS] = React.useState<string>('');
    const formData = new FormData();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const { t } = useTranslation('rfq');
    const newPdfFilePath =
        Platform.OS === 'ios' ? pdfFilePathiOS : 'file://' + pdfFilePath;

    formData.append('document', {
        uri: newPdfFilePath,
        type: mime.getType(newPdfFilePath),
        name: `RFQ-${shipId}-${shipId}`,
    });

    formData.append('shipId', shipId);
    formData.append('categoryId', categoryId);
    formData.append('shipOwnerId', shipOwnerId);
    formData.append('rentalDuration', rentalDuration);
    formData.append('rentalDate', rentalDate);
    formData.append('needs', needs);
    formData.append('locationDeparture', locationDeparture);
    formData.append('locationDestination', locationDestination);
    formData.append('shipRentType', shipRentType);

    const handleSendRFQ = () => {
        dispatch(showProgressIndicator());
        mutationSubmitRFQ.mutate(formData, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('RFQDocPreview.successRFQSent'),
                    }),
                );
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainScreenTab' }],
                    });
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                }, 3000);
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('RFQDocPreview.failedSendRFQ'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                }, 2000);
                handleAxiosError(err);
            },
        });
    };

    React.useEffect(() => {
        async function fetchPdfFilePath() {
            try {
                const resp = await getDataFromLocalStorage(RFQFILEPATH);
                if (resp && resp.path) {
                    if (Platform.OS === 'ios') {
                        const pdfPath = resp.path.split('/');
                        const fileName = pdfPath[pdfPath.length - 1];
                        setPdfFilePathiOS(resp.path);
                        setPdfFilePath(fileName);
                    } else {
                        setPdfFilePath(resp.path);
                    }
                } else {
                    console.error('Failed to retrieve PDF file path.');
                }
            } catch (error) {
                console.error('Error fetching PDF file path:', error);
            }
        }

        fetchPdfFilePath();
    }, []);

    return (
        <ScreenLayout
            testId="RFQDocPreviewScreen"
            backgroundColor="light"
            padding={10}>
            {pdfFilePath && (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: Color.bgColor,
                    }}>
                    <PDFView
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            backgroundColor: Color.bgColor,
                        }}
                        fadeInDuration={250.0}
                        resource={pdfFilePath}
                        {...(Platform.OS === 'ios' && {
                            fileFrom: 'documentsDirectory',
                        })}
                        resourceType={'file'}
                        // onLoad={() => console.log(`PDF rendered from ${pdfFilePath}`)}
                        onError={error =>
                            console.log('Cannot render PDF', error)
                        }
                    />
                </View>
            )}
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 20,
                }}>
                <Button
                    testID="SendButton"
                    onSubmit={handleSendRFQ}
                    title={t('RFQDocPreview.labelButtonRFQ')}
                    color="success"
                    leftIcon={<SendIcon />}
                    isSubmitting={mutationSubmitRFQ.isLoading}
                />
            </View>
        </ScreenLayout>
    );
};

export default RFQDocPreview;
