import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import { useGetRenterData } from '../../../../hooks';
import { modalSlice } from '../../../../slices';
import { CompanyProps, GetRenterDataResponse } from '../../../../types';
import { CompanyProfileField, DocumentMenu } from './components';

const Company: React.FC<CompanyProps> = ({ navigation }) => {
    const mutationCompanyProfile = useGetRenterData();
    const { hideModal, showModal } = modalSlice.actions;
    const dispatch = useDispatch();
    const { t } = useTranslation('account');
    const isFocused = useIsFocused();

    const [renterData, setRenterData] = React.useState<GetRenterDataResponse>();

    React.useEffect(() => {
        if (isFocused) {
            mutationCompanyProfile.mutate(undefined, {
                onSuccess: resp => {
                    setRenterData(resp.data);
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
        <ScreenLayout testId="CompanyScreen" backgroundColor="light" flex>
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
                    {renterData?.data.company.imageUrl && (
                        <View style={{ position: 'relative' }}>
                            <Image
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: 140 / 2,
                                }}
                                source={{
                                    uri: renterData?.data.company.imageUrl
                                        ? renterData?.data.company.imageUrl
                                        : 'https://picsum.photos/id/237/200/300',
                                }}
                            />
                            {renterData?.data.company.isVerified && (
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
                <CompanyProfileField
                    renterDataLabel={t('CompanyProfile.labelCompanyName')}
                    renterDataValue={renterData?.data.company.name}
                />
                <CompanyProfileField
                    renterDataLabel={t('CompanyProfile.labelTypeofCompany')}
                    renterDataValue={renterData?.data.company.companyType}
                />
                <CompanyProfileField
                    renterDataLabel={t('CompanyProfile.labelCompanyAddress')}
                    renterDataValue={renterData?.data.company.address}
                />
            </View>
            <DocumentMenu
                navigation={navigation}
                pdfUrl={
                    renterData
                        ? renterData?.data.company.documentCompany[0]
                              .documentUrl
                        : ''
                }
                label={t('CompanyProfile.labelDocumentBusiness')}
            />
            <DocumentMenu
                navigation={navigation}
                pdfUrl={
                    renterData
                        ? renterData?.data.company.documentCompany[1 + 0]
                              .documentUrl
                        : ''
                }
                label={t('CompanyProfile.labelDocumentTaxID')}
            />
        </ScreenLayout>
    );
};

export default Company;
