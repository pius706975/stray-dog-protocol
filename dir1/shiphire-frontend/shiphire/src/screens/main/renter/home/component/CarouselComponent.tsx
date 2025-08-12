import React from 'react';
import { Pressable } from 'react-native';
import { Image, View } from 'react-native-ui-lib';
import {
    CategoryContainer,
    CustomText,
    StarRating,
} from '../../../../../components';
import { Color } from '../../../../../configs';
import { CarouselComponentProps } from '../../../../../types';

const CarouselComponent: React.FC<CarouselComponentProps> = ({
    categoryLabel,
    imageUrl,
    onPress,
    shipName,
    shipRating,
    testId,
}) => {
    return (
        <Pressable style={{ flex: 1 }} onPress={onPress} testID={testId}>
            <Image
                overlayType={Image.overlayTypes.BOTTOM}
                style={{ flex: 3, borderRadius: 10 }}
                source={{
                    uri: imageUrl
                        ? imageUrl
                        : 'https://picsum.photos/id/237/200/300',
                }}
            />
            <View
                flex
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    marginTop: 8,
                    marginRight: 8,
                }}>
                <View row spread>
                    <View />
                    <CategoryContainer
                        testId={`categoryPressable-${shipName}`}
                        label={categoryLabel}
                        onPress={() => console.log('pressed')}
                    />
                </View>
            </View>
            <View
                flex
                centerV
                row
                spread
                paddingH-10
                paddingB-20
                style={{
                    backgroundColor: Color.primaryColor,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                }}>
                <CustomText
                    fontFamily="semiBold"
                    fontSize="xl"
                    color="secColor">
                    {shipName}
                </CustomText>
                <StarRating rating={shipRating} />
            </View>
        </Pressable>
    );
};

export default CarouselComponent;
