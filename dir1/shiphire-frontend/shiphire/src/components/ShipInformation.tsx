import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Image, Text, View } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';

import { Color, FontFamily, FontSize } from '../configs';
import { RootState, ShipInformationTrackDetailProps } from '../types';
import { BasicButton } from '.';

const ShipInformation: React.FC<ShipInformationTrackDetailProps> = ({
    shipImageUrl,
    shipName,
    shipCompanyName,
    shipCompanyType,
    shipDeparture,
    shipDestination,
    onRenterBtnPress,
}) => {
    const { isOwner } = useSelector((state: RootState) => state.userStatus);
    const { t } = useTranslation('shiptracking');

    const renderRenterButton = useMemo(() => {
        if (!isOwner) {
            return (
                <BasicButton
                    label={t('ShipInformation.textRenterBtnLabel')}
                    customStyles={styles.renterButton}
                    onClick={onRenterBtnPress || (() => {})}
                />
            );
        }
        return null;
    }, [isOwner, onRenterBtnPress]);

    const renderShipImage = useMemo(() => {
        if (shipImageUrl) {
            return (
                <Image source={{ uri: shipImageUrl }} style={styles.image} />
            );
        }
        return null;
    }, [shipImageUrl]);

    return (
        <View style={styles.container}>
            <View row spread style={styles.header}>
                <Text style={styles.companyText}>
                    {`${shipCompanyType || ''} - ${shipCompanyName || ''}`}
                </Text>
                {renderRenterButton}
            </View>
            <View row style={styles.details}>
                {renderShipImage}
                <View flex>
                    <Text numberOfLines={1} style={styles.shipName}>
                        {shipName || ''}
                    </Text>
                    <View>
                        <Text style={styles.routeText}>
                            {`${shipDeparture || ''} - ${
                                shipDestination || ''
                            }`}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.primaryColor,
        borderRadius: 6,
        padding: 16,
    },
    header: {
        borderBottomWidth: 0.5,
        borderColor: Color.softGreyBgPrimary,
        paddingBottom: 16,
        alignItems: 'center',
    },
    companyText: {
        fontSize: FontSize.lg,
        fontFamily: FontFamily.medium,
        color: Color.lightTextColor,
    },
    renterButton: {
        backgroundColor: Color.successColor,
    },
    details: {
        alignItems: 'flex-start',
        gap: 16,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: Color.softGreyBgPrimary,
    },
    image: {
        height: 80,
        width: 100,
    },
    shipName: {
        fontSize: FontSize.lg,
        fontFamily: FontFamily.medium,
        color: Color.lightTextColor,
    },
    routeText: {
        fontSize: FontSize.sm,
        fontFamily: FontFamily.regular,
        color: Color.secColor,
    },
});

export default ShipInformation;
