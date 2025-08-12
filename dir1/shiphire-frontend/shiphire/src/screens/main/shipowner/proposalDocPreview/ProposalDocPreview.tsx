import mime from 'mime';
import React from 'react';
import { View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    Color,
    PROPOSALOWNERFILEPATH,
    SendIcon,
    getDataFromLocalStorage,
} from '../../../../configs';
import { useSubmitProposalOwner } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { ProposalDocPreviewProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import { Platform } from 'react-native';

const ProposalDocPreview: React.FC<ProposalDocPreviewProps> = ({
    navigation,
    route,
}) => {
    const dispatch = useDispatch();
    const { shipId, renterId, offeredPrice, rentalId } = route.params;
    const mutationSubmitProposal = useSubmitProposalOwner();
    const { hideModal, showModal } = modalSlice.actions;
    const [pdfFilePath, setPdfFilePath] = React.useState<string>('');
    const [pdfFilePathiOS, setPdfFilePathiOS] = React.useState<string>('');
    const formData = new FormData();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const newPdfFilePath =
        Platform.OS === 'ios' ? pdfFilePathiOS : 'file://' + pdfFilePath;

    formData.append('document', {
        uri: newPdfFilePath,
        type: mime.getType(newPdfFilePath),
        name: `Proposal-${shipId}-${shipId}`,
    });
    formData.append('shipId', shipId);
    formData.append('renterId', renterId);
    formData.append('offeredPrice', offeredPrice);
    formData.append('rentalId', rentalId);

    const handleSendProposal = () => {
        dispatch(showProgressIndicator());
        mutationSubmitProposal.mutate(formData, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Proposal Sent!',
                    }),
                );
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'ShipOwnerHome' }],
                    });
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                }, 3000);
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'Failed to send Proposal. Please try again.',
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
                const resp = await getDataFromLocalStorage(
                    PROPOSALOWNERFILEPATH,
                );
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
            testId="ProposalDocPreviewScreen"
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
                    // onLoad={() => console.log(`PDF rendered from ${pdfFilePath}`)}
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
                    onSubmit={handleSendProposal}
                    title="Send Proposal"
                    color="success"
                    leftIcon={<SendIcon />}
                    isSubmitting={mutationSubmitProposal.isLoading}
                />
            </View>
        </ScreenLayout>
    );
};

export default ProposalDocPreview;
