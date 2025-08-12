import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions, FlatList, useWindowDimensions } from 'react-native';
import { Color, FontFamily, FontSize } from '../configs';
import {
    Complete,
    ContractStats,
    Failed,
    PaymentStats,
    ProposalStats,
    RequestForQuoteStats,
    ShipTracking,
} from '../screens';
import { TransactionParamList } from '../types';
import { CustomTopTabNav } from './component';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';

const Tab = createMaterialTopTabNavigator<TransactionParamList>();

const TransactionTabNav: React.FC = () => {
    const { height } = useWindowDimensions();
    const { t } = useTranslation('common');
    const [windowWidth, setWindowWidth] = React.useState<number>(
        Dimensions.get('window').width,
    );

    const navData = [
        {
            key: 'RequestForQuote',
            title: t('TransactionStatusTabNav.titleRFQ'),
        },
        { key: 'Proposal', title: t('TransactionStatusTabNav.titleProposal') },
        { key: 'Contract', title: t('TransactionStatusTabNav.titleContract') },
        {
            key: 'PaymentStats',
            title: t('TransactionStatusTabNav.titlePaymentRenter'),
        },
        {
            key: 'ShipTracking',
            title: t('TransactionStatusTabNav.titleTracking'),
        },
        { key: 'Complete', title: t('TransactionStatusTabNav.titleComplete') },
        { key: 'Failed', title: t('TransactionStatusTabNav.titleFailed') },
    ];

    const updateWindowWidth = () => {
        setWindowWidth(Dimensions.get('window').width);
    };
    React.useEffect(() => {
        Dimensions.addEventListener('change', updateWindowWidth);
        console.log(windowWidth);
    }, [Dimensions.get('window').width]);
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarInactiveTintColor: Color.softPrimaryColor,
                tabBarLabelStyle: {
                    fontFamily: FontFamily.semiBold,
                    fontSize: FontSize.xs,
                },
            }}
            tabBar={props => {
                if (windowWidth < 500) {
                    return (
                        <FlatList
                            data={navData}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                const isActive = index === props.state.index;
                                return (
                                    <CustomTopTabNav
                                        label={item.title}
                                        isActive={isActive}
                                        activeIndex={props.state.index}
                                        onPress={() =>
                                            props.navigation.navigate(item.key)
                                        }
                                    />
                                );
                            }}
                            style={{
                                maxHeight: height / 17,
                            }}
                            keyExtractor={item => item.key}
                        />
                    );
                } else {
                    return (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                            {navData.map((item, index) => {
                                const isActive = index === props.state.index;

                                return (
                                    <CustomTopTabNav
                                        key={index}
                                        label={item.title}
                                        isActive={isActive}
                                        activeIndex={props.state.index}
                                        onPress={() =>
                                            props.navigation.navigate(item.key)
                                        }
                                    />
                                );
                            })}
                        </View>
                    );
                }
            }}>
            <Tab.Screen
                name="RequestForQuote"
                component={RequestForQuoteStats}
            />
            <Tab.Screen name="Proposal" component={ProposalStats} />
            <Tab.Screen name="Contract" component={ContractStats} />
            <Tab.Screen name="PaymentStats" component={PaymentStats} />
            <Tab.Screen name="ShipTracking" component={ShipTracking} />
            <Tab.Screen name="Complete" component={Complete} />
            <Tab.Screen name="Failed" component={Failed} />
        </Tab.Navigator>
    );
};

export default TransactionTabNav;