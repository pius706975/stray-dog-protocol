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
import { useSendOTPSignContract } from '../../../../hooks';
import { progressIndicatorSlice } from '../../../../slices';
import { ContractPreviewProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import { OTPModal } from './component';
import { useTranslation } from 'react-i18next';

const ContractPreview: React.FC<ContractPreviewProps> = props => {
    const dispatch = useDispatch();
    const { contractUrl, rentalId } = props.route.params;
    const { t } = useTranslation('common');
    const mutationSendOTP = useSendOTPSignContract();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const [visible, setVisible] = React.useState<boolean>(false);
    const [renterEmail, setRenterEmail] = React.useState<string>('');
    const [contractLoading, setContractLoading] =
        React.useState<boolean>(false);

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
        setContractLoading(true);
    }, []);

    React.useEffect(() => {
        dispatch(showProgressIndicator());
        setTimeout(() => {
            dispatch(hideProgressIndicator());
        }, 1000);
    }, [contractLoading]);

    return (
        <ScreenLayout
            testId="ContractPreviewScreen"
            backgroundColor="light"
            padding={10}>
            {contractUrl && (
                <PDFView
                    fadeInDuration={250.0}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        backgroundColor: Color.bgColor,
                    }}
                    resource={contractUrl}
                    resourceType={'url'}
                    onLoad={() => {
                        setContractLoading(false);
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
                {/* <View flex row center>
                    <Button
                        title={t('ContractPreview.labelButtonNegotiate')}
                        onSubmit={() => {}}
                        color="warning"
                        leftIcon={<EditIcon />}
                    />
                </View> */}
                <View flex row right>
                    <Button
                        testID="acceptButton"
                        title={t('ContractPreview.labelButtonAcceptContract')}
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

export default ContractPreview;
