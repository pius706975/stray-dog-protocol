import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import { Pressable, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import StepIndicator from 'react-native-step-indicator';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CircleCheckIcon, Color, FontFamily, OnProressIcon } from '../configs';
import { CustomText } from '.';
import { RootState, SailingStatus, TrackHistoryProps } from '../types';

const { height: screenHeight } = Dimensions.get('window');

const TrackHistory: React.FC<TrackHistoryProps> = ({
    sailingStatus,
    beforeSailingPictures,
    afterSailingPictures,
    handlePress,
    latestShipTrackingStatus,
    scrollViewRef,
}) => {
    const { t } = useTranslation('shiptracking');
    const { isOwner } = useSelector((state: RootState) => state.userStatus);
    const isTrackFinished = latestShipTrackingStatus === 'afterSailing';

    const heightPercent =
        useMemo(() => {
            if (!isOwner) {
                return latestShipTrackingStatus === 'sailing' ? 0.38 : 0.57;
            }

            if (
                latestShipTrackingStatus &&
                ['sailing', 'afterSailing'].includes(latestShipTrackingStatus)
            ) {
                return 0.57;
            }

            return 0.47;
        }, [isOwner, latestShipTrackingStatus]) || 0;

    const maxHeight =
        useMemo(() => {
            let calculatedHeightPercent = heightPercent;

            if (screenHeight < 724) {
                calculatedHeightPercent = heightPercent - 0.05;
            }

            return screenHeight * calculatedHeightPercent;
        }, [screenHeight, heightPercent]) || 0;

    const orderedSailingStatus = useMemo(() => {
        return !!sailingStatus ? [...sailingStatus].reverse() : [];
    }, [sailingStatus]);

    const { statusDescriptions, formattedTimes, statusLength } = useMemo(() => {
        return orderedSailingStatus.reduce(
            (accumulator, statusData) => {
                accumulator.statusDescriptions.push(statusData.desc);
                accumulator.formattedTimes.push(
                    moment(statusData.date).utc().format('DD MMM HH:mm'),
                );
                accumulator.statusLength++;
                return accumulator;
            },
            {
                statusDescriptions: [] as string[],
                formattedTimes: [] as string[],
                statusLength: 0 as number,
            },
        );
    }, [orderedSailingStatus]);

    const renderStepIndicator = useCallback(
        ({ position, stepStatus }: any) => {
            const color =
                stepStatus === 'finished'
                    ? Color.lightTextColor
                    : stepStatus === 'unfinished'
                    ? '#aaaaaa'
                    : 'black';

            if (position === 0 && stepStatus === 'current') {
                return isTrackFinished ? (
                    <CircleCheckIcon />
                ) : (
                    <OnProressIcon />
                );
            }

            return <Text style={{ color }}></Text>;
        },
        [statusLength],
    );

    const renderPhotoButton = useCallback(
        (statusData: SailingStatus) => {
            if (!statusData) return null;

            const currentStatus = statusData.status;

            const onPress = () => {
                if (
                    currentStatus === 'beforeSailing' &&
                    beforeSailingPictures
                ) {
                    handlePress(beforeSailingPictures);
                } else if (
                    currentStatus === 'afterSailing' &&
                    afterSailingPictures
                ) {
                    const afterSailingPicturesWithDesc =
                        afterSailingPictures.map((picture, index) => ({
                            ...picture,
                            description:
                                beforeSailingPictures?.[index]?.description ||
                                '',
                        }));
                    handlePress(afterSailingPicturesWithDesc);
                } else {
                    handlePress(
                        statusData.image.map(image => ({
                            documentName: image.imageName,
                            documentUrl: image.imageUrl,
                            description: image.imageName,
                        })),
                    );
                }
            };

            return (
                <Pressable testID="btnSignUp" onPress={onPress}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="primaryColor">
                        {t('TrackHistory.textViewPhotos')}
                    </CustomText>
                </Pressable>
            );
        },
        [beforeSailingPictures, afterSailingPictures, handlePress, t],
    );

    const statusDescStyles = useMemo(
        () => ({
            stepIndicatorSize: 25,
            currentStepIndicatorSize: 30,
            separatorStrokeWidth: 2,
            currentStepStrokeWidth: 2,
            stepStrokeCurrentColor: Color.successColor,
            stepStrokeWidth: 1,
            stepStrokeFinishedColor: '#aaaaaa',
            stepStrokeUnFinishedColor: '#aaaaaa',
            separatorFinishedColor: '#aaaaaa',
            separatorUnFinishedColor: '#aaaaaa',
            stepIndicatorFinishedColor: '#aaaaaa',
            stepIndicatorUnFinishedColor: '#aaaaaa',
            stepIndicatorCurrentColor: isTrackFinished
                ? 'white'
                : Color.successColor,
            stepIndicatorLabelFontSize: 1,
            currentStepIndicatorLabelFontSize: 1,
            stepIndicatorLabelCurrentColor: Color.successColor,
            stepIndicatorLabelFinishedColor: Color.bgColor,
            stepIndicatorLabelUnFinishedColor: '#aaaaaa',
            labelColor: Color.darkTextColor,
            labelSize: 14,
            labelFontFamily: FontFamily.medium,
            currentStepLabelColor: Color.boldSuccessColor,
        }),
        [isTrackFinished],
    );

    const timesStyles = useMemo(
        () => ({
            stepStrokeCurrentColor: 'transparent',
            stepIndicatorUnFinishedColor: 'transparent',
            stepIndicatorCurrentColor: 'transparent',
            separatorStrokeWidth: 0,
            stepStrokeWidth: 0,
            labelColor: Color.darkTextColor,
            labelSize: 14,
            labelFontFamily: FontFamily.regular,
            currentStepLabelColor: Color.darkTextColor,
            stepIndicatorLabelCurrentColor: 'transparent',
            stepIndicatorLabelFinishedColor: 'transparent',
            stepIndicatorLabelUnFinishedColor: 'transparent',
        }),
        [],
    );

    const shouldShowViewPhotosButton = useCallback(
        (statusData: SailingStatus) => {
            if (!statusData) return false;

            const { status, image } = statusData;
            if (status === 'sailing') {
                return image.length > 0;
            } else {
                return ['beforeSailing', 'afterSailing'].includes(status);
            }
        },
        [],
    );

    return (
        <View style={styles.container}>
            {statusLength ? (
                <View style={{ maxHeight }}>
                    <CustomText
                        fontSize="sm"
                        fontFamily="medium"
                        color="primaryColor">
                        {t('TrackHistory.textTrackHistory')}
                    </CustomText>
                    <ScrollView ref={scrollViewRef} style={styles.scrollView}>
                        <View
                            style={{
                                ...styles.stepIndicatorContainer,
                                height: statusLength * 100,
                            }}>
                            <View style={styles.timesIndicator}>
                                <StepIndicator
                                    customStyles={timesStyles}
                                    currentPosition={0}
                                    labels={formattedTimes}
                                    stepCount={statusLength}
                                    direction="vertical"
                                />
                            </View>
                            <View style={styles.descriptionIndicator}>
                                <StepIndicator
                                    customStyles={{
                                        labelAlign: 'flex-start',
                                        ...statusDescStyles,
                                    }}
                                    currentPosition={0}
                                    labels={statusDescriptions}
                                    stepCount={statusLength}
                                    renderStepIndicator={renderStepIndicator}
                                    direction="vertical"
                                    renderLabel={label => {
                                        const currentStatusData =
                                            orderedSailingStatus[
                                                label.position
                                            ];
                                        const isShowViewPhotosBtn =
                                            shouldShowViewPhotosButton(
                                                currentStatusData,
                                            );

                                        return (
                                            <View>
                                                <CustomText
                                                    fontSize="xs"
                                                    fontFamily="regular"
                                                    color="darkTextColor">
                                                    {label.label}
                                                </CustomText>
                                                {isShowViewPhotosBtn &&
                                                    renderPhotoButton(
                                                        currentStatusData,
                                                    )}
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.noHistoryContainer}>
                    <CustomText
                        fontSize="xs"
                        fontFamily="medium"
                        textAlign="center"
                        color="darkTextColor">
                        {t('TrackHistory.textNoTrackHistory')}
                    </CustomText>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.bgNeutralColor,
        padding: 16,
        borderRadius: 10,
    },
    scrollView: {
        flexGrow: 1,
    },
    stepIndicatorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    timesIndicator: {
        height: '100%',
        width: '20%',
        left: -45,
    },
    descriptionIndicator: {
        height: '100%',
        left: -20,
        width: '75%',
    },
    noHistoryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TrackHistory;
