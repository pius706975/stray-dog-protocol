import { Input } from '@rneui/base';
import { SearchBarAndroid } from '@rneui/base/dist/SearchBar/SearchBar-android';
import moment from 'moment';
import React, { useRef } from 'react';
import {
    ListRenderItemInfo,
    Pressable,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
    Button,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { ScreenLayout, ShipCardSearch } from '../../../../components';
import { Color, FilterIcon, FontFamily } from '../../../../configs';
import {
    useGetSearch,
    useGetShipCategories,
    useGetShipLocations,
} from '../../../../hooks';
import { modalSlice } from '../../../../slices';
import {
    GetShipCategoriesResponse,
    RootState,
    SearchHomeProps,
    SearchRequest,
    ShipList,
} from '../../../../types';
import { DatePickerFilter } from './component';
import { SearchBar } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import { handleAxiosError } from '../../../../utils';
import { useIsFocused } from '@react-navigation/native';

const Search: React.FC<SearchHomeProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { userLocation, userCoordinates } = useSelector(
        (state: RootState) => state.userLocation,
    );
    const isSearchMounted = useRef(false);
    const { hideModal, showModal } = modalSlice.actions;
    const { isLoggedIn } = useSelector((state: RootState) => state.userStatus);
    const [ship, setShip] = React.useState<ShipList[]>();
    const [isFilterModalVisible, setFilterModalVisible] = React.useState(false);
    const [locations, setLocations] = React.useState([
        {
            city: '',
            province: '',
        },
    ]);
    const [provinces, setProvinces] = React.useState([
        {
            label: '',
            value: '',
        },
    ]);
    const [cities, setCities] = React.useState([
        {
            label: '',
            value: '',
        },
    ]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [selectedCity, setSelectedCity] = React.useState('');
    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [selectedStartDate, setSelectedStartDate] =
        React.useState<null | Date>(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState<null | Date>(
        null,
    );
    const [startDatePickerVisible, setStartDatePickerVisible] =
        React.useState(false);
    const [endDatePickerVisible, setEndDatePickerVisible] =
        React.useState(false);
    const [shipCategories, setShipCategories] =
        React.useState<GetShipCategoriesResponse>();
    const [loading, setLoading] = React.useState(false);
    const [dateF, setDateF] = React.useState('');

    const mutationSearch = useGetSearch();
    const mutationCategories = useGetShipCategories();
    const mutationGetShipLocations = useGetShipLocations();

    const dateEnd = selectedEndDate?.toISOString() || '';
    const dateStart = selectedStartDate?.toISOString() || '';
    const isFocused = useIsFocused();

    const { t } = useTranslation('search');

    const renderItemShip = ({ item }: ListRenderItemInfo<ShipList>) => {
        return (
            <ShipCardSearch
                name={item.name}
                category={item.categories}
                imageUrl={
                    item.imageUrl
                        ? item.imageUrl
                        : 'https://picsum.photos/id/237/200/300'
                }
                pricePerMonth={item.pricePerMonth}
                shipCompany={isLoggedIn ? item.companyName : ''}
                shipCity={item.city}
                totalRental={item.totalRentalCount}
                onPress={() => {
                    if (isLoggedIn) {
                        navigation.navigate('DetailShip', { shipId: item._id });
                    } else {
                        navigation.navigate('SignIn');
                    }
                }}
            />
        );
    };

    const input = searchTerm => {
        setSearchTerm(searchTerm);
        setLoading(true);
    };

    const getInitShipList = () => {
        const request: SearchRequest = {
            searchTerm: '',
            category: '',
            city: '',
            province: '',
            latitude: userCoordinates.latitude,
            longitude: userCoordinates.longitude,
            inputRentStartDate: '',
            inputRentEndDate: '',
        };
        mutationSearch.mutate(request, {
            onSuccess: res => {
                setShip(res.data.data);
                setLoading(false);
            },
            onError: err => {
                setLoading(false);
            },
        });
    };

    React.useEffect(() => {
        if (isFocused) {
            mutationGetShipLocations.mutate(undefined, {
                onSuccess: data => {
                    const { cities, provinces, locations } = data.data.data.reduce(
                        (acc, item) => {
                            const locationString = item.value;
                            const locationArr = locationString.split(' - ');
                            const city = locationArr[0];
                            const province = locationArr[1];

                            acc.locations.push({
                                city,
                                province,
                            });

                            if (!acc.provinces.some(p => p.label === province)) {
                                acc.provinces.push({
                                    label: province,
                                    value: province,
                                });
                            }

                            acc.cities.push({
                                label: city,
                                value: city,
                            });

                            return acc;
                        },
                        {
                            locations: [] as { city: string; province: string }[],
                            cities: [] as { label: string; value: string }[],
                            provinces: [] as { label: string; value: string }[],
                        },
                    );

                    const sortedProvinces = provinces.sort((a, b) =>
                        a.label.localeCompare(b.label),
                    );

                    setProvinces(sortedProvinces);
                    setCities(cities);
                    setLocations(locations);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });

            getInitShipList();
        }
    }, [isFocused]);

    React.useEffect(() => {
        if (isSearchMounted.current) {
            const request: SearchRequest = {
                searchTerm,
                category: selectedCategory,
                city: selectedCity,
                province: selectedProvince,
                latitude: userCoordinates.latitude,
                longitude: userCoordinates.longitude,
                inputRentStartDate: dateF,
                inputRentEndDate: dateF,
            };
            mutationSearch.mutate(request, {
                onSuccess: res => {
                    setShip(res.data.data);
                    setLoading(false);
                },
                onError: err => {
                    setLoading(false);
                },
            });
        } else {
            isSearchMounted.current = true;
        }
    }, [searchTerm]);

    React.useEffect(() => {
        mutationCategories.mutate(undefined, {
            onSuccess: resp => {
                setShipCategories(resp.data);
            },
            onError: err => {
                if (err.response?.status === 401) {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Token expired, please re-sign in',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                }
            },
        });
    }, [searchTerm]);

    const handleSearch = () => {
        const request: SearchRequest = {
            searchTerm,
            category: selectedCategory,
            city: selectedCity,
            province: selectedProvince,
            latitude: userCoordinates.latitude,
            longitude: userCoordinates.longitude,
            inputRentStartDate: selectedStartDate?.toISOString() || '',
            inputRentEndDate: selectedEndDate?.toISOString() || '',
        };
        const delayDebounceSearch = setTimeout(() => {
            mutationSearch.mutate(request, {
                onSuccess: res => {
                    setShip(res.data.data);
                    setLoading(false);
                    setFilterModalVisible(false);
                    console.log(res);
                },
                onError: err => {
                    setLoading(false);
                },
            });
        }, 800);
        return () => clearTimeout(delayDebounceSearch);
    };

    const handleCategorySelect = (categoryName: string) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory('');
        } else {
            setSelectedCategory(categoryName);
        }
    };

    const toggleFilterModal = () => {
        setFilterModalVisible(!isFilterModalVisible);
    };

    const handleStartDateChange = (date: Date) => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = (date: Date) => {
        setSelectedEndDate(date);
    };

    const showStartDatePicker = () => {
        setStartDatePickerVisible(true);
    };

    const hideStartDatePicker = () => {
        if (!selectedStartDate) {
            setSelectedStartDate(new Date());
        }
        setStartDatePickerVisible(false);
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisible(true);
    };

    const hideEndDatePicker = () => {
        if (!selectedEndDate) {
            setSelectedEndDate(new Date());
        }
        setEndDatePickerVisible(false);
    };

    const handleProvinceDropdownChange = selectedProvince => {
        if (selectedProvince) {
            const filteredCities = locations
                .filter(item => item.province === selectedProvince)
                .map(item => ({ label: item.city, value: item.city }));

            setCities(filteredCities);
        }
    };

    const styles = StyleSheet.create({
        dropdown: {
            borderBottomColor: 'gray',
            borderBottomWidth: 0.5,
            width: '100%',
        },
        icon: {
            marginRight: 5,
        },
        placeholderStyle: {
            fontSize: 16,
            color: 'black',
        },
        selectedTextStyle: {
            fontSize: 16,
            color: 'black',
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,
            color: 'black',
        },
    });

    return (
        <FlatList
            style={{ marginHorizontal: 5 }}
            data={['']}
            keyExtractor={() => 'dummyKey'}
            showsVerticalScrollIndicator={false}
            renderItem={() => (
                <ScreenLayout
                    testId="SearchScreen"
                    backgroundColor="light"
                    padding={15}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 10,
                            paddingBottom: 5,
                        }}>
                        <View
                            style={{
                                width: '85%',
                            }}>
                            <SearchBar
                                placeholder={t('searchFieldPlaceholder')}
                                onChangeText={input}
                                lightTheme={true}
                                inputStyle={{
                                    color: Color.darkTextColor,
                                    fontFamily: FontFamily.regular,
                                }}
                                inputContainerStyle={{
                                    backgroundColor: 'white',
                                }}
                                containerStyle={{
                                    backgroundColor: Color.softPrimaryColor,
                                    borderRadius: 20,
                                }}
                                round={true}
                                leftIcon={false}
                                showLoading={loading}
                                value={searchTerm}
                                searchIcon={false}
                            />
                        </View>
                        <View
                            style={{
                                padding: 15,
                                borderWidth: 3,
                                borderColor: Color.softPrimaryColor,
                                borderRadius: 20,
                                paddingLeft: 5,
                                paddingRight: 5,
                                paddingTop: 5,
                                paddingBottom: 5,
                            }}>
                            <Pressable
                                onPress={toggleFilterModal}
                                testID="filterButton">
                                <FilterIcon />
                            </Pressable>
                        </View>
                    </View>
                    <View testID="shipList">
                        {ship?.length === 0 ? (
                            <Text
                                style={{ textAlign: 'center', marginTop: 20 }}>
                                {t('emptyList')}
                            </Text>
                        ) : (
                            <FlatList
                                data={ship}
                                keyExtractor={item => item._id.toString()}
                                renderItem={renderItemShip}
                                numColumns={2}
                                contentContainerStyle={{
                                    gap: 14,
                                }}
                                columnWrapperStyle={{
                                    justifyContent: 'space-between',
                                    marginTop: 14,
                                }}
                            />
                        )}
                    </View>
                    <Modal
                        testID="filterModal"
                        visible={isFilterModalVisible}
                        animationType="slide"
                        transparent={true}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    width: '80%',
                                    padding: 20,
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                    borderWidth: 3,
                                    borderColor: Color.primaryColor,
                                }}>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            marginBottom: 10,
                                        }}>
                                        {t('filterModal.title')}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        borderWidth: 3,
                                        padding: 10,
                                        borderColor: Color.infoColor,
                                        borderRadius: 5,
                                        flexWrap: 'wrap',
                                    }}>
                                    {shipCategories?.data.map(item => (
                                        <Pressable
                                            testID={`categoryButton-${item.name}`}
                                            key={item._id}
                                            onPress={() =>
                                                handleCategorySelect(item.name)
                                            }>
                                            <View
                                                style={{
                                                    marginLeft: 5,
                                                    marginTop: 5,
                                                    borderWidth: 1,
                                                    padding: 5,
                                                    borderRadius: 7,
                                                    borderColor:
                                                        Color.primaryDisableColor,
                                                    paddingHorizontal: 10,
                                                    backgroundColor:
                                                        selectedCategory ===
                                                        item.name
                                                            ? Color.primaryColor
                                                            : 'transparent',
                                                }}>
                                                <Text
                                                    style={{
                                                        color:
                                                            selectedCategory ===
                                                            item.name
                                                                ? 'white'
                                                                : 'black',
                                                        fontFamily:
                                                            FontFamily.regular,
                                                    }}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            marginBottom: 10,
                                            marginTop: 10,
                                        }}>
                                        {t('filterModal.location')}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        borderWidth: 3,
                                        padding: 10,
                                        borderColor: Color.infoColor,
                                        borderRadius: 5,
                                        flexWrap: 'wrap',
                                    }}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={
                                            styles.placeholderStyle
                                        }
                                        selectedTextStyle={
                                            styles.selectedTextStyle
                                        }
                                        itemTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={
                                            styles.inputSearchStyle
                                        }
                                        data={provinces}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={t(
                                            'filterModal.provincePlaceholder',
                                        )}
                                        searchPlaceholder={t(
                                            'filterModal.searchPlaceholder',
                                        )}
                                        value={selectedProvince}
                                        onChange={item => {
                                            setSelectedCity('');
                                            handleProvinceDropdownChange(
                                                item.value,
                                            );
                                            setSelectedProvince(item.value);
                                        }}
                                    />
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={
                                            styles.placeholderStyle
                                        }
                                        selectedTextStyle={
                                            styles.selectedTextStyle
                                        }
                                        itemTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={
                                            styles.inputSearchStyle
                                        }
                                        data={cities}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={t(
                                            'filterModal.cityPlaceholder',
                                        )}
                                        searchPlaceholder={t(
                                            'filterModal.searchPlaceholder',
                                        )}
                                        value={selectedCity}
                                        onChange={item => {
                                            setSelectedCity(item.value);
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            marginBottom: 10,
                                            marginTop: 10,
                                        }}>
                                        {t('filterModal.filterSubtitle')}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        borderWidth: 3,
                                        padding: 2,
                                        paddingBottom: 5,
                                        borderColor: Color.infoColor,
                                        borderRadius: 5,
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            padding: 5,
                                            width: '100%',
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        FontFamily.regular,
                                                    color: Color.boldInfoColor,
                                                }}>
                                                {t(
                                                    'filterModal.startDateLabel',
                                                )}
                                            </Text>
                                            <Pressable
                                                onPress={showStartDatePicker}>
                                                <Input
                                                    value={
                                                        selectedStartDate
                                                            ? moment(
                                                                  selectedStartDate,
                                                              ).format(
                                                                  'DD MMMM YYYY',
                                                              )
                                                            : `${t(
                                                                  'filterModal.startDatePlaceholder',
                                                              )}`
                                                    }
                                                    // onChange={e => dateStart}
                                                    editable={false}
                                                />
                                            </Pressable>

                                            <DatePickerFilter
                                                visible={startDatePickerVisible}
                                                date={
                                                    selectedStartDate
                                                        ? selectedStartDate
                                                        : new Date()
                                                }
                                                onClose={hideStartDatePicker}
                                                onDateChange={
                                                    handleStartDateChange
                                                }
                                                minDate={new Date()}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        FontFamily.regular,
                                                    color: Color.boldInfoColor,
                                                }}>
                                                {t('filterModal.endDateLabel')}
                                            </Text>
                                            <Pressable
                                                onPress={showEndDatePicker}>
                                                <Input
                                                    value={
                                                        selectedEndDate
                                                            ? moment(
                                                                  selectedEndDate,
                                                              ).format(
                                                                  'DD MMMM YYYY',
                                                              )
                                                            : `${t(
                                                                  'filterModal.endDatePlaceholder',
                                                              )}`
                                                    }
                                                    onChange={e => dateEnd}
                                                    editable={false}
                                                />
                                            </Pressable>
                                            <DatePickerFilter
                                                visible={endDatePickerVisible}
                                                date={
                                                    selectedEndDate
                                                        ? selectedEndDate
                                                        : new Date()
                                                }
                                                onClose={hideEndDatePicker}
                                                onDateChange={
                                                    handleEndDateChange
                                                }
                                                minDate={
                                                    selectedStartDate
                                                        ? selectedStartDate
                                                        : new Date(0)
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingTop: 10,
                                    }}>
                                    <Button
                                        testID="btnCloseFilterModal"
                                        label={t('filterModal.btnClose')}
                                        onPress={toggleFilterModal}
                                        style={{
                                            backgroundColor: Color.infoColor,
                                        }}
                                    />
                                    <Button
                                        testID="btnApplyFilterModal"
                                        label={t('filterModal.btnApply')}
                                        onPress={handleSearch}
                                        style={{
                                            backgroundColor: Color.primaryColor,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScreenLayout>
            )}
        />
    );
};

export default Search;
