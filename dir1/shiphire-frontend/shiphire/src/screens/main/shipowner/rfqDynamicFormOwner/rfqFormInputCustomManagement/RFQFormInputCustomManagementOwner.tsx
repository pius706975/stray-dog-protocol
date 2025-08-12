import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Badge, View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { Color, PlusIcon } from '../../../../../configs';
import { useGetDynamicInputRFQByTemplateTypeOwner } from '../../../../../hooks';
import {
    DynamicInputRFQData,
    RFQFormInputManagementCustomOwnerProps,
} from '../../../../../types';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { DetailInputSheet } from './components';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const RFQFormInputCustomManagement: React.FC<
    RFQFormInputManagementCustomOwnerProps
> = ({ navigation, route }) => {
    const { shipId, formType, templateType } = route.params;
    const { width } = useWindowDimensions();
    const isFocused = useIsFocused();
    const sheetRef = React.useRef<BottomSheet>();
    const { t } = useTranslation('rfq');
    const mutationGetDynamicInputByShipId =
        useGetDynamicInputRFQByTemplateTypeOwner();
    const [itemDetail, setItemDetail] = React.useState<DynamicInputRFQData[]>();
    const [dynamicInputData, setDynamicInputData] = React.useState<
        DynamicInputRFQData[]
    >([]);
    const [templateTypes, setTemplateTypes] = React.useState<
        string | undefined
    >('');

    React.useEffect(() => {
        isFocused &&
            mutationGetDynamicInputByShipId.mutate(shipId, {
                onSuccess: resp => {
                    setDynamicInputData(resp.data.data.dynamicForms);
                    console.log('res', resp.data.data.dynamicForms);
                    setTemplateTypes(resp.data.data.templateType);
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
                    testID="add-input-button"
                    onPress={() =>
                        navigation.navigate('RFQInputFormOwner', {
                            templateType,
                            formType,
                            shipId,
                        })
                    }>
                    <PlusIcon />
                </Pressable>
            ),
        });
    });

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
                        // console.log('itemDetail', itemDetail);
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
                {/* <View
                    row
                    style={{
                        alignItems: 'center',
                    }}>
                    <View marginR-5>
                        <Button
                            title="Edit"
                            color="success"
                            onSubmit={() =>
                                navigation.navigate('EditRFQInputOwnerForm', {
                                    _id: dynamicInputData[0]?._id,
                                    templateType,
                                    formType,
                                    shipId
                                })
                            }
                        />
                    </View>
                    </View> */}
            </View>
        );
    };
    console.log(dynamicInputData);

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
                            <FlatList
                                ItemSeparatorComponent={() => <View />}
                                data={dynamicInputData}
                                renderItem={renderItem}
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
                <CustomButton
                    title="Add Form to the Ship"
                    color="success"
                    onSubmit={submitDynamic}
                />
            </View> */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}>
                <Button
                    testID="btn-submit"
                    title={t('RFQDynamicForm.DoneText')}
                    color="success"
                    // leftIcon={<PlusIcon />}
                    onSubmit={() => navigation.navigate('ShipOwnerHome')}
                />
            </View>
            <DetailInputSheet bottomRef={sheetRef} itemDetail={itemDetail} />
        </View>
    );
};

export default RFQFormInputCustomManagement;
