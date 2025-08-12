import React from "react";
import { Color } from "../configs";
import { useWindowDimensions } from "react-native";
import { SkeletonView } from "react-native-ui-lib";

export const CarouselSkeleton: React.FC = () => {
    return (
        <SkeletonView
            shimmerStyle={{
                width: '100%',
            }}
            colors={[
                Color.softSecBgPrimary,
                Color.softGreyBgPrimary,
                Color.softSecBgPrimary,
            ]}
            height={300}
            borderRadius={20}
            style={{ marginTop: 10 }}
        />
    )
}

export const ShipCardSkeleton: React.FC = () => {
    const { width, height } = useWindowDimensions();

    return (
        <SkeletonView
            shimmerStyle={{
                width: (width / 2) - 26,
            }}
            colors={[
                Color.softSecBgPrimary,
                Color.softGreyBgPrimary,
                Color.softSecBgPrimary,
            ]}
            height={height / 3}
            borderRadius={5}
        />
    )
}

