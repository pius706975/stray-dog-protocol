import moment from 'moment';
import React from 'react';
import { Badge, View } from 'react-native-ui-lib';
import { Pressable } from 'react-native';
import { Button, CustomText } from '../../../../../components';
import { BlackShipIcon, Color } from '../../../../../configs';
import { TransactionStatusCardProps } from '../../../../../types';
import Wizard from './Wizard';
import { useTranslation } from 'react-i18next';

const TransactionStatusCard: React.FC<TransactionStatusCardProps> = ({
    lastStatusText,
    rentalId,
    status,
    rentalPeriod,
    lastStatusName,
    newRespond,
    alertRespond,
    handleRespondPressed,
    offeredPrice,
    paymentDate,
    statusLength,
    approveDate,
    navigation,
}) => {
    const formattedPrice = offeredPrice?.toLocaleString('id-ID');
    const formattedPaymentDate = moment(paymentDate).format('DD-MM-YYYY HH:mm');
    const formattedApproveDate = moment(approveDate).format('DD-MM-YYYY HH:mm');
    const { t } = useTranslation('transactiondetail');

    // const responseButtonTitle = () => {
    //     switch (lastStatusName) {
    //         case 'proposal 1':
    //             return 'Open Proposal';
    //         case 'payment 1':
    //             return 'Pay';
    //         case 'contract 1':
    //             return 'Open Contract';
    //         default:
    //             return 'Open Response';
    //     }
    // };

    return (
        <Pressable
            style={{
                borderRadius: 6,
                padding: 20,
                backgroundColor: Color.bgNeutralColor,
            }}
            onPress={() =>
                navigation.navigate('TrackTransactionsStat', {
                    rentalId,
                })
            }>
            <View flex row spread>
                <View
                    row
                    centerV
                    style={{
                        gap: 16,
                    }}>
                    <BlackShipIcon />
                    <CustomText
                        fontSize="xl"
                        fontFamily="bold"
                        color="primaryColor">
                        {t('TransactionStatusCard.textTransactionStatus')}
                    </CustomText>
                </View>
                <View
                    row
                    centerV
                    style={{
                        gap: 6,
                    }}>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {t('TransactionStatusCard.textTrack')}
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {'>'}
                    </CustomText>
                </View>
            </View>
            <View
                flex
                paddingV-20
                style={{
                    gap: 16,
                }}>
                <View row spread>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="neutralColor">
                        {t('TransactionStatusCard.textRentalID')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        No. {rentalId}
                    </CustomText>
                </View>
                <View row spread>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="neutralColor">
                        {t('TransactionStatusCard.textRentalPeriod')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {rentalPeriod}d
                    </CustomText>
                </View>
                {statusLength > 3 && (
                    <>
                        <View row spread>
                            <CustomText
                                fontSize="sm"
                                fontFamily="regular"
                                color="neutralColor">
                                {t('TransactionStatusCard.textTotalPrice')}
                            </CustomText>
                            <CustomText
                                fontSize="sm"
                                fontFamily="semiBold"
                                color="primaryColor">
                                Rp{formattedPrice}
                            </CustomText>
                        </View>
                        <View row spread>
                            <CustomText
                                fontSize="sm"
                                fontFamily="regular"
                                color="neutralColor">
                                {t('TransactionStatusCard.textReceiptSent')}
                            </CustomText>
                            <CustomText
                                fontSize="sm"
                                fontFamily="regular"
                                color="primaryColor">
                                {formattedPaymentDate}
                            </CustomText>
                        </View>
                        {statusLength > 4 && (
                            <View row spread>
                                <CustomText
                                    fontSize="sm"
                                    fontFamily="regular"
                                    color="neutralColor">
                                    {t(
                                        'TransactionStatusCard.textReceiptApproved',
                                    )}
                                </CustomText>
                                <CustomText
                                    fontSize="sm"
                                    fontFamily="regular"
                                    color="primaryColor">
                                    {formattedApproveDate}
                                </CustomText>
                            </View>
                        )}
                    </>
                )}
            </View>
            <View
                style={{
                    backgroundColor: Color.bgNeutralColor,
                    marginTop: 10,
                    padding: 10,
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                }}>
                <Wizard
                    label={lastStatusText}
                    complete={status === 'complete'}
                />
            </View>
            {/* {(lastStatusName === 'proposal 1' ||
                lastStatusName === 'payment 1') && (
                <View flex row>
                    <View flex>
                        <Button
                            title={responseButtonTitle()}
                            onSubmit={handleRespondPressed}
                        />
                        {newRespond && (
                            <View
                                style={{
                                    position: 'absolute',
                                    right: -8,
                                    top: -6,
                                }}>
                                <Badge
                                    label={'New'}
                                    size={18}
                                    backgroundColor={Color.boldWarningColor}
                                />
                            </View>
                        )}
                        {alertRespond && (
                            <View
                                style={{
                                    position: 'absolute',
                                    right: -4,
                                    top: -6,
                                }}>
                                <Badge
                                    label={'!'}
                                    size={18}
                                    backgroundColor={Color.boldErrorColor}
                                />
                            </View>
                        )}
                    </View>
                </View>
            )} */}
        </Pressable>
    );
};

export default TransactionStatusCard;
