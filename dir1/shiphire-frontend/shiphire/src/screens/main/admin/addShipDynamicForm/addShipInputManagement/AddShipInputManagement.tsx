import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import React from 'react';
import { FlatList, Pressable, useWindowDimensions } from 'react-native';
import { Badge, View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import {
    CheckIcon,
    Color,
    DraggableList,
    PlusIcon,
} from '../../../../../configs';
import {
    AddShipDynamicInput,
    AddShipInputManagementProps,
} from '../../../../../types';
import { DetailInputSheet, ModalConfirmation } from './components';
import {
    useGetAddShipDynamicInputByTemplateName,
    useUpdateDynamicInputAddShipActivation,
    useUpdateDynamicInputAddShipOrder,
} from '../../../../../hooks';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';
import { handleAxiosError } from '../../../../../utils';
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from 'react-native-draggable-flatlist';

const AddShipInputManagement: React.FC<AddShipInputManagementProps> = ({
    navigation,
    route,
}) => {
    const { templateType } = route.params;
    const { width } = useWindowDimensions();
    const sheetRef = React.useRef<BottomSheet>();
    const [itemDetail, setItemDetail] = React.useState<AddShipDynamicInput>();
    const mutationGetAddShipDynamicInputByTemplateName =
        useGetAddShipDynamicInputByTemplateName();
    const [dynamicInputList, setDynamicInputList] = React.useState<
        AddShipDynamicInput[]
    >([]);
    const isFocused = useIsFocused();
    const [visible, setVisible] = React.useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [isSubmittingOrder, setIsSubmittingOrder] =
        React.useState<boolean>(false);
    const mutationUpdateDynamicInputAddShipActivation =
        useUpdateDynamicInputAddShipActivation();
    const mutationUpdateDynamicInputAddShipOrder =
        useUpdateDynamicInputAddShipOrder();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [rearrange, setRearrange] = React.useState<boolean>(false);

    const fetchData = () => {
        mutationGetAddShipDynamicInputByTemplateName.mutate(
            { templateType },
            {
                onSuccess: resp => {
                    setDynamicInputList(resp.data.data);
                },
                onError: err => {
                    console.log(err);
                },
            },
        );
    };

    React.useEffect(() => {
        isFocused && fetchData();
    }, [isFocused]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    testID="addShipButton"
                    onPress={() =>
                        navigation.navigate('AddShipInputForm', {
                            templateType,
                        })
                    }>
                    <PlusIcon />
                </Pressable>
            ),
        });
    });

    const updateOrder = () => {
        setIsSubmittingOrder(true);
        const payload = dynamicInputList.map((item, index) => {
            return {
                _id: item._id,
                order: index + 1,
            };
        });
        mutationUpdateDynamicInputAddShipOrder.mutate(
            { data: payload },
            {
                onSuccess: resp => {
                    setIsSubmittingOrder(false);

                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Update order successfully',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    setRearrange(false);
                },
                onError: err => {
                    setIsSubmittingOrder(false);

                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Cannot Update Order',
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

    const updateActivation = () => {
        const payload = {
            id: itemDetail?._id,
            isActive: !itemDetail?.active,
        };

        mutationUpdateDynamicInputAddShipActivation.mutate(payload, {
            onSuccess: resp => {
                setIsSubmitting(false);
                setVisible(!visible);

                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Update activation successfully',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);

                const updatedItems = dynamicInputList?.map(item =>
                    item._id === itemDetail?._id
                        ? { ...item, active: !itemDetail.active }
                        : item,
                );
                setDynamicInputList(updatedItems);
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'Cannot Update activation',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                handleAxiosError(err);
            },
        });
    };

    const renderAddShipInputDraggable = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<AddShipDynamicInput>) => {
        return (
            <ScaleDecorator>
                <View
                    row
                    style={{
                        justifyContent: 'space-between',
                        borderBottomWidth: 0.5,
                        width: '100%',
                    }}>
                    <Pressable
                        style={{
                            paddingVertical: 14,
                            borderColor: Color.primaryColor,
                            padding: 10,
                            flexDirection: 'row',
                            gap: width / 24,
                            width: '100%',
                        }}
                        onLongPress={drag}
                        disabled={isActive}>
                        <View style={{ justifyContent: 'center' }}>
                            <DraggableList />
                        </View>
                        <View>
                            <CustomText
                                fontSize="md"
                                fontFamily="bold"
                                color="darkTextColor">
                                {item.label}
                            </CustomText>

                            <CustomText
                                fontSize="sm"
                                lineHeight={20}
                                fontFamily="regular"
                                color="darkTextColor">
                                {item.inputType}
                            </CustomText>
                            <View row>
                                <Badge
                                    marginR-10
                                    label={
                                        item.active ? 'active' : 'not active'
                                    }
                                    borderRadius={3}
                                    backgroundColor={
                                        item.active
                                            ? Color.primaryColor
                                            : Color.neutralColor
                                    }
                                    size={16}
                                />
                                {item.required && (
                                    <Badge
                                        label="Required"
                                        borderRadius={3}
                                        backgroundColor={Color.errorColor}
                                        size={16}
                                    />
                                )}
                            </View>
                        </View>
                    </Pressable>
                </View>
            </ScaleDecorator>
        );
    };

    const renderAddShipInput = ({ item, index }) => {
        return (
            <View
                row
                style={{
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                    flexWrap: 'wrap',
                }}>
                <Pressable
                    testID={`renderItem-${index}`}
                    style={{
                        paddingVertical: 14,

                        borderColor: Color.primaryColor,
                        padding: 10,
                        flexDirection: 'row',
                        flex: 1,
                    }}
                    onPress={() => {
                        sheetRef.current?.expand();
                        setItemDetail(item);
                    }}>
                    <View>
                        <CustomText
                            fontSize="md"
                            fontFamily="bold"
                            color="darkTextColor">
                            {item.label}
                        </CustomText>

                        <CustomText
                            fontSize="sm"
                            lineHeight={20}
                            fontFamily="regular"
                            color="darkTextColor">
                            {item.inputType}
                        </CustomText>
                        <View row>
                            <Badge
                                marginR-10
                                label={item.active ? 'active' : 'not active'}
                                borderRadius={3}
                                backgroundColor={
                                    item.active
                                        ? Color.primaryColor
                                        : Color.neutralColor
                                }
                                size={16}
                            />
                            {item.required && (
                                <Badge
                                    label="Required"
                                    borderRadius={3}
                                    backgroundColor={Color.errorColor}
                                    size={16}
                                />
                            )}
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
                            title="edit"
                            color="success"
                            onSubmit={() => {
                                navigation.navigate('AddShipInputEditForm', {
                                    inputData: item,
                                });
                            }}
                        />
                    </View>
                    <View marginR-8>
                        {item.label !== 'Ship Category' && (
                            <Button
                                testID={`btn-active-${index}`}
                                title={item.active ? 'deactive' : 'activate'}
                                color={item.active ? 'error' : 'primary'}
                                onSubmit={() => {
                                    setItemDetail(item);
                                    setVisible(!visible);
                                }}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };
    return (
        <View testID="addshipinputmanagement">
            <FlatList
                style={{ width: '100%', height: '100%' }}
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
                        {rearrange ? (
                            <Button
                                testID="btn-save-order"
                                title={'Save Order'}
                                color="success"
                                isSubmitting={isSubmittingOrder}
                                leftIcon={<CheckIcon />}
                                onSubmit={() => updateOrder()}
                            />
                        ) : dynamicInputList.length > 0 ? (
                            <View row style={{ justifyContent: 'flex-end' }}>
                                <View>
                                    <Button
                                        testID="edit-input-order"
                                        title="Edit Input Order"
                                        color="warning"
                                        onSubmit={() => setRearrange(true)}
                                    />
                                </View>
                            </View>
                        ) : null}
                        <>
                            {rearrange ? (
                                <>
                                    <DraggableFlatList
                                        data={dynamicInputList}
                                        onDragEnd={({ data, from, to }) => {
                                            setDynamicInputList(data);
                                        }}
                                        keyExtractor={item => item._id}
                                        renderItem={renderAddShipInputDraggable}
                                    />
                                </>
                            ) : (
                                <FlatList
                                    ItemSeparatorComponent={() => <View />}
                                    data={dynamicInputList}
                                    renderItem={renderAddShipInput}
                                    keyExtractor={item => item._id}
                                    onEndReachedThreshold={0.1}
                                />
                            )}
                        </>
                    </View>
                )}
            />
            <DetailInputSheet bottomRef={sheetRef} itemDetail={itemDetail} />
            <ModalConfirmation
                visible={visible}
                onClose={() => setVisible(!visible)}
                onSubmit={updateActivation}
                isSubmitting={isSubmitting}
                activeStatus={itemDetail?.active}
            />
        </View>
    );
};

export default AddShipInputManagement;
