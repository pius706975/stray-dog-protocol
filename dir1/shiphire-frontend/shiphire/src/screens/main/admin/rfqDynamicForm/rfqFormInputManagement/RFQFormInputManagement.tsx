import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Badge, View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { Color, PlusIcon } from '../../../../../configs';
import {
    useActiveDynamicInput,
    useGetDynamicInputRFQByTemplateType,
} from '../../../../../hooks';
import {
    DynamicInputRFQData,
    RFQFormInputManagementProps,
} from '../../../../../types';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { DetailInputSheet, ConfirmModal } from './components';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';

const RFQFormInputManagement: React.FC<RFQFormInputManagementProps> = ({
    navigation,
    route,
}) => {
    const { templateType, formType } = route.params;
    const { width } = useWindowDimensions();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const sheetRef = React.useRef<BottomSheet>();
    const mutationGetDynamicInputRFQByTemplateType =
        useGetDynamicInputRFQByTemplateType();
    const mutationActiveDynamicInput = useActiveDynamicInput();
    const [itemDetail, setItemDetail] = React.useState<DynamicInputRFQData>();
    const [dynamicInputData, setDynamicInputData] =
        React.useState<DynamicInputRFQData[]>();
    const [showConfirmationModal, setShowConfirmationModal] =
        React.useState(false);
    const [selectedDynamicInputId, setSelectedDynamicInputId] =
        React.useState(null);

    React.useEffect(() => {
        mutationGetDynamicInputRFQByTemplateType.mutate(templateType, {
            onSuccess: resp => {
                setDynamicInputData(resp.data.data.dynamicForms);
                console.log(
                    'resp',
                    JSON.stringify(resp.data.data.dynamicForms, null, 2),
                );
            },
            onError: err => {
                console.log(err);
            },
        });
    }, []);

    React.useEffect(() => {
        if (isFocused) {
            mutationGetDynamicInputRFQByTemplateType.mutate(templateType, {
                onSuccess: resp => {
                    setDynamicInputData(resp.data.data.dynamicForms);
                    console.log(
                        'resp',
                        JSON.stringify(resp.data.data.dynamicForms, null, 2),
                    );
                },
                onError: err => {
                    console.log(err);
                },
            });
        }
    }, [isFocused]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={() =>
                        navigation.navigate('RFQInputForm', {
                            templateType,
                            formType,
                        })
                    }>
                    <PlusIcon />
                </Pressable>
            ),
        });
    });

    const handleConfirmDeactivation = () => {
        if (!selectedDynamicInputId) {
            // Handle the case where selectedDynamicInputId is not set
            console.error('Selected dynamic input ID is not set.');
            return;
        }
        mutationActiveDynamicInput.mutate(
            {
                id: selectedDynamicInputId,
            },
            {
                onSuccess: resp => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Update Dynamic Input Status Success',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    mutationGetDynamicInputRFQByTemplateType.mutate(
                        templateType,
                        {
                            onSuccess: resp => {
                                setDynamicInputData(
                                    resp.data.data.dynamicForms,
                                );
                            },
                            onError: err => {
                                console.log(err);
                            },
                        },
                    );
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
            ? 'Are you sure you want to deactivate?'
            : 'Are you sure you want to activate?';
    };

    const renderItem = ({ item, index }) => {
        console.log('item:', item.dynamicInput.active);

        const deactiveDynamicInput = id => {
            setSelectedDynamicInputId(item.dynamicInput._id);
            setShowConfirmationModal(true);
        };
        const activeDynamicInput = id => {
            setSelectedDynamicInputId(item.dynamicInput._id);
            setShowConfirmationModal(true);
        };
        return item.dynamicInput.templateType === templateType ? (
            <View
                row
                style={{
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                }}>
                <Pressable
                    testID={`item-detail-${index}`}
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
                            {item.dynamicInput.active ? (
                                <Badge
                                    marginR-10
                                    label="Active"
                                    borderRadius={4}
                                    backgroundColor={Color.primaryColor}
                                    size={16}
                                />
                            ) : (
                                <Badge
                                    marginR-10
                                    label="Inactive"
                                    borderRadius={4}
                                    backgroundColor={Color.darkTextColor}
                                    size={16}
                                />
                            )}
                            <View row>
                                {item.required ? (
                                    <Badge
                                        label="Required"
                                        borderRadius={4}
                                        backgroundColor={Color.errorColor}
                                        size={16}
                                    />
                                ) : (
                                    <View />
                                )}
                            </View>
                        </View>
                    </View>
                </Pressable>
                <View
                    row
                    style={{
                        alignItems: 'center',
                    }}>
                    <View marginR-5>
                        <Button
                            title="Edit"
                            color="success"
                            onSubmit={() =>
                                navigation.navigate('EditRFQInputForm', {
                                    _id: item.dynamicInput._id,
                                    templateType,
                                    formType,
                                })
                            }
                        />
                    </View>
                    <View marginR-5>
                        {item.dynamicInput.active ? (
                            <Button
                                testID="btn-deactive"
                                title="Deactive"
                                color="error"
                                onSubmit={() => deactiveDynamicInput(item._id)}
                            />
                        ) : (
                            <Button
                                testID="btn-active"
                                title="Active"
                                color="primary"
                                onSubmit={() => activeDynamicInput(item._id)}
                            />
                        )}
                    </View>
                </View>
            </View>
        ) : null;
    };

    return (
        <View style={{ flex: 1 }}>
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
                        No Dynamic Inputs available.
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
            {/* <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}>
                <Button
                    title="Dynamic Input"
                    color="primary"
                    leftIcon={<PlusIcon />}
                    onSubmit={() => {
                        navigation.navigate('RFQInputForm', {
                            templateType,
                            formType,
                        });
                    }}
                />
            </View> */}
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

export default RFQFormInputManagement;
