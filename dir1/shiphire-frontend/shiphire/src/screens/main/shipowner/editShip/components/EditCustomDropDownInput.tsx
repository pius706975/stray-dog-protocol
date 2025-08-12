import React from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { CustomText } from '../../../../../components';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { EditCustomDropDownInputProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const EditCustomDropDownInput: React.FC<EditCustomDropDownInputProps> = ({
    label,
    items,
    setItems,
    value,
    setValue,
    elevation,
    testID,
}) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation('detailship');

    return (
        <View style={{ zIndex: elevation }}>
            <CustomText fontSize="sm" fontFamily="medium" color="darkTextColor">
                {label}
            </CustomText>
            <DropDownPicker
                testID={testID}
                multiple={true}
                mode="SIMPLE"
                listMode="MODAL"
                searchable={false}
                modalTitle={t('ShipOwner.modalTitleDropDown')}
                modalProps={{
                    animationType: 'slide',
                }}
                style={{
                    marginBottom: 20,
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: Color.primaryColor,
                    backgroundColor: Color.bgColor,
                }}
                placeholderStyle={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.md,
                    color: '#4D596399',
                    textAlign: 'center',
                }}
                labelStyle={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.md,
                    color: Color.darkTextColor,
                }}
                dropDownContainerStyle={{
                    marginHorizontal: 10,
                    borderWidth: 2,
                    borderColor: Color.primaryColor,
                    backgroundColor: Color.secColor,
                }}
                listItemLabelStyle={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.md,
                    color: Color.darkTextColor,
                }}
                itemSeparatorStyle={{
                    backgroundColor: '#216DAB',
                }}
                selectedItemLabelStyle={{
                    fontWeight: 'bold',
                }}
                dropDownDirection="BOTTOM"
                itemSeparator={true}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                onPress={setOpen}
                setValue={setValue}
                setItems={setItems}
            />
        </View>
    );
};

export default EditCustomDropDownInput;
