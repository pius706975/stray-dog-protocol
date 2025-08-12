import React from 'react';
import { CustomText, ScreenLayout } from '../../../../components';
import {
    DeleteAccountProps,
    DeleteAccountRequest,
    RootState,
} from '../../../../types';
import { View } from 'react-native-ui-lib';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import CustomButton from '../../../../components/Button';
import { useUserDeleteAccount } from '../../../../hooks';
import { ConfirmationModal } from './components';
import { useDispatch, useSelector } from 'react-redux';
import {
    modalSlice,
    progressIndicatorSlice,
    userStatusSlice,
} from '../../../../slices';
import {
    RFQFILEPATH,
    ROLES,
    SHIPOWNERDOCSUBMITTED,
    TOKEN,
    getDataFromLocalStorage,
    removeDataToLocalStorage,
} from '../../../../configs';
import { useTranslation } from 'react-i18next';

const DeleteAccount: React.FC<DeleteAccountProps> = ({}) => {
    const { t } = useTranslation('account');
    const { isGoogleSignIn } = useSelector(
        (state: RootState) => state.userStatus,
    );
    const [firebase, setFirebase] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const mutationDeleteAccount = useUserDeleteAccount();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const { logout } = userStatusSlice.actions;

    const [isConfirmationModalVisible, setConfirmationModalVisible] =
        React.useState(false);

    const showConfirmationModal = () => {
        setConfirmationModalVisible(true);
    };

    const hideConfirmationModal = () => {
        setConfirmationModalVisible(false);
    };

    const confirmSubmit = () => {
        hideConfirmationModal();
        handleSubmitDeleteAccount();
    };

    const handleSubmitDeleteAccount = async () => {
        const deleteAccountRequest: DeleteAccountRequest = {
            password: password,
        };
        await getDataFromLocalStorage(TOKEN).then(resp => {
            mutationDeleteAccount.mutate(deleteAccountRequest, {
                onSuccess: () => {
                    removeDataToLocalStorage(TOKEN);
                    removeDataToLocalStorage(ROLES);
                    removeDataToLocalStorage(SHIPOWNERDOCSUBMITTED);
                    removeDataToLocalStorage(RFQFILEPATH);
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('DeleteAccount.textSuccessDelete'),
                        }),
                    );
                    dispatch(showProgressIndicator());
                    setTimeout(() => {
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                        dispatch(logout());
                    }, 2000);
                },
                onError: err => {
                    if (err.response?.status === 401) {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: t('DeleteAccount.textUnAuthorize'),
                            }),
                        );
                        dispatch(hideProgressIndicator());
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 2000);
                    } else {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: t('DeleteAccount.textFailDelete'),
                            }),
                        );
                        dispatch(hideProgressIndicator());
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 2000);
                    }
                },
            });
        });
    };

    // React.useEffect(() => {
    //     if (route.params) {
    //         setFirebase((route.params as { firebaseId: string }).firebaseId);
    //     }
    // }, [route.params]);

    console.log(firebase);
    console.log(isGoogleSignIn);
    return (
        <ScreenLayout testId="DeleteAccountScreen" backgroundColor="light">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ padding: 16 }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {t('DeleteAccount.text1paragraph')}
                    </CustomText>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {''}
                    </CustomText>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {t('DeleteAccount.text2paragraph')}
                    </CustomText>
                </View>
                <View style={{ padding: 16 }}>
                    <CustomText
                        fontFamily="bold"
                        fontSize="md"
                        color="errorColor">
                        - {t('DeleteAccount.textAccount')}
                    </CustomText>
                    <CustomText
                        fontFamily="bold"
                        fontSize="md"
                        color="errorColor">
                        - {t('DeleteAccount.textTransaction')}
                    </CustomText>
                    {/* <CustomText
                        fontFamily="bold"
                        fontSize="md"
                        color="errorColor">
                        - Transaction History
                    </CustomText> */}
                </View>
                <View style={{ padding: 16 }}>
                    {!isGoogleSignIn && (
                        <View style={{ marginTop: 16 }}>
                            <CustomText
                                fontFamily="regular"
                                fontSize="md"
                                color="darkTextColor">
                                {t('DeleteAccount.textClosing1')}
                            </CustomText>
                            <CustomText
                                fontFamily="regular"
                                fontSize="md"
                                color="darkTextColor">
                                {t('DeleteAccount.textClosing2')}
                            </CustomText>
                            <TextInput
                                style={{
                                    marginTop: 12,
                                    marginBottom: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'black',
                                    padding: 5,
                                }}
                                secureTextEntry
                                placeholder={t(
                                    'DeleteAccount.placeholderPassword',
                                )}
                                onChangeText={setPassword}
                                value={password}
                            />
                        </View>
                    )}
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginBottom: 24,
                    }}>
                    <CustomButton
                        title={t('DeleteAccount.btnDelete')}
                        onSubmit={showConfirmationModal}
                        color="error"
                    />
                </View>
            </ScrollView>
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                onConfirm={confirmSubmit}
                onCancel={hideConfirmationModal}
            />
        </ScreenLayout>
    );
};

export default DeleteAccount;
