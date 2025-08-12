import React from 'react';
import { ScreenLayout } from '../../../../components';
import { useGetShipById } from '../../../../hooks';
import {
    useGetRenterDataByOwner,
    useGetRenterUserData,
} from '../../../../hooks/useShipOwner';
import {
    ProposalOwnerProps,
    RenterData,
    RenterUserData,
    ShipDatas,
    ShipOwnerCompanyData,
    ShipOwnerUserData,
} from '../../../../types';
import {
    FormProposalOwner,
    RenterInformation,
    ShipInformation,
} from './components';
import {
    COMPANYDATA,
    USERDATA,
    getDataFromLocalStorage,
} from '../../../../configs';
import { useIsFocused } from '@react-navigation/native';

const ProposalOwner: React.FC<ProposalOwnerProps> = ({ route, navigation }) => {
    const {
        shipId,
        categoryId,
        shipOwnerId,
        renterId,
        rentalId,
        rentalDuration,
        rentalStartDate,
        rentalEndDate,
    } = route.params;
    const mutationGetShipById = useGetShipById();
    const mutationGetRenterData = useGetRenterDataByOwner();
    const mutationGetRenterUserData = useGetRenterUserData();
    const isFocused = useIsFocused();
    const [shipData, setShipData] = React.useState<ShipDatas>();
    const [renterData, setRenterData] = React.useState<RenterData>({
        _id: '',
        userId: {
            _id: '',
            name: '',
            email: '',
            phoneNumber: '',
            isVerified: false,
            isPhoneVerified: false,
            isCompanySubmitted: false,
            imageUrl: '',
        },
        renterPreference: [],
        name: '',
        company: {
            name: '',
            companyType: '',
            address: '',
            documentCompany: [
                {
                    documentName: '',
                    documentUrl: '',
                },
            ],
            isVerified: false,
            isRejected: false,
            imageUrl: '',
        },
        shipReminded: [],
    });
    const [renterUserData, setRenterUserData] = React.useState<RenterUserData>({
        name: '',
        email: '',
        phoneNumber: '',
        imageUrl: '',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        isCompanyRejected: false,
        isCompanyVerified: true,
    });
    const [shipOwnerUserData, setShipOwnerUserData] =
        React.useState<ShipOwnerUserData>({
            email: '',
            name: '',
            phone: '',
            isVerified: true,
            isCompanySubmitted: true,
        });
    const [shipOwnerCompanyData, setShipOwnerCompanyData] =
        React.useState<ShipOwnerCompanyData>({
            name: '',
            companyType: '',
            address: '',
            bankName: '',
            bankAccountName: '',
            bankAccountNumber: 0,
        });

    React.useEffect(() => {
        if (isFocused) {
            getDataFromLocalStorage(USERDATA).then(resp => {
                setShipOwnerUserData(resp);
            });
            getDataFromLocalStorage(COMPANYDATA).then(resp => {
                setShipOwnerCompanyData(resp);
            });
            mutationGetRenterUserData.mutate(renterId, {
                onSuccess: resp => {
                    setRenterUserData(resp.data.data);
                },
            });

            mutationGetRenterData.mutate(renterId, {
                onSuccess: resp => {
                    setRenterData(resp.data.data);
                },
            }),
            mutationGetShipById.mutate(shipId, {
                onSuccess: resp => {
                    setShipData(resp.data.data);
                },
            });
        }
    }, [isFocused]);

    return (
        <ScreenLayout
            testId="ProposalOwnerScreen"
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
                shipDocument={shipData?.shipDocuments}
                priceperMonth={shipData?.pricePerMonth}
            />
            <RenterInformation
                renterName={renterData?.name}
                renterCompany={renterData.company.name}
                renterAddress={renterData.company.address}
            />
            {shipData && (
                <FormProposalOwner
                    shipId={shipId}
                    shipName={shipData ? shipData?.name : ''}
                    shipCategory={shipData ? shipData?.category.name : ''}
                    categoryId={categoryId}
                    navigation={navigation}
                    shipOwnerId={shipOwnerId}
                    renterData={renterData}
                    renterUserData={renterUserData}
                    shipOwnerUserData={shipOwnerUserData}
                    shipOwnerCompanyData={shipOwnerCompanyData}
                    rentalDuration={rentalDuration}
                    rentalStartDate={rentalStartDate}
                    rentalEndDate={rentalEndDate}
                    renterId={renterId}
                    rentalId={rentalId}
                    offeredPrice={shipData?.pricePerMonth}
                />
            )}
        </ScreenLayout>
    );
};
export default ProposalOwner;
