import React from 'react';
import { Image, Text, View } from 'react-native-ui-lib';
import {
    GetShipOwnerDataResponse,
    ShipOwnerCompanyProps,
} from '../../../../types';
import { useGetShipOwnerData } from '../../../../hooks';
import { modalSlice } from '../../../../slices';
import { useDispatch } from 'react-redux';
import { ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import { CompanyField, DocumentMenuShipOwner } from './components';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

const ShipOwnerCompany: React.FC<ShipOwnerCompanyProps> = ({ navigation }) => {
    const { t } = useTranslation('account');
    const mutationShipOwnerCompany = useGetShipOwnerData();
    const { hideModal, showModal } = modalSlice.actions;
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [shipOwnerData, setShipOwnerData] =
        React.useState<GetShipOwnerDataResponse>();

    React.useEffect(() => {
        if (isFocused) {
            mutationShipOwnerCompany.mutate(undefined, {
                onSuccess: resp => {
                    setShipOwnerData(resp.data);
                },
                onError: err => {
                    if (err.response?.status === 401) {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: 'Token expired, please re-sign in',
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                    }
                },
            });
        }
    }, [isFocused]);
    return (
        <ScreenLayout testId="ShipOwnerCompanyScreen" backgroundColor="light">
            <View
                style={{
                    margin: 6,
                    borderRadius: 8,
                    backgroundColor: Color.bgNeutralColor,
                    paddingBottom: 30,
                    paddingHorizontal: 10,
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'column',
                        paddingVertical: 30,
                    }}>
                    {shipOwnerData?.data.company.imageUrl && (
                        <View style={{ position: 'relative' }}>
                            <Image
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: 140 / 2,
                                }}
                                source={{
                                    uri: shipOwnerData?.data.company.imageUrl,
                                }}
                            />
                            {shipOwnerData?.data.company.isVerified && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 5,
                                        padding: 5,
                                        paddingHorizontal: 8,
                                        borderRadius: 50,
                                        backgroundColor: Color.successColor, // Adjust padding as needed
                                    }}>
                                    {/* Use your preferred check icon component or image here */}
                                    <Text
                                        style={{ color: Color.lightTextColor }}>
                                        ✓
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
                <CompanyField
                    shipOwnerDataLabel={t('CompanyProfile.labelCompanyName')}
                    shipOwnerDataValue={shipOwnerData?.data.company.name}
                />
                <CompanyField
                    shipOwnerDataLabel={t('CompanyProfile.labelTypeofCompany')}
                    shipOwnerDataValue={shipOwnerData?.data.company.companyType}
                />
                <CompanyField
                    shipOwnerDataLabel={t('CompanyProfile.labelCompanyAddress')}
                    shipOwnerDataValue={shipOwnerData?.data.company.address}
                />
                <CompanyField
                    shipOwnerDataLabel={t('CompanyProfile.labelBankName')}
                    shipOwnerDataValue={shipOwnerData?.data.company.bankName}
                />
                <CompanyField
                    shipOwnerDataLabel={t(
                        'CompanyProfile.labelBankAccountName',
                    )}
                    shipOwnerDataValue={
                        shipOwnerData?.data.company.bankAccountName
                    }
                />
            </View>
            <DocumentMenuShipOwner
                navigation={navigation}
                pdfUrl={
                    shipOwnerData
                        ? shipOwnerData?.data.company.documentCompany[0]
                              .documentUrl
                        : ''
                }
                documentName={
                    shipOwnerData
                        ? shipOwnerData?.data.company.documentCompany[0]
                              .documentName
                        : ''
                }
                label={t('CompanyProfile.labelDocumentBusiness')}
            />
            <DocumentMenuShipOwner
                navigation={navigation}
                pdfUrl={
                    shipOwnerData
                        ? shipOwnerData?.data.company.documentCompany[1 + 0]
                              .documentUrl
                        : ''
                }
                documentName={
                    shipOwnerData
                        ? shipOwnerData?.data.company.documentCompany[1 + 0]
                              .documentName
                        : ''
                }
                label={t('CompanyProfile.labelDocumentDeed')}
            />
        </ScreenLayout>
    );
};

export default ShipOwnerCompany;
