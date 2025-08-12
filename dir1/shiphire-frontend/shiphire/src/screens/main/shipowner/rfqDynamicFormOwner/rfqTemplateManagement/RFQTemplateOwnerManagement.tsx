import React from 'react';
import { Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import {
    DynamicFormRFQ,
    RFQTemplateManagementOwnerProps,
} from '../../../../../types';
import {
    createTemplateCustomRFQForm,
    useGetTemplateRfqShipFormByShipCategory,
} from '../../../../../hooks';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../../slices';
import { handleAxiosError } from '../../../../../utils';
import { useTranslation } from 'react-i18next';

const RFQTemplateOwnerManagement: React.FC<RFQTemplateManagementOwnerProps> = ({
    navigation,
    route,
}) => {
    const { shipCategory, shipId } = route.params;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const mutationGetTemplateShipRFQForm =
        useGetTemplateRfqShipFormByShipCategory();
    const [dynamicFormData, setDynamicFormData] = React.useState<
        DynamicFormRFQ | undefined
    >();
    const mutationCreateTemplateCustomRFQ = createTemplateCustomRFQForm();
    const { t } = useTranslation('rfq');
    const isFocused = useIsFocused();
    React.useEffect(() => {
        isFocused &&
            mutationGetTemplateShipRFQForm.mutate(shipCategory, {
                onSuccess: resp => {
                    setDynamicFormData(resp.data.data);
                },
                onError: err => {
                    console.log(err);
                },
            });
    }, [isFocused]);

    const customRFQ = () => {
        dispatch(showProgressIndicator());

        mutationCreateTemplateCustomRFQ.mutate(
            { shipId },
            {
                onSuccess: () => {
                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('RFQDynamicForm.SuccessCreatedCustomRFQ'),
                        }),
                    );

                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 3000);

                    navigation.navigate('RFQFormInputCustomManagementOwner', {
                        shipId: shipId,
                        formType: dynamicFormData?.formType,
                        templateType: dynamicFormData?.templateType,
                    });
                },
                onError: err => {
                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Add RFQ Template Failed/Duplicate Template',
                        }),
                    );

                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 2000);
                    handleAxiosError(err);
                },
            },
        );
    };
    console.log(dynamicFormData);

    return (
        <View style={{ flex: 1 }}>
            {dynamicFormData ? (
                <View
                    style={{
                        padding: 10,
                    }}>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('RFQFormInputManagementOwner', {
                                dynamicForms: dynamicFormData?.dynamicForms,
                                shipId: shipId,
                                templateType: dynamicFormData?.templateType,
                            });
                        }}>
                        <View
                            style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: Color.darkTextColor,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                            }}>
                            <CustomText
                                fontFamily="regular"
                                fontSize="lg"
                                color="darkTextColor">
                                {dynamicFormData && shipCategory}{' '}
                                {t('RFQDynamicForm.DefaultRFQTemplatesText')}
                            </CustomText>
                        </View>
                    </Pressable>
                    <Pressable testID="custom-rfq" onPress={customRFQ}>
                        <View
                            style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: Color.darkTextColor,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                            }}>
                            <CustomText
                                fontFamily="regular"
                                fontSize="lg"
                                color="darkTextColor">
                                {t('RFQDynamicForm.CustomRFQTemplatesText')}
                            </CustomText>
                        </View>
                    </Pressable>
                </View>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <CustomText
                        color="darkTextColor"
                        fontSize="lg"
                        fontFamily="regular">
                        {t('RFQDynamicForm.EmptyRFQTemplatesText')}
                    </CustomText>
                </View>
            )}
        </View>
    );
};

export default RFQTemplateOwnerManagement;
