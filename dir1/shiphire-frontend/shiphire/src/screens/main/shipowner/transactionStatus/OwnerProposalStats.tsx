import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';
import { useGetAllOwnerTransaction } from '../../../../hooks';
import {
    OwnerProposalTransactionStatusProps,
    Transaction,
} from '../../../../types';

const OwnerProposalStats: React.FC<OwnerProposalTransactionStatusProps> = ({
    navigation,
}) => {
    const { t } = useTranslation('common');
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllOwnerTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();

    const proposalTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        return (
            lastStatus.name === 'rfq 2' ||
            lastStatus.name === 'proposal 1' ||
            lastStatus.name === 'proposal'
        );
    });
    const filteredTransaction = proposalTransactions?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    const handleOnCardClick = (item: Transaction, status: string) => {
        if (status === 'proposal 1') {
            navigation.navigate('Negotiate', {
                transactionId: item._id,
                status: item.status,
            });
        } else if (status === 'rfq 2') {
            navigation.navigate('ProposalOwner', {
                shipId: item.ship._id,
                categoryId: item.ship.category._id,
                shipOwnerId: item.ship.shipOwnerId,
                renterId: item.renterId,
                rentalId: item.rentalId,
                rentalDuration: item.rentalDuration,
                rentalStartDate: item.rentalStartDate,
                rentalEndDate: item.rentalEndDate,
            });
        }
    };
    React.useEffect(() => {
        isFocused &&
            mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
            });
    }, [isFocused]);

    return filteredTransaction && filteredTransaction.length > 0 ? (
        <ScreenLayout
            testId="ProposalStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction?.map(item => {
                console.log('item', item.status);
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusKey = lastStatus?.name;
                let translatedStatusText = t(`OwnerStatusText.${statusKey}`);
                const lastProposal = item.proposal[item.proposal.length - 1];
                if (statusKey === 'proposal 1' && !lastProposal.proposalUrl) {
                    translatedStatusText = t('StatusText.rfq 1');
                }
                // const statusText = getOwnerStatusText(lastStatus.name);
                const time = moment(item.updatedAt).toDate();

                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="onProgress"
                        statusText={translatedStatusText}
                        onPress={
                            () =>
                                navigation.navigate(
                                    'ShipOwnerTransactionDetail',
                                    {
                                        status: 'proposal',
                                        rentalId: item.rentalId,
                                    },
                                )
                            // () => handleOnCardClick(item, lastStatus.name)
                        }
                        imageUrl={item.ship.imageUrl}
                        shipName={item.ship.name}
                        shipCategory={item.ship.category.name}
                        shipSize={item.ship.size}
                        newRespond={
                            lastStatus.isOpened === true &&
                            lastStatus.name === 'proposal 1'
                        }
                        time={time}
                        responded
                        respondKey={
                            lastStatus.isOpened === true &&
                            lastStatus.name === 'proposal 1' &&
                            !lastProposal.proposalUrl
                                ? t('OwnerStatusText.negotiate 1')
                                : lastStatus.name === 'proposal 1'
                                ? t('OwnerStatusText.negotiate 2')
                                : lastStatus.name === 'proposal 1'
                                ? t('OwnerStatusText.negotiate 1')
                                : t('ProposalStats.respondKey')
                        }
                        respondValue={
                            lastStatus.name === 'proposal 1' &&
                            !lastProposal.proposalUrl
                                ? t(
                                      'TransactionCard.respondValueNegotiateOwner',
                                  )
                                : lastStatus.name === 'proposal 1'
                                ? t(
                                      'TransactionCard.respondValueHistoryNegotiate',
                                  )
                                : t('ProposalStats.respondValue')
                        }
                        respondKeyAlert={lastStatus.isOpened !== true}
                        respondPressed={() =>
                            handleOnCardClick(item, lastStatus.name)
                        }
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

export default OwnerProposalStats;
