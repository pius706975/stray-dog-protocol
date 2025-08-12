import React from 'react';
import { FlatList, Platform, Pressable } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { CustomText, ScreenLayout } from '../../../../../components';
import { Color, RightIcon } from '../../../../../configs';
import { AddShipManagementProps } from '../../../../../types';

const AddShipManagement: React.FC<AddShipManagementProps> = ({
    navigation,
}) => {
    const menu = [
        {
            id: '1',
            title: 'General Ship Information',
            templateType: 'generalAddShip',
        },
        {
            id: '2',
            title: 'Specific Information',
            templateType: 'spesificAddShip',
        },
        {
            id: '3',
            title: 'Ship Document Information',
            templateType: 'shipDoc',
        },
        {
            id: '4',
            title: 'Ship Image ',
            templateType: 'shipImage',
        },
    ];

    const renderAddShipManagementMenu = ({ item }) => {
        const { title, templateType } = item;
        return (
            <Pressable
                testID={`test-${templateType}`}
                onPress={() => {
                    if (templateType === 'spesificAddShip') {
                        navigation.navigate('AddShipSpecificInfo');
                    } else {
                        navigation.navigate('AddShipInputManagement', {
                            templateType,
                        });
                    }
                }}>
                <View
                    style={{
                        padding: 10,
                        borderBottomWidth: 0.5,
                        margin: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                padding: 5,
                                paddingRight: 10,
                                paddingLeft: 0,
                            }}></View>

                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor">
                            {title}
                        </CustomText>
                    </View>
                    <RightIcon />
                </View>
            </Pressable>
        );
    };
    return (
        <FlatList
            style={{ width: '100%', height: '100%' }}
            data={['']}
            keyExtractor={() => 'dummyKey'}
            showsVerticalScrollIndicator={false}
            renderItem={() => (
                <View
                    style={{
                        margin: 6,
                        borderRadius: 8,
                    }}>
                    <>
                        <FlatList
                            testID="flatlist"
                            ItemSeparatorComponent={() => <View />}
                            data={menu}
                            renderItem={renderAddShipManagementMenu}
                            keyExtractor={item => item.id}
                            onEndReachedThreshold={0.1}
                        />
                    </>
                </View>
            )}
        />
    );
};

export default AddShipManagement;
