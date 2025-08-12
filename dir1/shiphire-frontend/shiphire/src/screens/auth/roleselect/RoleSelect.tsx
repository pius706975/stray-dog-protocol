import React from 'react';
import { useWindowDimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button, CustomText, ScreenLayout } from '../../../components';
import {
    ROLES,
    USERDATA,
    getDataFromLocalStorage,
    removeDataToLocalStorage,
    setDataToLocalStorage,
} from '../../../configs';
import { useSubmitUserRole } from '../../../hooks';
import {
    modalSlice,
    progressIndicatorSlice,
    userStatusSlice,
} from '../../../slices';
import { RoleSelectProps, SubmitUserRoleRequest } from '../../../types';
import { handleAxiosError } from '../../../utils';
import CustomCheckbox from './component/CustomCheckbox';

const RoleSelect: React.FC<RoleSelectProps> = () => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const {
        setRoleSubmitted: roleIsSubmitted,
        setPreferencesNotSubmitted,
        setRoleOwner,
    } = userStatusSlice.actions;
    const { width } = useWindowDimensions();
    const mutationSubmitUserRole = useSubmitUserRole();
    const [renterChecked, setRenterChecked] = React.useState<boolean>(false);
    const [shipOwnerChecked, setShipOwnerChecked] =
        React.useState<boolean>(false);
    const [userData, setUserData] = React.useState<string>('');
    const [roleSubmitted, setRoleSubmitted] =
        React.useState<SubmitUserRoleRequest>({
            roleSubmitted: '',
        });
    const userName = userData?.split(' ')[0];

    const handleRenterCheckboxPress = () => {
        setRenterChecked(true);
        setShipOwnerChecked(false);
        setRoleSubmitted({ roleSubmitted: 'renter' });
    };

    const handleShipOwnerCheckboxPress = () => {
        setRenterChecked(false);
        setShipOwnerChecked(true);
        setRoleSubmitted({ roleSubmitted: 'shipOwner' });
    };
    const handleRoleConfirm = () => {
        if (renterChecked == false && shipOwnerChecked == false) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: 'Please choose your role',
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
            return;
        }
        dispatch(setPreferencesNotSubmitted());
        dispatch(showProgressIndicator());
        mutationSubmitUserRole.mutate(roleSubmitted, {
            onSuccess: resp => {
                removeDataToLocalStorage(ROLES);
                setDataToLocalStorage(ROLES, { roles: resp.data.data.roles });
                dispatch(
                    showModal({
                        status: 'success',
                        text: `Hello new ${resp.data.data.roles}`,
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                    resp.data.data.roles === 'renter'
                        ? dispatch(roleIsSubmitted())
                        : (dispatch(setRoleOwner()),
                          dispatch(roleIsSubmitted()));
                }, 2000);
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'Failed to submit roles, please try again later',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideProgressIndicator());
                    dispatch(hideModal());
                }, 2000);
                handleAxiosError(err);
            },
        });
    };

    React.useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(resp => {
            if (resp) {
                setUserData('name' in resp ? resp.name : '');
            }
        });
    }, []);

    return (
        <ScreenLayout
            flex
            center
            spread
            backgroundColor="light"
            paddingV={113}
            testId="RoleSelectScreen">
            <View center>
                <CustomText
                    fontFamily="bold"
                    fontSize="xxl"
                    color="primaryColor">
                    Helo {userName},
                </CustomText>
                <CustomText
                    fontFamily="bold"
                    fontSize="xxl"
                    color="primaryColor">
                    Welcome to ShipHire!
                </CustomText>
                <View marginT-20 style={{ marginBottom: 100 }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="lg"
                        color="darkTextColor">
                        Please choose your role
                    </CustomText>
                </View>
                <View row>
                    <CustomCheckbox
                        checked={renterChecked}
                        onPress={handleRenterCheckboxPress}
                        title="Renter"
                        testId="renterCB"
                    />
                    <CustomCheckbox
                        checked={shipOwnerChecked}
                        onPress={handleShipOwnerCheckboxPress}
                        title="Ship Owner"
                        testId="shipOwnerCB"
                    />
                </View>
            </View>
            <View
                style={{
                    width: width / 1.2,
                }}>
                <Button title="Confirm" onSubmit={handleRoleConfirm} />
            </View>
        </ScreenLayout>
    );
};

export default RoleSelect;
