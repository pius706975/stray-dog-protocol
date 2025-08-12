import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import { DynamicFormRFQ, SelectRFQTemplateProps } from '../../../../types';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../slices';
import { useGetAllTemplateRFQForm } from '../../../../hooks';
import { useIsFocused } from '@react-navigation/native';
import { Button, CustomText } from '../../../../components';
import { FlatList } from 'react-native-gesture-handler';
import { Pressable } from 'react-native';
import { PlusIcon } from '../../../../configs';
type RadioProps = {
    id: number;
    value: string;
};
type SelectProps = {
    id: number;
    itemId?: string;
    value: string;
};

const SelectRFQTemplate: React.FC<SelectRFQTemplateProps> = ({navigation}) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const mutationGetAllTemplateRFQForm = useGetAllTemplateRFQForm();
    const { hideModal, showModal } = modalSlice.actions;
    const [selectItem, setSelectItem] = React.useState<SelectProps[]>([]);
    const [radioItem, setRadioItem] = React.useState<RadioProps[]>([]);
    const [fieldType, setFieldType] = React.useState('');
    const [selectedDynamicInputId, setSelectedDynamicInputId] =
    React.useState(null);
    const [dynamicFormData, setDynamicFormData] =
    React.useState<DynamicFormRFQ[]>();
    const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
    const [items, setItems] = React.useState([
        {
            label: '',
            value: '',
        },
    ]);

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

    const renderRFQTemplate = ({ item }) => {
        const { title, templateType, formType } = item;
        const deactivateDynamicInput = id => {
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
                    // onPress={() => {
                    //     navigation.navigate('RFQFormInputManagement', {
                    //         templateType,
                    //         formType,
                    //     });
                    // }}
                    >
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
                                     ? templateType
                                     .split(/(?=[A-Z])/)
                                     .map(
                                         word =>
                                             word.charAt(0).toUpperCase() +
                                             word.slice(1),
                                     )
                                     .join(' ')
                               : 'Unknown Template Type'}
                            </CustomText>
                        </View>
                    </View>
                    </Pressable>
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
            <View
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
                        navigation.navigate('DetailShip');
                    }}
                />
            </View>
            </View>
    );
};

export default SelectRFQTemplate;
