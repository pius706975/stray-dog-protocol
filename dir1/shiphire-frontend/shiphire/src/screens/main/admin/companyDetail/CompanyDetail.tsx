import React from 'react';
import { CompanyDetailProps } from '../../../../types';
import { Avatar, Badge, View } from 'react-native-ui-lib';
import { Color } from '../../../../configs';
import { CustomText, ScreenLayout } from '../../../../components';
import { FlatList } from 'react-native';
import { CompanyDocumentItem } from './components';
import { ModalPdf } from '../../renter/negotiate/components';
import ModalConfirmation from './components/ModalConfirmation';
import { useApproveCompany, useRejectCompany } from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../slices';
import { handleAxiosError } from '../../../../utils';
import CustomButton from '../../../../components/Button';

type AdditionalDocument = {
    id: number;
    name: string;
    uri: string;
    type: string;
};

const CompanyDetail: React.FC<CompanyDetailProps> = ({ navigation, route }) => {
    const { companyInfo } = route.params;
    const documentName = ['Dokumen Izin Usaha', 'Dokumen NPWP'];
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const [isSubmittingApprove, setIsSubmittingApprove] =
        React.useState<boolean>(false);
    const [isSubmittingReject, setIsSubmittingReject] =
        React.useState<boolean>(false);
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };
    const handleShowModal = () => {
        setvisible(!visible);
    };
    const [verified, setVerified] = React.useState<boolean | undefined>(
        companyInfo.renterId?.company.isVerified ||
            companyInfo.shipOwnerId?.company.isVerified,
    );
    const [reject, setReject] = React.useState<boolean | undefined>(
        companyInfo.renterId?.company.isRejected ||
            companyInfo.shipOwnerId?.company.isRejected,
    );
    const mutationApproveCompany = useApproveCompany();
    const mutationRejectCompany = useRejectCompany();
    const { hideModal, showModal } = modalSlice.actions;
    const dispatch = useDispatch();

    const [visible, setvisible] = React.useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });
    const handleDocumentPress = item => {
        setSelectedDocument({
            id: item._id,
            name: item.documentName,
            uri: item.documentUrl,
            type: 'application/pdf',
        });
        handleShowModalPdf();
    };

    const updateActivation = (isRejected, isVerified) => {
        const data = {
            id: companyInfo.renterId?._id || companyInfo.shipOwnerId?._id,
            role: companyInfo.roles || companyInfo.roles,
        };
        if (isRejected) {
            setIsSubmittingReject(true);
            mutationRejectCompany.mutate(data, {
                onSuccess: resp => {
                    setIsSubmittingReject(false);
                    handleShowModal();
                    setVerified(false);
                    setReject(true);
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Reject company success',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });
        } else {
            setIsSubmittingApprove(true);
            mutationApproveCompany.mutate(
                { ...data, verified: true },
                {
                    onSuccess: resp => {
                        setIsSubmittingApprove(false);
                        handleShowModal();
                        setVerified(true);

                        dispatch(
                            showModal({
                                status: 'success',
                                text: 'Approve company success',
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
        }
    };

    return (
        <ScreenLayout backgroundColor="light" testId="companyDetail">
            <View
                paddingV-12
                paddingH-12
                paddingB-8
                style={{
                    backgroundColor: Color.primaryColor,
                    borderBottomColor: Color.primaryColor,
                    borderBottomWidth: 1,
                }}>
                {verified && (
                    <View right style={{ justifyContent: 'flex-end' }}>
                        <Badge
                            marginR-10
                            backgroundColor={Color.successColor}
                            label={'Verified'}
                            borderRadius={3}
                            // labelStyle={{ color: 'black' }}
                            size={25}
                        />
                    </View>
                )}
                {reject && (
                    <View right style={{ justifyContent: 'flex-end' }}>
                        <Badge
                            marginR-10
                            backgroundColor={Color.errorColor}
                            label={'Rejected'}
                            borderRadius={3}
                            // labelStyle={{ color: 'black' }}
                            size={25}
                        />
                    </View>
                )}
                <View center>
                    <Avatar
                        useAutoColors
                        size={100}
                        source={{
                            uri:
                                companyInfo.renterId?.company.imageUrl ||
                                companyInfo.shipOwnerId?.company.imageUrl,
                        }}
                        badgePosition="BOTTOM_RIGHT"
                        // badgeProps={badgeShow}
                    />
                    <CustomText
                        fontSize="lg"
                        fontFamily="bold"
                        color="lightTextColor">
                        {companyInfo.shipOwnerId?.company.name ||
                            companyInfo.renterId?.company.name}
                    </CustomText>
                    <CustomText
                        fontSize="md"
                        fontFamily="regular"
                        color="lightTextColor">
                        {companyInfo.shipOwnerId?.company.companyType ||
                            companyInfo.renterId?.company.companyType}
                    </CustomText>
                </View>
            </View>
            <View paddingH-8 paddingT-8 flex-1>
                <View marginB-8>
                    <View row style={{ alignItems: 'center' }}>
                        <CustomText
                            fontSize="xl"
                            fontFamily="bold"
                            color="primaryColor">
                            Pemilik perusahaan
                        </CustomText>
                    </View>
                    <CustomText
                        fontSize="md"
                        fontFamily="regular"
                        color="darkTextColor">
                        {companyInfo.shipOwnerId?.name ||
                            companyInfo.renterId?.name}
                    </CustomText>
                </View>
                <View marginB-8>
                    <View row style={{ alignItems: 'center' }}>
                        <CustomText
                            fontSize="xl"
                            fontFamily="bold"
                            color="primaryColor">
                            Alamat Perusahaan
                        </CustomText>
                    </View>
                    <CustomText
                        fontSize="md"
                        fontFamily="regular"
                        color="darkTextColor">
                        {companyInfo.shipOwnerId?.company.address ||
                            companyInfo.renterId?.company.address}
                    </CustomText>
                </View>
                <View marginB-8>
                    <View row style={{ alignItems: 'center' }}>
                        <CustomText
                            fontSize="xl"
                            fontFamily="bold"
                            color="primaryColor">
                            Dokumen perusahaan
                        </CustomText>
                    </View>
                    <View>
                        <FlatList
                            data={
                                companyInfo.renterId?.company.documentCompany ||
                                companyInfo.shipOwnerId?.company.documentCompany
                            }
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <CompanyDocumentItem
                                        index={index}
                                        label={documentName[index]}
                                        handlePress={() =>
                                            handleDocumentPress(item)
                                        }
                                    />
                                );
                            }}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
                {!verified && !reject && (
                    <View
                        flexG-1
                        marginB-30
                        style={{ justifyContent: 'flex-end' }}>
                        <CustomButton
                            testID="verifyButton"
                            title={'Verifikasi'}
                            onSubmit={handleShowModal}
                        />
                    </View>
                )}
            </View>
            <ModalPdf
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedDocument={selectedDocument}
            />
            <ModalConfirmation
                visible={visible}
                onClose={handleShowModal}
                onSubmit={(isRejected, isVerified) =>
                    updateActivation(isRejected, isVerified)
                }
                isSubmittingApprove={isSubmittingApprove}
                isSubmittingReject={isSubmittingReject}
            />
        </ScreenLayout>
    );
};

export default CompanyDetail;
