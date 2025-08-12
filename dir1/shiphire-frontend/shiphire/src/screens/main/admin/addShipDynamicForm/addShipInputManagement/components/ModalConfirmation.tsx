import { Modal } from 'react-native';
import { View } from 'react-native-ui-lib';
import { Color } from '../../../../../../configs';
import { CustomText } from '../../../../../../components';
import CustomButton from '../../../../../../components/Button';
import { useTranslation } from 'react-i18next';
import { ModalConfirmationProps } from '../../../../../../types';

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
    visible,
    onClose,
    onSubmit,
    isSubmitting,
    activeStatus,
}) => {
    const { t } = useTranslation('usermanagement');
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
                        Are you sure, you want to update this input activation ?
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
                            testID="activation-btn"
                            title={activeStatus ? t('deactive') : t('activate')}
                            onSubmit={onSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalConfirmation;
