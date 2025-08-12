import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';
import { useGetAllTransaction, useOpenTransaction } from '../../../../hooks';
import {
    ProposalTransactionStatusProps,
    Transaction,
    TransactionStatus,
} from '../../../../types';
import { handleAxiosError } from '../../../../utils';

const ProposalStats: React.FC<ProposalTransactionStatusProps> = ({
    navigation,
}) => {
    const { t } = useTranslation('common');
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllTransaction();
    const mutationOpenTransaction = useOpenTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();

    const proposalTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        const fileteredLastStatus = lastStatus?.name.split(' ')[0];
        return fileteredLastStatus === 'proposal';
    });

    const filteredTransaction = proposalTransactions?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    const handleRespondPressed = (
        rentalId: string | String,
        statusName: string,
        // proposalUrl: string | undefined,
        isOpened: boolean = true,
        paymentReceiptUrl: string,
        transactionId: string,
        status: TransactionStatus[],
    ) => {
        !isOpened &&
            mutationOpenTransaction.mutate(
                { rentalId },
                {
                    onSuccess: () => {
                        console.log('success');
                    },
                    onError: err => {
                        handleAxiosError(err);
                    },
                },
            );

        statusName === 'proposal 1' &&
            navigation.navigate('Negotiate', { transactionId, status });
        statusName === 'proposal 2' &&
            navigation.navigate('Negotiate', { transactionId, status });
        statusName === 'proposal 3' &&
            navigation.navigate('PaymentReceipt', { paymentReceiptUrl });
        statusName === 'proposal 4' &&
            navigation.navigate('PaymentReceipt', { paymentReceiptUrl });
    };

    React.useEffect(() => {
        isFocused &&
            mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
            });
    }, [isFocused]);
    console.log(filteredTransaction);

    return filteredTransaction && filteredTransaction.length > 0 ? (
        <ScreenLayout
            testId="ProposalStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction?.map(item => {
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusKey = lastStatus?.name;
                let translatedStatusText = t(`StatusText.${statusKey}`);
                const lastProposal = item.proposal[item.proposal.length - 1];
                if (statusKey === 'proposal 1' && !lastProposal.proposalUrl) {
                    translatedStatusText = t('StatusText.rfq 1');
                }
                // const statusText = getStatusText(lastStatus.name);
                const time = moment(item.updatedAt).toDate();

                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="onProgress"
                        statusText={translatedStatusText}
                        onPress={() => {
                            navigation.navigate('TransactionDetailStack', {
                                status: 'proposal',
                                rentalId: item.rentalId,
                            });
                        }}
                        imageUrl={item.ship.imageUrl}
                        shipName={item.ship.name}
                        shipCategory={item.ship.category.name}
                        shipSize={item.ship.size}
                        responded
                        respondKey={
                            lastStatus.isOpened === true &&
                            lastStatus.name === 'proposal 1' &&
                            !lastProposal.proposalUrl
                                ? t(
                                      'TransactionCard.respondKeyProposalWaiting1',
                                  )
                                : lastStatus.name === 'proposal 1'
                                ? t('TransactionCard.respondKeyProposal1')
                                : lastStatus.name === 'proposal 2'
                                ? t('TransactionCard.respondKeyProposal2')
                                : lastStatus.name === 'proposal 3'
                                ? t('TransactionCard.respondKeyProposal3')
                                : lastStatus.name === 'proposal 4'
                                ? t('TransactionCard.respondKeyProposal4')
                                : t('TransactionCard.respondKeyElse')
                        }
                        respondKeyAlert={
                            lastStatus.isOpened === true &&
                            lastStatus.name === 'proposal 1' &&
                            lastProposal.proposalUrl !== undefined
                        }
                        respondKeySuccess={lastStatus.name === 'proposal 4'}
                        respondValue={
                            lastStatus.name === 'proposal 1' &&
                            !lastProposal.proposalUrl
                                ? t(
                                      'TransactionCard.respondValueProposalWaiting1',
                                  )
                                : lastStatus.name === 'proposal 1'
                                ? t('TransactionCard.respondValueProposal1')
                                : lastStatus.name === 'proposal 2'
                                ? t('TransactionCard.respondValueProposal2')
                                : lastStatus.name === 'proposal 3' ||
                                  lastStatus.name === 'proposal 4'
                                ? t('TransactionCard.respondValueProposal3/4')
                                : t('TransactionCard.respondValueProposalElse')
                        }
                        respondPressed={() =>
                            handleRespondPressed(
                                item.rentalId,
                                lastStatus.name,
                                // item?.proposal[item.proposal.length - 1]
                                //     ?.proposalUrl,
                                lastStatus.isOpened,
                                item.payment[item.payment.length - 1]
                                    ?.receiptUrl,
                                item._id,
                                statusArray,
                            )
                        }
                        newRespond={
                            lastStatus.isOpened === false &&
                            lastStatus.name === 'proposal 1' &&
                            lastProposal.proposalUrl !== undefined
                        }
                        time={time}
                    />
                );
            })}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="ProposalStatsScreen"
            backgroundColor="light"
            flex
            center>
            <CustomText
                fontSize="md"
                color="darkTextColor"
                fontFamily="semiBold">
                {t('TransactionCard.textEmptyProposal')}
            </CustomText>
        </ScreenLayout>
    );
};

export default ProposalStats;
