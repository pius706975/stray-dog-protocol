import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DetailUserProps } from '../../../../types';
import { Avatar, View } from 'react-native-ui-lib';
import {
    CustomText,
    NavigationKebabMenu,
    ScreenLayout,
} from '../../../../components';
import { Alert, Button, Platform } from 'react-native';
import CustomButton from '../../../../components/Button';
import {
    CircleCheckIcon,
    CircleInactiveIcon,
    Color,
} from '../../../../configs';
import {
    useUpdateUserActivation,
    useVerifyUserPhoneNumber,
} from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../slices';
import { handleAxiosError } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { ModalConfirmation } from './component';

const UserDetail: React.FC<DetailUserProps> = ({ navigation, route }) => {
    const {
        _id,
        name,
        email,
        phoneNumber,
        roles,
        isActive,
        shipOwnerId,
        renterId,
        isPhoneVerified,
        isVerified,
    } = route.params.user;
    const [active, setActive] = React.useState<boolean>(isActive);
    const [isUserPhoneVerified, setIsUserPhoneVerified] =
        React.useState<boolean>(isPhoneVerified);
    const { t } = useTranslation('usermanagement');
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const mutationUpdateUserActivation = useUpdateUserActivation();
    const mutationVerifyUserPhoneNumber = useVerifyUserPhoneNumber();
    const { hideModal, showModal } = modalSlice.actions;
    const dispatch = useDispatch();
    const [visible, setvisible] = React.useState<boolean>(false);
    const [isVerifyPhoneModal, setIsVerifyPhoneModal] =
        useState<boolean>(false);
    const [isVerifyPhoneLoading, setIsVerifyPhoneLoading] =
        useState<boolean>(false);
    let roleText: string = '';
    if (roles === 'renter') {
        roleText = t('renter');
    } else if (roles === 'shipOwner') roleText = t('shipOwner');

    const handleShowModal = useCallback(() => {
        setvisible(prevVisible => !prevVisible);
    }, []);

    const handleVerifyPhoneModal = useCallback(() => {
        setIsVerifyPhoneModal(
            prevIsVerifyPhoneModal => !prevIsVerifyPhoneModal,
        );
    }, []);

    const updateActivation = useCallback(() => {
        setIsSubmitting(true);
        mutationUpdateUserActivation.mutate(
            { _id, isActive: !active },
            {
                onSuccess: resp => {
                    setIsSubmitting(false);
                    handleShowModal();
                    setActive(resp.data.data.isActive);

                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('successMessageUpdateActivation'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            },
        );
    }, [
        _id,
        active,
        mutationUpdateUserActivation,
        dispatch,
        handleShowModal,
        t,
    ]);

    const verifyUserPhoneNumber = useCallback(() => {
        setIsVerifyPhoneLoading(true);

        mutationVerifyUserPhoneNumber.mutate(
            { _id, isPhoneVerified: !isUserPhoneVerified },
            {
                onSuccess: resp => {
                    handleVerifyPhoneModal();
                    setIsUserPhoneVerified(resp.data.data.isPhoneVerified);

                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('successVerifyUserPhoneNumber'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                },
                onSettled: () => {
                    setIsVerifyPhoneLoading(false);
                },
            },
        );
    }, [
        _id,
        isUserPhoneVerified,
        mutationVerifyUserPhoneNumber,
        dispatch,
        handleVerifyPhoneModal,
        t,
    ]);

    const menuOptions = useMemo(() => {
        const options = [
            {
                label: active ? t('inactiveUser') : t('activateUser'),
                action: handleShowModal,
            },
        ];

        if (!isUserPhoneVerified) {
            options.push({
                label: t('verifyPhoneNumber'),
                action: handleVerifyPhoneModal,
            });
        }

        return options;
    }, [
        active,
        handleShowModal,
        handleVerifyPhoneModal,
        isUserPhoneVerified,
        t,
    ]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <NavigationKebabMenu options={menuOptions} />,
        });
    }, [navigation, menuOptions]);

    return (
        <ScreenLayout backgroundColor="light" testId="adminUserDetail">
            <View
                paddingV-12
                paddingH-12
                paddingB-8
                style={{
                    backgroundColor: Color.primaryColor,
                    borderBottomColor: Color.primaryColor,
                    borderBottomWidth: 1,
                }}
                center>
                <Avatar name={name} useAutoColors size={100} />
                <CustomText
                    fontSize="xl2"
                    fontFamily="bold"
                    color="lightTextColor">
                    {name}
                </CustomText>
                <CustomText
                    fontSize="md"
                    fontFamily="regular"
                    color="lightTextColor">
                    {roleText}
                </CustomText>
            </View>
            <View paddingH-8 paddingT-8 flex-1>
                <View marginB-8>
                    <View row style={{ alignItems: 'center' }}>
                        <CustomText
                            fontSize="xl"
                            fontFamily="bold"
                            color="primaryColor">
                            Email
                        </CustomText>
                        <View marginL-5>
                            {isVerified ? (
                                <CircleCheckIcon />
                            ) : (
                                <CircleInactiveIcon />
                            )}
                        </View>
                    </View>
                    <CustomText
                        fontSize="md"
                        fontFamily="regular"
                        color="darkTextColor">
                        {email}
                    </CustomText>
                </View>
                <View marginB-8>
                    <View row style={{ alignItems: 'center' }}>
                        <CustomText
                            fontSize="xl"
                            fontFamily="bold"
                            color="primaryColor">
                            {t('phoneNumber')}
                        </CustomText>
                        <View marginL-5>
                            {isPhoneVerified ? (
                                <CircleCheckIcon />
                            ) : (
                                <CircleInactiveIcon />
                            )}
                        </View>
                    </View>
                    <CustomText
                        fontSize="md"
                        fontFamily="regular"
                        color="darkTextColor">
                        {phoneNumber ? phoneNumber : t('phoneNumberNotSubmit')}
                    </CustomText>
                </View>
                {renterId?.company || shipOwnerId?.company ? (
                    <>
                        <View marginB-8>
                            <CustomText
                                fontSize="xl"
                                fontFamily="bold"
                                color="primaryColor">
                                {t('companyName')}
                            </CustomText>
                            <CustomText
                                fontSize="md"
                                fontFamily="regular"
                                color="darkTextColor">
                                {shipOwnerId?.company.name ||
                                    renterId?.company.name}
                            </CustomText>
                        </View>
                        <View marginB-8>
                            <CustomText
                                fontSize="xl"
                                fontFamily="bold"
                                color="primaryColor">
                                {t('companyAddress')}
                            </CustomText>
                            <CustomText
                                fontSize="md"
                                fontFamily="regular"
                                color="darkTextColor">
                                {shipOwnerId?.company.address ||
                                    renterId?.company.address}
                            </CustomText>
                        </View>
                    </>
                ) : (
                    <View></View>
                )}
            </View>
            <ModalConfirmation
                visible={visible}
                onClose={handleShowModal}
                onSubmit={updateActivation}
                isSubmitting={isSubmitting}
                activeStatus={active}
            />
            <ModalConfirmation
                visible={isVerifyPhoneModal}
                onClose={handleVerifyPhoneModal}
                onSubmit={verifyUserPhoneNumber}
                isSubmitting={isVerifyPhoneLoading}
                activeStatus={active}
                customButtonText={t('verify')}
                customBodyText={t('verifyPhoneConfirmation')}
            />
        </ScreenLayout>
    );
};

export default UserDetail;
