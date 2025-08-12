import { Color, FontFamily, FontSize } from "../configs";
import { Text } from "react-native"
import { CustomTextProps } from "../types";

const CustomText: React.FC<CustomTextProps> = ({
    children,
    color,
    fontFamily,
    fontSize,
    borderBottomColor,
    lineHeight,
    textAlign,
    numberOfLines,
    ellipsizeMode
}) => {
    return (
        <Text
            style={{
                fontFamily:
                    fontFamily === "bold" ? FontFamily.bold :
                        fontFamily === "boldItalic" ? FontFamily.boldItalic :
                            fontFamily === "medium" ? FontFamily.medium :
                                fontFamily === "mediumItalic" ? FontFamily.mediumItalic :
                                    fontFamily === "semiBold" ? FontFamily.semiBold :
                                        fontFamily === "semiBoldItalic" ? FontFamily.semiBoldItalic :
                                            FontFamily.regular
                ,
                fontSize:
                    fontSize === "xs" ? FontSize.xs :
                        fontSize === "sm" ? FontSize.sm :
                            fontSize === "md" ? FontSize.md :
                                fontSize === "lg" ? FontSize.lg :
                                    fontSize === "xl" ? FontSize.xl :
                                        fontSize === "xl1" ? FontSize.xl1 :
                                            fontSize === "xl2" ? FontSize.xl2 :
                                                fontSize === "xxl" ? FontSize.xxl :
                                                    FontSize.xxxl
                ,
                color:
                    color === "primaryColor" ? Color.primaryColor :
                        color === "primaryDisableColor" ? Color.primaryDisableColor :
                            color === "lightTextColor" ? Color.lightTextColor :
                                color === "darkTextColor" ? Color.darkTextColor :
                                    color === "bgColor" ? Color.bgColor :
                                        color === "softSecBgPrimary" ? Color.softSecBgPrimary :
                                            color === "softGreyBgPrimary" ? Color.softGreyBgPrimary :
                                                color === "softPrimaryColor" ? Color.softPrimaryColor :
                                                    color === "secColor" ? Color.secColor :
                                                        color === "softSecColor" ? Color.softSecColor :
                                                            color === "bgSuccessColor" ? Color.bgSuccessColor :
                                                                color === "boldSuccessColor" ? Color.boldSuccessColor :
                                                                    color === "successColor" ? Color.successColor :
                                                                        color === "bgErrorColor" ? Color.bgErrorColor :
                                                                            color === "boldErrorColor" ? Color.boldErrorColor :
                                                                                color === "errorColor" ? Color.errorColor :
                                                                                    color === "bgInfoColor" ? Color.bgInfoColor :
                                                                                        color === "boldInfoColor" ? Color.boldInfoColor :
                                                                                            color === "infoColor" ? Color.infoColor :
                                                                                                color === "bgWarningColor" ? Color.bgWarningColor :
                                                                                                    color === "boldWarningColor" ? Color.boldWarningColor :
                                                                                                        color === "warningColor" ? Color.warningColor :
                                                                                                            color === "bgNeutralColor" ? Color.bgNeutralColor :
                                                                                                                color === "neutralColor" ? Color.neutralColor :
                                                                                                                    Color.primaryColor
                ,
                borderBottomWidth: borderBottomColor ? 1 : 0,
                borderColor: borderBottomColor,
                lineHeight: lineHeight,
                textAlign: textAlign,
            }}
            numberOfLines={numberOfLines ? numberOfLines : 0}
            ellipsizeMode={ellipsizeMode ? "tail" : undefined}
        >
            {children}
        </Text>
    );
}

export default CustomText