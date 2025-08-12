import React from 'react';
import { useWindowDimensions, View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { Color } from '../configs';
import { RootState } from '../types';

const ProgressIndicator: React.FC = () => {
    const { width, height } = useWindowDimensions();
    const { visible } = useSelector(
        (state: RootState) => state.progressIndicator,
    );
    const { isNetworkError } = useSelector(
        (state: RootState) => state.networkError,
    );
    return visible && !isNetworkError ? (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: height,
                backgroundColor: 'rgba(0,0,0,0.7)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={Color.primaryColor} />
        </View>
    ) : null;
};

export default ProgressIndicator;
