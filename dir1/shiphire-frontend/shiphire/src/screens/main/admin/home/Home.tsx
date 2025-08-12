import React from 'react';
import { Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';
import { ADMINDATA, getDataFromLocalStorage } from '../../../../configs';
import { AdminHomeProps } from '../../../../types';
import { Button, CustomText, ScreenLayout } from '../../../../components';

const Home: React.FC<AdminHomeProps> = ({ navigation }) => {
    const [adminData, setAdminData] = React.useState<any>({});
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;

    React.useEffect(() => {
        getDataFromLocalStorage(ADMINDATA).then(res => {
            setAdminData(res);
        });
    }, []);

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
                    marginB={40}
                    paddingV={plusPaddingV}>
                    <CustomText
                        fontSize="xxl"
                        fontFamily="bold"
                        color="primaryColor">
                        Welcome, {adminData.name}
                    </CustomText>
                    <Button
                        testID="manage-transaction"
                        title="Manage Transaction"
                        onSubmit={() =>
                            navigation.navigate('ManageTransaction')
                        }
                    />
                    <View marginT-10>
                        <Button
                            testID="manage-user"
                            title="Manage User"
                            onSubmit={() =>
                                navigation.navigate('UserManagement')
                            }
                        />
                    </View>
                    <View marginT-10>
                        <Button
                            testID="manage-ship"
                            title="Manage Ship"
                            onSubmit={() =>
                                navigation.navigate('ShipManagement')
                            }
                        />
                    </View>
                    <View marginT-10>
                        <Button
                            testID="manage-ship-history"
                            title="Manage Ship History"
                            onSubmit={() =>
                                navigation.navigate('ShipHistoryDelete')
                            }
                        />
                    </View>
                    <View marginT-10>
                        <Button
                            testID="add-ship-form-management"
                            title="Add Ship Form Management"
                            onSubmit={() =>
                                navigation.navigate('AddShipManagement')
                            }
                        />
                    </View>
                    <View marginT-10>
                        <Button
                            testID="rfq-template-management"
                            title="RFQ Template Management"
                            onSubmit={() =>
                                navigation.navigate('RFQTemplateManagement')
                            }
                        />
                    </View>
                    <View marginT-10>
                        <Button
                            testID="company-management"
                            title="Company Management"
                            onSubmit={() =>
                                navigation.navigate('CompanyManagement')
                            }
                        />
                    </View>
                </ScreenLayout>
            )}
        />
    );
};

export default Home;
