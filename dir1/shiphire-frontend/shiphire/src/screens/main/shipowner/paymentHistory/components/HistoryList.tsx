import React from 'react';
import moment from 'moment-timezone';
import { AdditionalImage, HistoryListProps } from '../../../../../types';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { CheckIcon, Color, OpenInNew } from '../../../../../configs';
import CustomButton from '../../../../../components/Button';
import ModalImage from './ModalImage';
import { useTranslation } from 'react-i18next';

const HistoryList: React.FC<HistoryListProps> = ({ item, index, rentType }) => {
    const userTimeZone = moment.tz.guess();
    const dateTimeFormat = moment(item.createdAt)
        .tz(userTimeZone)
        .format('DD/MM/YYYY HH:mm');
    const [selectedImage, setSelectedImage] = React.useState<AdditionalImage>({
        id: 0,
        selectedImage: { path: '' },
        imageNotes: '',
    });
    const [visibleImage, setVisibleImage] = React.useState<boolean>(false);
    const handleShowModalImage = () => {
        setVisibleImage(!visibleImage);
    };
    const { t } = useTranslation('common');
    console.log(rentType);

    return (
        <View
            testID={`payment-${index}`}
            margin-5
            padding-12
            style={{
                borderRadius: 5,
                backgroundColor: 'white',
                elevation: 5,
            }}>
            <View row marginB-5 style={{ justifyContent: 'space-between' }}>
                <View style={{ alignSelf: 'center' }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {dateTimeFormat}
                    </CustomText>
                </View>
                {/* <View padding-6 style={{ backgroundColor: Color.successColor }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="lightTextColor">
                        Approved
                    </CustomText>
                </View> */}
                {item.paymentApproved && (
                    <View
                        padding-1
                        style={{
                            backgroundColor: Color.successColor,
                            borderRadius: 50,
                        }}>
                        <CheckIcon />
                    </View>
                )}
            </View>
            <CustomText fontFamily="bold" fontSize="md" color="darkTextColor">
                {rentType === 'One Time Rent'
                    ? t('PaymentHistory.titleOTR')
                    : t('PaymentHistory.titleRFOM')}
            </CustomText>
            <CustomText
                fontFamily="regular"
                fontSize="md"
                color="darkTextColor">
                {item.paymentId}
            </CustomText>
            <View width={'45%'} marginT-10>
                <CustomButton
                    testID={`paymentImage-${0}`}
                    title={t('PaymentHistory.btnReceipt')}
                    leftIcon={<OpenInNew />}
                    onSubmit={() => {
                        handleShowModalImage();
                        setSelectedImage({
                            id: index,
                            selectedImage: {
                                path: item.receiptUrl ? item.receiptUrl : '',
                            },
                        });
                    }}
                />
            </View>
            <ModalImage
                visible={visibleImage}
                onClose={handleShowModalImage}
                selectedImage={selectedImage}
            />
        </View>
    );
};

export default HistoryList;
