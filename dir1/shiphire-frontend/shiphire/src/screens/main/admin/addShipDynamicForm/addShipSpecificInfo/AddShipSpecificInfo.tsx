import React from 'react';
import { Button, Text, View } from 'react-native-ui-lib';
import {
    AddShipSpecificInfoProps,
    GetShipSpecificationResponse,
} from '../../../../../types';
import { FlatList, Pressable } from 'react-native';
import { CustomText } from '../../../../../components';
import { Color, PlusIcon, RightIcon, TrashIcon } from '../../../../../configs';
import {
    useDeleteShipSpectAddShip,
    useGetShipSpecification,
} from '../../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';
import { handleAxiosError } from '../../../../../utils';
import { ModalConfirmation } from './components';
import { useIsFocused } from '@react-navigation/native';

const AddShipSpecificInfo: React.FC<AddShipSpecificInfoProps> = ({
    navigation,
}) => {
    const mutationGetShipSpect = useGetShipSpecification();
    const [shipSpectList, setShipSpectList] =
        React.useState<{ templateType: string; value: string }[]>();
    const mutationDeleteShipSpectAddShip = useDeleteShipSpectAddShip();
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [visible, setVisible] = React.useState<boolean>(false);
    const [templateType, setTemplateType] = React.useState<string>('');
    const isFocused = useIsFocused();
    const handleDeleteSpect = () => {
        setSubmitting(true);
        mutationDeleteShipSpectAddShip.mutate(
            { templateType: templateType },
            {
                onSuccess: resp => {
                    setSubmitting(false);
                    setVisible(false);
                    const newSpect = shipSpectList?.filter(
                        item => item.templateType !== templateType,
                    );
                    setShipSpectList(newSpect);
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Delete successfully',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
                onError: err => {
                    setSubmitting(false);
                    setVisible(false);
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Cannot delate specification',
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
    React.useEffect(() => {
        isFocused &&
            mutationGetShipSpect.mutate(undefined, {
                onSuccess: resp => {
                    console.log(resp.data.data);

                    setShipSpectList(resp.data.data);
                },
                onError: err => {
                    console.log(err);
                },
            });
    }, [isFocused]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    testID="add-specific-btn"
                    onPress={() =>
                        navigation.navigate('AddShipInputForm', {
                            templateType: '',
                        })
                    }>
                    <PlusIcon />
                </Pressable>
            ),
        });
    });
    const renderAddShipManagementMenu = ({ item, index }) => {
        return (
            <View
                style={{
                    padding: 10,
                    borderBottomWidth: 0.5,
                    margin: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Pressable
                    testID={`input-manage-${index}`}
                    style={{ width: '90%' }}
                    onPress={() => {
                        navigation.navigate('AddShipInputManagement', {
                            templateType: item.templateType,
                        });
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
                            {item.value}
                        </CustomText>
                    </View>
                </Pressable>
                {item.templateType !== 'spesificAddShip' && (
                    <Button
                        testID={`btn-delete-${index}`}
                        backgroundColor={Color.softSecBgPrimary}
                        padding-4
                        disabled={submitting}
                        iconSource={() => <TrashIcon />}
                        onPress={() => {
                            setVisible(!visible);
                            setTemplateType(item.templateType);
                        }}
                    />
                )}
            </View>
        );
    };
    return (
        <FlatList
            testID="addShipSpecInfo"
            style={{ width: '100%', height: '100%' }}
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
                        data={shipSpectList}
                        renderItem={renderAddShipManagementMenu}
                        onEndReachedThreshold={0.1}
                    />
                    <ModalConfirmation
                        visible={visible}
                        onClose={() => setVisible(!visible)}
                        onSubmit={handleDeleteSpect}
                        isSubmitting={submitting}
                    />
                </View>
            )}
        />
    );
};

export default AddShipSpecificInfo;
