import React from 'react';
import { UserData, UserManagementProps } from '../../../../types';
import { useGetAllUser } from '../../../../hooks';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';
import { UserListItem } from './component';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const UserManagement: React.FC<UserManagementProps> = ({ navigation }) => {
    const { t } = useTranslation('usermanagement');
    const mutationGetAllUser = useGetAllUser();
    const [userListData, setUserListData] = React.useState<UserData[]>();

    const isFocused = useIsFocused();
    const role = (userRole: string) => {
        let roleText: string = '';
        if (userRole === 'renter') {
            roleText = t('renter');
        } else if (userRole === 'shipOwner') roleText = t('shipOwner');
        return roleText;
    };

    React.useEffect(() => {
        mutationGetAllUser.mutate(undefined, {
            onSuccess: resp => {
                setUserListData(resp.data.data);
            },
            onError: err => {
                console.log(err);
            },
        });
    }, []);

    React.useEffect(() => {
        isFocused &&
            mutationGetAllUser.mutate(undefined, {
                onSuccess: resp => {
                    setUserListData(resp.data.data);
                },
            });
    }, [isFocused]);

    const renderTransactionItem = ({
        item,
        index,
    }: {
        item: UserData;
        index: number;
    }) => {
        const textRole = role(item.roles);
        return (
            <UserListItem
                onPress={() =>
                    navigation.navigate('UserDetail', { user: item })
                }
                index={index}
                isActive={item.isActive}
                isPhoneVerified={item.isPhoneVerified}
                name={item.name}
                role={textRole}
                googleId={item.googleId}
            />
        );
    };

    return (
        <FlatList
            style={{ marginVertical: 10, width: '100%' }}
            data={['']}
            keyExtractor={() => 'dummyKey'}
            showsVerticalScrollIndicator={false}
            renderItem={() => (
                <>
                    <FlatList
                        testID="user-flatlist"
                        ItemSeparatorComponent={() => <View />}
                        data={userListData}
                        renderItem={renderTransactionItem}
                        keyExtractor={item => item._id}
                        onEndReachedThreshold={0.1}
                    />
                </>
            )}
        />
    );
};

export default UserManagement;
