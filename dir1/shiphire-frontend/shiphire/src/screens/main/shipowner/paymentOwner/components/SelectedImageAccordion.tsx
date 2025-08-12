import { ListItem } from '@rneui/base';
import React from 'react';
import { Image, View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { SelectedImageAccordionOwnerProps, SelectedImageAccordionProps } from '../../../../../types';

const SelectedImageAccordion: React.FC<SelectedImageAccordionOwnerProps> = ({
    handleAcceptPayment,
    selectedImagePath,
}) => {
    const [paymentReceiptExpanded, setPaymentReceiptExpanded] =
        React.useState<boolean>(true);

    return (
        <ListItem.Accordion
            content={
                <CustomText
                    fontFamily="bold"
                    fontSize="lg"
                    color="primaryColor">
                    Payment receipt from renter
                </CustomText>
            }
            containerStyle={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: Color.secColor,
                borderRadius: 6,
                padding: 16,
                alignItems: 'center',
            }}
            isExpanded={paymentReceiptExpanded}
            onPress={() => {
                setPaymentReceiptExpanded(!paymentReceiptExpanded);
            }}>
            <View
                flex
                center
                style={{
                    backgroundColor: Color.secColor,
                    borderBottomEndRadius: 6,
                    borderBottomStartRadius: 6,
                    top: -28,
                    marginBottom: -28,
                    padding: 16,
                }}>
                <Image
                    source={{
                        uri: selectedImagePath
                            ? selectedImagePath
                            : 'https://picsum.photos/id/237/200/300',
                    }}
                    style={{ width: 280, height: 360 }}
                />
                <View
                    row
                    style={{
                        width: '100%',
                        justifyContent: 'space-around',
                        marginTop: 20,
                    }}>
                    <Button
                        title="Accept payment"
                        color="success"
                        onSubmit={handleAcceptPayment}

                    />
                </View>
            </View>
        </ListItem.Accordion>
    );
};

export default SelectedImageAccordion;
