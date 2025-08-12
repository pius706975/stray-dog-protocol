import { CheckBox } from '@rneui/base';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { Text } from 'react-native-ui-lib';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    Color,
    FontFamily,
    FontSize,
} from '../../../../configs';
import { SignUpCheckBoxProps } from '../../../../types';

const SignUpCheckBox: React.FC<SignUpCheckBoxProps> = ({
    checked,
    onPress,
    setModalVisible,
}) => {
    const { width } = useWindowDimensions();
    const { t } = useTranslation('signup');
    return (
        <CheckBox
            checked={checked}
            checkedIcon={<CheckboxCheckedIcon />}
            uncheckedIcon={<CheckboxIcon />}
            onPress={onPress}
            testID="signUpCheckBox"
            wrapperStyle={{
                gap: 12,
            }}
            title={
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.xs,
                        color: Color.darkTextColor,
                    }}>
                    {t('FormSignUp.textIHaveRead')}
                    <Text
                        style={{
                            color: Color.primaryColor,
                            borderBottomWidth: 1,
                            borderColor: Color.primaryColor,
                        }}
                        onPress={() => setModalVisible(true)}>
                        {' '}
                        {t('FormSignUp.textTerms')}{' '}
                    </Text>
                    {t('FormSignUp.textOfShiphire')}{' '}
                </Text>
            }
            containerStyle={{
                width: width / 1.4,
                justifyContent: 'center',
                alignItems: 'flex-start',
                backgroundColor: Color.bgColor,
                marginTop: -8,
            }}
        />
    );
};

export default SignUpCheckBox;
