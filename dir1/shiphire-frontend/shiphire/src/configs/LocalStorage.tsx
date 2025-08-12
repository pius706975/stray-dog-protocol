import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN = '@token';
export const ROLES = '@roles';
export const ADMINDATA = '@admindata';
export const USERDATA = '@userdata';
export const COMPANYDATA = '@companydata';
export const SHIPOWNERDOCSUBMITTED = '@shipownerdocsubmitted';
export const RFQFILEPATH = '@rfqfilepath';
export const PROPOSALOWNERFILEPATH = '@proposalfilepath';
export const CONTRACTFILEPATH = '@contractfilepath';
export const USERLANGUAGE = '@userlanguage';
export const FCMTOKEN = '@fcmtoken';

export const setDataToLocalStorage = async (key: string, data: Object) => {
    try {
        const jsonData = JSON.stringify(data);
        return await AsyncStorage.setItem(key, jsonData);
    } catch (error) {
        return error;
    }
};

export const getDataFromLocalStorage = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        let valueObj;
        if (jsonValue) valueObj = JSON.parse(jsonValue);
        return valueObj;
    } catch (error) {
        return error;
    }
};

export const removeDataToLocalStorage = async (key: string) => {
    try {
        return await AsyncStorage.removeItem(key);
    } catch (error) {
        return error;
    }
};
