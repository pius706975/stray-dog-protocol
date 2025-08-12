import React from 'react';
import { ReviewProps } from '../../../../types';
import { useDispatch } from 'react-redux';
import { useAddReview, useGetTransactionByRentalId } from '../../../../hooks';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import { AirbnbRating } from 'react-native-ratings';
import { Button, TextInput } from '../../../../components';
import { useIsFocused } from '@react-navigation/native';

const AddReview: React.FC<ReviewProps> = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { shipId } = route.params;
    const mutationUseAddReview = useAddReview();

    const { t } = useTranslation('common');
    const [rate, setRate] = React.useState(0);
    const [review, setReview] = React.useState('');

    const handleRatingCompleted = (rating: number) => {
        setRate(rating);
    };

    const handleSubmitReview = () => {
        const reviewData = {
            shipId,
            rate,
            review,
        };

        mutationUseAddReview.mutate(reviewData);

        navigation.goBack();
    };

    return (
        <View>
            <AirbnbRating
                count={5}
                reviews={[
                    t('AddReview.veryBad'),
                    t('AddReview.bad'),
                    t('AddReview.ok'),
                    t('AddReview.good'),
                    t('AddReview.awesome'),
                ]}
                defaultRating={rate}
                size={30}
                onFinishRating={handleRatingCompleted}
            />
            <TextInput
                placeholder={t('AddReview.textPlaceholder')}
                multiline
                marginT-50
                onChange={text => setReview(text)}
                value={review}
            />
            <Button title={t('Submit')} onSubmit={handleSubmitReview} />
        </View>
    );
};

export default AddReview;
