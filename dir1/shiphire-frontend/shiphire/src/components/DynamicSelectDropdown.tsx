import { FormikErrors } from 'formik';
import React from 'react';
import { View } from 'react-native';
import DropDownPicker, {
    ItemType,
    ValueType,
} from 'react-native-dropdown-picker';
import { Color, FontFamily, FontSize } from '../configs';
import CustomText from './CustomText';
import TextInputError from './TextInputError';
import { useTranslation } from 'react-i18next';

const DynamicSelectDropdown: React.FC<{
    testID: string;
    label: string;
    items: { label: string; value: string }[];
    onSetValue: (value: ItemType<ValueType>[]) => void;
    errorText?: string;
    error?:
        | string
        | false
        | string[]
        | FormikErrors<any>
        | FormikErrors<any>[]
        | boolean
        | Date;
}> = ({ testID, items, label, onSetValue, error, errorText }) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string[]>([]);
    const { t } = useTranslation('common');
    return (
        <View>
            <CustomText color="primaryColor" fontSize="xl" fontFamily="medium">
                {label}
            </CustomText>
            <DropDownPicker
                testID={testID}
                multiple={true}
                multipleText={`${value.length} ${label} selected`}
                mode="SIMPLE"
                listMode="MODAL"
                searchable={false}
                modalTitle={`${t('AddShip.titleSpecificAdd')} ${label.toLowerCase()}`}
                placeholder={`${t('AddShip.placeholderSpecificAdd')} ${label.toLowerCase()}`}
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
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                onPress={setOpen}
                setValue={setValue}
                onSelectItem={e => {
                    onSetValue(e ? e : []);
                }}
            />
            {error && (
                <View
                    style={{
                        paddingTop: 6,
                        marginLeft: -10,
                    }}>
                    <TextInputError errorText={errorText ? errorText : ''} />
                </View>
            )}
        </View>
    );
};

export default DynamicSelectDropdown;
