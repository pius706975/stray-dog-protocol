import { SearchBar } from '@rneui/themed';
import React from 'react';
import { Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';
import { CustomText, ScreenLayout } from '../../../../components';
import { Color, FontFamily, FontSize } from '../../../../configs';
import { useGetAllUserTransactions } from '../../../../hooks';
import { GetAllUserTransactions, Transaction } from '../../../../types';
import { TransactionCard } from './components';
import { useIsFocused } from '@react-navigation/native';

const ManageTransaction = ({ navigation }) => {
    const isFocus = useIsFocused();
    const [value, setValue] = React.useState('');
    const [page, setPage] = React.useState<number>(1);
    const mutationGetAllUserTransactions = useGetAllUserTransactions();
    const [transactionData, setTransactionData] =
        React.useState<Transaction[]>();

    const fetchMoreTransactionData = () => {
        setPage(page + 1);
    };

    const handleSearch = (text: string) => {
        setValue(text);
    };

    const renderTransactionItem = ({
        item,
        index,
    }: {
        item: Transaction;
        index: number;
    }) => {
        return (
            <TransactionCard
                testID={`transaction-${index}`}
                onPress={() =>
                    navigation.navigate('DetailTransaction', {
                        transactionData: item,
                    })
                }
                status={item.status[item.status.length - 1].name}
                shipImage={item.ship.imageUrl}
                shipName={item.ship.name}
                rentalId={item.rentalId}
                totalRent={item.offeredPrice}
                shipCompany={item.ownerDetails!!.company!!.name!!}
                timeStamp={item.updatedAt}
            />
        );
    };

    React.useEffect(() => {
        if (page !== 1) {
            const request: GetAllUserTransactions = {
                page: page,
                limit: 4,
                query: value === '' ? undefined : value,
            };

            mutationGetAllUserTransactions.mutate(request, {
                onSuccess: res => {
                    setTransactionData(prevTransactionData => {
                        if (prevTransactionData) {
                            return [...prevTransactionData, ...res.data.data];
                        } else {
                            return res.data.data;
                        }
                    });
                },
                onError: err => {
                    console.log(err);
                },
            });
        }
    }, [page]);

    React.useEffect(() => {
        if (value !== '') {
            setPage(1);
            if (page === 1) {
                const request: GetAllUserTransactions = {
                    page: page,
                    limit: 4,
                    query: value,
                };

                const delayDebounceSearch = setTimeout(() => {
                    mutationGetAllUserTransactions.mutate(request, {
                        onSuccess: res => {
                            setTransactionData(res.data.data);
                        },
                        onError: err => {
                            console.log(err);
                        },
                    });
                }, 400);
                return () => clearTimeout(delayDebounceSearch);
            }
        }
    }, [value]);

    React.useEffect(() => {
        const request: GetAllUserTransactions = {
            page: 1,
            limit: 4,
        };
        mutationGetAllUserTransactions.mutate(request, {
            onSuccess: res => {
                setTransactionData(res.data.data);
                setPage(1);
            },
            onError: err => {
                console.log(err);
            },
        });
    }, [isFocus, value === '']);

    return (
        <FlatList
            style={{ marginHorizontal: 20 }}
            data={['']}
            keyExtractor={() => 'dummyKey'}
            showsVerticalScrollIndicator={false}
            renderItem={() => (
                <ScreenLayout
                    backgroundColor="light"
                    testId="adminHomeScreen"
                    marginB={40}>
                    <CustomText
                        fontSize="xl"
                        fontFamily="regular"
                        color="darkTextColor">
                        Transaction List
                    </CustomText>
                    <SearchBar
                        testID={'search-bar'}
                        value={value}
                        onChangeText={handleSearch}
                        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
                        placeholder="Search Transaction"
                        containerStyle={{
                            marginVertical: 12,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Color.softGreyBgPrimary,
                            borderRadius: 5,
                        }}
                        inputContainerStyle={{
                            backgroundColor: Color.softGreyBgPrimary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                        }}
                        inputStyle={{
                            color: Color.darkTextColor,
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.lg,
                        }}
                    />

                    <FlatList
                        testID="transaction-flatlist"
                        ItemSeparatorComponent={() => <View marginV-8 />}
                        data={transactionData}
                        renderItem={renderTransactionItem}
                        keyExtractor={item => item._id.toString()}
                        onEndReached={fetchMoreTransactionData}
                        onEndReachedThreshold={0.1}
                    />
                    {transactionData && transactionData.length === 0 && (
                        <View centerV centerH>
                            <CustomText
                                fontSize="lg"
                                fontFamily="medium"
                                color="darkTextColor">
                                No Transaction Found
                            </CustomText>
                        </View>
                    )}
                </ScreenLayout>
            )}
        />
    );
};

export default ManageTransaction;
