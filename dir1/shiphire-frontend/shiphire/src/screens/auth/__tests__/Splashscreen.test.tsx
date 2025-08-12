import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SplashScreen from '../splash/SplashScreen';

describe('Testing SplashScreen', () => {
    it('should render SplashScreen correctly', () => {
        const tree = renderer.create(<SplashScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
