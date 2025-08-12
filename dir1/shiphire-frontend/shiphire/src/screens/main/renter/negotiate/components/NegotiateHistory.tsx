import React from 'react';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { FlatList } from 'react-native';
import { NegotiateHistoryProps } from '../../../../../types';

import moment from 'moment';
import NegotiateHistoryItem from './NegotiateHistoryItem';

const NegotiateHistory: React.FC<NegotiateHistoryProps> = ({ transaction }) => {
    const status = transaction?.status.filter(
        item => item.name === 'proposal 1' || item.name === 'proposal 2',
    );
    const proposal = transaction?.proposal;
    let groupedResult = [];
    proposal?.forEach(function (item, index) {
        if (status) {
            var dateKey = moment(status[index].date).format('DD MMM YYYY');
            if (!groupedResult[dateKey]) {
                groupedResult[dateKey] = [];
            }
            const obj = proposal[proposal.length - 1 - index];

            groupedResult[dateKey].push(obj);
        }
    });
    let indexDate = -1;
    return (
        <View paddingH-5>
            {Object.entries(groupedResult).map(([date, items], index) => {
                return (
                    <View marginB-10 key={index}>
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="primaryDisableColor"
                            textAlign="center">
                            {date}
                        </CustomText>

                        <FlatList
                            data={items}
                            showsHorizontalScrollIndicator={false}
                            renderItem={item => {
                                indexDate += 1;
                                return (
                                    <NegotiateHistoryItem
                                        negotiateData={item}
                                        transaction={transaction}
                                        index={indexDate}
                                    />
                                );
                            }}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                        />
                    </View>
                );
            })}
        </View>
    );
};

export default NegotiateHistory;
