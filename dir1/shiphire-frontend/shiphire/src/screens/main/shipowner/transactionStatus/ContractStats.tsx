import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';
import {
    COMPANYDATA,
    USERDATA,
    getDataFromLocalStorage,
} from '../../../../configs';
import {
    useGetAllOwnerTransaction,
    useGetRenterDataById,
    useOpenTransaction,
} from '../../../../hooks';
import {
    OwnerContractTransactionStatusProps,
    ShipOwnerCompanyData,
    ShipOwnerUserData,
    Transaction,
} from '../../../../types';
import { generateContractDocument, handleAxiosError } from '../../../../utils';

const OwnerContractStats: React.FC<OwnerContractTransactionStatusProps> = ({
    navigation,
}) => {
    const { t } = useTranslation('common');
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllOwnerTransaction();
    const mutationOpenTransaction = useOpenTransaction();
    const mutationGetRenterDataById = useGetRenterDataById();
    const [transaction, setTransaction] = React.useState<Transaction[]>([]);
    const [shipOwnerUserData, setShipOwnerUserData] =
        React.useState<ShipOwnerUserData>({
            email: '',
            name: '',
            phone: '',
            isVerified: true,
            isCompanySubmitted: true,
        });
    const [shipOwnerCompanyData, setShipOwnerCompanyData] =
        React.useState<ShipOwnerCompanyData>({
            name: '',
            companyType: '',
            address: '',
            bankName: '',
            bankAccountName: '',
            bankAccountNumber: 0,
        });
    const contractTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        return (
            lastStatus.name === 'contract 1' || lastStatus.name === 'proposal 2'
        );
    });

    const filteredTransaction = contractTransactions?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    React.useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(resp => {
            setShipOwnerUserData(resp);
        });
        getDataFromLocalStorage(COMPANYDATA).then(resp => {
            setShipOwnerCompanyData(resp);
        });

        isFocused &&
            mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
            });
    }, [isFocused]);

    // const handleRespondPressed = async (
    //     rentalId: string | String,
    //     statusName: string,

    //     // contractUrl: string,
    //     isOpened: boolean = true,
    // ) => {
    //     !isOpened &&
    //         mutationOpenTransaction.mutate(
    //             { rentalId },
    //             {
    //                 onSuccess: () => {
    //                     console.log('success');
    //                 },
    //                 onError: err => {
    //                     handleAxiosError(err);
    //                 },
    //             },
    //         );
    //     const selectedTransaction = filteredTransaction?.find(
    //         item => item.rentalId === rentalId,
    //     );

    //     if (!selectedTransaction) {
    //         console.error(`Transaction with id ${rentalId} is not found`);
    //         return;
    //     }

    //     const renterId = selectedTransaction.renterId;
    //     try {
    //         const resp = await mutationGetRenterDataById.mutateAsync(renterId);
    //         const updatedRenterData = {
    //             name: resp.data.data.name,
    //         };

    //         const updatedRenterCompanyData = {
    //             name: resp.data.data.company.name,
    //             companyType: resp.data.data.company.companyType,
    //             address: resp.data.data.company.address,
    //         };

    //         const rentalDuration = selectedTransaction.rentalDuration;
    //         const rentalStartDate = moment(selectedTransaction.rentalStartDate)
    //             .utc()
    //             .format('DD MMMM YYYY');
    //         const rentalEndDate = moment(selectedTransaction.rentalEndDate)
    //             .utc()
    //             .format('DD MMMM YYYY');
    //         const dateNow = new Date();
    //         await generateContractDocument(
    //             selectedTransaction,
    //             updatedRenterData,
    //             updatedRenterCompanyData,
    //             shipOwnerUserData,
    //             shipOwnerCompanyData,
    //             rentalDuration,
    //             rentalStartDate,
    //             rentalEndDate,
    //             dateNow,
    //         );
    //         if (
    //             selectedTransaction.contract &&
    //             selectedTransaction.contract.contractUrl
    //         ) {
    //             // Gunakan contract URL yang sudah ada
    //             navigation.navigate('OwnerDocumentPreview', {
    //                 documentUrl: selectedTransaction?.contract.contractUrl,
    //                 documentName: 'Contract Preview',
    //             });
    //         } else {
    //             // Jika tidak ada, navigasi ke OwnerContractPreview
    //             navigation.navigate('OwnerContractPreview', {
    //                 shipId: selectedTransaction?.ship._id,
    //                 rentalId: selectedTransaction?.rentalId,
    //                 renterId: selectedTransaction?.renterId,
    //                 renterCompanyName: updatedRenterCompanyData.name,
    //             });
    //             console.log(
    //                 'updatedRenterCompanyData',
    //                 updatedRenterCompanyData.name,
    //             );
    //         }
    //     } catch (error) {
    //         console.error('Error generating contract: ', error);
    //     }
    // };

    const handleRespondPress = async (
        rentalId: string | String,
        statusName: string,

        // contractUrl: string,
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
        const selectedTransaction = filteredTransaction?.find(
            item => item.rentalId === rentalId,
        );

        if (!selectedTransaction) {
            console.error(`Transaction with id ${rentalId} is not found`);
            return;
        }

        const renterId = selectedTransaction.renterId;
        const resp = await mutationGetRenterDataById.mutateAsync(renterId);
        // const updatedRenterCompanyData = {
        //     name: resp.data.data.company.name,
        //     companyType: resp.data.data.company.companyType,
        //     address: resp.data.data.company.address,
        // };
        if (
            selectedTransaction.contract &&
            selectedTransaction.contract.contractUrl
        ) {
            // Gunakan contract URL yang sudah ada
            navigation.navigate('OwnerDocumentPreview', {
                documentUrl: selectedTransaction?.contract.contractUrl,
                documentName: 'Contract Preview',
            });
        } else {
            navigation.navigate('SendContract', {
                shipId: selectedTransaction?.ship._id,
                rentalId: selectedTransaction?.rentalId,
                renterId: selectedTransaction?.renterId,
                renterCompanyName: resp.data.data.company.name,
                renterCompanyAddress: resp.data.data.company.address,
                renterName: resp.data.data.name,
                shipName: selectedTransaction?.ship.name,
                shipCategory: selectedTransaction?.ship.category.name,
                shipSize: selectedTransaction?.ship.size,
                shipCompanyType: shipOwnerCompanyData.companyType,
                shipCompanyName: shipOwnerCompanyData.name,
                shipDocuments: selectedTransaction?.ship.shipDocuments,
                shipImageUrl: selectedTransaction?.ship.imageUrl,
                draftContract: selectedTransaction?.proposal,
            });
        }
    };

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
                const translatedStatusText = t(`OwnerStatusText.${statusKey}`);
                // const statusText = getOwnerStatusText(lastStatus.name);
                const time = moment(item.updatedAt).toDate();

                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="onProgress"
                        statusText={translatedStatusText}
                        onPress={() =>
                            navigation.navigate('ShipOwnerTransactionDetail', {
                                status: 'contract',
                                rentalId: item.rentalId,
                            })
                        }
                        imageUrl={item.ship.imageUrl}
                        shipName={item.ship.name}
                        shipCategory={item.ship.category.name}
                        shipSize={item.ship.size}
                        responded
                        respondKey={
                            lastStatus.isOpened === true &&
                            lastStatus.name === 'proposal 2'
                                ? t('ContractStats.respondKeyProposal4')
                                : lastStatus.name === 'contract 1'
                                ? t('ContractStats.respondKeyContract1')
                                : t(
                                      'ContractStats.respondKeyProposal4NotOpened',
                                  )
                        }
                        respondKeyAlert={
                            lastStatus.isOpened === true &&
                            lastStatus.name === 'proposal 2'
                        }
                        respondValue={
                            lastStatus.name === 'proposal 2'
                                ? t('ContractStats.respondValueProposal4')
                                : t('ContractStats.respondValueContract1')
                        }
                        respondPressed={
                            () =>
                                handleRespondPress(
                                    item.rentalId,
                                    lastStatus.name,
                                    lastStatus.isOpened,
                                )
                            // () =>
                            // handleRespondPressed(
                            //     item.rentalId,
                            //     lastStatus.name,
                            //     // item.contract.contractUrl,
                            //     lastStatus.isOpened,
                            // )
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

export default OwnerContractStats;
