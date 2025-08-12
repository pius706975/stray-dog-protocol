import { Pressable, useWindowDimensions } from 'react-native';
import { Avatar, Colors, View } from 'react-native-ui-lib';
import { Color } from '../../../../../configs';
import { CustomText } from '../../../../../components';

const CompanyItem = ({ item, index, navigation }) => {
    const { width } = useWindowDimensions();
    let badgeShow;

    if (item.shipOwnerId?.company.isVerified === false) {
        badgeShow = {};
    } else if (item.renterId?.company.isVerified === false) {
        badgeShow = {};
    } else {
        badgeShow = {
            label: '✓',
            size: 15,
            borderWidth: 1.5,
            borderColor: Colors.$outlineInverted,
            backgroundColor: Color.successColor,
        };
    }

    return (
        <Pressable
            key={index}
            testID={`company-${index}`}
            onPress={() =>
                navigation.navigate('CompanyDetail', {
                    companyInfo: item,
                })
            }
            style={{
                paddingVertical: 10,
                borderBottomWidth: 0.5,
                borderColor: Color.primaryColor,
                flexDirection: 'row',
                gap: width / 24,
            }}>
            <View style={{ justifyContent: 'center' }}>
                <Avatar
                    useAutoColors
                    source={{
                        uri:
                            item.renterId?.company.imageUrl ||
                            item.shipOwnerId?.company.imageUrl,
                    }}
                    badgePosition="BOTTOM_RIGHT"
                    badgeProps={badgeShow}
                />
            </View>
            <View>
                <View style={{ flexWrap: 'wrap' }}>
                    <CustomText
                        fontSize="sm"
                        fontFamily="bold"
                        color="darkTextColor">
                        {item.renterId?.company.name ||
                            item.shipOwnerId?.company.name}
                    </CustomText>
                </View>

                <CustomText
                    fontSize="sm"
                    lineHeight={20}
                    fontFamily="regular"
                    color="darkTextColor">
                    {item.renterId?.name || item.shipOwnerId?.name}
                </CustomText>
                <CustomText
                    fontSize="sm"
                    lineHeight={20}
                    fontFamily="regular"
                    color="darkTextColor">
                    {item.roles === 'shipOwner' ? 'Ship Owner' : 'Renter'}
                </CustomText>
            </View>
        </Pressable>
    );
};

export default CompanyItem;
