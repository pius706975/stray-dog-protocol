import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { PaymentCDProps } from '../../../../../types';
import moment from 'moment-timezone';

const PaymentCD: React.FC<PaymentCDProps> = ({
    offeredPrice,
    payIn,
    rentStartDate,
    rentEndDate,
}) => {
    const { t } = useTranslation('payment');
    const [timeLeft, setTimeLeft] = React.useState<number>(payIn);
    const formattedPrice = offeredPrice?.toLocaleString('id-ID');

    const formatTimeLeft = (seconds: number): string => {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);
        const remainingSeconds = seconds % 60;

        return `${days}d ${hours}hrs ${minutes}mnts ${remainingSeconds}scnds`;
    };
    const formatRange = (startDate, endDate, timeZone = 'UTC') => {
        const startMoment = moment.tz(startDate, timeZone);
        const endMoment = moment.tz(endDate, timeZone);

        // Check if the dates are in the same year
        const isSameYear = startMoment.isSame(endMoment, 'year');

        // Check if the dates are in the same month
        const isSameMonth = startMoment.isSame(endMoment, 'month');

        if (isSameYear && isSameMonth) {
            // Same month and year
            return `${startMoment.format('DD MMM')} - ${endMoment.format(
                'DD MMM YYYY',
            )}`;
        } else if (isSameYear) {
            // Same year, different month
            return `${startMoment.format('DD MMM')} - ${endMoment.format(
                'DD MMM YYYY',
            )}`;
        } else {
            // Different year
            return `${startMoment.format('DD MMM YYYY')} - ${endMoment.format(
                'DD MMM YYYY',
            )}`;
        }
    };

    const formattedRangeDate = formatRange(rentStartDate, rentEndDate);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    React.useEffect(() => {
        setTimeLeft(payIn);
    }, [payIn]);

    return (
        <View style={{ gap: 10 }}>
            <View
                flex
                row
                spread
                style={{
                    backgroundColor: Color.primaryColor,
                    borderRadius: 6,
                    padding: 16,
                    alignItems: 'center',
                }}>
                <View flex>
                    <View row spread>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="lightTextColor">
                            {t('PaymentCD.textRentalDate')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="secColor">
                            {formattedRangeDate}
                        </CustomText>
                    </View>
                    <View row spread>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="lightTextColor">
                            {t('PaymentCD.textPriceToPay')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="secColor">
                            {`Rp${formattedPrice}`}
                        </CustomText>
                    </View>
                    <View row spread>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="lightTextColor">
                            {t('PaymentCD.textPayIn')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="secColor">
                            {formatTimeLeft(timeLeft)}
                        </CustomText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PaymentCD;
