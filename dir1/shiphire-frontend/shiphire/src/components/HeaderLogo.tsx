import React from 'react';
import { View } from 'react-native';
import { BigLogo } from '../configs';
import { CustomText } from '.';

const HeaderLogo = () => {
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                flex: 1.5,
            }}>
            <BigLogo />
            <CustomText fontSize="xxxl" fontFamily="bold" color="primaryColor">
                ShipHire
            </CustomText>
        </View>
    );
};

export default HeaderLogo;
