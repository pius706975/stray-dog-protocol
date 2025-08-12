import React from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { CustomText } from '../../../../../components';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { CustomDropDownInputProps } from '../../../../../types';

const CustomDropDownInput: React.FC<CustomDropDownInputProps> = ({
    label,
    items,
    setItems,
    value,
    setValue,
    elevation,
}) => {
    const [open, setOpen] = React.useState(false);

    return (
        <View style={{ zIndex: elevation }}>
            <CustomText color="primaryColor" fontSize="xl" fontFamily="medium">
                {label}
            </CustomText>
            <DropDownPicker
                multiple={true}
                multipleText={`${value.length} ${label} selected`}
                mode="SIMPLE"
                listMode="MODAL"
                searchable={false}
                modalTitle={`Pick one or more ${label.toLowerCase()}`}
                placeholder={`Select your ${label.toLowerCase()}`}
                modalProps={{
                    animationType: 'slide',
                }}
                modalTitleStyle={{
                    fontFamily: FontFamily.medium,
                    fontSize: FontSize.lg,
                    color: Color.primaryColor,
                }}
                closeIconStyle={{
                    borderColor: Color.primaryColor,
                    borderWidth: 2,
                    borderRadius: 50,
                    padding: 6,
                }}
                style={{
                    marginBottom: 20,
                    marginStart: -4,
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: Color.primaryColor,
                    backgroundColor: Color.bgColor,
                }}
                placeholderStyle={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.md,
                    color: '#4D596399',
                }}
                labelStyle={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.md,
                    color: Color.darkTextColor,
                }}
                listItemLabelStyle={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.md,
                    color: Color.darkTextColor,
                }}
                itemSeparatorStyle={{
                    backgroundColor: Color.neutralColor,
                }}
                selectedItemLabelStyle={{
                    fontFamily: FontFamily.bold,
                    fontSize: FontSize.md,
                    color: Color.softPrimaryColor,
                }}
                itemSeparator={true}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
            />
        </View>
    );
};

export default CustomDropDownInput;
