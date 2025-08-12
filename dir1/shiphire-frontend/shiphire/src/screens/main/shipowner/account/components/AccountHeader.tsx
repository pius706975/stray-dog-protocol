import { ShipOwnerUserData } from '../../../../../types';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { USERDATA, getDataFromLocalStorage } from '../../../../../configs';
import { Image, View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';

const AccountHeader: React.FC = () => {
    const [userData, setUserData] = React.useState<ShipOwnerUserData>({
        name: '',
        email: '',
        phone: '',
        isVerified: false,
        isCompanySubmitted: false,
        imageUrl: '',
    });

    const shipownerName = userData?.name.split(' ')[0];
    const shipownerEmail = userData?.email;

    // Get user data from local storage
    useFocusEffect(
        React.useCallback(() => {
            getDataFromLocalStorage(USERDATA).then(resp => {
                console.log('resp : ', resp);
                if (resp) {
                    setUserData(resp);
                }
            });
        }, []),
    );

    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'column',
            }}>
            <Image
                style={{ width: 90, height: 90, borderRadius: 90 / 2 }}
                source={
                    userData.imageUrl
                        ? { uri: userData.imageUrl }
                        : require('../../../../../../assets/images/user.png')
                }
            />
            <CustomText
                fontSize="xl"
                fontFamily="regular"
                color="darkTextColor">
                {shipownerName}
            </CustomText>
            <CustomText fontSize="lg" fontFamily="regular" color="neutralColor">
                {shipownerEmail}
            </CustomText>
            {/* {userData.isPhoneVerified === false && (
                <View style={{ marginTop: 10 }}>
                    <Button
                        title={t('AccountHeader.labelButtonVerifyPhone')}
                        color="warning"
                        onSubmit={handleVerifyPhone}
                        isSubmitting={mutationSendOTPPhoneVerif.isLoading}
                    />
                </View>
            )} */}
        </View>
    );
};

export default AccountHeader;
