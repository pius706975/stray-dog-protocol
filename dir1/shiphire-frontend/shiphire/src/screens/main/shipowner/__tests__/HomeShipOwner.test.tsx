import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { USERDATA } from '../../../../configs';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    MainOwnerStackParamList,
    MainScreenOwnerParamList,
} from '../../../../types';
import { useGetTopRentedOwner } from '../../../../hooks';
import Home from '../home/Home';
import { OwnerTransactionTabNav } from '../../../../navigations';
import { Ships } from '../ships';

const queryClient = new QueryClient();
const MainScreenStack = createNativeStackNavigator<MainScreenOwnerParamList>();
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const mockAdapter = new MockAdapter(httpRequest);

const homeMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainScreenStack.Navigator>
                    <MainScreenStack.Screen name="Home" component={Home} />
                    <MainScreenStack.Screen name="Ships" component={Ships} />
                    <MainOwnerStack.Screen
                        name="OwnerTransactionTabNav"
                        component={OwnerTransactionTabNav}
                    />
                </MainScreenStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockGetShipOwnerDataResponse = {
    status: 'success',
    data: {
        company: {
            isRejected: false,
            name: 'Fauzan Company',
            companyType: 'PT',
            address: 'Jl. Raudah',
            bankName: 'BRI',
            bankAccountName: 'Fauzan Corp',
            bankAccountNumber: 123456789,
            documentCompany: [
                {
                    documentName: 'Fauzan Corp Business License',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
                    _id: '65a4d4184fa531643fc8cdb5',
                },
                {
                    documentName: 'Fauzan Corp Deed of Establishment',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
                    _id: '65a4d4184fa531643fc8cdb6',
                },
            ],
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
            isVerified: true,
        },
        _id: '65a4d4184fa531643fc8cdb2',
        userId: '65a4d4174fa531643fc8cd9a',
        name: 'Fauzan',
        ships: [
            {
                shipId: '65a4d4184fa531643fc8ceba',
                shipName: 'Barge Hauler',
                _id: '65a4d4184fa531643fc8cec2',
            },
            {
                shipId: '65a4d4184fa531643fc8ced3',
                shipName: 'Swift Tow',
                _id: '65a4d4184fa531643fc8cedf',
            },
            {
                shipId: '65a4d4184fa531643fc8cef2',
                shipName: 'Island Hopper',
                _id: '65a4d4184fa531643fc8cefe',
            },
            {
                shipId: '65a4d4184fa531643fc8cf11',
                shipName: 'Cargo Carrier',
                _id: '65a4d4184fa531643fc8cf1b',
            },
            {
                shipId: '65a4d4184fa531643fc8cf32',
                shipName: 'Mighty Tug',
                _id: '65a4d4184fa531643fc8cf3e',
            },
            {
                shipId: '65a4d4184fa531643fc8cf57',
                shipName: 'Coastal Cruiser',
                _id: '65a4d4184fa531643fc8cf63',
            },
            {
                shipId: '65a4d4184fa531643fc8cf80',
                shipName: 'Ferry Cruiser',
                _id: '65a4d4184fa531643fc8cf8e',
            },
            {
                shipId: '65a4d4184fa531643fc8cfad',
                shipName: 'MV Seaside Voyager',
                _id: '65a4d4184fa531643fc8cfbb',
            },
        ],
        __v: 0,
    },
};

const mockGetTopRatedShipsResponse = {
    status: 'success',
    data: [
        {
            size: {
                length: 400,
                width: 75,
                height: 20,
            },
            _id: '65a4d4184fa531643fc8ceba',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'Barge Hauler',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Barge%20Hauler?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=BmuSrc1ujivUWLEr4nH6YW%2BDrF5AAYBC5ILuijc3IZLecUPbajy6p8BF4KbtCJi9n7Ud0UjRvYrW%2FdNXN2S%2Bg2ie1vNu9XOAG0QFRwx03WKcyJ4X4oODpwgiI1j9RLCX2c4vFXAMjvlsqGMoZqLkEEn7pMnLu0lX8RxnZgE5Iv5JH%2FjiRG3LfpcDTmOgf9LECum01nS%2BW%2Bcto7Vs3g2YpanAWCvaq5vvwU3G765WhumhBPRNoQwMAAlqgXdZAEzQ4hqfrF3Fc8V9GmcGQVm2YwL2eNdZmR0djWWGU5gZx6opiCjwJlirmgJfAy4Q%2BB3LRoi7Zhh9xtZdOZm2Tz4j0g%3D%3D',
            desc: 'Barge Hauler is a heavy-duty cargo barge designed to transport goods and materials across rivers, lakes, and coastal areas. Equipped with robust loading and unloading mechanisms, it can handle large and bulky items with ease. Barge Hauler plays a crucial role in facilitating the movement of essential commodities and equipment for various industries.',
            category: {
                _id: '65a4d4184fa531643fc8cdcb',
                name: 'Barge',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Barge Hauler Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Barge%20Hauler%20Owner%20Document%201?generation=1695180758491269&alt=media',
                    _id: '65a4d4184fa531643fc8cebb',
                },
                {
                    documentName: 'Ship Barge Hauler Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Barge%20Hauler%20Owner%20Document%202?generation=1695180762377238&alt=media',
                    _id: '65a4d4184fa531643fc8cebc',
                },
            ],
            pricePerMonth: 900000000,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cdd5',
                    typeName: 'Cargo Handling Equipment',
                    name: 'Cranes',
                    _id: '65a4d4184fa531643fc8cebd',
                },
                {
                    type: '65a4d4184fa531643fc8cdd5',
                    typeName: 'Cargo Handling Equipment',
                    name: 'Conveyor Belt',
                    _id: '65a4d4184fa531643fc8cebe',
                },
                {
                    type: '65a4d4184fa531643fc8cdd7',
                    typeName: 'Deck Cranes',
                    name: 'Hydraulic Winches',
                    _id: '65a4d4184fa531643fc8cebf',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce47',
                    name: 'Vehicle Capacity',
                    value: 100,
                    _id: '65a4d4184fa531643fc8cec0',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
            rfqDynamicForm: '65a4d4184fa531643fc8d0b1',
        },
        {
            size: {
                length: 35,
                width: 12,
                height: 5,
            },
            _id: '65a4d4184fa531643fc8ced3',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'Swift Tow',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Swift%20Tow?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=fAR%2FBvTTGbnZSdgIBWl0QKJAmfX5YuY99zgQNuDLngxOWPlMkWptx7L171j0REuFrlylqZ%2F1uIrxm9NvRnDfNiGpg7CnaGsbwD6iXb3syF%2F8rFJROSYWJmAD%2B2sKqWDaRptZzJ3zXCiLK6hrgMruuf9N9pifLx4xX%2FRJy%2Fu2WBsaOMb0GcfFoEh7u9lRZ2vaX4QRjVuTlOMlYB669IIhXvLHSB651nHWZ6Nl0ceTgfHEEkOJb9nCMRWtt7Z2YU5YP98QK4416twCTHhe24UGjlX3Az18V7%2FbU6%2BJf85A3Jy2H%2BzUc3SlhTGS4sxh5BIaoM6b6%2FCq92TfiVLL2r5PWA%3D%3D',
            desc: 'Swift Tow is a highly maneuverable and efficient tugboat designed to handle a wide range of towing tasks. Its compact size and powerful engines make it suitable for both port operations and offshore assistance.',
            category: {
                _id: '65a4d4184fa531643fc8cdcd',
                name: 'Tugboat',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Swift Tow Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Swift%20Tow%20Owner%20Document%201?generation=1695180220406334&alt=media',
                    _id: '65a4d4184fa531643fc8ced4',
                },
                {
                    documentName: 'Ship Swift Tow Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Swift%20Tow%20Owner%20Document%202?generation=1695180222284196&alt=media',
                    _id: '65a4d4184fa531643fc8ced5',
                },
            ],
            pricePerMonth: 110000000,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cddb',
                    typeName: 'Towing Equipment',
                    name: 'Electric Towing Winches',
                    _id: '65a4d4184fa531643fc8ced6',
                },
                {
                    type: '65a4d4184fa531643fc8cddb',
                    typeName: 'Towing Equipment',
                    name: 'Towing Hooks',
                    _id: '65a4d4184fa531643fc8ced7',
                },
                {
                    type: '65a4d4184fa531643fc8cddd',
                    typeName: 'Navigation Aids',
                    name: 'GPS',
                    _id: '65a4d4184fa531643fc8ced8',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce45',
                    name: 'Towing Capacity',
                    value: 100,
                    _id: '65a4d4184fa531643fc8ced9',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4d',
                    name: 'Draft',
                    value: 2,
                    _id: '65a4d4184fa531643fc8ceda',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4f',
                    name: 'Fuel Capacity',
                    value: 100,
                    _id: '65a4d4184fa531643fc8cedb',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce51',
                    name: 'Traction',
                    value: 30,
                    _id: '65a4d4184fa531643fc8cedc',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce43',
                    name: 'Capacity',
                    value: 6,
                    _id: '65a4d4184fa531643fc8cedd',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
        },
        {
            size: {
                length: 60,
                width: 20,
                height: 10,
            },
            _id: '65a4d4184fa531643fc8cef2',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'Island Hopper',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Island%20Hopper?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=Rq%2BWliFsxwjby9pFF6sveAsZK3fPF3%2FSHFDQ9KsiCAJ09N3SeXrLeFnvdfmlAvZLCwK6RPaCwzCyH%2Boxdn84WAU7bP8t42844GuwtzV72V4xTxoPJMNp6qWlEfx%2F%2FuK60MqrTwdYAtlUKjN1V9y0Lfk5mzJcink7mUYIUgnT7e9pyCAjkuq9Sj3HP69crMkCTSU%2BxTaeWsx3FswErvJ3ySXxhoFkqRt%2FELF%2BlvW5DV87uu1kDzNsJBKSpFMH07LzfNNBoJUSFhwjWfringrtUs0qpLYDbSDzOcls7QCsqX6WazIZeaXHXFBgxzDWTpLUG5vMv2uCw0B3qnu9hqrhCA%3D%3D&param=1701057586826',
            desc: 'Island Hopper is a passenger ferry designed to transport people and vehicles between islands and coastal regions. With its comfortable seating arrangements and vehicle-carrying capacity, it ensures a smooth and enjoyable journey for passengers.',
            category: {
                _id: '65a4d4184fa531643fc8cdcf',
                name: 'Ferry',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Island Hopper Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Island%20Hopper%20Owner%20Document%201?generation=1695180511790203&alt=media',
                    _id: '65a4d4184fa531643fc8cef3',
                },
                {
                    documentName: 'Ship Island Hopper Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Island%20Hopper%20Owner%20Document%202?generation=1695180513667068&alt=media',
                    _id: '65a4d4184fa531643fc8cef4',
                },
            ],
            pricePerMonth: 150000000,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Economy Class',
                    _id: '65a4d4184fa531643fc8cef5',
                },
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Business Class',
                    _id: '65a4d4184fa531643fc8cef6',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Car Deck',
                    _id: '65a4d4184fa531643fc8cef7',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce47',
                    name: 'Vehicle Capacity',
                    value: 30,
                    _id: '65a4d4184fa531643fc8cef8',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce49',
                    name: 'Passenger Capacity',
                    value: 150,
                    _id: '65a4d4184fa531643fc8cef9',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4b',
                    name: 'Crew Capacity',
                    value: 20,
                    _id: '65a4d4184fa531643fc8cefa',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce55',
                    name: 'Max Speed',
                    value: 200,
                    _id: '65a4d4184fa531643fc8cefb',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4f',
                    name: 'Fuel Capacity',
                    value: 60,
                    _id: '65a4d4184fa531643fc8cefc',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
        },
        {
            size: {
                length: 350,
                width: 75,
                height: 15,
            },
            _id: '65a4d4184fa531643fc8cf11',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'Cargo Carrier',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Cargo%20Carrier?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=jtFgSw18kaFu7NGRYv9YYfUunj1XqBzmZ5CELfh%2BjLz5Ea4dP5isnDpMDCuQVp5giXfjlOypyvyQnUx3iLWE%2FfL1pMhcWONWpWdSEMcg9zgSYElZgJQw3BHKeh8C0a2WGvyfm9q%2BlS%2Fpx%2BpKbhDuvHZEvGNs5OnGxLrLmDzHj50CnRTH5H%2BYYrFpNhPcskwqT4Tz0ZybC34HgmVCN3sBNa9dZnUxi3Gz34RV%2FgJZgQB%2BgIUbJAtAYFL6Wj7PphKhOYbHE%2BElz5nm1I1XYkT8fJ6c%2BzrRtsB3ApmCA1ZKT1YYvBaHD42EjD9OMizVO0ETX%2F9%2Ba6uipRQrv59bSlGRvQ%3D%3D',
            desc: 'Cargo Carrier is a versatile barge designed to transport various types of goods and equipment across water bodies. With its spacious deck and robust construction, it provides a reliable and cost-effective solution for cargo transportation.',
            category: {
                _id: '65a4d4184fa531643fc8cdcb',
                name: 'Barge',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Cargo Carrier Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Cargo%20Carrier%20Owner%20Document%201?generation=1695180974620680&alt=media',
                    _id: '65a4d4184fa531643fc8cf12',
                },
                {
                    documentName: 'Ship Cargo Carrier Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Cargo%20Carrier%20Owner%20Document%202?generation=1695180987121517&alt=media',
                    _id: '65a4d4184fa531643fc8cf13',
                },
            ],
            pricePerMonth: 700000000,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cdd5',
                    typeName: 'Cargo Handling Equipment',
                    name: 'Cranes',
                    _id: '65a4d4184fa531643fc8cf14',
                },
                {
                    type: '65a4d4184fa531643fc8cdd5',
                    typeName: 'Cargo Handling Equipment',
                    name: 'Pumps',
                    _id: '65a4d4184fa531643fc8cf15',
                },
                {
                    type: '65a4d4184fa531643fc8cdd5',
                    typeName: 'Cargo Handling Equipment',
                    name: 'Conveyor Belt',
                    _id: '65a4d4184fa531643fc8cf16',
                },
                {
                    type: '65a4d4184fa531643fc8cdd7',
                    typeName: 'Deck Cranes',
                    name: 'Telescopic Cranes',
                    _id: '65a4d4184fa531643fc8cf17',
                },
                {
                    type: '65a4d4184fa531643fc8cdd7',
                    typeName: 'Deck Cranes',
                    name: 'Hydraulic Winches',
                    _id: '65a4d4184fa531643fc8cf18',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce43',
                    name: 'Capacity',
                    value: 200,
                    _id: '65a4d4184fa531643fc8cf19',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
        },
        {
            size: {
                length: 40,
                width: 15,
                height: 6,
            },
            _id: '65a4d4184fa531643fc8cf32',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'Mighty Tug',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Mighty%20Tug?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=QY6dG4ju8MXNInW14uv0T3WHehSuh%2BIpRFafaGuk2uTOwAFQlEFFSgXv3fMGsYTKE6z%2B6l6sMf9BdVi9ufto2IlUl8GumI%2F%2BhlJHyk%2BpSse26u1ep0aRiWLz2v6y%2BUDZR2Aj6PYM6drVm0KSNxcGybtXL2XvW4B7O5JqzUgryQHlnUHZbs%2F0BaHJkE1XUhH8PjM6fwOGpZq82SYSX4qczQSVuSKoEOIC5g7LOm0cZXxiTPz4UWVfxnFunMTp56KQgDFDpLycHHHgrZLi8jGRzj5HH5qiodtHBKQslKQZRz08PGjqfOVFCFQzSbFywnDRm%2FLrkz17I3Np0co9LfP3Lw%3D%3D',
            desc: 'Mighty Tug is a powerful and compact tugboat designed to assist larger vessels in docking, undocking, and maneuvering in confined waterways. Its high towing capacity and agile performance make it a reliable companion for maritime operations.',
            category: {
                _id: '65a4d4184fa531643fc8cdcd',
                name: 'Tugboat',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Mighty Tug Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Mighty%20Tug%20Owner%20Document%201?generation=1695181800497630&alt=media',
                    _id: '65a4d4184fa531643fc8cf33',
                },
                {
                    documentName: 'Ship Mighty Tug Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Mighty%20Tug%20Owner%20Document%202?generation=1695181801719492&alt=media',
                    _id: '65a4d4184fa531643fc8cf34',
                },
            ],
            pricePerMonth: 120000000,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cddb',
                    typeName: 'Towing Equipment',
                    name: 'Electric Towing Winches',
                    _id: '65a4d4184fa531643fc8cf35',
                },
                {
                    type: '65a4d4184fa531643fc8cddd',
                    typeName: 'Navigation Aids',
                    name: 'GPS',
                    _id: '65a4d4184fa531643fc8cf36',
                },
                {
                    type: '65a4d4184fa531643fc8cddb',
                    typeName: 'Towing Equipment',
                    name: 'Towing Hooks',
                    _id: '65a4d4184fa531643fc8cf37',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce45',
                    name: 'Towing Capacity',
                    value: 100,
                    _id: '65a4d4184fa531643fc8cf38',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4d',
                    name: 'Draft',
                    value: 3,
                    _id: '65a4d4184fa531643fc8cf39',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4f',
                    name: 'Fuel Capacity',
                    value: 70,
                    _id: '65a4d4184fa531643fc8cf3a',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce51',
                    name: 'Traction',
                    value: 30,
                    _id: '65a4d4184fa531643fc8cf3b',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce43',
                    name: 'Capacity',
                    value: 6,
                    _id: '65a4d4184fa531643fc8cf3c',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
        },
        {
            size: {
                length: 75,
                width: 25,
                height: 8,
            },
            _id: '65a4d4184fa531643fc8cf57',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'Coastal Cruiser',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Coastal%20Cruiser?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=ixK98%2FusIcqEl%2BVrzD%2BphG51OzPxJuo8kWJI%2Fx%2BFWBQnBPaUKQYAyHjLeV9jT%2FrW9mO1VPObxoEqdg7TP%2F0ILQBNyYYW1wCsEkF3EzfiaHfG0WspxN5wfRgDD7moMkUJ2HVhl9us3bzWqZBXWYInurycMB%2Fh5u1sQnLlRw17Ze0iwLxevuYpXEZJvrQfOHAKCUBRsGreDSxZNvLYEYZEWdc4Dg0su1Iz95B6HTDL9TEbN%2BhhuvR1HXLdGIvHuVrorrtvhDK%2FVpv%2F5wi%2BXz2hlFqvE7a%2Bk6nMgBihnH6reXGDkO5zu7rexmEpGHX6KzwFjjUjU%2F1rSfQv2kchp1eotw%3D%3D&param=1701049172810',
            desc: 'Coastal Cruiser is a modern passenger ferry designed to provide a comfortable and safe journey along coastal routes. Equipped with advanced navigation systems and luxurious amenities, it offers a delightful travel experience for passengers.',
            category: {
                _id: '65a4d4184fa531643fc8cdcf',
                name: 'Ferry',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Coastal Cruiser Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Coastal%20Cruiser%20Owner%20Document%201?generation=1695182314473765&alt=media',
                    _id: '65a4d4184fa531643fc8cf58',
                },
                {
                    documentName: 'Ship Coastal Cruiser Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Coastal%20Cruiser%20Owner%20Document%202?generation=1695182316785523&alt=media',
                    _id: '65a4d4184fa531643fc8cf59',
                },
            ],
            pricePerMonth: 180000000,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Economy Class',
                    _id: '65a4d4184fa531643fc8cf5a',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Car Deck',
                    _id: '65a4d4184fa531643fc8cf5b',
                },
                {
                    type: '65a4d4184fa531643fc8cde5',
                    typeName: 'Passenger Lounge',
                    name: 'First Class Lounge',
                    _id: '65a4d4184fa531643fc8cf5c',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce47',
                    name: 'Vehicle Capacity',
                    value: 20,
                    _id: '65a4d4184fa531643fc8cf5d',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce49',
                    name: 'Passenger Capacity',
                    value: 100,
                    _id: '65a4d4184fa531643fc8cf5e',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4b',
                    name: 'Crew Capacity',
                    value: 20,
                    _id: '65a4d4184fa531643fc8cf5f',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce55',
                    name: 'Max Speed',
                    value: 600,
                    _id: '65a4d4184fa531643fc8cf60',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4f',
                    name: 'Fuel Capacity',
                    value: 35,
                    _id: '65a4d4184fa531643fc8cf61',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
        },
        {
            size: {
                length: 200,
                width: 80,
                height: 40,
            },
            _id: '65a4d4184fa531643fc8cf80',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'Ferry Cruiser',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Ferry%20Cruiser?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=CwfLcFjiRND3dXyylNsSHrd7pOmBlh7zw8HaXcHMVUpAQKqIBt%2BCT0tIv6LJmbf28VboZX7rRFl%2FqgcXvwYsAeWaln21Wq%2BHz48sbfWEdweiG0V9Fdzg2oqnBlgachFQ63Se45XQc2FhJ6fMzMsL3%2Bnfb%2BJ9kHIMsQUSbsUftqo8%2ByY1I22jOK4HkJmq3H3kdbhdHG0BPcD9WoWuJk6iagLr0C1Wa9XcQVwdZuikAJHSrUbri%2FXayZ2acDgmTD0AfWCWhqW%2B3nT075CZkclWwKfeQvtOk6r7D6KUJGxwrM5x9Z1x9OT0MQWD7TiijCzASgXt5w1INRxtXRHTH5fZgQ%3D%3D&param=1701058116905',
            desc: 'Our ferry comes equipped with modern facilities, including a restaurant with a delectable menu, a cozy café, a shopping center for souvenir hunting, and entertainment for all ages.',
            category: {
                _id: '65a4d4184fa531643fc8cdcf',
                name: 'Ferry',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Ferry Cruiser Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Ferry%20Cruiser%20Owner%20Document%201?generation=1695182510255200&alt=media',
                    _id: '65a4d4184fa531643fc8cf81',
                },
                {
                    documentName: 'Ship Ferry Cruiser Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Ferry%20Cruiser%20Owner%20Document%202?generation=1695182512421863&alt=media',
                    _id: '65a4d4184fa531643fc8cf82',
                },
            ],
            pricePerMonth: 1800000000,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cde5',
                    typeName: 'Passenger Lounge',
                    name: 'First Class Lounge',
                    _id: '65a4d4184fa531643fc8cf83',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Truck Deck',
                    _id: '65a4d4184fa531643fc8cf84',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Car Deck',
                    _id: '65a4d4184fa531643fc8cf85',
                },
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Business Class',
                    _id: '65a4d4184fa531643fc8cf86',
                },
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Economy Class',
                    _id: '65a4d4184fa531643fc8cf87',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce47',
                    name: 'Vehicle Capacity',
                    value: 300,
                    _id: '65a4d4184fa531643fc8cf88',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce49',
                    name: 'Passenger Capacity',
                    value: 1500,
                    _id: '65a4d4184fa531643fc8cf89',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4b',
                    name: 'Crew Capacity',
                    value: 200,
                    _id: '65a4d4184fa531643fc8cf8a',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce55',
                    name: 'Max Speed',
                    value: 800,
                    _id: '65a4d4184fa531643fc8cf8b',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4f',
                    name: 'Fuel Capacity',
                    value: 300,
                    _id: '65a4d4184fa531643fc8cf8c',
                },
            ],
            rating: 5,
            totalRentalCount: 0,
            shipApproved: true,
            __v: 0,
        },
        {
            size: {
                length: 100,
                width: 65,
                height: 10,
            },
            _id: '65a4d4184fa531643fc8cfad',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'MV Seaside Voyager',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Sunny%20Go?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=GWm2EHbaJ8R9NLuicPLRNfRNwSKUiCCNcTou5v6O4UG%2FxAE7ymhoq3zQdNYhKDoWm0IT8rdkLoWmMoAfgOP0GkEeDUa4tU2w9WT0roHA62ayFXo5GDVz1Meeg4G%2B9nCXxjV51V9UZZLyEEamiYKgnm4BxeAMTWByV%2Bs42V%2BBLmADCkULFTRTU2RuKgtJbU7J4HinNwWSN%2FFcJ5XSeNfAr45iJ%2F91McFtjXB0ZlEv5WynEMQkHs%2Fu4c%2FZhL0d3hZvKdBcOs717vPoY19vxpur6kLL58%2B1BzOQwKDNUnfUi2e7dTZ%2FYtiB9n%2B55mqCQ9vrqPV4Pd4wiz2OK%2F7AgZDNUA%3D%3D&param=1701049075231',
            desc: 'MV Seaside Voyager adalah kapal ferry modern yang dirancang khusus untuk memberikan pengalaman perjalanan laut yang nyaman dan aman. Dengan panjang kapal yang mencapai 80 meter, kapal ini mampu menampung sejumlah penumpang dan kendaraan dengan fasilitas yang memadai.',
            category: {
                _id: '65a4d4184fa531643fc8cdcf',
                name: 'Ferry',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Ferry Cruiser Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Ferry%20Cruiser%20Owner%20Document%201?generation=1695182510255200&alt=media',
                    _id: '65a4d4184fa531643fc8cfae',
                },
                {
                    documentName: 'Ship Ferry Cruiser Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Ferry%20Cruiser%20Owner%20Document%202?generation=1695182512421863&alt=media',
                    _id: '65a4d4184fa531643fc8cfaf',
                },
            ],
            pricePerMonth: 999000999,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cde5',
                    typeName: 'Passenger Lounge',
                    name: 'First Class Lounge',
                    _id: '65a4d4184fa531643fc8cfb0',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Truck Deck',
                    _id: '65a4d4184fa531643fc8cfb1',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Car Deck',
                    _id: '65a4d4184fa531643fc8cfb2',
                },
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Business Class',
                    _id: '65a4d4184fa531643fc8cfb3',
                },
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Economy Class',
                    _id: '65a4d4184fa531643fc8cfb4',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce47',
                    name: 'Vehicle Capacity',
                    value: 9,
                    _id: '65a4d4184fa531643fc8cfb5',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce49',
                    name: 'Passenger Capacity',
                    value: 11,
                    _id: '65a4d4184fa531643fc8cfb6',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4b',
                    name: 'Crew Capacity',
                    value: 11,
                    _id: '65a4d4184fa531643fc8cfb7',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce55',
                    name: 'Max Speed',
                    value: 1000,
                    _id: '65a4d4184fa531643fc8cfb8',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4f',
                    name: 'Fuel Capacity',
                    value: 99,
                    _id: '65a4d4184fa531643fc8cfb9',
                },
            ],
            rating: 5,
            totalRentalCount: 300,
            shipApproved: true,
            __v: 0,
        },
    ],
};

const mockGetTopRentedShipsResponse = {
    status: 'success',
    data: [
        {
            size: {
                length: 100,
                width: 65,
                height: 10,
            },
            _id: '65a4d4184fa531643fc8cfad',
            shipOwnerId: '65a4d4184fa531643fc8cdb2',
            name: 'MV Seaside Voyager',
            imageUrl:
                'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Sunny%20Go?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=GWm2EHbaJ8R9NLuicPLRNfRNwSKUiCCNcTou5v6O4UG%2FxAE7ymhoq3zQdNYhKDoWm0IT8rdkLoWmMoAfgOP0GkEeDUa4tU2w9WT0roHA62ayFXo5GDVz1Meeg4G%2B9nCXxjV51V9UZZLyEEamiYKgnm4BxeAMTWByV%2Bs42V%2BBLmADCkULFTRTU2RuKgtJbU7J4HinNwWSN%2FFcJ5XSeNfAr45iJ%2F91McFtjXB0ZlEv5WynEMQkHs%2Fu4c%2FZhL0d3hZvKdBcOs717vPoY19vxpur6kLL58%2B1BzOQwKDNUnfUi2e7dTZ%2FYtiB9n%2B55mqCQ9vrqPV4Pd4wiz2OK%2F7AgZDNUA%3D%3D&param=1701049075231',
            desc: 'MV Seaside Voyager adalah kapal ferry modern yang dirancang khusus untuk memberikan pengalaman perjalanan laut yang nyaman dan aman. Dengan panjang kapal yang mencapai 80 meter, kapal ini mampu menampung sejumlah penumpang dan kendaraan dengan fasilitas yang memadai.',
            category: {
                _id: '65a4d4184fa531643fc8cdcf',
                name: 'Ferry',
            },
            tags: [],
            shipDocuments: [
                {
                    documentName: 'Ship Ferry Cruiser Owner Document1',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Ferry%20Cruiser%20Owner%20Document%201?generation=1695182510255200&alt=media',
                    _id: '65a4d4184fa531643fc8cfae',
                },
                {
                    documentName: 'Ship Ferry Cruiser Owner Document2',
                    documentUrl:
                        'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Ferry%20Cruiser%20Owner%20Document%202?generation=1695182512421863&alt=media',
                    _id: '65a4d4184fa531643fc8cfaf',
                },
            ],
            pricePerMonth: 999000999,
            facilities: [
                {
                    type: '65a4d4184fa531643fc8cde5',
                    typeName: 'Passenger Lounge',
                    name: 'First Class Lounge',
                    _id: '65a4d4184fa531643fc8cfb0',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Truck Deck',
                    _id: '65a4d4184fa531643fc8cfb1',
                },
                {
                    type: '65a4d4184fa531643fc8cde3',
                    typeName: 'Vehicle Deck',
                    name: 'Car Deck',
                    _id: '65a4d4184fa531643fc8cfb2',
                },
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Business Class',
                    _id: '65a4d4184fa531643fc8cfb3',
                },
                {
                    type: '65a4d4184fa531643fc8cde1',
                    typeName: 'Passenger Seating',
                    name: 'Economy Class',
                    _id: '65a4d4184fa531643fc8cfb4',
                },
            ],
            specifications: [
                {
                    spesificationId: '65a4d4184fa531643fc8ce47',
                    name: 'Vehicle Capacity',
                    value: 9,
                    _id: '65a4d4184fa531643fc8cfb5',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce49',
                    name: 'Passenger Capacity',
                    value: 11,
                    _id: '65a4d4184fa531643fc8cfb6',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4b',
                    name: 'Crew Capacity',
                    value: 11,
                    _id: '65a4d4184fa531643fc8cfb7',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce55',
                    name: 'Max Speed',
                    value: 1000,
                    _id: '65a4d4184fa531643fc8cfb8',
                },
                {
                    spesificationId: '65a4d4184fa531643fc8ce4f',
                    name: 'Fuel Capacity',
                    value: 99,
                    _id: '65a4d4184fa531643fc8cfb9',
                },
            ],
            rating: 5,
            totalRentalCount: 300,
            shipApproved: true,
            __v: 0,
        },
    ],
};

mockAdapter
    .onGet('/ship-owner/get-ship-owner-data')
    .reply(200, mockGetShipOwnerDataResponse);

AsyncStorage.setItem(
    USERDATA,
    JSON.stringify({
        name: 'Fauzan',
        email: 'mfauzan120202@gmail.com',
        phoneNumber: '089690746351',
        isVerified: false,
        isPhoneVerified: false,
        isCompanySubmitted: false,
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/shiphire-fdb0e.appspot.com/o/Profile%20Picture%2FIMG_20210120_153751.jpg?alt=media&token=8f9b9b9a-9b9a-4e4e-8e9a-9b9a9b9a9b9a',
        isCompanyVerified: false,
        isCompanyRejected: false,
    }),
);

describe('Testing Home Screen', () => {
    describe('Snapshot Testing', () => {
        it('should render home screen correctly', async () => {
            const homeScreenOwner = render(homeMockComponent);
            expect(homeScreenOwner).toMatchSnapshot();
        });
    });

    describe('Unit Testing', () => {
        it('should show name of ship owner in header', async () => {
            const { getByText } = render(homeMockComponent);

            const textName = getByText('textGreet');

            expect(textName).toBeTruthy();
        });
        it('should handle error when get top rented ships error', async () => {
            const { getByText } = render(homeMockComponent);
            mockAdapter
                .onGet('/ship-owner/get-top-rented-ships')
                .reply(401, { status: 'failed' });

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedTokenExpired',
                });

                jest.advanceTimersByTime(4000);
            });
        });
        it('should handle error when get top rated ships error', async () => {
            const { getByText } = render(homeMockComponent);
            mockAdapter
                .onGet('/ship-owner/get-top-rated-ships')
                .reply(401, { status: 'failed' });

            await waitFor(() => {
                const modalState = store.getState().modal;

                expect(modalState).toEqual({
                    visible: true,
                    status: 'failed',
                    text: 'failedTokenExpired',
                });

                jest.advanceTimersByTime(4000);
            });
        });
        it('should render top rated ships correctly', async () => {
            const { getByTestId } = render(homeMockComponent);

            mockAdapter
                .onGet('/ship-owner/get-top-rated-ships')
                .reply(200, mockGetTopRatedShipsResponse);

            await waitFor(() => {
                const carouselTopRatedShips = getByTestId(
                    'carouselTopRatedShips',
                );
                const carouselComponentTopRatedShips = getByTestId(
                    'carouselComponentTopRatedShips-1',
                );
                fireEvent.press(carouselComponentTopRatedShips);

                expect(carouselTopRatedShips).toBeDefined();
                expect(carouselComponentTopRatedShips).toBeDefined();
            });
        });
        it('should render top rented ships correctly', async () => {
            const { getByTestId } = render(homeMockComponent);

            mockAdapter
                .onGet('/ship-owner/get-top-rented-ships')
                .reply(200, mockGetTopRentedShipsResponse);

            await waitFor(() => {
                const contentTopRentedShips = getByTestId(
                    'shipListViewTopRented',
                );

                expect(contentTopRentedShips).toBeDefined();
            });
        });
        it('should navigate to Transaction Screen when click Transaction icon', async () => {
            const { getByTestId } = render(homeMockComponent);

            const buttonTransaction = getByTestId('transactionButton');
            fireEvent.press(buttonTransaction);

            expect(getByTestId('RequestForQuoteStatsScreen')).toBeDefined();
        });
        it('should navigate to Ships Screen when click View All', async () => {
            const { getByTestId } = render(homeMockComponent);

            const buttonViewAll = getByTestId('viewAllButton');
            fireEvent.press(buttonViewAll);

            expect(getByTestId('shipsScreen')).toBeDefined();
        });
    });
});
