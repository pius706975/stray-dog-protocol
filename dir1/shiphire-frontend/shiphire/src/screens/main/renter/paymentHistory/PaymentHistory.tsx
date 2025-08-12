import { Text, FlatList } from 'react-native';
import React from 'react';
import { Payment, PaymentHistoryProps } from '../../../../types';
import { HistoryList } from './components';
import { useGetPaymentHistory } from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';
import { View } from 'react-native-ui-lib';
import { Color } from '../../../../configs';
import { useIsFocused } from '@react-navigation/native';

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ route }) => {
    const { rentalId } = route.params;
    const mutationGetPaymentHistory = useGetPaymentHistory();
    const [historyData, setHistoryData] = React.useState<Payment[]>([]);
    const [rentType, setRentType] = React.useState<string>('');
    const isFocused = useIsFocused();

    const fetchPaymentHistory = () => {
        mutationGetPaymentHistory.mutate(
            { rentalId },
            {
                onSuccess: resp => {
                    setRentType(resp.data.data[0].shipRentType);
                    setHistoryData(resp.data.data[0].payment.reverse());
                },
                onError: err => {
                    handleAxiosError(err);
                },
            },
        );
    };
    React.useEffect(() => {
        if (isFocused) {
            fetchPaymentHistory();
        }
    }, [isFocused]);
    
    return (
        <View
            flex
            style={{
                backgroundColor: Color.bgColor,
                position: 'relative',
                justifyContent: 'space-between',
            }}
            padding-10
            testID="paymentHistoryScreen">
            <FlatList
                testID="flatlistHistory"
                ItemSeparatorComponent={() => <View />}
                data={historyData}
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

export default PaymentHistory;
