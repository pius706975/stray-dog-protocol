import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import NumericInput from 'react-native-numeric-input';
import {
    CalendarPickerModal,
    DatePickerModal,
} from '../../../../renter/requestForQuote/components';
import DropDownPicker from 'react-native-dropdown-picker';
import { Pressable } from 'react-native';
import { CustomText, TextInput } from '../../../../../../components';
import { Color, FontFamily, FontSize, PlusIcon } from '../../../../../../configs';
import { useTranslation } from 'react-i18next';

const InputPreview = ({ fieldType }) => {
    const [showPicker, setShowPicker] = React.useState<boolean>(false);
    const arr = [
        {
            label: 'Item 1',
            value: 'item1',
        },
        {
            label: 'Item 2',
            value: 'item2',
        },
        {
            label: 'Item 3',
            value: 'item3',
        },
    ];
    const { t } = useTranslation('rfq');

    return (
        <View
            marginV-10
            padding-10
            paddingL-15
            style={{
                backgroundColor: Color.bgNeutralColor,
            }}>
            <CustomText fontSize="xl" fontFamily="medium" color="primaryColor">
                {t('RFQFormInputView.textPreview')}
            </CustomText>
            {fieldType === 'textInput' ? (
                <TextInput
                    editable={false}
                    leftIcon
                    label=""
                    placeholder="Text Input"
                />
            ) : fieldType === 'numericInput' ? (
                <View row centerV marginT-16 style={{ gap: 10 }}>
                    <NumericInput
                        onChange={() => {}}
                        editable={false}
                        type="up-down"
                        valueType="integer"
                        rounded
                        textColor={Color.darkTextColor}
                        upDownButtonsBackgroundColor={Color.softPrimaryColor}
                        borderColor={Color.primaryColor}
                    />
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {t('RFQFormInputView.labelUnit')}
                    </CustomText>
                </View>
            ) : fieldType === 'datePicker' ? (
                <>
                    <TextInput
                        leftIcon
                        placeholder="Date Picker"
                        label=""
                        value="13 November 2023"
                        editable={false}
                        onPress={() => setShowPicker(!showPicker)}
                    />
                    <DatePickerModal
                        visible={showPicker}
                        date={new Date()}
                        onClose={() => setShowPicker(!showPicker)}
                        onDateChange={() => {}}
                        minDate={new Date()}
                    />
                </>
            ) : fieldType === 'datePickerCalendar' ? (
                <View
                    flex
                    style={{
                        borderRadius: 8,
                    }}>
                    <TextInput
                        leftIcon
                        placeholder={t('RFQFormInputView.textSelectDate')}
                        label={''}
                        value={'13 Nov 2023 to 14 Des 2023'}
                        editable={false}
                        onPress={() => setShowPicker(!showPicker)}
                    />
                    <CalendarPickerModal
                        visible={showPicker}
                        onClose={() => setShowPicker(!showPicker)}
                        date={'13 November 2024'}
                        handleSubmit={() => {}}
                    />
                </View>
            ) : fieldType === 'radioDropdown' ? (
                <View
                    style={{
                        height: showPicker ? 170 : undefined,
                    }}>
                    <DropDownPicker
                        style={{
                            marginStart: -4,
                            borderWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: Color.primaryColor,
                            backgroundColor: Color.bgColor,
                        }}
                        placeholderStyle={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            color: Color.neutralColor,
                        }}
                        labelStyle={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            color: Color.darkTextColor,
                        }}
                        dropDownContainerStyle={{
                            marginStart: -4,
                            marginHorizontal: 10,
                            borderWidth: 1.5,
                            borderColor: Color.primaryColor,
                            backgroundColor: Color.bgColor,
                            elevation: 5,
                        }}
                        listItemLabelStyle={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            color: Color.darkTextColor,
                        }}
                        itemSeparatorStyle={{
                            backgroundColor: Color.neutralColor,
                        }}
                        placeholder={t('RFQFormInputView.textSelectItem')}
                        itemSeparator={true}
                        onSelectItem={() => {}}
                        open={showPicker}
                        items={arr}
                        setOpen={setShowPicker}
                        value=""
                        setValue={() => {}}
                        mode="SIMPLE"
                        listMode="SCROLLVIEW"
                    />
                </View>
            ) : fieldType === 'selectDropDown' ? (
                <DropDownPicker
                    multiple={true}
                    multipleText={t('RFQFormInputView.text1Selected')}
                    mode="SIMPLE"
                    listMode="MODAL"
                    searchable={false}
                    modalTitle={t('RFQFormInputView.textPickOne')}
                    placeholder={t('RFQFormInputView.textSelectItem')}
                    modalProps={{
                        animationType: 'slide',
                    }}
                    modalTitleStyle={{
                        fontFamily: FontFamily.medium,
                        fontSize: FontSize.lg,
                        color: Color.primaryColor,
                    }}
                    closeIconStyle={{
                        borderColor: Color.primaryColor,
                        borderWidth: 2,
                        borderRadius: 50,
                        padding: 6,
                    }}
                    style={{
                        marginBottom: 20,
                        marginStart: -4,
                        borderWidth: 0,
                        borderBottomWidth: 1,
                        borderColor: Color.primaryColor,
                        backgroundColor: Color.bgColor,
                    }}
                    placeholderStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: '#4D596399',
                    }}
                    labelStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: Color.darkTextColor,
                    }}
                    listItemLabelStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: Color.darkTextColor,
                    }}
                    itemSeparatorStyle={{
                        backgroundColor: Color.neutralColor,
                    }}
                    selectedItemLabelStyle={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.md,
                        color: Color.softPrimaryColor,
                    }}
                    itemSeparator={true}
                    open={showPicker}
                    value={[]}
                    items={arr}
                    setOpen={setShowPicker}
                    setValue={() => {}}
                    onSelectItem={() => {}}
                />
            ) : fieldType === 'docSelect' ? (
                <Pressable onPress={() => {}}>
                    <View
                        flex
                        spread
                        row
                        centerV
                        paddingB-15
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: Color.primaryColor,
                        }}>
                        <CustomText
                            color="darkTextColor"
                            fontFamily="regular"
                            fontSize="md">
                            {t('RFQFormInputView.textSelectFile')}
                        </CustomText>
                        <PlusIcon />
                    </View>
                </Pressable>
            ) : fieldType === 'imageSelect' ? (
                <Pressable onPress={() => {}}>
                    <View
                        flex
                        spread
                        row
                        centerV
                        paddingB-15
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: Color.primaryColor,
                        }}>
                        <CustomText
                            color="darkTextColor"
                            fontFamily="regular"
                            fontSize="md">
                            {t('RFQFormInputView.textSelectFile')}
                        </CustomText>
                        <PlusIcon />
                    </View>
                </Pressable>
            ) : (
                <Text>{t('RFQFormInputView.textNoInputSelected')}</Text>
            )}
        </View>
    );
};

export default InputPreview;
