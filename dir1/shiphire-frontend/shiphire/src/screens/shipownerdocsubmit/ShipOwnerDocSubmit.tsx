import React from "react";
import { Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { Button } from "../../components";
import { Color, FontFamily, FontSize, SHIPOWNERDOCSUBMITTED, getDataFromLocalStorage, setDataToLocalStorage } from "../../configs";
import { modalSlice } from "../../slices";
import { ShipOwnerDocProps } from "../../types";

const ShipOwnerDocSubmit: React.FC<ShipOwnerDocProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions

    const handleOnDocSubmit = () => {
        setDataToLocalStorage(SHIPOWNERDOCSUBMITTED, { status: true })
        dispatch(showModal({ status: "success", text: "Ship Owner Document Submitted!" }))
        setTimeout(() => {
            dispatch(hideModal());
            navigation.navigate("MainScreenTab")
        }, 4000)
    }

    React.useEffect(() => {
        getDataFromLocalStorage(SHIPOWNERDOCSUBMITTED).then(resp => {
            resp && (navigation.navigate("MainScreenTab"))
        })
    }, [])

    return (
        <View flex center >
            <Text> Ship Owner Document Submit Screen</Text>
            <Button title="Confirm" onSubmit={handleOnDocSubmit} />
            <Text
                style={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.sm,
                    color: Color.primaryColor,
                    borderBottomWidth: 1,
                    borderColor: Color.primaryColor
                }}
                onPress={() => navigation.navigate("MainScreenTab")}
            >I'll do this later</Text>
        </View>
    )
}

export default ShipOwnerDocSubmit

