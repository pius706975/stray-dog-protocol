import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { Button, Text, View } from "react-native-ui-lib";
import { Color } from "../../../../configs";

const Notification = ({ navigation }) => {

    return (
        <View
            style={{
                flexDirection: 'row',
                alignSelf: 'center',

            }}>

            <Text style={{
                color: Color.boldInfoColor
            }}>Notification Screen</Text>
        </View>
    )

}

export default Notification;