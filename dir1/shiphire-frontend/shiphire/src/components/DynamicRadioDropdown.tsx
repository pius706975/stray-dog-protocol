import { View } from 'react-native-ui-lib';
import React from 'react';
import CustomText from './CustomText';
import DropDownPicker from 'react-native-dropdown-picker';
import { Color, FontFamily, FontSize } from '../configs';
import { FormikErrors } from 'formik';
import TextInputError from './TextInputError';

const DynamicRadioDropdown: React.FC<{
    testID: string;
    label?: string;
    placeholder?: string;
    onSetValue: (value: string) => void;
    items: { label: string; value: string }[];
    errorText?: string;
    error?:
        | string
        | false
        | string[]
        | FormikErrors<any>
        | FormikErrors<any>[]
        | boolean
        | Date;
    fullBorder?: boolean;
}> = ({
    testID,
    onSetValue,
    items,
    label,
    error,
    errorText,
    placeholder,
    fullBorder,
}) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>('');
    const [dropdownHeight, setDropdownHeight] = React.useState<
        number | undefined
    >(undefined);

    const calculateDropdownHeight = (itemCount: number) => {
        // You can adjust the multiplier as needed to fit your UI
        const itemHeight = 70; // Assuming each item has a height of 50 units
        const maxDropdownHeight = 350; // Set a maximum height if needed

        const calculatedHeight = Math.min(
            itemCount * itemHeight,
            maxDropdownHeight,
        );
        setDropdownHeight(calculatedHeight);
    };

    React.useEffect(() => {
        if (open) {
            calculateDropdownHeight(items.length);
        } else {
            // Reset the height when the dropdown is closed
            setDropdownHeight(undefined);
        }
    }, [open, items]);

    return (
        <View>
            {label && (
                <CustomText
                    color="primaryColor"
                    fontSize="xl"
                    fontFamily="medium">
                    {label}
                </CustomText>
            )}
            <View style={{ height: dropdownHeight }}>
                <DropDownPicker
                    testID={testID}
                    style={{
                        marginStart: -4,
                        borderWidth: fullBorder ? 1 : 0,
                        borderBottomWidth: 1,
                        borderColor: error
                            ? Color.errorColor
                            : Color.primaryColor,
                        backgroundColor: Color.bgColor,
                    }}
                    placeholderStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: Color.neutralColor,
                    }}
                    labelStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: Color.darkTextColor,
                    }}
                    dropDownContainerStyle={{
                        marginStart: -4,
                        marginHorizontal: 10,
                        borderWidth: 1.5,
                        borderColor: Color.primaryColor,
                        backgroundColor: Color.bgColor,
                        elevation: 5,
                    }}
                    listItemLabelStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: Color.darkTextColor,
                    }}
                    itemSeparatorStyle={{
                        backgroundColor: Color.neutralColor,
                    }}
                    placeholder={
                        label
                            ? `Select your ${label.toLowerCase()}`
                            : placeholder
                            ? placeholder
                            : undefined
                    }
                    searchable={items.length > 5}
                    itemSeparator={true}
                    onSelectItem={e => onSetValue(e.value ? e.value : '')}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    listMode={items.length > 5 ? "MODAL" :"SCROLLVIEW"}
                    dropDownDirection="BOTTOM"
                />
            </View>
            {error && (
                <View
                    style={{
                        paddingTop: 26,
                        marginLeft: -10,
                    }}>
                    <TextInputError errorText={errorText ? errorText : ''} />
                </View>
            )}
        </View>
    );
};

export default DynamicRadioDropdown;
