import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { NegotiateProps, TransactionNego } from '../../../../types';
import { useGetTransactionForNegotiate } from '../../../../hooks';
import { useIsFocused } from '@react-navigation/native';
import { Color, FontFamily, FontSize } from '../../../../configs';
import { ScreenLayout } from '../../../../components';
import { NegotiateForm, NegotiateHistory, ShipInformation } from './components';
import { Pressable, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

type TabNegotiate = { id: string; text: string; active: boolean };

const Negotiate: React.FC<NegotiateProps> = ({ navigation, route }) => {
    const { t } = useTranslation('common');
    const { transactionId, status } = route.params;
    const mutationGetTransactionForNegotiate = useGetTransactionForNegotiate();
    const [transaction, setTransaction] = React.useState<TransactionNego>();
    const isFocused = useIsFocused();
    const data = [
        {
            id: '1',
            text: t('FormNegotiateRenter.textNegotiate'),
            active: true,
        },
        {
            id: '2',
            text: t('FormNegotiateRenter.textDocument'),
            active: false,
        },
        {
            id: '3',
            text: t('FormNegotiateRenter.textHistory'),
            active: false,
        },
    ];
    const dataWaiting = data.filter(item => item.id !== '1');
    let arr;

    if (
        status[status.length - 1].desc === 'Negotiate draft contact sent' ||
        status[status.length - 1].desc === 'Waiting for contract'
    ) {
        dataWaiting[0].active = true;
        arr = dataWaiting;
    } else {
        arr = data;
    }
    const [activeTab, setActiveTab] = React.useState<TabNegotiate>(arr[0]);
    const [tabNav, setTabNav] = React.useState<TabNegotiate[]>(arr);
    React.useEffect(() => {
        isFocused &&
            mutationGetTransactionForNegotiate.mutate(transactionId, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
                onError: err => {
                    console.log(err);
                },
            });
    }, [isFocused]);

    const handlePress = (id, item) => {
        const updatedData = arr.map(item => ({
            ...item,
            active: item.id === id,
        }));

        setTabNav(updatedData);

        setActiveTab(item);
    };
    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                }}>
                {tabNav.map((item, index) => (
                    <Pressable
                        testID={`tabButton-${item.id}`}
                        key={index}
                        style={{
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderBottomWidth: item.active ? 3 : 0,
                            borderBottomColor: item.active
                                ? Color.boldWarningColor
                                : 'transparent',
                            backgroundColor: 'white',
                            flex: 1,
                        }}
                        onPress={() => handlePress(item.id, item)}>
                        <Text
                            style={{
                                fontFamily: FontFamily.semiBold,
                                fontSize: FontSize.xs,
                                color: item.active
                                    ? Color.boldWarningColor
                                    : Color.softPrimaryColor,
                                textAlign: 'center',
                            }}>
                            {item.text}
                        </Text>
                    </Pressable>
                ))}
                {/* <FlatList
                    data={tabNav}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => renderItem(item)}
                    style={{
                        maxHeight: height / 17,
                    }}
                    keyExtractor={item => item.id}
                /> */}
            </View>
            <ScreenLayout
                testId="NegotiateScreen"
                backgroundColor="light"
                padding={10}
                gap={10}>
                {activeTab.id === '1' ? (
                    <View>
                        {transaction && (
                            <NegotiateForm
                                rentalId={transaction?.rentalId}
                                offeredPrice={
                                    transaction?.proposal[
                                        transaction?.proposal.length - 1
                                    ].offeredPrice
                                }
                                navigation={navigation}
                            />
                        )}
                    </View>
                ) : activeTab.id === '2' ? (
                    <View testID="shipInformationComponent">
                        {transaction?.ship.shipId && (
                            <ShipInformation
                                draftContract={transaction.proposal}
                                shipName={transaction.ship.shipId?.name}
                                shipImageUrl={transaction.ship.shipId?.imageUrl}
                                shipSize={transaction.ship.shipId?.size}
                                shipDocument={
                                    transaction.ship.shipId?.shipDocuments
                                }
                            />
                        )}
                    </View>
                ) : activeTab.id === '3' ? (
                    <View>
                        <NegotiateHistory transaction={transaction} />
                    </View>
                ) : (
                    ''
                )}
            </ScreenLayout>
        </>
    );
};

export default Negotiate;
