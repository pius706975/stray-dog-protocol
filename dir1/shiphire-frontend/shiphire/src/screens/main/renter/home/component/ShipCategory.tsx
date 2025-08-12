import React from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { CategoryContainer } from '../../../../../components';
import { useGetShipCategories } from '../../../../../hooks';
import { modalSlice } from '../../../../../slices';
import {
    GetShipCategoriesResponse,
    ShipCategoryProps,
} from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

const ShipCategory: React.FC<ShipCategoryProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('home');
    const mutationGetShipCategories = useGetShipCategories();
    const [shipCategories, setShipCategories] =
        React.useState<GetShipCategoriesResponse>();
    const { hideModal, showModal } = modalSlice.actions;
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            mutationGetShipCategories.mutate(undefined, {
                onSuccess: resp => {
                    setShipCategories(resp.data);
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
        <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 20 }}
            horizontal>
            <CategoryContainer
                label={t('labelRecommendation')}
                onPress={() => console.log('Recommendation')}
            />
            {shipCategories?.data.map(item => (
                <CategoryContainer
                    key={item._id}
                    label={item.name}
                    onPress={() => navigation.navigate('ShipByCategory')}
                />
            ))}
        </ScrollView>
    );
};

export default ShipCategory;
