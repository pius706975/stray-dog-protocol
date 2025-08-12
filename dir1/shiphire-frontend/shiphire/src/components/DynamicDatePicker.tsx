import moment from 'moment';
import React from 'react';
import { View } from 'react-native-ui-lib';
import { DatePickerModal } from '../screens/main/renter/requestForQuote/components';
import TextInput from './TextInput';

const DynamicDatePicker: React.FC<{
    value: Date;
    onChange: (date: Date) => void;
    minDate: Date;
    label?: string;
    placeholder: string;
    fullBorder?: boolean;
}> = ({ minDate, onChange, value, label, placeholder, fullBorder }) => {
    const [showPicker, setShowPicker] = React.useState<boolean>(false);
    const getFormattedDate = (date: Date) => {
        return moment(date).format('DD MMMM YYYY');
    };
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
                value={getFormattedDate(value)}
                editable={false}
                onPress={() => setShowPicker(!showPicker)}
                fullBorder={fullBorder}
            />
            <DatePickerModal
                visible={showPicker}
                date={value}
                onClose={() => setShowPicker(!showPicker)}
                onDateChange={e => onChange(e)}
                minDate={minDate}
            />
        </View>
    );
};

export default DynamicDatePicker;
