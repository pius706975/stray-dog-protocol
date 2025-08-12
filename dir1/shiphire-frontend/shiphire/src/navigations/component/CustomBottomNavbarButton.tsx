import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { Color, FontFamily, FontSize } from "../../configs";
import { CustomNavbarType } from "../../types";


const CustomBottomNavBarButton: React.FC<CustomNavbarType> = ({
    icon,
    label,
    onPress,
    isActive
}) => {

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: isActive ? Color.softPrimaryColor : Color.primaryColor,
                borderRadius: isActive ? 20 : 0,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    gap: 10
                }}
            >
                {icon}
                {isActive && (
                    <Text
                        style={{
                            fontSize: FontSize.xs,
                            fontFamily: FontFamily.regular,
                            color: Color.secColor
                        }}
                    >{label}</Text>
                )
                }
            </View>
        </TouchableOpacity>
    );
};

export default CustomBottomNavBarButton;
