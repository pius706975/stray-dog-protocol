import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Badge, View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { createTemplateDefaultRFQForm } from '../../../../../hooks';
import {
    DynamicInputRFQData,
    RFQFormInputManagementOwnerProps,
} from '../../../../../types';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { DetailInputSheet } from './components';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../../slices';
import CustomButton from '../../../../../components/Button';
import { handleAxiosError } from '../../../../../utils';
import { useTranslation } from 'react-i18next';

const RFQFormInputManagement: React.FC<RFQFormInputManagementOwnerProps> = ({
    navigation,
    route,
}) => {
    const { dynamicForms, shipId, templateType } = route.params;
    const { width } = useWindowDimensions();
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const dispatch = useDispatch();
    const sheetRef = React.useRef<BottomSheet>();
    const mutationAddDynamicFormRFQ = createTemplateDefaultRFQForm();
    const [itemDetail, setItemDetail] = React.useState<DynamicInputRFQData>();
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
    console.log(dynamicForms);
    const submitDynamic = () => {
        setIsButtonDisabled(true);
        dispatch(showProgressIndicator());
        mutationAddDynamicFormRFQ.mutate(
            {
                request: { templateType },
                shipId,
            },
            {
                onSuccess: () => {
                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Successfully added dynamic form.',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                        setIsButtonDisabled(false);
                    }, 4000);
                    navigation.navigate('ShipOwnerHome');
                },
                onError: err => {
                    setIsButtonDisabled(false);
                    dispatch(hideProgressIndicator());
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Failed to add dynamic form.',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 2000);
                    console.log('err', err);
                    handleAxiosError(err);
                },
            },
        );
    };
    const { t } = useTranslation('rfq');

    const renderItem = ({ item }) => {
        return (
            <View
                row
                style={{
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                }}>
                <Pressable
                    style={{
                        paddingVertical: 14,
                        borderColor: Color.primaryColor,
                        padding: 10,
                        flexDirection: 'row',
                        gap: width / 24,
                    }}
                    onPress={() => {
                        sheetRef.current?.expand();
                        setItemDetail(item);
                        console.log('itemDetail', itemDetail);
                    }}>
                    <View>
                        <CustomText
                            fontSize="xs"
                            fontFamily="semiBold"
                            color="darkTextColor">
                            {item.dynamicInput.label}
                        </CustomText>

                        <CustomText
                            fontSize="xs"
                            lineHeight={20}
                            fontFamily="regular"
                            color="darkTextColor">
                            {item.dynamicInput.inputType
                                .split(/(?=[A-Z])/)
                                .map(
                                    word =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1),
                                )
                                .join(' ')}
                        </CustomText>
                        <View row>
                            <Badge
                                label={t('RFQFormInputView.labelRequired')}
                                borderRadius={4}
                                backgroundColor={Color.errorColor}
                                size={16}
                            />
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {!dynamicForms || dynamicForms.length === 0 ? (
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
                         {t('RFQFormInputView.dynamicInputNotAvailable')}
                    </CustomText>
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1 }}
                    data={['']}
                    keyExtractor={() => 'dummyKey'}
                    showsVerticalScrollIndicator={false}
                    renderItem={() => (
                        <View
                            style={{
                                margin: 6,
                                borderRadius: 8,
                                height: '100%',
                            }}>
                            <>
                                <FlatList
                                    ItemSeparatorComponent={() => <View />}
                                    data={dynamicForms}
                                    renderItem={renderItem}
                                    keyExtractor={item => item._id}
                                    onEndReachedThreshold={0.1}
                                />
                            </>
                        </View>
                    )}
                />
            )}

            {dynamicForms && dynamicForms.length > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 30,
                    }}>
                    <CustomButton
                        testID="btn-submit"
                        title={t('RFQDynamicForm.DoneText')}
                        color="success"
                        onSubmit={submitDynamic}
                        disabled={isButtonDisabled}
                    />
                </View>
            )}

            <DetailInputSheet bottomRef={sheetRef} itemDetail={itemDetail} />
        </View>
    );
};

export default RFQFormInputManagement;
