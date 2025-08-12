import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Badge, View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { Color, PlusIcon } from '../../../../../configs';
import {
    useActiveDynamicInputOwner,
    useGetDynamicInputRFQOwnerById,
} from '../../../../../hooks';
import {
    DynamicInputRFQData,
    RFQFormInputViewProps,
} from '../../../../../types';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { DetailInputSheet, ConfirmModal } from './components';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';

import { useTranslation } from 'react-i18next';

const RFQFormInputView: React.FC<RFQFormInputViewProps> = ({
    navigation,
    route,
}) => {
    const { _id, category, shipId } = route.params;
    const { width } = useWindowDimensions();
    const sheetRef = React.useRef<BottomSheet>();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { t } = useTranslation('rfq');
    const mutationGetDynamicInputById = useGetDynamicInputRFQOwnerById();
    const mutationActiveDynamicInput = useActiveDynamicInputOwner();
    const [itemDetail, setItemDetail] = React.useState<DynamicInputRFQData[]>();
    const [dynamicInputData, setDynamicInputData] = React.useState<
        DynamicInputRFQData[]
    >([]);
    const [templateTypes, setTemplateTypes] = React.useState('');
    const [showConfirmationModal, setShowConfirmationModal] =
        React.useState(false);
    const [selectedDynamicInputId, setSelectedDynamicInputId] =
        React.useState(null);

    React.useEffect(() => {
        mutationGetDynamicInputById.mutate(_id, {
            onSuccess: resp => {
                setDynamicInputData(resp.data.data.dynamicForms);
                setTemplateTypes(resp.data.data.templateType);
            },
            onError: err => {
                console.log(err);
            },
        });
    }, []);

    React.useEffect(() => {
        if (isFocused) {
            mutationGetDynamicInputById.mutate(_id, {
                onSuccess: resp => {
                    setDynamicInputData(resp.data.data.dynamicForms);
                    setTemplateTypes(resp.data.data.templateType);
                },
                onError: err => {
                    console.log(err);
                },
            });
        }
    }, [isFocused]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if (
                    templateTypes !== 'defaultRfq' &&
                    templateTypes !== `${category}Rfq`
                ) {
                    // Show the button only for default dynamic forms
                    return (
                        <Pressable
                            testID="add-input-btn"
                            onPress={() =>
                                navigation.navigate('RFQInputFormOwnerDetail', {
                                    shipId,
                                    templateType: templateTypes,
                                    formType: category,
                                })
                            }>
                            <PlusIcon />
                        </Pressable>
                    );
                } else {
                    // For other dynamic forms, you can choose not to show the button
                    return null;
                }
            },
        });
    }, [templateTypes]);

    const handleConfirmDeactivation = () => {
        if (!selectedDynamicInputId) {
            // Handle the case where selectedDynamicInputId is not set
            console.error('Selected dynamic input ID is not set.');
            return;
        }
        mutationActiveDynamicInput.mutate(
            {
                _id: selectedDynamicInputId,
            },
            {
                onSuccess: resp => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('RFQFormInputView.successText'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    mutationGetDynamicInputById.mutate(_id, {
                        onSuccess: resp => {
                            setDynamicInputData(resp.data.data.dynamicForms);
                        },
                        onError: err => {
                            console.log(err);
                        },
                    });
                },
                onError: err => {
                    console.log(err);
                },
            },
        );
        // Close the confirmation modal
        setShowConfirmationModal(false);
    };

    const handleCancelDeactivation = () => {
        // Close the confirmation modal
        setShowConfirmationModal(false);
    };

    const getConfirmationMessage = active => {
        return active
            ? t('RFQFormInputView.modalDeactivate')
            : t('RFQFormInputView.modalActivate');
    };

    const renderItem = ({ item, index }) => {
        const isEditable =
            item.dynamicInput.templateType === 'defaultRfq' ||
            item.dynamicInput.templateType === `${category}Rfq`;
        const isActivable =
            item.dynamicInput.templateType === 'defaultRfq' ||
            item.dynamicInput.templateType === `${category}Rfq`;

        const activateDynamicInput = id => {
            setSelectedDynamicInputId(item.dynamicInput._id);
            setShowConfirmationModal(true);
        };
        return (
            <View
                row
                style={{
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                }}>
                <Pressable
                    testID={`detail-item-${index}`}
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
                            {item.required ? (
                                <Badge
                                    label={t('RFQFormInputView.labelRequired')}
                                    borderRadius={3}
                                    backgroundColor={Color.errorColor}
                                    size={16}
                                />
                            ) : (
                                <View />
                            )}
                        </View>
                    </View>
                </Pressable>
                <View
                    row
                    style={{
                        alignItems: 'center',
                    }}>
                    {!isEditable && (
                        <View marginR-5>
                            <Button
                                title={t('RFQFormInputView.textButtonEdit')}
                                color="success"
                                onSubmit={() =>
                                    navigation.navigate(
                                        'EditRFQInputFormOwner',
                                        {
                                            _id: item.dynamicInput._id,
                                            templateType:
                                                item.dynamicInput.templateType,
                                            formType:
                                                item.dynamicInput.formType,
                                        },
                                    )
                                }
                            />
                        </View>
                    )}
                    {!isActivable && (
                        <View marginR-5>
                            {item.dynamicInput.active ? (
                                <Button
                                    testID={`btn-deactive-${index}`}
                                    title={t(
                                        'RFQFormInputView.textButtonDeactivate',
                                    )}
                                    color="error"
                                    onSubmit={() =>
                                        activateDynamicInput(item._id)
                                    }
                                />
                            ) : (
                                <Button
                                    testID={`btn-active-${index}`}
                                    title={t(
                                        'RFQFormInputView.textButtonActive',
                                    )}
                                    color="primary"
                                    onSubmit={() =>
                                        activateDynamicInput(item._id)
                                    }
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }} testID="RFQFormInputViewScreen">
            {dynamicInputData && dynamicInputData.length === 0 ? (
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
                                    data={dynamicInputData}
                                    renderItem={renderItem}
                                    keyExtractor={item => item._id}
                                    onEndReachedThreshold={0.1}
                                />
                            </>
                        </View>
                    )}
                />
            )}

            <DetailInputSheet bottomRef={sheetRef} itemDetail={itemDetail} />
            <ConfirmModal
                isVisible={showConfirmationModal}
                onConfirm={handleConfirmDeactivation}
                onCancel={handleCancelDeactivation}
                confirmationMessage={getConfirmationMessage(
                    dynamicInputData &&
                        selectedDynamicInputId &&
                        dynamicInputData.find(
                            item => item._id === selectedDynamicInputId,
                        )?.active,
                )}
            />
        </View>
    );
};

export default RFQFormInputView;
