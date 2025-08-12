import { CheckBox } from '@rneui/base'
import React from 'react'
import { Text } from 'react-native-ui-lib'
import { Color, FontFamily, FontSize } from '../../../configs'
import { CustomSelectionProps } from '../../../types'

const CustomSelection: React.FC<CustomSelectionProps> = ({ checked, title, onPress }) => {
    return (
        <CheckBox
            checked={checked}
            onPress={onPress}
            checkedIcon={<Text style={{
                fontFamily: FontFamily.medium,
                fontSize: FontSize.lg,
                color: Color.lightTextColor
            }} >{title}</Text>}
            uncheckedIcon={<Text style={{
                fontFamily: FontFamily.medium,
                fontSize: FontSize.lg,
                color: Color.primaryColor
            }}>{title}</Text>}
            containerStyle={checked ? {
                height: 55,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "flex-start",
                backgroundColor: Color.primaryColor,
                borderRadius: 10
            } : {
                height: 55,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "flex-start",
                backgroundColor: Color.softSecColor,
                borderWidth: 2,
                borderColor: Color.primaryColor,
                borderRadius: 10
            }}
        />
    )
}

export default CustomSelection