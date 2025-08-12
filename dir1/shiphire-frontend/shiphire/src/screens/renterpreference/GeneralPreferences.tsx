import React from 'react';
import { useWindowDimensions } from 'react-native';
import { ProgressBar, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { CustomText, ScreenLayout } from '../../components';
import { Color } from '../../configs';
import { useGetRenterData } from '../../hooks';
import { modalSlice, renterPreferenceSlice, userStatusSlice } from '../../slices';
import { GeneralPrefProps } from '../../types';
import { CustomSelection, RPButtonsSection } from './component';
import { useIsFocused } from '@react-navigation/native';

const GeneralPreferences: React.FC<GeneralPrefProps> = ({ navigation }) => {
    const { height } = useWindowDimensions();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { addRenterPreference } = renterPreferenceSlice.actions;
    const mutationGetRenterData = useGetRenterData();
    const [securityChecked, setSecurityChecked] =
        React.useState<boolean>(false);
    const [certChecked, setCertChecked] = React.useState<boolean>(false);
    const [repChecked, setRepChecked] = React.useState<boolean>(false);
    const isFocused = useIsFocused();
    const [generalPreference, setGeneralPreference] =
        React.useState<string>('');
    const { setPreferencesSubmitted } = userStatusSlice.actions;

    const handleSecurityPress = () => {
        setSecurityChecked(true);
        setCertChecked(false);
        setRepChecked(false);
        setGeneralPreference('security');
    };

    const handleCertPress = () => {
        setSecurityChecked(false);
        setCertChecked(true);
        setRepChecked(false);
        setGeneralPreference('certification and permits');
    };

    const handleRepChecked = () => {
        setSecurityChecked(false);
        setCertChecked(false);
        setRepChecked(true);
        setGeneralPreference('reputation and track record');
    };

    const handleOnButtonPress = () => {
        if (
            securityChecked == false &&
            certChecked == false &&
            repChecked == false
        ) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: 'Please choose your General Preference',
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
            return;
        }
        dispatch(addRenterPreference(generalPreference));

        navigation.navigate('Category');
    };

    React.useEffect(() => {
        if (isFocused) {
            dispatch(
                showModal({
                    status: 'info',
                    text: 'Please fill the renter preference, so we can serve you better',
                }),
            );
            setTimeout(() => dispatch(hideModal()), 4000);
            mutationGetRenterData.mutate(undefined, {
                onSuccess: resp => {
                    resp.data.data.renterPreference.length > 0 &&
                        dispatch(setPreferencesSubmitted());
                },
                onError: err => {
                    if (err.response?.status === 401) {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: 'Token expired, please re-sign in',
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                    }
                },
            });
        }
    }, [isFocused]);

    return (
        <ScreenLayout
            testId="generalPreferencesScreen"
            backgroundColor="light"
            flex
            padding={25}
        >
            <ProgressBar
                progress={33}
                style={{ backgroundColor: Color.secColor, height: 10 }}
                progressColor={Color.primaryColor}
            />
            <View
                style={{
                    marginTop: height / 20,
                    gap: 23,
                }}
            >
                <CustomText
                    fontFamily='bold'
                    fontSize='xxxl'
                    color='primaryColor'
                    lineHeight={40}
                >
                    Choose Your General Ship Rental Preference!
                </CustomText>
                <CustomText
                    fontFamily='regular'
                    fontSize='lg'
                    color='darkTextColor'
                    lineHeight={30}
                >
                    When searching for a ship rental, which aspect is your
                    top priority? (Choose 1)
                </CustomText>
            </View>
            <View
                style={{
                    marginTop: height / 20,
                }}>
                <CustomSelection
                    testId="securityButton"
                    checked={securityChecked}
                    onPress={handleSecurityPress}
                    title="Security"
                />
                <CustomSelection
                    testId="certificationButton"
                    checked={certChecked}
                    onPress={handleCertPress}
                    title="Certification and permits"
                />
                <CustomSelection
                    testId="repAndTrackButton"
                    checked={repChecked}
                    onPress={handleRepChecked}
                    title="Reputation and track record"
                />
            </View>
            <RPButtonsSection
                onButtonSubmitPressed={handleOnButtonPress}
                onLinkPressed={() => dispatch(setPreferencesSubmitted())}
            />
        </ScreenLayout>
    );
};

export default GeneralPreferences;
