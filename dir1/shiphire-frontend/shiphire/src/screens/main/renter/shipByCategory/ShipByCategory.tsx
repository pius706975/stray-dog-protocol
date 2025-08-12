import React from "react"
import { Text } from "react-native-ui-lib"
import { ScreenLayout } from "../../../../components"

const ShipByCategory: React.FC = () => {
    return (
        <ScreenLayout
            testId="ShipByCategoryScreen"
            backgroundColor="light"
            flex
            center
        >
            <Text>Ship By Category Screen</Text>
        </ScreenLayout>
    )
}

export default ShipByCategory