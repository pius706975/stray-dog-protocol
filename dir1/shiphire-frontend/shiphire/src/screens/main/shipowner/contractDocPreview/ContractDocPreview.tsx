import mime from 'mime';
import React from 'react';
import { Platform, View } from 'react-native';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    Color,
    CONTRACTFILEPATH,
    SendIcon,
    getDataFromLocalStorage,
} from '../../../../configs';
import { useSubmitContract } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { OwnerContractPreviewProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';

const ContractDocPreview: React.FC<OwnerContractPreviewProps> = ({
    navigation,
    route,
}) => {
    const dispatch = useDispatch();
    const { shipId, rentalId, renterId, renterCompanyName } = route.params;
    const mutationSubmitContract = useSubmitContract();
    const { hideModal, showModal } = modalSlice.actions;
    const [pdfFilePath, setPdfFilePath] = React.useState<string>('');
    const [pdfFilePathiOS, setPdfFilePathiOS] = React.useState<string>('');
    const formData = new FormData();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const newPdfFilePath =
        Platform.OS === 'ios' ? pdfFilePathiOS : 'file://' + pdfFilePath;

    const handleSendContract = () => {
        formData.append('document', {
            uri: newPdfFilePath,
            type: mime.getType(newPdfFilePath),
            name: `Contract-${shipId}-${rentalId}`,
        });
        formData.append('shipId', shipId);
        formData.append('rentalId', rentalId);
        formData.append('renterId', renterId);
        formData.append('renterCompanyName', renterCompanyName);
        console.log('form data: ', formData);
        dispatch(showProgressIndicator());
        mutationSubmitContract.mutate(formData, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Contract Sent! Check your transaction status frequently for renter response!',
                    }),
                );
                setTimeout(() => {
                    navigation.navigate('OwnerTransactionTabNav');
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                }, 4000);
            },
            onError: err => {
                handleAxiosError(err);
                dispatch(hideProgressIndicator());
            },
        });
    };

    React.useEffect(() => {
        console.log('renter id: ', renterId);
        console.log('renterCompanyName: ', renterCompanyName);
        async function fetchPdfFilePath() {
            try {
                const resp = await getDataFromLocalStorage(CONTRACTFILEPATH);
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
                    console.error('Failed to get pdf file path');
                }
            } catch (error) {
                console.error('Error while fetching pdf file path:', error);
            }
        }
        fetchPdfFilePath();
    }, []);

    console.log('pdf file path: ', pdfFilePath);
    return (
        <ScreenLayout
            testId="OwnerContractDocPreviewScreen"
            backgroundColor="light"
            padding={10}>
            {pdfFilePath && (
                <PDFView
                    fadeInDuration={250.0}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        backgroundColor: Color.bgColor,
                    }}
                    resource={pdfFilePath}
                    {...(Platform.OS === 'ios' && {
                        fileFrom: 'documentsDirectory',
                    })}
                    resourceType={'file'}
                    onLoad={() =>
                        console.log(`PDF rendered from ${pdfFilePath}`)
                    }
                    onError={error => console.log('Cannot render PDF', error)}
                />
            )}
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 20,
                }}>
                <Button
                    onSubmit={handleSendContract}
                    title="Send Contract"
                    color="success"
                    leftIcon={<SendIcon />}
                    isSubmitting={mutationSubmitContract.isLoading}
                />
            </View>
        </ScreenLayout>
    );
};

export default ContractDocPreview;
