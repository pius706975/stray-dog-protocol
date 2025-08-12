import moment from 'moment';
import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { Badge, Image, View } from 'react-native-ui-lib';
import { Color, FontSize, SuccessIcon } from '../configs';
import { TransactionCardProps } from '../types';
import CustomText from './CustomText';
import { Button } from '.';
import { useTranslation } from 'react-i18next';

const TransactionCard: React.FC<TransactionCardProps> = ({
    responded,
    respondValue,
    respondKey,
    respondKeyAlert,
    respondPressed,
    rentalID,
    rentalPeriod,
    status,
    statusText,
    onPress,
    newRespond,
    imageUrl,
    shipCategory,
    shipName,
    shipSize,
    respondKeySuccess,
    time,
}) => {
    const { t } = useTranslation('common');
    const { width } = useWindowDimensions();

    const flagText =
        status === 'complete'
            ? t('TransactionCard.completeFlagText')
            : status === 'failed'
            ? t('TransactionCard.failedFlagText')
            : statusText;

    const flagColor =
        status === 'complete'
            ? Color.boldSuccessColor
            : status === 'failed'
            ? Color.boldErrorColor
            : Color.boldWarningColor;

    const formattedShipSize = `${shipSize?.length} m x ${shipSize?.width} m x ${shipSize?.height} m`;

    const formattedTime = () => {
        const timesDiff = moment().diff(moment(time));
        const hoursDiff = moment.duration(timesDiff).asHours();
        const minuteTimeDescription = t('TransactionCard.textmAgo');
        const hourTimeDescription = t('TransactionCard.texthAgo');
        const dayTimeDescription = t('TransactionCard.textdAgo');

        if (hoursDiff < 1) {
            if (moment.duration(timesDiff).asMinutes() < 1) {
                return t('TransactionCard.textJustNow');
            } else {
                return `${moment
                    .duration(timesDiff)
                    .asMinutes()
                    .toFixed(0)}${minuteTimeDescription}`;
            }
        } else if (hoursDiff < 24) {
            return `${moment
                .duration(timesDiff)
                .asHours()
                .toFixed(0)}${hourTimeDescription}`;
        } else {
            return `${moment
                .duration(timesDiff)
                .asDays()
                .toFixed(0)}${dayTimeDescription}`;
        }
    };

    return (
        <View
            testID={`transaction-card-${rentalID}`}
            style={{
                borderRadius: 10,
            }}>
            <Pressable
                testID={`pressable-${rentalID}`}
                onPress={onPress}
                style={{
                    flex: 1,
                    padding: 20,
                    paddingTop: 50,
                    backgroundColor: Color.primaryColor,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                }}>
                <View
                    flex
                    row
                    spread
                    style={{
                        position: 'absolute',
                        width: width - 30,
                    }}>
                    <View
                        center
                        style={{
                            padding: 6,
                            minWidth: width / 2,
                            backgroundColor: flagColor,
                            borderTopStartRadius: 10,
                            borderBottomEndRadius: 10,
                        }}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor">
                            {flagText}
                        </CustomText>
                    </View>
                    <View
                        row
                        style={{
                            alignItems: 'center',
                        }}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="regular"
                            color="softSecColor">
                            {formattedTime()}
                        </CustomText>
                    </View>
                </View>
                <View
                    flex
                    row
                    style={{
                        alignItems: 'flex-start',
                        gap: 16,
                    }}>
                    <Image
                        source={{
                            uri: imageUrl
                                ? imageUrl
                                : 'https://picsum.photos/id/237/200/300',
                        }}
                        style={{
                            height: 80,
                            width: 100,
                        }}
                    />
                    <View flex>
                        <CustomText
                            fontSize="lg"
                            fontFamily="medium"
                            color="lightTextColor"
                            ellipsizeMode
                            numberOfLines={1}>
                            {shipName ? shipName : 'King of the Ocean MK271DG'}
                        </CustomText>
                        <View
                            row
                            style={{
                                gap: 8,
                            }}>
                            <CustomText
                                fontSize="sm"
                                fontFamily="regular"
                                color="secColor">
                                {t('TransactionCard.textCategory')}
                            </CustomText>
                            <CustomText
                                fontSize="sm"
                                fontFamily="regular"
                                color="secColor">
                                {shipCategory ? shipCategory : 'Barge'}
                            </CustomText>
                        </View>
                        <View
                            row
                            style={{
                                gap: 8,
                            }}>
                            <CustomText
                                fontSize="sm"
                                fontFamily="regular"
                                color="secColor">
                                {t('TransactionCard.textSize')}
                            </CustomText>
                            <View row style={{ justifyContent: 'center' }}>
                                <CustomText
                                    fontSize="xs"
                                    fontFamily="regular"
                                    color="secColor">
                                    {shipSize ? formattedShipSize : '200 m'}
                                </CustomText>
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
            <View
                flex
                style={{
                    gap: 16,
                    padding: 16,
                    backgroundColor: Color.bgNeutralColor,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                }}>
                <View row spread>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="neutralColor">
                        {t('TransactionCard.textRentalId')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {t('TransactionCard.textNumber')} {rentalID}
                    </CustomText>
                </View>
                <View row spread>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="neutralColor">
                        {t('TransactionCard.textRentalPeriod')}
                    </CustomText>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {rentalPeriod}
                    </CustomText>
                </View>
                {responded && (
                    <View row spread centerV>
                        <View flex>
                            <CustomText
                                fontSize="sm"
                                fontFamily="medium"
                                color={
                                    respondKeyAlert
                                        ? 'errorColor'
                                        : respondKeySuccess
                                        ? 'boldSuccessColor'
                                        : 'primaryColor'
                                }>
                                {respondKey}
                            </CustomText>
                        </View>
                        <View flex>
                            <Button
                                testID={`btn-respond-${rentalID}`}
                                title={respondValue || ''}
                                onSubmit={
                                    respondPressed ? respondPressed : () => {}
                                }
                            />
                            {respondKeyAlert && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: -4,
                                        top: -6,
                                    }}>
                                    <Badge
                                        label={'!'}
                                        size={18}
                                        backgroundColor={Color.boldErrorColor}
                                    />
                                </View>
                            )}
                            {newRespond && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: -8,
                                        top: -6,
                                    }}>
                                    <Badge
                                        label={t(
                                            'TransactionCard.labelBadeNewRespond',
                                        )}
                                        size={18}
                                        backgroundColor={Color.boldWarningColor}
                                    />
                                </View>
                            )}
                            {respondKeySuccess && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: -8,
                                        top: -6,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 100,
                                        backgroundColor: Color.bgColor,
                                    }}>
                                    <SuccessIcon />
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default TransactionCard;
