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
import { ContractTransactionStatusProps, Transaction } from '../../../../types';
import { getStatusText, handleAxiosError } from '../../../../utils';

const ContractStats: React.FC<ContractTransactionStatusProps> = ({
    navigation,
}) => {
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllTransaction();
    const mutationOpenTransaction = useOpenTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();
    const { t } = useTranslation('common');

    const contractTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        const fileteredLastStatus = lastStatus?.name;
        return fileteredLastStatus === 'contract 1';
    });

    const filteredTransaction = contractTransactions?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    const handleRespondPressed = (
        rentalId: string | String,
        statusName: string,
        contractUrl: string,
        isOpened: boolean = true,
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
        statusName === 'contract 1' &&
            navigation.navigate('ContractPreview', { contractUrl, rentalId });
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
            testId="ContractStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction?.map(item => {
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusKey = lastStatus?.name;
                const translatedStatusText = t(`StatusText.${statusKey}`);
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
                                status: 'contract',
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
                            lastStatus.name === 'contract 1'
                                ? t('TransactionCard.respondKeyContract1')
                                : t('TransactionCard.respondKeyContractElse')
                        }
                        respondKeyAlert={
                            lastStatus.isOpened === true &&
                            lastStatus.name === 'contract 1'
                        }
                        respondKeySuccess={lastStatus.name === 'proposal 4'}
                        respondValue={
                            lastStatus.name === 'contract 1'
                                ? t('TransactionCard.respondValueContract1')
                                : 'undefined'
                        }
                        respondPressed={() =>
                            handleRespondPressed(
                                item.rentalId,
                                lastStatus.name,
                                item.contract.contractUrl,
                                lastStatus.isOpened,
                            )
                        }
                        newRespond={
                            lastStatus.isOpened === false &&
                            lastStatus.name === 'contract 1'
                        }
                        time={time}
                    />
                );
            })}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="ContractStatsScreen"
            backgroundColor="light"
            flex
            center>
            <CustomText
                fontSize="md"
                color="darkTextColor"
                fontFamily="semiBold">
                {t('TransactionCard.textEmptyContract')}
            </CustomText>
        </ScreenLayout>
    );
};

export default ContractStats;
