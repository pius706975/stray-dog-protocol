import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Pressable,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Color } from '../configs';
import { NavigationKebabMenuOptions, NavigationKebabMenuProps } from '../types';

const NavigationKebabMenu: React.FC<NavigationKebabMenuProps> = ({
    options,
}) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    const toggleMenu = useCallback(() => {
        setMenuVisible(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setMenuVisible(false);
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: NavigationKebabMenuOptions }) => (
            <Pressable
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? '#ddd' : 'white',
                    },
                    styles.menuItem,
                ]}
                onPress={() => {
                    item.action();
                    closeMenu();
                }}>
                <Text style={styles.menuText}>{item.label}</Text>
            </Pressable>
        ),
        [closeMenu],
    );

    const itemHeight = 45;
    const maxMenuHeight = useMemo(
        () => Dimensions.get('window').height / 3,
        [],
    );
    const menuHeight = useMemo(
        () => Math.min(options.length * itemHeight, maxMenuHeight),
        [options.length, maxMenuHeight],
    );

    return (
        <View>
            <TouchableOpacity onPress={toggleMenu} style={styles.iconContainer}>
                <Icon name="more-vert" color={Color.primaryColor} size={30} />
            </TouchableOpacity>
            {menuVisible && (
                <Modal
                    transparent
                    animationType="none"
                    visible={menuVisible}
                    onRequestClose={closeMenu}>
                    <TouchableWithoutFeedback onPress={closeMenu}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View
                                    style={[
                                        styles.menu,
                                        { height: menuHeight },
                                    ]}>
                                    <FlatList
                                        data={options}
                                        renderItem={renderItem}
                                        keyExtractor={(_, index) =>
                                            index.toString()
                                        }
                                        style={styles.flatList}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menu: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 50,
        marginRight: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        maxWidth: 250,
    },
    flatList: {
        flexGrow: 0,
    },
    menuItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        height: 45,
    },
    menuText: {
        fontSize: 16,
        color: Color.darkTextColor,
    },
});

export default NavigationKebabMenu;
