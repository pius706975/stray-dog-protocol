import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { Button, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Color } from '../../configs';
import { CustomText } from '../../components';
import { handleAxiosError, getUserLocation } from '../../utils';
import { useGetUserLocation } from '../../hooks';
import { modalSlice, userLocationSlice } from '../../slices';
import { TLocation, TLocationError } from '../../utils/getUserLocation';

export const RequestLocationPermission = () => {
    const { t } = useTranslation('reqlocationperm');
    const dispatch = useDispatch();
    const mutationGetUserLocation = useGetUserLocation();

    const { showModal } = modalSlice.actions;
    const { setUserLocation, setUserCoordinates } = userLocationSlice.actions;

    const [locationError, setLocationError] = useState<TLocationError>(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
    const [location, setLocation] = useState<TLocation>({
        latitude: 0,
        longitude: 0,
        accuracy: 100,
        heading: 0,
    });

    const sheetRef = useRef<BottomSheet>(null);

    const handleGetUserLocation = () => {
        getUserLocation(setLocation, setLocationError);
    };

    const handleClosePress = () => {
        handleGetUserLocation();

        sheetRef.current?.close();
    };

    const askLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: t('androidLocationTitle'),
                    message: t('androidLocationBody'),
                    buttonNeutral: t('androidLocationNeutral'),
                    buttonNegative: t('androidLocationNegative'),
                    buttonPositive: t('androidLocationPositive'),
                },
            );

            if (result === PermissionsAndroid.RESULTS.GRANTED) {
                handleClosePress();
            }
        }
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization(() => {
                handleClosePress();
            });
        }
    };

    const checkPermission = async () => {
        if (Platform.OS === 'android') {
            const hasLocationPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );

            if (!hasLocationPermission) {
                setBottomSheetIndex(0);
            } else {
                handleGetUserLocation();
            }
        }
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization(
                () => {
                    handleGetUserLocation();
                },
                _error => {
                    setBottomSheetIndex(0);
                },
            );
        }
    };

    useEffect(() => {
        checkPermission();
    }, []);

    useEffect(() => {
        if (location.latitude && location.longitude) {
            dispatch(
                setUserCoordinates({
                    latitude: `${location.latitude}`,
                    longitude: `${location.longitude}`,
                }),
            );
            mutationGetUserLocation.mutate(
                { latitude: location.latitude, longitude: location.longitude },
                {
                    onSuccess: resp => {
                        const userLocation = resp.data.data;
                        dispatch(setUserLocation(userLocation));
                    },
                    onError: err => {
                        handleAxiosError(err);
                    },
                },
            );
        }
    }, [location]);

    useEffect(() => {
        if (!!locationError) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: `${locationError.message} ${t('enableGPSMessage')}`,
                }),
            );
        }
    }, [locationError]);

    return (
        <>
            <BottomSheet
                ref={sheetRef}
                index={bottomSheetIndex}
                snapPoints={['60%']}
                enablePanDownToClose={false}
                backgroundStyle={{
                    backgroundColor: Color.bgColor,
                    borderWidth: 1,
                }}>
                <BottomSheetView
                    style={{
                        paddingHorizontal: 10,
                        flex: 1,
                    }}>
                    <View row center marginB-30>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            textAlign="center"
                            color="primaryColor">
                            {t('locationTitle')}
                        </CustomText>
                    </View>
                    <View row center marginB-30>
                        <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            textAlign="center"
                            color="darkTextColor">
                            {t('locationBody')}
                        </CustomText>
                    </View>

                    <Button
                        label={t('locationButton')}
                        onPress={() => {
                            askLocationPermission();
                        }}
                    />
                </BottomSheetView>
            </BottomSheet>
        </>
    );
};
