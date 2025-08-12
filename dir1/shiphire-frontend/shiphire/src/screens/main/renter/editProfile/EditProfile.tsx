import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, View } from 'react-native-ui-lib';
import { ScreenLayout } from '../../../../components';
import {
    Color,
    FontFamily,
    FontSize,
    USERDATA,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from '../../../../configs';
import { TextInput } from 'react-native';
import { addPhoneNumber } from '../../../../hooks';
import { AddPhoneNumberRequest, EditProfileProps } from '../../../../types';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';

const EditProfile: React.FC<EditProfileProps> = ({ navigation }) => {
    const { t } = useTranslation('account');
    const [userData, setUserData] = React.useState({
        email: '',
        name: '',
        phoneNumber: '',
        imageUrl: '',
        isVerified: true,
        isCompanySubmitted: true,
    });
    const [renterPhone, setRenterPhone] = React.useState<string>('');
    const mutationAddPhoneNumber = addPhoneNumber();
    const dispatch = useDispatch();
    const { showModal, hideModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    React.useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(res => {
            if (res) {
                setUserData(res);
                setRenterPhone(res.phoneNumber);
            }
        });
    }, []);

    const handleSave = () => {
        dispatch(showProgressIndicator());
        const data: AddPhoneNumberRequest = {
            phoneNumber: renterPhone,
        };
        mutationAddPhoneNumber.mutate(data, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        text: t('EditProfile.successText'),
                        status: 'success',
                    }),
                );
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainScreenTab' }],
                    });
                    dispatch(hideProgressIndicator());
                    dispatch(hideModal());
                }, 2000);
                setUserData({
                    ...userData,
                    phoneNumber: renterPhone,
                });
                setDataToLocalStorage(USERDATA, {
                    ...userData,
                    phoneNumber: renterPhone,
                });
            },
            onError: () => {
                dispatch(
                    showModal({
                        text: t('EditProfile.failedText'),
                        status: 'failed',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                dispatch(hideProgressIndicator());
            },
        });
    };

    return (
        <ScreenLayout
            testId="EditProfileScreen"
            backgroundColor="light"
            padding={20}
            flex>
            <View>
                {/* <View>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.xl,
                            color: Color.primaryColor,
                        }}>
                        {t('EditProfile.textName')} :
                    </Text>
                    <TextInput
                        value={userData.name}
                        pointerEvents="none"
                        style={{
                            borderWidth: 1,
                            borderColor: Color.primaryColor,
                            borderRadius: 10,
                            padding: 10,
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.xl,
                            color: Color.primaryColor,
                        }}
                    />
                </View>
                <View>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.xl,
                            color: Color.primaryColor,
                        }}>
                        {t('EditProfile.textEmail')}
                    </Text>
                    <TextInput
                        value={userData.email}
                        pointerEvents="none"
                        style={{
                            borderWidth: 1,
                            borderColor: Color.primaryColor,
                            borderRadius: 10,
                            padding: 10,
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.xl,
                            color: Color.primaryColor,
                        }}
                    />
                </View> */}
                <View>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.xl,
                            color: Color.primaryColor,
                        }}>
                        {t('EditProfile.textPhoneNumber')}
                    </Text>
                    <TextInput
                        testID="phoneNumberInput"
                        pointerEvents={userData.phoneNumber ? 'none' : 'auto'}
                        value={
                            userData.phoneNumber
                                ? userData.phoneNumber
                                : renterPhone
                        }
                        onChangeText={setRenterPhone}
                        style={{
                            borderWidth: 1,
                            borderColor: Color.primaryColor,
                            borderRadius: 10,
                            padding: 10,
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.xl,
                            color: Color.primaryColor,
                        }}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <Button
                testID="buttonSave"
                label={t('EditProfile.buttonSave')}
                backgroundColor={Color.primaryColor}
                borderRadius={10}
                marginT-10
                onPress={handleSave}
            />
        </ScreenLayout>
    );
};

export default EditProfile;
