import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions, FlatList, useWindowDimensions } from 'react-native';
import { Color, FontFamily, FontSize } from '../configs';
import { OwnerTransactionParamList } from '../types';
import { CustomTopTabNav } from './component';
import { useTranslation } from 'react-i18next';
import {
    CompleteStats,
    OwnerProposalStats,
    OwnerRequestForQuoteStats,
    OwnerShipTracking,
} from '../screens';
import AcceptPaymentStats from '../screens/main/shipowner/transactionStatus/AcceptPaymentStats';
import { OwnerContractStats } from '../screens';
import { View } from 'react-native-ui-lib';
import React from 'react';

const Tab = createMaterialTopTabNavigator<OwnerTransactionParamList>();

const OwnerTransactionTabNav: React.FC = () => {
    const { t } = useTranslation('common');
    const [windowWidth, setWindowWidth] = React.useState<number>(
        Dimensions.get('window').width,
    );
    const { height } = useWindowDimensions();
    const navData: {
        key: keyof OwnerTransactionParamList;
        name: keyof OwnerTransactionParamList;
        component: any;
        title: string;
    }[] = [
        {
            key: 'RequestForQuote',
            name: 'RequestForQuote',
            component: OwnerRequestForQuoteStats,
            title: t('TransactionStatusTabNav.titleRFQ'),
        },
        {
            key: 'Proposal',
            name: 'Proposal',
            component: OwnerProposalStats,
            title: 'PROPOSAL',
        },
        {
            key: 'Contract',
            name: 'Contract',
            component: OwnerContractStats,
            title: t('TransactionStatusTabNav.titleContract'),
        },
        {
            key: 'AcceptPayment',
            name: 'AcceptPayment',
            component: AcceptPaymentStats,
            title: t('TransactionStatusTabNav.titlePaymentOwner'),
        },
        {
            key: 'ShipTracking',
            name: 'ShipTracking',
            component: OwnerShipTracking,
            title: t('TransactionStatusTabNav.titleTracking'),
        },
        {
            key: 'Complete',
            name: 'Complete',
            component: CompleteStats,
            title: t('TransactionStatusTabNav.titleComplete'),
        },
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
            testID="ownerTransactionTabNav"
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
            {navData.map((item, index) => (
                <Tab.Screen
                    key={index}
                    name={item.name}
                    component={item.component}
                />
            ))}
        </Tab.Navigator>
    );
};

export default OwnerTransactionTabNav;
