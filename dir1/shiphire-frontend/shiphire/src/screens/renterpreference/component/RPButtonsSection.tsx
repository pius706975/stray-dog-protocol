import React from "react";
import { View } from "react-native-ui-lib";
import { Button, CustomText } from "../../../components";
import { ArrowIcon, Color } from "../../../configs";
import { Pressable } from "react-native";
import { RPButtonsSectionProps } from "../../../types";

const RPButtonsSection: React.FC<RPButtonsSectionProps> = ({
    onButtonSubmitPressed,
    onLinkPressed,
    confirm
}) => {
    return (
        <View
            flex
            centerV
            style={{
                gap: 10,
            }}>
            <Button
                title={confirm ? "Confirm" : "Next"}
                rightIcon={confirm ? null : <ArrowIcon />}
                onSubmit={onButtonSubmitPressed}
            />
            <Pressable
                onPress={onLinkPressed}
                style={{ alignSelf: 'center' }}
            >
                <CustomText
                    fontFamily='regular'
                    fontSize='sm'
                    color='primaryColor'
                    borderBottomColor={Color.primaryColor}
                >
                    ill do this later
                </CustomText>
            </Pressable>
        </View>
    )
}

export default RPButtonsSection;