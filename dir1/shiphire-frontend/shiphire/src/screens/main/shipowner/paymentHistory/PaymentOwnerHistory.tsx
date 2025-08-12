import React from 'react';
import { PaymentHistoryOwnerProps } from '../../../../types';
import { Color } from '../../../../configs';
import { View } from 'react-native-ui-lib';
import { FlatList } from 'react-native';
import { HistoryList } from './components';

const PaymentOwnerHistory: React.FC<PaymentHistoryOwnerProps> = ({ route }) => {
    const { payment, rentType } = route.params;
    return (
        <View
            flex
            style={{
                backgroundColor: Color.bgColor,
                position: 'relative',
                justifyContent: 'space-between',
            }}
            padding-10
            testID="paymentOwner">
            <FlatList
                testID="flatlistHistory"
                ItemSeparatorComponent={() => <View />}
                data={payment.reverse()}
                renderItem={({ item, index }) => {
                    if (item.receiptUrl) {
                        return (
                            <HistoryList
                                index={index}
                                item={item}
                                rentType={rentType}
                            />
                        );
                    } else {
                        return <View testID="emptyItem"></View>;
                    }
                }}
                keyExtractor={item => item._id}
            />
        </View>
    );
};

export default PaymentOwnerHistory;
