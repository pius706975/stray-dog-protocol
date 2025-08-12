import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BigLogo, Color, FontFamily, FontSize } from '../../../configs';

const SplashScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <BigLogo />
            <Text style={styles.text}>ShipHire</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.secColor,
    },
    text: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.xxxl,
        color: Color.primaryColor,
    },
});

export default SplashScreen;
