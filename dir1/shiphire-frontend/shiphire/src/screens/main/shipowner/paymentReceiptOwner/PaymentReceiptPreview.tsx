import React from 'react';
import { Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomText, ScreenLayout } from '../../../../components';
import { progressIndicatorSlice } from '../../../../slices';
import { PaymentReceiptOwnerProps } from '../../../../types';
import { View } from 'react-native-ui-lib';
import { Color } from '../../../../configs';

const PaymentReceiptPreview: React.FC<PaymentReceiptOwnerProps> = ({ url }) => {
    const dispatch = useDispatch();
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;

    return (
        <ScreenLayout
            backgroundColor="light"
            testId="PaymentReceiptOwnerPreviewScreen">
            <View
                marginT-10
                paddingH-10
                style={{
                    backgroundColor: Color.bgNeutralColor,
                    justifyContent: 'center',
                    borderRadius: 5,
                }}>
                <Image
                    source={{
                        uri: url ? url : 'https://picsum.photos/id/237/200/300',
                    }}
                    style={{
                        width: '100%',
                        height: '90%',
                        resizeMode: 'cover',
                        borderRadius: 5,
                    }}
                    onLoadStart={() => dispatch(showProgressIndicator())}
                    onLoadEnd={() => dispatch(hideProgressIndicator())}
                />
            </View>
        </ScreenLayout>
    );
};

export default PaymentReceiptPreview;
