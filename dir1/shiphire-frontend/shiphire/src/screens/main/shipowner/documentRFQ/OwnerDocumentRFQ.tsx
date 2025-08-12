import React from 'react';
import { View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { AcceptRFQRequest, OwnerDocumentRFQProps } from '../../../../types';
import { useTranslation } from 'react-i18next';
import { useUpdateTransactionAcceptRFQ } from '../../../../hooks';

const OwnerDocumentRFQ: React.FC<OwnerDocumentRFQProps> = ({
    navigation,
    route,
}) => {
    const { documentUrl, shipId, documentName, rentalId } = route.params;
    const dispatch = useDispatch();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const { hideModal, showModal } = modalSlice.actions;
    const mutationUpdateTransactionAcceptRFQ = useUpdateTransactionAcceptRFQ();
    const { t } = useTranslation('common');

    const handleError = () => {
        dispatch(
            showModal({
                status: 'failed',
                text: t('DocumentPreview.failedLoad'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 3000);
    };

    const handleAcceptRFQ = async () => {
        dispatch(showProgressIndicator());
        const request: AcceptRFQRequest = {
            rentalId: rentalId!!,
        };
        mutationUpdateTransactionAcceptRFQ.mutate(request, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                navigation.navigate('OwnerTransactionTabNav');
            },
        });
    };

    return (
        <>
            <ScreenLayout testId="DocumentShipScreen" backgroundColor="light">
                {documentUrl && (
                    <PDFView
                        fadeInDuration={250.0}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            backgroundColor: Color.bgColor,
                        }}
                        resource={documentUrl}
                        resourceType={'url'}
                        onError={error => handleError()}
                    />
                )}
            </ScreenLayout>

            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}>
                <Button
                    testID="acceptRFQ-button"
                    title={t('RFQStats.btnAcceptRFQ')}
                    color="success"
                    onSubmit={() => {
                        handleAcceptRFQ();
                    }}
                />
            </View>
        </>
    );
};

export default OwnerDocumentRFQ;
