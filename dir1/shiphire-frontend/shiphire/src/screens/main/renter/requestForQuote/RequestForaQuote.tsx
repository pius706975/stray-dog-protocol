import React from 'react';
import { useDispatch } from 'react-redux';
import { ScreenLayout } from '../../../../components';
import {
    COMPANYDATA,
    USERDATA,
    getDataFromLocalStorage,
} from '../../../../configs';
import { useGetShipById, useGetShipRFQForm } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import {
    DynamicFormType,
    RenterUserData,
    RequestForaQuoteProps,
    ShipDatas,
    UserCompanyData,
} from '../../../../types';
import { FormRFQ, PersonalInformation, ShipInformation } from './components';
import { useIsFocused } from '@react-navigation/native';

const RequestForaQuote: React.FC<RequestForaQuoteProps> = ({
    navigation,
    route,
}) => {
    const { shipId, categoryId, shipOwnerId, dynamicFormId } = route.params;
    const dispatch = useDispatch();
    const { showModal, hideModal } = modalSlice.actions;
    const mutationGetShipById = useGetShipById();
    const mutationGetShipRFQForm = useGetShipRFQForm();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const [rfqDynamicForm, setRfqDynamicForm] = React.useState<
        DynamicFormType[]
    >([]);
    const [shipData, setShipData] = React.useState<ShipDatas>();
    const [userData, setUserData] = React.useState<RenterUserData>({
        email: '',
        name: '',
        phoneNumber: '',
        imageUrl: '',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        isCompanyVerified: true,
        isCompanyRejected: true,
    });
    const [companyUserData, setCompanyUserData] =
        React.useState<UserCompanyData>({
            name: '',
            companyType: '',
            address: '',
        });

    const isFocused = useIsFocused();
    
    const handlePressEditProfile = () => {
        console.log('Button pressed!');
    };

    const showInfoModal = (message: string) => {
        dispatch(
            showModal({
                status: 'info',
                text: message,
            }),
        );

        setTimeout(() => {
            dispatch(hideModal());
        }, 5000);
    };

    React.useEffect(() => {
        if (isFocused) {
            getDataFromLocalStorage(USERDATA).then(resp => {
                setUserData(resp);
            });
            getDataFromLocalStorage(COMPANYDATA).then(resp => {
                setCompanyUserData(resp);
            });
            mutationGetShipById.mutate(shipId, {
                onSuccess: resp => {
                    setShipData(resp.data.data);
                },
            });
            mutationGetShipRFQForm.mutate(dynamicFormId, {
                onSuccess: resp => {
                    if (resp.data.data.active === false) {
                        showInfoModal(
                            "Sorry, this ship's Request for a quote has not been actived by the admin yet, this form will be available soon",
                        );
                        navigation.goBack();
                    }
                    setRfqDynamicForm(resp.data.data.dynamicForms);
                },
            });
            dispatch(showProgressIndicator());
        }
    }, [isFocused]);

    mutationGetShipRFQForm.isSuccess &&
        setTimeout(() => {
            dispatch(hideProgressIndicator());
        }, 2000);

    return (
        <ScreenLayout
            testId="RFQScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <ShipInformation
                shipName={shipData ? shipData?.name : ''}
                shipCategory={shipData ? shipData?.category.name : ''}
                shipImageUrl={shipData ? shipData?.imageUrl : ''}
                shipSize={
                    shipData
                        ? shipData?.size
                        : { height: 0, length: 0, width: 0 }
                }
                shipCompany={
                    shipData
                        ? `${shipData?.shipOwnerId.company.companyType}. ${shipData?.shipOwnerId.company.name}`
                        : ''
                }
            />
            <PersonalInformation
                renterName={userData.name}
                renterCompany={companyUserData.name}
                renterAddress={companyUserData.address}
                renterCompanyType={companyUserData.companyType}
                renterPhone={userData.phoneNumber}
                renterEmail={userData.email}
                handlePressEditProfile={handlePressEditProfile}
            />
            <FormRFQ
                testId="FormRFQ"
                shipId={shipId}
                categoryId={categoryId}
                shipOwnerId={shipOwnerId}
                navigation={navigation}
                userData={userData}
                renterCompanyAddress={companyUserData.address}
                companyData={companyUserData}
                shipCategory={shipData ? shipData?.category.name : ''}
                shipCompany={
                    shipData
                        ? shipData?.shipOwnerId?.company
                        : { name: '', companyType: '', address: '' }
                }
                dynamicForms={rfqDynamicForm}
            />
        </ScreenLayout>
    );
};

export default RequestForaQuote;
