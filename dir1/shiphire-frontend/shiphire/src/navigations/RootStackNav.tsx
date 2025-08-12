import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AuthScreenStacks,
    MainScreenAdminStack,
    MainScreenOwnerStack,
    MainScreenStack,
    RenterPreferencesStackNav,
} from '.';
import { ROLES, TOKEN, USERDATA, getDataFromLocalStorage } from '../configs';
import { DeleteAccount, NetworkErrorScreen, RoleSelect, SplashScreen } from '../screens';
import { OwnerCompanyRegister } from '../screens/main/shipowner/ownerCompany';
import { userStatusSlice } from '../slices';
import { RootParamList, RootState } from '../types';

const RootStack = createNativeStackNavigator<RootParamList>();

const RootStackNav: React.FC = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {
        isLoggedIn,
        isRoleSubmitted,
        isOwner,
        isPreferencesSubmitted,
        isCompanySubmitted,
        isAdmin,
    } = useSelector((state: RootState) => state.userStatus);
    // const renterPreferences = useSelector(
    //     (state: RootState) => state.renterPreference.renterPreference,
    // );

    const {
        login,
        setRoleSubmitted,
        setRoleOwner,
        setCompanySubmitted,
        setCompanyNotSubmitted,
        setPreferencesSubmitted,
        setRoleAdmin,
    } = userStatusSlice.actions;

    useEffect(() => {
        const checkLoginAndRole = async () => {
            const token = await getDataFromLocalStorage(TOKEN);
            const role = await getDataFromLocalStorage(ROLES);
            const userData = await getDataFromLocalStorage(USERDATA);

            if (token && role !== undefined && role.roles !== 'user') {
                if (role.roles === 'shipOwner') {
                    if (userData.isCompanySubmitted) {
                        dispatch(setCompanySubmitted());
                    } else {
                        dispatch(setCompanyNotSubmitted());
                    }
                    dispatch(setRoleOwner());
                } else if (role.roles === 'renter') {
                    if (userData.isCompanySubmitted) {
                        dispatch(setCompanySubmitted());
                    } else {
                        dispatch(setCompanyNotSubmitted());
                    }
                    dispatch(setPreferencesSubmitted());
                    // renter preferences logic should apply here
                } else if (role.roles === 'admin') {
                    dispatch(setRoleAdmin());
                }
                dispatch(setRoleSubmitted());
                dispatch(login());
            }
            if (token && role !== undefined && role.roles === 'user') {
                dispatch(login());
            }
            setIsLoading(false);
        };

        checkLoginAndRole();
    }, []);

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isLoading ? (
                <RootStack.Screen name="Splash" component={SplashScreen} />
            ) : isLoggedIn ? (
                isRoleSubmitted ? (
                    isOwner ? (
                        isCompanySubmitted ? (
                            <RootStack.Screen
                                name="MainScreenOwnerStack"
                                component={MainScreenOwnerStack}
                            />
                        ) : (
                            <RootStack.Screen
                                name="OwnerCompanyRegister"
                                component={OwnerCompanyRegister}
                            />
                        )
                    ) : isAdmin ? (
                        <RootStack.Screen
                            name="MainScreenAdminStack"
                            component={MainScreenAdminStack}
                        />
                    ) : isPreferencesSubmitted ? (
                        <RootStack.Screen
                            name="MainScreenStack"
                            component={MainScreenStack}
                        />
                    ) : (
                        <RootStack.Screen
                            name="RenterPreferencesStack"
                            component={RenterPreferencesStackNav}
                        />
                    )
                ) : (
                    <RootStack.Screen
                        name="RoleSelect"
                        component={RoleSelect}
                    />
                )
            ) : (
                <RootStack.Screen
                    name="AuthScreenStack"
                    component={AuthScreenStacks}
                />
            )}
            <RootStack.Screen name="DeleteAccount" component={DeleteAccount} />
            <RootStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} />
        </RootStack.Navigator>
    );
};

export default RootStackNav;
