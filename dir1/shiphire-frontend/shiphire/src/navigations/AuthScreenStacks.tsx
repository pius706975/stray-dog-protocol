import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    ForgotPassword,
    ResetPassword,
    SignIn,
    SignUp,
    VerifyOTPForgotPass,
} from '../screens';
import { AuthParamList } from '../types';
import MainScreenStack from './MainScreenStack';
import MainScreenGuestStack from './MainScreenGuestStack';

const AuthStack = createNativeStackNavigator<AuthParamList>();

const AuthScreenStacks = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="SignIn" component={SignIn} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <AuthStack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
            />
            <AuthStack.Screen
                name="VerifyOTPForgotPass"
                component={VerifyOTPForgotPass}
            />
            <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
            <AuthStack.Screen
                name="MainScreenStack"
                component={MainScreenStack}
            />
            <AuthStack.Screen
                name="MainScreenGuestStack"
                component={MainScreenGuestStack}
            />
        </AuthStack.Navigator>
    );
};

export default AuthScreenStacks;
