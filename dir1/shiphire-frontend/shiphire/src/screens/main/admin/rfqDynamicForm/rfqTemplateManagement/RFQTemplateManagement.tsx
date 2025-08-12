import React from 'react';
import { Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Badge, View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { Color, PlusIcon, RightIcon } from '../../../../../configs';
import {
    DynamicFormRFQ,
    RFQTemplateManagementProps,
} from '../../../../../types';
import {
    useActiveDynamicForm,
    useGetAllTemplateRFQForm,
} from '../../../../../hooks';
import { useIsFocused } from '@react-navigation/native';
import { ConfirmModal } from '../rfqFormInputManagement/components';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';

const RFQTemplateManagement: React.FC<RFQTemplateManagementProps> = ({
    navigation,
}) => {
    const templates = [
        {
            id: '1',
            title: 'Default RFQ Form',
            templateType: 'generalRfqDefault',
            formType: 'rfqForm',
        },
        {
            id: '2',
            title: 'Default Barge RFQ Form',
            templateType: 'bargeRfqDefault',
            formType: 'rfqForm',
        },
        {
            id: '3',
            title: 'Default Ferry RFQ Form',
            templateType: 'ferryRfqDefault',
            formType: 'rfqForm',
        },
        {
            id: '4',
            title: 'Default Tugboat RFQ Form',
            templateType: 'tugboatRfqDefault',
            formType: 'rfqForm',
        },
    ];
    const isFocused = useIsFocused();
    const mutationGetAllTemplateRFQForm = useGetAllTemplateRFQForm();
    const mutationActiveDynamicFormRFQ = useActiveDynamicForm();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [showConfirmationModal, setShowConfirmationModal] =
        React.useState(false);
    const [selectedDynamicInputId, setSelectedDynamicInputId] =
        React.useState(null);
    const [dynamicFormData, setDynamicFormData] =
        React.useState<DynamicFormRFQ[]>();

    React.useEffect(() => {
        mutationGetAllTemplateRFQForm.mutate(undefined, {
            onSuccess: resp => {
                setDynamicFormData(resp.data.data);
                console.log('resp.data.data', resp.data.data);
            },
            onError: err => {
                console.log(err);
            },
        });
    }, []);

    React.useEffect(() => {
        isFocused &&
            mutationGetAllTemplateRFQForm.mutate(undefined, {
                onSuccess: resp => {
                    setDynamicFormData(resp.data.data);
                },
            });
    }, [isFocused]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    testID="btn-add-template"
                    onPress={() => navigation.navigate('AddRfqTemplate')}>
                    <PlusIcon />
                </Pressable>
            ),
        });
    });

    const handleConfirmDeactivation = () => {
        if (!selectedDynamicInputId) {
            console.error('Selected dynamic input ID is not set.');
            return;
        }

        mutationActiveDynamicFormRFQ.mutate(
            {
                id: selectedDynamicInputId,
            },
            {
                onSuccess: resp => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Update Template RFQ Form Status Success',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    mutationGetAllTemplateRFQForm.mutate(undefined, {
                        onSuccess: resp => {
                            setDynamicFormData(resp.data.data);
                        },
                    });
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Update Template RFQ Form Status Failed',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
            },
        );

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

    const renderRFQTemplate = ({ item }) => {
        const { title, templateType, formType } = item;
        const deactivateDynamicInput = id => {
            setSelectedDynamicInputId(id);
            setShowConfirmationModal(true);
        };
        const activeDynamicInput = id => {
            setSelectedDynamicInputId(id);
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
                    style={{ flex: 1 }}
                    onPress={() => {
                        navigation.navigate('RFQFormInputManagement', {
                            templateType,
                            formType,
                        });
                    }}>
                    <View
                        style={{
                            padding: 10,
                            margin: 5,
                            // flexDirection: 'row',
                            justifyContent: 'space-between',
                            // alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    padding: 5,
                                    paddingRight: 10,
                                    paddingLeft: 0,
                                }}></View>

                            <CustomText
                                fontFamily="regular"
                                fontSize="md"
                                color="darkTextColor">
                                {templateType
                                    .split(/(?=[A-Z])/)
                                    .map(
                                        word =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1),
                                    )
                                    .join(' ')}
                            </CustomText>
                        </View>
                        {/* <RightIcon /> */}
                        <View marginT-5>
                            {item.active ? (
                                <Badge
                                    marginL-10
                                    label="Active"
                                    borderRadius={4}
                                    backgroundColor={Color.primaryColor}
                                    size={16}
                                />
                            ) : (
                                <Badge
                                    marginL-10
                                    label="Inactive"
                                    borderRadius={4}
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
                        {/* <Button
                            title="Edit"
                            color="success"
                            onSubmit={() =>
                                navigation.navigate('EditRFQInputForm', {
                                    _id: item._id,
                                    templateType,
                                    formType,
                                })
                            }
                        /> */}
                    </View>
                    <View marginR-5>
                        {item.active ? (
                            <Button
                                testID="btn-confirm-deactive"
                                title="Deactive"
                                color="error"
                                onSubmit={() =>
                                    deactivateDynamicInput(item._id)
                                }
                            />
                        ) : (
                            <Button
                                testID="btn-confirm-active"
                                title="Active"
                                color="primary"
                                onSubmit={() => activeDynamicInput(item._id)}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {dynamicFormData && dynamicFormData.length === 0 ? (
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
                        No RFQ Templates available.
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
                            }}>
                            <FlatList
                                ItemSeparatorComponent={() => <View />}
                                data={dynamicFormData}
                                renderItem={renderRFQTemplate}
                                keyExtractor={item => item._id}
                                onEndReachedThreshold={0.1}
                            />
                        </View>
                    )}
                />
            )}
            {/* <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}>
                <Button
                    title="New Template RFQ"
                    color="primary"
                    leftIcon={<PlusIcon />}
                    onSubmit={() => {
                        navigation.navigate('AddRfqTemplate');
                    }}
                />
            </View> */}
            <ConfirmModal
                isVisible={showConfirmationModal}
                onConfirm={handleConfirmDeactivation}
                onCancel={handleCancelDeactivation}
                confirmationMessage={getConfirmationMessage(
                    dynamicFormData &&
                        selectedDynamicInputId &&
                        dynamicFormData.find(
                            item => item._id === selectedDynamicInputId,
                        )?.active,
                )}
            />
        </View>
    );
};

export default RFQTemplateManagement;
