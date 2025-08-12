import React from 'react';
import { View } from 'react-native-ui-lib';
import { CompanyManagementProps, UserInfo } from '../../../../types';
import { ScreenLayout } from '../../../../components';
import { FlatList } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { useGetCompany } from '../../../../hooks';
import { CompanyItem } from './components';

const CompanyManagement: React.FC<CompanyManagementProps> = ({
    navigation,
}) => {
    const isFocused = useIsFocused();
    const mutationGetCompany = useGetCompany();
    const [companies, setCompanies] = React.useState<UserInfo[]>([]);

    React.useEffect(() => {
        isFocused &&
            mutationGetCompany.mutate(undefined, {
                onSuccess: resp => {
                    setCompanies(resp.data.data);
                },
            });
    }, [isFocused]);

    return (
        <ScreenLayout
            testId="companyManagementScreen"
            backgroundColor="light"
            padding={20}
            flex>
            <FlatList
                testID="flatlistCompany"
                ItemSeparatorComponent={() => <View />}
                data={companies}
                renderItem={({ item, index }) => (
                    <CompanyItem
                        item={item}
                        index={index}
                        navigation={navigation}
                    />
                )}
                keyExtractor={item => item._id}
                onEndReachedThreshold={0.1}
                scrollEnabled={false}
            />
        </ScreenLayout>
    );
};

export default CompanyManagement;
