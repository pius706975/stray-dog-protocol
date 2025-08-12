import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Color, FontFamily, FontSize } from '../../configs';
import { Button, ScreenLayout } from '../../components';
import { useGetHealthCheck } from '../../hooks';
import {
    modalSlice,
    networkErrorSlice,
    progressIndicatorSlice,
} from '../../slices';

const NetworkErrorScreen = ({ navigation }) => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const mutationGetHealthCheck = useGetHealthCheck();
    const [isLoading, setIsLoading] = useState(false);

    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator } = progressIndicatorSlice.actions;
    const { setIsNetworkError } = networkErrorSlice.actions;

    return (
        <ScreenLayout testId="AboutUs" padding={20} backgroundColor="light">
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>
                        {t('NetworkError.textServerDownTitle')}
                    </Text>
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>
                            {t('NetworkError.textServerDownBody')}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title={t('NetworkError.textServerDownBtn')}
                        isSubmitting={isLoading}
                        onSubmit={() => {
                            setIsLoading(true);
                            mutationGetHealthCheck.mutate(undefined, {
                                onSuccess: _ => {
                                    dispatch(hideProgressIndicator());
                                    dispatch(setIsNetworkError(false));
                                    navigation.goBack();
                                },
                                onError: _ => {
                                    dispatch(
                                        showModal({
                                            status: 'failed',
                                            text: t(
                                                'NetworkError.textServerDownFail',
                                            ),
                                        }),
                                    );

                                    setTimeout(() => {
                                        dispatch(hideModal());
                                    }, 4000);
                                },
                                onSettled: () => {
                                    setIsLoading(false);
                                },
                            });
                        }}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
    },
    headerText: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.xl,
        color: Color.errorColor,
    },
    messageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    messageText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        textAlign: 'center',
    },
    buttonContainer: {
        alignSelf: 'stretch',
        marginTop: 20,
    },
});

export default NetworkErrorScreen;
