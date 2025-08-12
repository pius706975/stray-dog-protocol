import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ScreenLayout } from '../../components';
import {
    FontFamily,
    FontSize,
    USERLANGUAGE,
    setDataToLocalStorage,
} from '../../configs';
import { modalSlice, progressIndicatorSlice } from '../../slices';
import { RootState } from '../../types';

const ChangeLanguage: React.FC = () => {
    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    const { t } = useTranslation('account');
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;

    const currentLanguage =
        useSelector((state: RootState) => state.userLanguage.language) ||
        i18n.language;

    const changeLanguage = (lng: string) => {
        try {
            i18n.changeLanguage(lng);
            setDataToLocalStorage(USERLANGUAGE, lng);
            dispatch(
                showModal({
                    status: 'success',
                    text: t('ChangeLanguage.successLanguageChanged'),
                }),
            );
            console.log('masuk sini');
            dispatch(showProgressIndicator());
            setTimeout(() => {
                dispatch(hideModal());
                dispatch(hideProgressIndicator());
            }, 2000);
        } catch (e) {
            setTimeout(() => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('ChangeLanguage.failedLanguageChanged'),
                    }),
                );
            }, 2000);
        }
    };
    return (
        <ScreenLayout
            testId="ChangeLanguageScreen"
            padding={20}
            backgroundColor="light">
            <View
                style={{
                    alignItems: 'flex-start',
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.sm,
                    }}>
                    {t('ChangeLanguage.textSelectLanguage')}
                </Text>
            </View>

            <View
                style={{
                    marginTop: 10,
                    gap: 10,
                }}>
                <Button
                    testID="englishButton"
                    title="English"
                    onSubmit={() => changeLanguage('en')}
                    disable={currentLanguage === 'en'}
                />
                <Button
                    testID="bahasaButton"
                    title="Bahasa Indonesia"
                    onSubmit={() => changeLanguage('id')}
                    disable={currentLanguage === 'id'}
                />
            </View>
        </ScreenLayout>
    );
};

export default ChangeLanguage;
