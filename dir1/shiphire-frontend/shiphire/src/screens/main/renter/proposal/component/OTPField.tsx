import React from 'react';
import { Pressable, TextInput } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { OTPFieldProps } from '../../../../../types';

const OTPField: React.FC<OTPFieldProps> = ({
    setPinReady,
    setModalCode,
    modalCode,
}) => {
    const [code, setCode] = React.useState<string>('');
    const [inputContainerIsFocused, setInputContainerIsFocused] =
        React.useState<boolean>(false);
    const textInputRef = React.useRef<any>(null);
    const codeDigitsArray = new Array(4).fill(0);

    const handleOnPress = () => {
        setInputContainerIsFocused(true);
        textInputRef?.current?.focus();
    };

    const handleOnBlur = () => {
        setInputContainerIsFocused(false);
    };

    const toCodeDigitInput = (_value: number, index: number) => {
        const emptyInputChar = ' ';
        const digit = code[index] || emptyInputChar;

        const isCurrentDigit = index === code.length;
        const isLastDigit = index === 3;
        const isCodeFull = code.length === 3;

        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        return (
            <View
                key={index}
                style={{
                    borderColor:
                        inputContainerIsFocused && isDigitFocused
                            ? Color.secColor
                            : Color.primaryColor,
                    backgroundColor:
                        inputContainerIsFocused && isDigitFocused
                            ? Color.softSecColor
                            : Color.bgColor,
                    minWidth: '15%',
                    borderWidth: 3,
                    borderRadius: 5,
                    padding: 12,
                }}>
                <Text
                    style={{
                        fontSize: FontSize.md,
                        fontFamily: FontFamily.semiBold,
                        textAlign: 'center',
                    }}>
                    {digit}
                </Text>
            </View>
        );
    };

    React.useEffect(() => {
        setPinReady(code.length === 4);
        setModalCode(+code);
        return () => setPinReady(false);
    }, [code]);

    React.useEffect(() => {
        if (modalCode === 0) {
            setCode('');
        }
    }, [modalCode]);

    return (
        <View
            center
            style={{
                marginVertical: 30,
            }}>
            <Pressable
                style={{
                    width: '70%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }}
                onPress={handleOnPress}>
                {codeDigitsArray.map(toCodeDigitInput)}
            </Pressable>
            <TextInput
                testID="OTPInput"
                style={{
                    position: 'absolute',
                    width: '70%',
                    height: 10,
                    opacity: 0,
                }}
                value={code}
                onChangeText={text => setCode(text)}
                keyboardType="number-pad"
                maxLength={4}
                returnKeyType="done"
                textContentType="oneTimeCode"
                onBlur={handleOnBlur}
            />
        </View>
    );
};

export default OTPField;
