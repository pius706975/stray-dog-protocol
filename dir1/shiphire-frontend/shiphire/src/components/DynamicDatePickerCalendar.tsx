import { FormikErrors } from 'formik';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native-ui-lib';
import { useGetShipById } from '../hooks';
import { CalendarPickerModal } from '../screens/main/renter/requestForQuote/components';
import { ShipDatas } from '../types';
import TextInput from './TextInput';
import TextInputError from './TextInputError';

const DynamicDatePickerCalendar: React.FC<{
    value: string;
    label?: string;
    placeholder: string;
    fullBorder?: boolean;
    shipId?: string | String;
    errorText?: string;
    error?:
        | string
        | false
        | string[]
        | FormikErrors<any>
        | FormikErrors<any>[]
        | boolean
        | Date;
    onChange: (date: string) => void;
    shipRentType?: string;
}> = ({
    value,
    label,
    placeholder,
    fullBorder,
    shipId,
    error,
    errorText,
    onChange,
    shipRentType,
}) => {
    const [showPicker, setShowPicker] = React.useState<boolean>(false);

    const [shipData, setShipData] = React.useState<ShipDatas>();
    const mutationGetShipById = useGetShipById();

    React.useEffect(() => {
        if (shipId) {
            mutationGetShipById.mutate(shipId, {
                onSuccess: resp => {
                    setShipData(resp.data.data);
                },
                onError: err => {
                    console.log(err);
                },
            });
        }
    }, [showPicker]);
    return (
        <View
            style={{
                paddingTop: 20,
                margin: -10,
            }}>
            <TextInput
                leftIcon
                placeholder={placeholder}
                label={label}
                value={value}
                editable={false}
                onPress={() => setShowPicker(!showPicker)}
                fullBorder={fullBorder}
                error={error}
            />
            {error && <TextInputError errorText={errorText ? errorText : ''} />}
            <CalendarPickerModal
                visible={showPicker}
                onClose={() => setShowPicker(!showPicker)}
                shipHistory={shipData?.shipHistory}
                date={value}
                handleSubmit={date => onChange(date)}
                shipRentType={shipRentType}
            />
        </View>
    );
};

export default DynamicDatePickerCalendar;
