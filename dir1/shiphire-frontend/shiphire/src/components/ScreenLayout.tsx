import React from 'react';
import { ScrollView } from 'react-native';
import { View } from 'react-native-ui-lib';
import { Color } from '../configs';
import { ScreenLayoutProps } from '../types';

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
    children,
    backgroundColor,
    center,
    spread,
    flex,
    paddingV,
    testId,
    marginB,
    padding,
    start,
    gap
}) => {
    return (
        <View
            flex
            style={{
                backgroundColor:
                    backgroundColor === 'secondary'
                        ? Color.secColor
                        : backgroundColor === 'light'
                            ? Color.bgColor
                            : Color.primaryColor,
                position: 'relative',
                justifyContent: 'space-between',
            }}
            testID={testId}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    flex: flex ? 1 : undefined,
                    alignItems: center ? 'center' : undefined,
                    justifyContent: spread
                        ? 'space-between'
                        : center
                            ? 'center'
                            : start
                                ? 'flex-start'
                                : undefined,
                    paddingVertical: paddingV,
                    padding: padding,
                    marginBottom: marginB,
                    gap: gap
                }}
            >
                {children}
            </ScrollView>
        </View>
    );
};

export default ScreenLayout;
