import React from 'react';
import { Carousel, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { CarouselSkeleton, CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { useGetTopRatedShips } from '../../../../../hooks';
import { modalSlice } from '../../../../../slices';
import { ShipDatas, TopRateShipComponentProps } from '../../../../../types';
import CarouselComponent from './CarouselComponent';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

const TopRateShipComponent: React.FC<TopRateShipComponentProps> = ({
    navigation,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('home');
    const { hideModal, showModal } = modalSlice.actions;
    const [topRatedShips, setTopRatedShips] = React.useState<ShipDatas[]>();
    const mutationGetTopRatedShips = useGetTopRatedShips();
    const isFocused = useIsFocused();

    const carouselData = topRatedShips?.map(item => ({
        imageUrl: item.imageUrl
            ? item.imageUrl
            : 'https://picsum.photos/id/237/200/300',
        _id: item._id,
        name: item.name,
        category: item.category.name,
        rating: item.rating,
    }));

    React.useEffect(() => {
        if (isFocused) {
            mutationGetTopRatedShips.mutate(undefined, {
                onSuccess: resp => {
                    const approvedShips = resp.data.data.filter(
                        ship => ship.shipApproved,
                    );
                    setTopRatedShips(approvedShips);
                },
                onError: err => {
                    if (err.response?.status === 401) {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: 'Token expired, please re-sign in',
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                    }
                },
            });
        }
    }, [isFocused]);
    return (
        <View>
            <CustomText fontFamily="bold" fontSize="xxl" color="primaryColor">
                {t('textTopRatedShips')}
            </CustomText>
            {mutationGetTopRatedShips.isLoading ? (
                <CarouselSkeleton />
            ) : (
                <Carousel
                    testID="carouselTopRatedShip"
                    autoplay
                    containerStyle={{
                        height: 300,
                        marginTop: 10,
                        borderRadius: 10,
                    }}
                    pageControlProps={{
                        size: 10,
                        color: Color.secColor,
                        inactiveColor: Color.bgNeutralColor,
                    }}
                    pageControlPosition={Carousel.pageControlPositions.OVER}>
                    {carouselData?.map((item, i) => (
                        <CarouselComponent
                            testId={`carouselComponent-${i}`}
                            categoryLabel={item.category}
                            imageUrl={
                                item.imageUrl
                                    ? item.imageUrl
                                    : 'https://picsum.photos/id/237/200/300'
                            }
                            key={i}
                            onPress={() =>
                                navigation.navigate('DetailShip', {
                                    shipId: item._id,
                                })
                            }
                            shipName={item.name}
                            shipRating={item.rating}
                        />
                    ))}
                </Carousel>
            )}
        </View>
    );
};

export default TopRateShipComponent;
