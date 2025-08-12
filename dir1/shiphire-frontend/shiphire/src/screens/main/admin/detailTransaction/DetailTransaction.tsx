import React from 'react';
import { Button, CustomText, ScreenLayout } from '../../../../components';
import { Image, Platform, Pressable, useWindowDimensions } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { DetailTransactionProps } from '../../../../types';
import { Color } from '../../../../configs';
import { DetailTransactionField, DocumentField } from './components';
import moment from 'moment';
import { getAdminStatusText } from '../../../../utils';

const DetailTransaction: React.FC<DetailTransactionProps> = ({
    navigation,
    route,
}) => {
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const { width } = useWindowDimensions();
    const { transactionData } = route.params;
    const statusText = getAdminStatusText(
        transactionData.status[transactionData.status.length - 1].name,
    );
    const humanizedTimeStamp = moment(transactionData.updatedAt).format(
        'D MMMM YYYY, h:mm A',
    );

    const openPdfRFQ = () => {
        navigation.navigate('AdminDocumentPreview', {
            documentUrl: transactionData.rfq.rfqUrl,
            isButtonActive: false,
            shipId: transactionData.ship._id,
            documentName: 'RFQ Document',
        });
    };

    const openPdfProposal = () => {
        navigation.navigate('AdminDocumentPreview', {
            documentUrl:
                transactionData.proposal[transactionData.proposal.length - 1]
                    .proposalUrl,
            isButtonActive: false,
            shipId: transactionData.ship._id,
            documentName: 'Proposal Document',
        });
    };

    const openPdfContract = () => {
        navigation.navigate('AdminDocumentPreview', {
            documentUrl: transactionData.contract.contractUrl,
            isButtonActive: false,
            shipId: transactionData.ship._id,
            documentName: 'Contract Document',
        });
    };
    // console.log(transactionData);

    return (
        <ScreenLayout
            backgroundColor="light"
            testId="adminHomeScreen"
            marginB={40}
            paddingV={plusPaddingV}>
            <View
                style={{
                    backgroundColor: Color.primaryColor,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    marginHorizontal: 12,
                }}>
                <View row flex style={{ alignContent: 'space-between' }}>
                    <View
                        center
                        style={{
                            borderWidth: 1,
                            minWidth: width / 3,
                            backgroundColor: Color.boldWarningColor,
                            borderTopStartRadius: 10,
                            borderBottomEndRadius: 10,
                        }}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor">
                            {statusText}{' '}
                        </CustomText>
                    </View>
                    <View flex paddingR-8>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor"
                            textAlign="right">
                            {transactionData.ownerDetails?.company?.name}
                        </CustomText>
                    </View>
                </View>
                <View row>
                    <Image
                        source={{
                            uri: transactionData.ship.imageUrl,
                        }}
                        style={{
                            width: 80,
                            height: 80,
                            margin: 12,
                            borderRadius: 12,
                        }}
                    />
                    <View style={{ justifyContent: 'center' }}>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                Ship Name
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                Rental ID
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                Total Rental
                            </CustomText>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            paddingStart: 4,
                        }}>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                : {transactionData.ship.name}
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                : {transactionData.rentalId}
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                : Rp. {transactionData.offeredPrice}
                            </CustomText>
                        </View>
                    </View>
                </View>
                <View
                    row
                    style={{
                        marginHorizontal: 8,
                        marginBottom: 8,
                    }}>
                    <View flex style={{ justifyContent: 'center' }}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor">
                            {humanizedTimeStamp}
                        </CustomText>
                    </View>
                </View>
            </View>
            <View
                style={{
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    padding: 12,
                    marginHorizontal: 12,
                    borderWidth: 1,
                    backgroundColor: 'white',
                }}>
                <CustomText
                    fontSize="xl"
                    fontFamily="medium"
                    color="darkTextColor">
                    Transaction Details
                </CustomText>

                <DetailTransactionField
                    label="Needs"
                    textData={transactionData.needs}
                />

                <DetailTransactionField
                    label="Rental Duration"
                    textData={`${transactionData.rentalDuration} days`}
                />

                <DetailTransactionField
                    label="Rental Start Date"
                    textData={transactionData.rentalStartDate.toString()}
                />

                <DetailTransactionField
                    label="Rental End Date"
                    textData={transactionData.rentalEndDate.toString()}
                />

                <DetailTransactionField
                    label="Deport Location"
                    textData={transactionData.locationDeparture}
                />

                <DetailTransactionField
                    label="Destination Location"
                    textData={transactionData.locationDestination}
                />

                {transactionData.rfq !== undefined &&
                transactionData.rfq.rfqUrl ? (
                    <DocumentField
                        label="RFQ"
                        navigateFunc={() => openPdfRFQ()}
                        proposeDate={transactionData.status[0].date}
                        acceptDate={
                            transactionData.status[1] !== undefined
                                ? transactionData.status[1].date
                                : 'Not Accepted Yet'
                        }
                    />
                ) : null}

                {transactionData.proposal &&
                transactionData.proposal[transactionData.proposal?.length - 1]
                    .proposalUrl ? (
                    <DocumentField
                        label="Proposal"
                        navigateFunc={() => openPdfProposal()}
                        proposeDate={transactionData.status[2].date}
                        acceptDate={
                            transactionData.status[3]?.date
                                ? transactionData.status[3]?.date
                                : 'Not Accepted Yet'
                        }
                    />
                ) : null}

                {transactionData.contract !== undefined &&
                transactionData.contract.contractUrl ? (
                    <DocumentField
                        label="Contract"
                        navigateFunc={() => openPdfContract()}
                        proposeDate={transactionData.status[4].date}
                        acceptDate={
                            transactionData.status[5].date
                                ? transactionData.status[5].date
                                : 'Not Accepted Yet'
                        }
                    />
                ) : null}
            </View>
        </ScreenLayout>
    );
};

export default DetailTransaction;
