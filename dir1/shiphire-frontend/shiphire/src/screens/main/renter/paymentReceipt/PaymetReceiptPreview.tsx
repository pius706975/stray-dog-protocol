import React from 'react';
import { Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { ScreenLayout } from '../../../../components';
import { progressIndicatorSlice } from '../../../../slices';
import { PaymentReceiptProps } from '../../../../types';

const PaymetReceiptPreview: React.FC<PaymentReceiptProps> = ({ route }) => {
    const { paymentReceiptUrl } = route.params;
    const dispatch = useDispatch();
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;

    return (
        <ScreenLayout
            backgroundColor="light"
            testId="PaymentReceiptPreviewScreen"
            padding={10}>
            <Image
                source={{
                    uri: paymentReceiptUrl
                        ? paymentReceiptUrl
                        : 'https://picsum.photos/id/237/200/300',
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                }}
                onLoadStart={() => dispatch(showProgressIndicator())}
                onLoadEnd={() => dispatch(hideProgressIndicator())}
                testID="imageComponent"
            />
        </ScreenLayout>
    );
};

export default PaymetReceiptPreview;
