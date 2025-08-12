import { Dispatch, SetStateAction } from 'react';
import Geolocation, {
    GeolocationError,
    GeolocationResponse,
} from '@react-native-community/geolocation';

export type TLocation = Pick<
    GeolocationResponse['coords'],
    'latitude' | 'longitude' | 'accuracy' | 'heading'
>;

export type TLocationError = GeolocationError | null;

const getUserLocation = (
    setLocation: Dispatch<SetStateAction<TLocation>>,
    setLocationError: Dispatch<SetStateAction<TLocationError>>,
) => {
    Geolocation.getCurrentPosition(
        info => {
            setLocation({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                accuracy: info.coords.accuracy,
                heading: info.coords.heading,
            });
        },
        error => {
            setLocationError(error);
        },
        {
            // enableHighAccuracy: true, //! Disabled because the package issue (github issue number: 272)
            distanceFilter: 0,
            maximumAge: 1000 * 60 * 60,
            timeout: 1000 * 15,
        },
    );
};

export default getUserLocation;
