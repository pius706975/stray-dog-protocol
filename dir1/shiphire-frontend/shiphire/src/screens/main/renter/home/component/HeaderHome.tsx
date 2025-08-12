import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { Badge, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { CustomText } from '../../../../../components';
import {
    Color,
    TransactionIcon,
    USERDATA,
    getDataFromLocalStorage,
} from '../../../../../configs';
import { useGetAllTransaction, useGetUserNotif } from '../../../../../hooks';
import { notifBadgeSlice } from '../../../../../slices';
import { HeaderHomeProps, RootState, Transaction, UserNotif } from '../../../../../types';

const HeaderHome: React.FC<HeaderHomeProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { userLocation } = useSelector((state: RootState) => state.userLocation);
    const { addNotifBadge } = notifBadgeSlice.actions;
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllTransaction();
    const mutationGetUserNotif = useGetUserNotif();
    const [renterName, setRenterName] = React.useState<string>();
    const [transactions, setTransaction] = React.useState<Transaction[]>();
    const { t } = useTranslation('home');
    const renterNameSplited = renterName?.split(' ')[0];

    React.useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(resp => {
            setRenterName(resp?.name);
        });
    }, []);

    React.useEffect(() => {
        isFocused &&
            (mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
            }),
            mutationGetUserNotif.mutate(undefined, {
                onSuccess: resp => {
                    dispatch(
                        addNotifBadge(
                            resp.data.data.filter(
                                (notif: UserNotif) => notif.isReaded === false,
                            ).length,
                        ),
                    );
                },
            }));
    }, [isFocused]);
    React.useEffect(() => {
        mutationGetAllTransaction.mutate(undefined, {
            onSuccess: resp => {
                setTransaction(resp.data.data);
            },
        }),
            mutationGetUserNotif.mutate(undefined, {
                onSuccess: resp => {
                    dispatch(
                        addNotifBadge(
                            resp.data.data.filter(
                                (notif: UserNotif) => notif.isReaded === false,
                            ).length,
                        ),
                    );
                },
            });
    }, []);

    const newProposalCount = Array.isArray(transactions)
        ? transactions.filter(
              transaction =>
                  transaction.status[transaction.status.length - 1].desc ===
                      'Draft contract sent' &&
                  !transaction.status[transaction.status.length - 1].isOpened,
              //   transaction.status.some(
              //       status =>
              //           status.desc === 'Negotiate draft contract sent' &&
              //           status.isOpened === false,
              //   ),
          ).length
        : 0;

    const newContractCount = Array.isArray(transactions)
        ? transactions.filter(transaction =>
              transaction.status.some(
                  status =>
                      status.name === 'contract 1' && status.isOpened === false,
              ),
          ).length
        : 0;

    const newTrasactionsCount = newProposalCount + newContractCount;
    return (
        <>
            <View row spread centerV testID="headerHome">
                <CustomText fontFamily="bold" fontSize="xxl" color="primaryColor">
                    {t('textGreet')}
                    {renterNameSplited}
                </CustomText>
                <Pressable
                    testID="transactionButton"
                    onPress={() => navigation.navigate('TransactionStatusTab')}>
                    <TransactionIcon />
                    {newTrasactionsCount > 0 && (
                        <View
                            style={{
                                position: 'absolute',
                                right: -4,
                                top: -4,
                            }}>
                            <Badge
                                label={`${newTrasactionsCount}`}
                                size={14}
                                backgroundColor={Color.boldErrorColor}
                            />
                        </View>
                    )}
                </Pressable>
            </View>
            <View row spread centerV marginB-26 testID="headerHomeUserLocation">
                <CustomText fontFamily="bold" fontSize="sm" color="darkTextColor">
                    {userLocation.city || t('textNoLocation')}
                </CustomText>
            </View>
        </>
    );
};

export default HeaderHome;
