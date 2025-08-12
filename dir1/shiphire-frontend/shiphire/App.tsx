import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as RNLocalize from 'react-native-localize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native-ui-lib';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSelector } from 'react-redux';
import i18next from './i18n';
import { ProgressIndicator, Toast } from './src/components';
import {
    USERLANGUAGE,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from './src/configs';
import { RootStackNav } from './src/navigations';
import { RootState } from './src/types';
import {
    notificationListener,
    registerAppWithFCM,
    requestUserPermission,
} from './src/utils';

const App: React.FC = () => {
    React.useEffect(() => {
        const deviceLanguages = RNLocalize.getLocales();
        const supportedLanguages = ['en', 'id'];

        let defaultLanguage = 'en';

        getDataFromLocalStorage(USERLANGUAGE).then(storedLanguage => {
            if (storedLanguage) {
                defaultLanguage = storedLanguage;
            } else {
                for (const deviceLanguage of deviceLanguages) {
                    if (
                        supportedLanguages.includes(deviceLanguage.languageCode)
                    ) {
                        console.log(
                            'languageCode: ',
                            deviceLanguage.languageCode,
                        );
                        defaultLanguage = deviceLanguage.languageCode;
                        break;
                    }
                }
            }
            console.log('defaultLanguage: ', defaultLanguage);
            setDataToLocalStorage(USERLANGUAGE, defaultLanguage);
            i18next.changeLanguage(defaultLanguage);
        });
        registerAppWithFCM();
        requestUserPermission();
        notificationListener();
    }, []);

    const queryClient = new QueryClient();
    const { visible: modalVisible } = useSelector(
        (state: RootState) => state.modal,
    );
    const { visible: progressVisible } = useSelector(
        (state: RootState) => state.progressIndicator,
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18next}>
                    <SafeAreaProvider>
                        <NavigationContainer
                            linking={{
                                prefixes: ['shiphire://shiphire'],
                                config: {
                                    screens: {
                                        DeleteAccount: 'DeleteAccount',
                                    },
                                },
                            }}>
                            <RootStackNav />
                        </NavigationContainer>
                        {modalVisible &&
                        progressVisible ? null : modalVisible ? (
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                }}
                            />
                        ) : null}
                        <ProgressIndicator />
                        <Toast />
                    </SafeAreaProvider>
                </I18nextProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
};

export default App;
