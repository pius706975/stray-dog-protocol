import React from 'react'
import { View } from "react-native-ui-lib";
import { StarIcon } from '../configs';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const starIcons = Array(5)
        .fill(null)
        .map((_, index) => <StarIcon key={index} isFilled={index < Math.floor(rating)} />);

    return (
        <View style={{
            flexDirection: "row",
            gap: 2
        }}>
            {starIcons}
        </View>
    );
};

export default StarRating;