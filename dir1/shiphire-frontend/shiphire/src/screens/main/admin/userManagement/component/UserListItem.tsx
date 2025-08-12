import { Pressable, useWindowDimensions } from 'react-native';
import { Color } from '../../../../../configs';
import { Avatar, Badge, View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { useTranslation } from 'react-i18next';
import { UserItemListProps } from '../../../../../types';

const UserListItem: React.FC<UserItemListProps> = ({
    onPress,
    name,
    role,
    isActive,
    isPhoneVerified,
    googleId,
    index,
}) => {
    const { width } = useWindowDimensions();
    const { t } = useTranslation('usermanagement');
    return (
        <>
            <Pressable
                testID={`user-${index}`}
                onPress={onPress}
                style={{
                    paddingVertical: 14,
                    borderBottomWidth: 0.5,
                    borderColor: Color.primaryColor,
                    padding: 10,
                    flexDirection: 'row',
                    gap: width / 24,
                }}>
                <Avatar name={name} useAutoColors />
                <View>
                    <CustomText
                        fontSize="md"
                        fontFamily="bold"
                        color="darkTextColor">
                        {name}
                    </CustomText>

                    <CustomText
                        fontSize="sm"
                        lineHeight={20}
                        fontFamily="regular"
                        color="darkTextColor">
                        {role}
                    </CustomText>
                    <View row>
                        {isActive ? (
                            <Badge
                                marginR-10
                                label={t('active')}
                                borderRadius={3}
                                backgroundColor={Color.primaryColor}
                                size={16}
                            />
                        ) : (
                            <Badge
                                marginR-10
                                label={t('inactive')}
                                borderRadius={3}
                                backgroundColor={Color.darkTextColor}
                                size={16}
                            />
                        )}
                        {!isPhoneVerified && (
                            <Badge
                                marginR-10
                                label={t('unverifiedNumber')}
                                borderRadius={3}
                                backgroundColor={Color.errorColor}
                                size={16}
                            />
                        )}
                        {googleId && (
                            <Badge
                                labelStyle={{ color: 'black' }}
                                borderColor={Color.darkTextColor}
                                borderWidth={1}
                                label={t('googleAccount')}
                                borderRadius={3}
                                backgroundColor={Color.lightTextColor}
                                size={16}
                            />
                        )}
                    </View>
                </View>
            </Pressable>
        </>
    );
};

export default UserListItem;
