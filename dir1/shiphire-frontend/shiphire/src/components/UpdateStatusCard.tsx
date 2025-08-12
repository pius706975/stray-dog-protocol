import React, { useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BasicButton, CustomText } from '../components';
import { RootState, UpdateStatusCardProps } from '../types';
import { Color } from '../configs';

const UpdateStatusCard: React.FC<UpdateStatusCardProps> = ({
    latestShipTrackingStatus,
    handlePress,
}) => {
    const { t } = useTranslation('shiptracking');
    const { isOwner } = useSelector((state: RootState) => state.userStatus);

    const statusCardLabels = useMemo(
        () => [
            {
                key: 'beforeSailing',
                header: t('UpdateStatusCard.textBeforeSailingHeader'),
                buttonText: t('UpdateStatusCard.textBeforeSailingButton'),
                desc: t('UpdateStatusCard.textBeforeSailingDesc'),
                nextStatus: 'sailing',
            },
            {
                key: 'returning',
                header: t('UpdateStatusCard.textReturningHeader'),
                buttonText: t('UpdateStatusCard.textReturningButton'),
                desc: t('UpdateStatusCard.textReturningDesc'),
                nextStatus: 'afterSailing',
            },
            {
                key: 'sailing',
                header: '',
                buttonText: t('UpdateStatusCard.textSailingButton'),
                desc: t('UpdateStatusCard.textSailingDesc'),
                nextStatus: 'sailing',
            },
        ],
        [t],
    );

    const selectedStatusText = useMemo(
        () =>
            statusCardLabels.find(
                label => label.key === latestShipTrackingStatus,
            ) || {
                key: '',
                header: '',
                buttonText: '',
                desc: '',
                nextStatus: '',
            },
        [latestShipTrackingStatus, statusCardLabels],
    );

    const isShowUpdateStatusCard = useMemo(
        () =>
            isOwner
                ? !['sailing', 'afterSailing'].some(
                      hiddenStatus => hiddenStatus === latestShipTrackingStatus,
                  )
                : 'sailing' === latestShipTrackingStatus,
        [latestShipTrackingStatus, isOwner],
    );

    const memoizedHandlePress = useCallback(
        (nextStatus: string) => {
            handlePress(nextStatus);
        },
        [handlePress],
    );

    return (
        isShowUpdateStatusCard && (
            <View testID="updateStatusCard" style={styles.container}>
                <View flex style={styles.card}>
                    <View row spread centerV>
                        <View flex>
                            {selectedStatusText.header && (
                                <CustomText
                                    fontSize="sm"
                                    fontFamily="semiBold"
                                    color="primaryColor">
                                    {selectedStatusText.header}
                                </CustomText>
                            )}
                            <CustomText
                                fontSize="xs"
                                fontFamily="regular"
                                color="primaryColor">
                                {selectedStatusText.desc}
                            </CustomText>
                        </View>
                        <BasicButton
                            label={selectedStatusText.buttonText}
                            onClick={() => {
                                memoizedHandlePress(
                                    selectedStatusText.nextStatus,
                                );
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
    },
    card: {
        gap: 16,
        padding: 16,
        backgroundColor: Color.bgNeutralColor,
        borderRadius: 10,
    },
});

export default UpdateStatusCard;
