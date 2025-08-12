import React from 'react';
import { useWindowDimensions } from 'react-native';
import { ProgressBar, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { CustomText, ScreenLayout } from '../../components';
import { Color } from '../../configs';
import { useSubmitRenterPreference } from '../../hooks';
import {
    modalSlice,
    progressIndicatorSlice,
    renterPreferenceSlice,
    userStatusSlice
} from '../../slices';
import { RootState, SpesificPrefProps, SubmitRenterPreferenceRequest } from '../../types';
import { CustomSelection, RPButtonsSection } from './component';

const SpesificPreferences: React.FC<SpesificPrefProps> = ({ navigation }) => {
    const { height } = useWindowDimensions();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { addRenterPreference, removeRenterPreference } =
        renterPreferenceSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } = progressIndicatorSlice.actions
    const mutationSubmitRenterPreference = useSubmitRenterPreference();
    const [cargoChecked, setCargoChecked] = React.useState<boolean>(false);
    const [loadingChecked, setLoadingChecked] = React.useState<boolean>(false);
    const [spesificPreference, setSpesificPreference] =
        React.useState<string>('');
    const renterPreference = useSelector(
        (state: RootState) => state.renterPreference.renterPreference,
    );
    const { setPreferencesSubmitted } = userStatusSlice.actions;

    const handleCargoPress = () => {
        setCargoChecked(true);
        setLoadingChecked(false);
        setSpesificPreference('cargo capacity');
    };

    const handleLoadingPress = () => {
        setCargoChecked(false);
        setLoadingChecked(true);
        setSpesificPreference('loading-unloading capability');
    };

    const handleOnButtonPress = () => {
        if (cargoChecked == false && loadingChecked == false) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: 'Please choose your Spesific Preference',
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
            return;
        }
        const submitRenterPreferenceRequest: SubmitRenterPreferenceRequest = {
            renterPreference: renterPreference,
        };
        mutationSubmitRenterPreference.mutate(submitRenterPreferenceRequest, {
            onSuccess: resp => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Renter Preference Submitted!',
                    }),
                );
                dispatch(showProgressIndicator())
                setTimeout(() => {
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator())
                    dispatch(setPreferencesSubmitted());
                }, 4000);
            },
            onError(err) {
                console.log(err);
            },
        });
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', event => {
            event.preventDefault();
            dispatch(removeRenterPreference(2));
            dispatch(removeRenterPreference(1));
            navigation.dispatch(event.data.action);
        });

        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        if (renterPreference.length >= 3) {
            for (let i = 2; i < renterPreference.length; i++) {
                dispatch(removeRenterPreference(i));
            }
        }
        dispatch(addRenterPreference(spesificPreference));
    }, [spesificPreference]);

    return (
        <ScreenLayout
            testId="spesificPreferencesScreen"
            backgroundColor="light"
            flex
            padding={25}
        >
            <ProgressBar
                progress={100}
                style={{ backgroundColor: Color.secColor, height: 10 }}
                progressColor={Color.primaryColor}
            />
            <View
                style={{
                    marginTop: height / 20,
                    gap: 23,
                }}>
                <CustomText
                    fontFamily='bold'
                    fontSize='xxxl'
                    color='primaryColor'
                    lineHeight={40}
                >
                    Choose Your Spesific Ship Rental Preferences ! (Barge)
                </CustomText>
                <CustomText
                    fontFamily='regular'
                    fontSize='lg'
                    color='darkTextColor'
                    lineHeight={30}
                >
                    When selecting a barge, which feature is your main
                    priority? (Choose 1)
                </CustomText>
            </View>
            <View
                style={{
                    marginTop: height / 20,
                }}>
                <CustomSelection
                    testId="cargoButton"
                    checked={cargoChecked}
                    onPress={handleCargoPress}
                    title="Cargo capacity"
                />
                <CustomSelection
                    testId="loadunloadButton"
                    checked={loadingChecked}
                    onPress={handleLoadingPress}
                    title="Loading-unloading capability"
                />
            </View>
            <RPButtonsSection
                onButtonSubmitPressed={handleOnButtonPress}
                onLinkPressed={() => dispatch(setPreferencesSubmitted())}
                confirm
            />
        </ScreenLayout>
    );
};

export default SpesificPreferences;
