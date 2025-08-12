import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { Image, View } from 'react-native-ui-lib';
import { useIsFocused } from '@react-navigation/native';
import { CustomText } from '../../../../../components';
import { CheckIconSecColor, Color, CopyIcon } from '../../../../../configs';
import { useGetPaymentAccount } from '../../../../../hooks';
import {
    ShipOwnerAccProps,
    TransactionPaymentAccount,
} from '../../../../../types';

const ShipOwnerAcc: React.FC<ShipOwnerAccProps> = ({ transactionId }) => {
    const [isCopied, setIsCopied] = React.useState<boolean>(false);
    const { t } = useTranslation('payment');
    const [paymentAccount, setPaymentAccount] =
        React.useState<TransactionPaymentAccount>();
    const [bankAccountNumber, setBankAccountNumber] =
        React.useState<string>('');
    const mutationGetPaymentAccount = useGetPaymentAccount();
    const isFocused = useIsFocused();

    React.useEffect(() => {
        mutationGetPaymentAccount.mutate(
            { transactionId },
            {
                onSuccess: res => {
                    setPaymentAccount(res.data.data);
                },
            },
        );
    }, [isFocused]);

    React.useEffect(() => {
        if (paymentAccount) {
            const split = splitNumber(
                paymentAccount.bankAccountNumber.toString(),
            );
            setBankAccountNumber(split);
        }
    }, [paymentAccount]);

    const splitNumber = (number: string) => {
        const split = number.split('');
        const result = split.map((item, index) => {
            if ((index + 1) % 4 === 0) {
                return item + ' ';
            } else {
                return item;
            }
        });
        return result.join('');
    };

    const handleCopyButtonClick = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    };

    return (
        <View
            flex
            row
            spread
            padding-16
            centerV
            style={{
                backgroundColor: Color.bgNeutralColor,
                borderRadius: 6,
            }}>
            <View flex>
                <View
                    row
                    paddingB-8
                    style={{
                        gap: 10,
                        borderBottomWidth: 0.6,
                    }}>
                    <Image
                        source={{
                            uri: 'https://logos-download.com/wp-content/uploads/2016/06/Bank_Mandiri_logo_fon.png',
                        }}
                        style={{
                            height: 30,
                            width: 60,
                        }}
                    />
                    <CustomText
                        fontFamily="medium"
                        fontSize="md"
                        color="darkTextColor">
                        Bank {paymentAccount?.bankName}
                    </CustomText>
                </View>
                <View flex marginT-10>
                    <View row spread>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="neutralColor">
                            {t('ShipOwnerAcc.textAccountName')}
                        </CustomText>
                        <CustomText
                            fontFamily="medium"
                            fontSize="md"
                            color="primaryColor">
                            {paymentAccount?.bankAccountName}
                        </CustomText>
                    </View>
                </View>
                <CustomText
                    fontFamily="regular"
                    fontSize="md"
                    color="neutralColor">
                    {t('ShipOwnerAcc.textAccountNumber')}
                </CustomText>
                <View flex row spread centerV>
                    <CustomText
                        fontFamily="bold"
                        fontSize="xl2"
                        color="primaryColor">
                        {bankAccountNumber}
                    </CustomText>
                    {isCopied ? (
                        <View testID="success-copied">
                            <CheckIconSecColor />
                        </View>
                    ) : (
                        <Pressable
                            testID="copy-button"
                            onPress={handleCopyButtonClick}>
                            <CopyIcon />
                        </Pressable>
                    )}
                </View>
                <View
                    marginT-16
                    style={{
                        gap: 10,
                    }}>
                    <CustomText
                        fontFamily="medium"
                        fontSize="sm"
                        color="softPrimaryColor"
                        lineHeight={18}>
                        {t('ShipOwnerAcc.textYourPayment1')}
                        {paymentAccount?.companyType}.{paymentAccount?.name}
                        {t('ShipOwnerAcc.textYourPayment2')}
                    </CustomText>
                    <CustomText
                        fontFamily="medium"
                        fontSize="sm"
                        color="errorColor"
                        lineHeight={18}>
                        {t('ShipOwnerAcc.textNote')}
                    </CustomText>
                </View>
            </View>
        </View>
    );
};

export default ShipOwnerAcc;
