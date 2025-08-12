import React from 'react';
import { useWindowDimensions } from 'react-native';
import { ProgressBar, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { CustomText, ScreenLayout } from '../../components';
import { Color } from '../../configs';
import { modalSlice, renterPreferenceSlice, userStatusSlice } from '../../slices';
import { CategoryPrefProps } from '../../types';
import { CustomSelection, RPButtonsSection } from './component';

const CategoryPreferences: React.FC<CategoryPrefProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { height } = useWindowDimensions();
    const { addRenterPreference, removeRenterPreference } =
        renterPreferenceSlice.actions;
    const [tugboatChecked, setTugboatChecked] = React.useState<boolean>(false);
    const [ferryChecked, setFerryChecked] = React.useState<boolean>(false);
    const [bargeChecked, setBargeChecked] = React.useState<boolean>(false);
    const [categoryPreference, setCategoryPreference] =
        React.useState<string>('');
    const { setPreferencesSubmitted } = userStatusSlice.actions;

    const handleTugboatPress = () => {
        setTugboatChecked(true);
        setFerryChecked(false);
        setBargeChecked(false);
        setCategoryPreference('tugboat');
    };

    const handleFerryPress = () => {
        setTugboatChecked(false);
        setFerryChecked(true);
        setBargeChecked(false);
        setCategoryPreference('ferry');
    };

    const handleBargeChecked = () => {
        setTugboatChecked(false);
        setFerryChecked(false);
        setBargeChecked(true);
        setCategoryPreference('barge');
    };

    const handleOnButtonPress = () => {
        if (
            tugboatChecked == false &&
            ferryChecked == false &&
            bargeChecked == false
        ) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: 'Please choose your Category Preference',
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
            return;
        }
        dispatch(addRenterPreference(categoryPreference));
        navigation.navigate('Spesific');
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', event => {
            event.preventDefault();
            dispatch(removeRenterPreference(0));
            navigation.dispatch(event.data.action);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <ScreenLayout
            testId="categoryPreferenceScreen"
            backgroundColor="light"
            flex
            padding={25}
        >
            <ProgressBar
                progress={66}
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
                    Choose Your General Ship Rental Preference!
                </CustomText>
                <CustomText
                    fontFamily='regular'
                    fontSize='lg'
                    color='darkTextColor'
                    lineHeight={30}
                >
                    Which category of ship are you currently looking for?
                    (Choose 1)
                </CustomText>
            </View>
            <View
                style={{
                    marginTop: height / 20 + 26,
                }}>
                <CustomSelection
                    testId="tugboatBtn"
                    checked={tugboatChecked}
                    onPress={handleTugboatPress}
                    title="Tugboat"
                />
                <CustomSelection
                    testId="ferryBtn"
                    checked={ferryChecked}
                    onPress={handleFerryPress}
                    title="Ferry"
                />
                <CustomSelection
                    testId="bargeBtn"
                    checked={bargeChecked}
                    onPress={handleBargeChecked}
                    title="Barge"
                />
            </View>
            <RPButtonsSection
                onButtonSubmitPressed={handleOnButtonPress}
                onLinkPressed={() => dispatch(setPreferencesSubmitted())}
            />
        </ScreenLayout >
    );
};

export default CategoryPreferences;
