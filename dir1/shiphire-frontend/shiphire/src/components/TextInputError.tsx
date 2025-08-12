import React from "react";
import { View } from "react-native-ui-lib";
import { ErrorIcon } from "../configs/Svg";
import CustomText from "./CustomText";
import { TextInputErrorProps } from "../types";

const TextInputError: React.FC<TextInputErrorProps> = ({ errorText }) => {
    return (
        <View
            style={{
                position: "absolute",
                left: 12,
                bottom: 4,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10
            }}
        >
            <ErrorIcon />
            <CustomText
                fontSize='xs'
                fontFamily='regular'
                color='errorColor'
            >
                {errorText}
            </CustomText>
        </View>
    )
}

export default TextInputError