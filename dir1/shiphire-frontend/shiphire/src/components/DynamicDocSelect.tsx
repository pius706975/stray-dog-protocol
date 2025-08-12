import React from 'react';
import { Pressable } from 'react-native';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import { View } from 'react-native-ui-lib';
import { CloseIcon, Color, PlusIcon } from '../configs';
import CustomText from './CustomText';
import { FormikErrors } from 'formik';
import TextInputError from './TextInputError';
import TextInput from './TextInput';
import { DatePickerModal } from '../screens/main/shipowner/manageTransactionHistory/components';
import moment from 'moment';

const DynamicDocSelect: React.FC<{
    testID: string;
    label: string;
    error?:
        | string
        | false
        | string[]
        | FormikErrors<any>
        | FormikErrors<any>[]
        | boolean
        | Date;
    errorText?: string;
    docExpired?: boolean;
    setSelectedValue: (e: DocumentPickerResponse, date?: Date) => void;
    setUnselectValue: () => void;
}> = ({
    testID,
    label,
    error,
    errorText,
    setSelectedValue,
    setUnselectValue,
    docExpired,
}) => {
    const [selectedPdf, setSelectedPdf] =
        React.useState<DocumentPickerResponse | null>(null);
    const [showDeleteButton, setShowDeleteButton] =
        React.useState<boolean>(false);
    const [showPicker, setShowPicker] = React.useState<boolean>(false);
    const [expDate, setExpDate] = React.useState<Date | undefined>(undefined);

    const openPdfPickerDocument = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
            .then(result => {
                setSelectedPdf(result[0]);
                setShowDeleteButton(true);
                let exp: Date | undefined = undefined;
                if (docExpired && expDate === undefined) {
                    exp = new Date();
                } else {
                    exp = expDate;
                }
                setSelectedValue(result[0], exp);
            })
            .catch(error => {
                console.log('Error selecting PDF:', error);
            });
    };
    const getFormattedDate = (date: Date) => {
        return moment(date).format('DD MMMM YYYY');
    };

    const onDatePickerClose = () => {
        if (!expDate) {
            setExpDate(new Date());
        }

        setSelectedValue(selectedPdf, expDate);
        setShowPicker(!showPicker);
    };

    return (
        <View>
            <View paddingB-5 style={{ paddingTop: 20 }}>
                <CustomText
                    color="primaryColor"
                    fontSize="xl"
                    fontFamily="medium">
                    {label}
                </CustomText>
            </View>
            <View paddingB-25>
                {selectedPdf ? (
                    <View
                        flex
                        spread
                        row
                        centerV
                        paddingB-18
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: error
                                ? Color.errorColor
                                : Color.primaryColor,
                        }}>
                        <CustomText
                            color="darkTextColor"
                            fontFamily="regular"
                            fontSize="md">
                            {selectedPdf.name}
                        </CustomText>
                        {showDeleteButton && (
                            <Pressable
                                onPress={() => {
                                    setSelectedPdf(null);
                                    setExpDate(undefined);
                                    setShowDeleteButton(false);
                                    setUnselectValue();
                                }}>
                                <CloseIcon />
                            </Pressable>
                        )}
                    </View>
                ) : (
                    <Pressable testID={testID} onPress={openPdfPickerDocument}>
                        <View
                            flex
                            spread
                            row
                            centerV
                            paddingB-15
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: error
                                    ? Color.errorColor
                                    : Color.primaryColor,
                            }}>
                            <CustomText
                                color="darkTextColor"
                                fontFamily="regular"
                                fontSize="md">
                                Select file
                            </CustomText>
                            <PlusIcon />
                        </View>
                    </Pressable>
                )}
            </View>
            {error && (
                <View
                    style={{
                        marginLeft: -10,
                    }}>
                    <TextInputError errorText={errorText ? errorText : ''} />
                </View>
            )}
            {docExpired && (
                <View
                    style={{
                        margin: -10,
                    }}>
                    <TextInput
                        leftIcon
                        placeholder="Select Date"
                        label="Expired in"
                        value={expDate ? getFormattedDate(expDate) : ''}
                        editable={false}
                        onPress={() => setShowPicker(!showPicker)}
                    />
                    <DatePickerModal
                        visible={showPicker}
                        date={expDate || new Date()}
                        onClose={() => onDatePickerClose()}
                        onDateChange={e => setExpDate(e)}
                        minDate={new Date()}
                    />
                </View>
            )}
        </View>
    );
};

export default DynamicDocSelect;
