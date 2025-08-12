import React from 'react';
import { useDispatch } from 'react-redux';
import { ScreenLayout } from '../../../../components';
import { useGetRenterData } from '../../../../hooks';
import { progressIndicatorSlice } from '../../../../slices';
import { GetRenterDataResponse, RemindedShipsProps } from '../../../../types';
import { ShipReminderCard } from './components';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const RemindedShips: React.FC<RemindedShipsProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const mutationGetRenterData = useGetRenterData();
    const [renterData, setRenterData] = React.useState<GetRenterDataResponse>();
    const isFocused = useIsFocused();

    // const sortedShipReminded = renterData?.data?.shipReminded?.sort((a,b)=>{
    //     const updatedAtA = new Date(a.updatedAt).getTime();
    //         const updatedAtB = new Date(b.updatedAt).getTime();
    //         return updatedAtB - updatedAtA;
    // })

    React.useEffect(() => {
        if (isFocused) {
            mutationGetRenterData.mutate(undefined, {
                onSuccess: resp => {
                    setRenterData(resp.data);
                },
            });
            dispatch(showProgressIndicator());
        }
    }, [isFocused]);

    mutationGetRenterData.isSuccess &&
        setTimeout(() => {
            dispatch(hideProgressIndicator());
        }, 2000);
    return (
        <ScreenLayout
            flex
            padding={10}
            testId="RemindedShipsScreen"
            backgroundColor="light">
            {renterData?.data?.shipReminded?.map((ship, index) => {
                const reminderDate = moment(ship.ship.reminderDate).format(
                    'DD MMMM YYYY',
                );
                console.log(renterData?.data?.shipReminded);
                console.log('nomor ', index);
                return (
                    <ShipReminderCard
                        testID={`ship-${index}`}
                        key={index}
                        navigation={navigation}
                        imageUrl={ship.ship.id.imageUrl}
                        reminderDate={reminderDate}
                        shipName={ship.ship.id.name}
                        shipId={ship.ship.id._id}
                    />
                );
            })}
        </ScreenLayout>
    );
};

export default RemindedShips;
