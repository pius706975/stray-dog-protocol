import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-native';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import CustomButton from '../../../../../components/Button';
import { Color } from '../../../../../configs';
import { ModalConfirmationProps } from '../../../../../types';

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
    visible,
    onClose,
    onSubmit,
    isSubmitting,
    activeStatus,
    customButtonText,
    customBodyText,
}) => {
    const { t } = useTranslation('usermanagement');

    const confirmButtonText =
        customButtonText || (activeStatus ? t('deactive') : t('activate'));
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View
                flex-1
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                <View
                    style={{
                        backgroundColor: Color.bgColor,
                        padding: 16,
                        borderRadius: 8,
                        width: '83%',
                    }}>
                    <CustomText
                        fontSize="md"
                        textAlign="center"
                        fontFamily="regular"
                        color="darkTextColor">
                        {customBodyText || t('updateConfirmation')}
                    </CustomText>
                    <View
                        marginT-20
                        row
                        style={{
                            justifyContent: 'space-evenly',
                            alignContent: 'center',
                            height: 40,
                        }}>
                        <CustomButton
                            title={t('cancel')}
                            onSubmit={onClose}
                            color="warning"
                            disable={isSubmitting ? true : false}
                        />
                        <CustomButton
                            testID="update-status"
                            title={confirmButtonText}
                            onSubmit={onSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

ModalConfirmation.propTypes = {};

export default ModalConfirmation;
