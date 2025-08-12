import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { CustomText } from '../../../../../components';

import { USERDATA, getDataFromLocalStorage } from '../../../../../configs';
import { modalSlice } from '../../../../../slices';
import { AccountHeaderProps, RenterUserData } from '../../../../../types';

const AccountHeader: React.FC<AccountHeaderProps> = ({ navigation }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation('account');
    const { hideModal, showModal } = modalSlice.actions;
    const [userData, setUserData] = React.useState<RenterUserData>({
        name: '',
        email: '',
        phoneNumber: '',
        imageUrl: '',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        isCompanyVerified: false,
        isCompanyRejected: false,
    });

    const renterName = userData?.name.split(' ')[0];
    const renterEmail = userData?.email;

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

    // Show modal if user is not verified
    React.useEffect(() => {
        if (!userData.isVerified || !userData.isPhoneVerified) {
            dispatch(
                showModal({
                    status: 'info',
                    text: t('AccountHeader.infoVerifyAccount'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 3000);
        }
    }, [userData.isPhoneVerified, userData.isVerified]);

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
                {renterName}
            </CustomText>
            <CustomText fontSize="lg" fontFamily="regular" color="neutralColor">
                {renterEmail}
            </CustomText>
        </View>
    );
};

export default AccountHeader;
