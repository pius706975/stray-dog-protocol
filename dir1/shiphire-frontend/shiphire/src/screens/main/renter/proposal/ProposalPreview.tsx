import React from 'react';
import { View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    CheckIcon,
    Color,
    EditIcon,
    USERDATA,
    getDataFromLocalStorage,
} from '../../../../configs';
import { useSendOTPSignProposal } from '../../../../hooks';
import { progressIndicatorSlice } from '../../../../slices';
import { ProposalPreviewProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import { OTPModal } from './component';
import { useTranslation } from 'react-i18next';

const ProposalPreview: React.FC<ProposalPreviewProps> = props => {
    const dispatch = useDispatch();
    const { proposalUrl, rentalId } = props.route.params;
    const mutationSendOTP = useSendOTPSignProposal();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const [visible, setVisible] = React.useState<boolean>(false);
    const [renterEmail, setRenterEmail] = React.useState<string>('');
    const [proposalLoading, setProposalLoading] =
        React.useState<boolean>(false);
    const { t } = useTranslation('proposal');

    const handleAcceptPressed = () => {
        mutationSendOTP.mutate(undefined, {
            onSuccess: () => {
                setVisible(!visible);
            },
            onError: err => {
                handleAxiosError(err);
            },
        });
    };

    React.useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(resp => {
            setRenterEmail(resp.email);
        });
        setProposalLoading(true);
    }, []);

    React.useEffect(() => {
        dispatch(showProgressIndicator());
        setTimeout(() => {
            dispatch(hideProgressIndicator());
        }, 1000);
    }, [proposalLoading]);

    return (
        <ScreenLayout
            testId="ProposalPreviewScreen"
            backgroundColor="light"
            padding={10}>
            {proposalUrl && (
                <PDFView
                    fadeInDuration={250.0}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        backgroundColor: Color.bgColor,
                    }}
                    resource={proposalUrl}
                    resourceType={'url'}
                    onLoad={() => {
                        setProposalLoading(false);
                        setTimeout(() => {
                            dispatch(hideProgressIndicator());
                        }, 1000);
                    }}
                    onError={error => console.log('Cannot render PDF', error)}
                />
            )}
            <View
                row
                spread
                center
                flex
                style={{
                    position: 'absolute',
                    bottom: 30,
                }}>
                <View flex row center>
                    <Button
                        title={t('labelButtonNegotiate')}
                        onSubmit={() => {}}
                        color="warning"
                        leftIcon={<EditIcon />}
                    />
                </View>
                <View flex row center>
                    <Button
                        testID="acceptButton"
                        title={t('labelButtonAccept')}
                        onSubmit={handleAcceptPressed}
                        color="success"
                        leftIcon={<CheckIcon />}
                        isSubmitting={mutationSendOTP.isLoading}
                    />
                </View>
            </View>
            {visible && (
                <OTPModal
                    visible={visible}
                    setVisible={setVisible}
                    parentProp={props}
                    rentalId={rentalId}
                    renterEmail={renterEmail}
                />
            )}
        </ScreenLayout>
    );
};

export default ProposalPreview;
