import Ship from '../models/Ship';
import ShipCategory from '../models/ShipCategory';
import ShipFacility from '../models/ShipFacility';
import ShipFacilityCategory from '../models/ShipFacilityCategory';
import ShipOwner from '../models/ShipOwner';
import ShipSpecification from '../models/ShipSpecification';

const expiredDate = new Date(2100, 11, 31);

const ships = [
    {
        shipOwnerId: 'Fauzan',
        name: 'Barge Hauler',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Barge%20Hauler?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=BmuSrc1ujivUWLEr4nH6YW%2BDrF5AAYBC5ILuijc3IZLecUPbajy6p8BF4KbtCJi9n7Ud0UjRvYrW%2FdNXN2S%2Bg2ie1vNu9XOAG0QFRwx03WKcyJ4X4oODpwgiI1j9RLCX2c4vFXAMjvlsqGMoZqLkEEn7pMnLu0lX8RxnZgE5Iv5JH%2FjiRG3LfpcDTmOgf9LECum01nS%2BW%2Bcto7Vs3g2YpanAWCvaq5vvwU3G765WhumhBPRNoQwMAAlqgXdZAEzQ4hqfrF3Fc8V9GmcGQVm2YwL2eNdZmR0djWWGU5gZx6opiCjwJlirmgJfAy4Q%2BB3LRoi7Zhh9xtZdOZm2Tz4j0g%3D%3D&param=1707120670883',
        province: 'Kalimantan Timur',
        city: 'Samarinda',
        desc: 'Barge Hauler is a heavy-duty cargo barge designed to transport goods and materials across rivers, lakes, and coastal areas. Equipped with robust loading and unloading mechanisms, it can handle large and bulky items with ease. Barge Hauler plays a crucial role in facilitating the movement of essential commodities and equipment for various industries.',
        category: 'Barge',
        size: {
            length: 400,
            width: 75,
            height: 20,
        },
        shipDocuments: [
            {
                documentName: 'Ship Barge Hauler Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Barge Hauler Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Barge Hauler Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Barge Hauler Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Barge Hauler Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 900000000,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Cargo Handling Equipment',
                name: 'Cranes',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Cargo Handling Equipment',
                name: 'Conveyor Belt',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Deck Cranes',
                name: 'Hydraulic Winches',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Vehicle Capacity',
                value: 100,
            },
        ],
        rating: 5,
        totalRentalCount: 0,
        shipApproved: true,
    },
    {
        shipOwnerId: 'Fauzan',
        name: 'Swift Tow',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Swift%20Tow?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=fAR%2FBvTTGbnZSdgIBWl0QKJAmfX5YuY99zgQNuDLngxOWPlMkWptx7L171j0REuFrlylqZ%2F1uIrxm9NvRnDfNiGpg7CnaGsbwD6iXb3syF%2F8rFJROSYWJmAD%2B2sKqWDaRptZzJ3zXCiLK6hrgMruuf9N9pifLx4xX%2FRJy%2Fu2WBsaOMb0GcfFoEh7u9lRZ2vaX4QRjVuTlOMlYB669IIhXvLHSB651nHWZ6Nl0ceTgfHEEkOJb9nCMRWtt7Z2YU5YP98QK4416twCTHhe24UGjlX3Az18V7%2FbU6%2BJf85A3Jy2H%2BzUc3SlhTGS4sxh5BIaoM6b6%2FCq92TfiVLL2r5PWA%3D%3D&param=1707120314116',
        province: 'Kalimantan Timur',
        city: 'Balikpapan',
        desc: 'Swift Tow is a highly maneuverable and efficient tugboat designed to handle a wide range of towing tasks. Its compact size and powerful engines make it suitable for both port operations and offshore assistance.',
        category: 'Tugboat',
        size: {
            length: 35,
            width: 12,
            height: 5,
        },
        shipDocuments: [
            {
                documentName:
                    'Ship Swift Tow Owner Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Swift Tow Owner Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Swift Tow Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Swift Tow Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Swift Tow Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 110000000,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Towing Equipment',
                name: 'Electric Towing Winches',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Towing Equipment',
                name: 'Towing Hooks',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Navigation Aids',
                name: 'GPS',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Towing Capacity',
                value: 100,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Draft',
                value: 2,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Fuel Capacity',
                value: 100,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Traction',
                value: 30,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Capacity',
                value: 6,
            },
        ],
        rating: 5,
        totalRentalCount: 0,
        shipApproved: true,
    },
    {
        shipOwnerId: 'Fauzan',
        name: 'Island Hopper',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Island%20Hopper?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=Rq%2BWliFsxwjby9pFF6sveAsZK3fPF3%2FSHFDQ9KsiCAJ09N3SeXrLeFnvdfmlAvZLCwK6RPaCwzCyH%2Boxdn84WAU7bP8t42844GuwtzV72V4xTxoPJMNp6qWlEfx%2F%2FuK60MqrTwdYAtlUKjN1V9y0Lfk5mzJcink7mUYIUgnT7e9pyCAjkuq9Sj3HP69crMkCTSU%2BxTaeWsx3FswErvJ3ySXxhoFkqRt%2FELF%2BlvW5DV87uu1kDzNsJBKSpFMH07LzfNNBoJUSFhwjWfringrtUs0qpLYDbSDzOcls7QCsqX6WazIZeaXHXFBgxzDWTpLUG5vMv2uCw0B3qnu9hqrhCA%3D%3D&param=1701057586826',
        province: 'Kalimantan Timur',
        city: 'Samarinda',
        desc: 'Island Hopper is a passenger ferry designed to transport people and vehicles between islands and coastal regions. With its comfortable seating arrangements and vehicle-carrying capacity, it ensures a smooth and enjoyable journey for passengers.',
        category: 'Ferry',
        size: {
            length: 60,
            width: 20,
            height: 10,
        },
        shipDocuments: [
            {
                documentName:
                    'Ship Island Hopper Owner Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Island Hopper Owner Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Island Hopper Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Island Hopper Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Island Hopper Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 150000000,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Passenger Seating',
                name: 'Economy Class',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Passenger Seating',
                name: 'Business Class',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Vehicle Deck',
                name: 'Car Deck',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Vehicle Capacity',
                value: 30,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Passenger Capacity',
                value: 150,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Crew Capacity',
                value: 20,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Max Speed',
                value: 200,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Fuel Capacity',
                value: 60,
            },
        ],
        rating: 5,
        totalRentalCount: 0,
        shipApproved: true,
    },
    {
        shipOwnerId: 'Fauzan',
        name: 'Cargo Carrier',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Cargo%20Carrier?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=jtFgSw18kaFu7NGRYv9YYfUunj1XqBzmZ5CELfh%2BjLz5Ea4dP5isnDpMDCuQVp5giXfjlOypyvyQnUx3iLWE%2FfL1pMhcWONWpWdSEMcg9zgSYElZgJQw3BHKeh8C0a2WGvyfm9q%2BlS%2Fpx%2BpKbhDuvHZEvGNs5OnGxLrLmDzHj50CnRTH5H%2BYYrFpNhPcskwqT4Tz0ZybC34HgmVCN3sBNa9dZnUxi3Gz34RV%2FgJZgQB%2BgIUbJAtAYFL6Wj7PphKhOYbHE%2BElz5nm1I1XYkT8fJ6c%2BzrRtsB3ApmCA1ZKT1YYvBaHD42EjD9OMizVO0ETX%2F9%2Ba6uipRQrv59bSlGRvQ%3D%3D',
        province: 'Kalimantan Timur',
        city: 'Balikpapan',
        desc: 'Cargo Carrier is a versatile barge designed to transport various types of goods and equipment across water bodies. With its spacious deck and robust construction, it provides a reliable and cost-effective solution for cargo transportation.',
        category: 'Barge',
        size: {
            length: 350,
            width: 75,
            height: 15,
        },
        shipDocuments: [
            {
                documentName:
                    'Ship Cargo Carrier Owner Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Cargo Carrier Owner Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Cargo Carrier Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Cargo Carrier Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Cargo Carrier Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 700000000,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Cargo Handling Equipment',
                name: 'Cranes',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Cargo Handling Equipment',
                name: 'Pumps',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Cargo Handling Equipment',
                name: 'Conveyor Belt',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Deck Cranes',
                name: 'Telescopic Cranes',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Deck Cranes',
                name: 'Hydraulic Winches',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Capacity',
                value: 200,
            },
        ],
        rating: 5,
        totalRentalCount: 0,
        shipApproved: true,
    },
    {
        shipOwnerId: 'Fauzan',
        name: 'Mighty Tug',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Mighty%20Tug?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=QY6dG4ju8MXNInW14uv0T3WHehSuh%2BIpRFafaGuk2uTOwAFQlEFFSgXv3fMGsYTKE6z%2B6l6sMf9BdVi9ufto2IlUl8GumI%2F%2BhlJHyk%2BpSse26u1ep0aRiWLz2v6y%2BUDZR2Aj6PYM6drVm0KSNxcGybtXL2XvW4B7O5JqzUgryQHlnUHZbs%2F0BaHJkE1XUhH8PjM6fwOGpZq82SYSX4qczQSVuSKoEOIC5g7LOm0cZXxiTPz4UWVfxnFunMTp56KQgDFDpLycHHHgrZLi8jGRzj5HH5qiodtHBKQslKQZRz08PGjqfOVFCFQzSbFywnDRm%2FLrkz17I3Np0co9LfP3Lw%3D%3D',
        province: 'Kalimantan Selatan',
        city: 'Banjarmasin',
        desc: 'Mighty Tug is a powerful and compact tugboat designed to assist larger vessels in docking, undocking, and maneuvering in confined waterways. Its high towing capacity and agile performance make it a reliable companion for maritime operations.',
        category: 'Tugboat',
        size: {
            length: 40,
            width: 15,
            height: 6,
        },
        shipDocuments: [
            {
                documentName:
                    'Ship Mighty Tug Owner Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Mighty Tug Owner Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Mighty Tug Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Mighty Tug Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Mighty Tug Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 120000000,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Towing Equipment',
                name: 'Electric Towing Winches',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Navigation Aids',
                name: 'GPS',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Towing Equipment',
                name: 'Towing Hooks',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Towing Capacity',
                value: 100,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Draft',
                value: 3,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Fuel Capacity',
                value: 70,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Traction',
                value: 30,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Capacity',
                value: 6,
            },
        ],
        rating: 5,
        totalRentalCount: 0,
        shipApproved: true,
    },
    {
        shipOwnerId: 'Fauzan',
        name: 'Coastal Cruiser',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Coastal%20Cruiser?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=ixK98%2FusIcqEl%2BVrzD%2BphG51OzPxJuo8kWJI%2Fx%2BFWBQnBPaUKQYAyHjLeV9jT%2FrW9mO1VPObxoEqdg7TP%2F0ILQBNyYYW1wCsEkF3EzfiaHfG0WspxN5wfRgDD7moMkUJ2HVhl9us3bzWqZBXWYInurycMB%2Fh5u1sQnLlRw17Ze0iwLxevuYpXEZJvrQfOHAKCUBRsGreDSxZNvLYEYZEWdc4Dg0su1Iz95B6HTDL9TEbN%2BhhuvR1HXLdGIvHuVrorrtvhDK%2FVpv%2F5wi%2BXz2hlFqvE7a%2Bk6nMgBihnH6reXGDkO5zu7rexmEpGHX6KzwFjjUjU%2F1rSfQv2kchp1eotw%3D%3D&param=1707120141606',
        province: 'Kalimantan Timur',
        city: 'Samarinda',
        desc: 'Coastal Cruiser is a modern passenger ferry designed to provide a comfortable and safe journey along coastal routes. Equipped with advanced navigation systems and luxurious amenities, it offers a delightful travel experience for passengers.',
        category: 'Ferry',
        size: {
            length: 75,
            width: 25,
            height: 8,
        },
        shipDocuments: [
            {
                documentName:
                    'Ship Coastal Cruiser Owner Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Coastal Cruiser Owner Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Coastal Cruiser Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Coastal Cruiser Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Coastal Cruiser Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 180000000,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Passenger Seating',
                name: 'Economy Class',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Vehicle Deck',
                name: 'Car Deck',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Passenger Lounge',
                name: 'First Class Lounge',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Vehicle Capacity',
                value: 20,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Passenger Capacity',
                value: 100,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Crew Capacity',
                value: 20,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Max Speed',
                value: 600,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Fuel Capacity',
                value: 35,
            },
        ],
        rating: 5,
        totalRentalCount: 0,
        shipApproved: true,
    },
    {
        shipOwnerId: 'Fauzan',
        name: 'Ferry Cruiser',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20Ferry%20Cruiser?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=CwfLcFjiRND3dXyylNsSHrd7pOmBlh7zw8HaXcHMVUpAQKqIBt%2BCT0tIv6LJmbf28VboZX7rRFl%2FqgcXvwYsAeWaln21Wq%2BHz48sbfWEdweiG0V9Fdzg2oqnBlgachFQ63Se45XQc2FhJ6fMzMsL3%2Bnfb%2BJ9kHIMsQUSbsUftqo8%2ByY1I22jOK4HkJmq3H3kdbhdHG0BPcD9WoWuJk6iagLr0C1Wa9XcQVwdZuikAJHSrUbri%2FXayZ2acDgmTD0AfWCWhqW%2B3nT075CZkclWwKfeQvtOk6r7D6KUJGxwrM5x9Z1x9OT0MQWD7TiijCzASgXt5w1INRxtXRHTH5fZgQ%3D%3D&param=1701058116905',
        province: 'Kalimantan Timur',
        city: 'Samarinda',
        desc: 'Our ferry comes equipped with modern facilities, including a restaurant with a delectable menu, a cozy café, a shopping center for souvenir hunting, and entertainment for all ages.',
        category: 'Ferry',
        size: {
            length: 200,
            width: 80,
            height: 40,
        },
        shipDocuments: [
            {
                documentName:
                    'Ship Ferry Cruiser Owner Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Ferry Cruiser Owner Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Ferry Cruiser Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Ferry Cruiser Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Ferry Cruiser Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 1800000000,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Passenger Lounge',
                name: 'First Class Lounge',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Vehicle Deck',
                name: 'Truck Deck',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Vehicle Deck',
                name: 'Car Deck',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Passenger Seating',
                name: 'Business Class',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Passenger Seating',
                name: 'Economy Class',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Vehicle Capacity',
                value: 300,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Passenger Capacity',
                value: 1500,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Crew Capacity',
                value: 200,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Max Speed',
                value: 800,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Fuel Capacity',
                value: 300,
            },
        ],
        rating: 5,
        totalRentalCount: 0,
        shipApproved: true,
    },
    {
        shipOwnerId: 'Fauzan',
        name: 'MV Seaside Voyager',
        imageUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Ship%20MV%20Seaside%20Voyager?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=pt4Izdq4uAXRpjOSumsZO8vXd2PMyhGDqaDXozjBBIjmxA3B1Z1SOUj4p4SkrcjmyfuNW6IaSVIdDWlDk8jiwtEmymC4jvOEV0K23GnWq%2BqqMg%2Fcz4HllU6QfDambV%2FTJvmwzbVb2YLy%2BiwJ5Uoch7TmjFWbXso25rvCi9hz2Rq8ACvEnMMMV6e7yHBqgQmrrUUf5wGXHqDwiAJffxqpV7YI8xdYTKA5x8m2u6xtT7PuML%2Bvk7fQ3tJeMKbSMeA4DUrj60yuT6w%2B9wik7pQLbgmMkIXq8FI81M2XJOqnNqEcMDCnlcLNrGhV2YUrOsq3%2F%2B%2FgX5DdRKZoAZuEWFPCEg%3D%3D&param=1707119776438',
        province: 'Kalimantan Timur',
        city: 'Samarinda',
        desc: 'MV Seaside Voyager adalah kapal ferry modern yang dirancang khusus untuk memberikan pengalaman perjalanan laut yang nyaman dan aman. Dengan panjang kapal yang mencapai 80 meter, kapal ini mampu menampung sejumlah penumpang dan kendaraan dengan fasilitas yang memadai.',
        category: 'Ferry',
        size: {
            length: 100,
            width: 65,
            height: 10,
        },
        shipDocuments: [
            {
                documentName:
                    'Ship Ferry Cruiser Owner Owner CertificateOfRegister',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Ferry Cruiser Owner Owner safetyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Ferry Cruiser Owner seaworthyCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName:
                    'Ship Ferry Cruiser Owner shipMeasurementCertificate',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
            {
                documentName: 'Ship Ferry Cruiser Owner shipInsurance',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Ship%20Kapal%20Kapalan%20Owner%20CertificateOfRegister?generation=1705047911333326&alt=media',
                documentExpired: expiredDate,
            },
        ],
        pricePerMonth: 999000999,
        facilities: [
            {
                type: '60b9b0b3b3b3b3b3b3b3b3c',
                typeName: 'Passenger Lounge',
                name: 'First Class Lounge',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3d',
                typeName: 'Vehicle Deck',
                name: 'Truck Deck',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Vehicle Deck',
                name: 'Car Deck',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Passenger Seating',
                name: 'Business Class',
            },
            {
                type: '60b9b0b3b3b3b3b3b3b3b3e',
                typeName: 'Passenger Seating',
                name: 'Economy Class',
            },
        ],
        specifications: [
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Vehicle Capacity',
                value: 9,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Passenger Capacity',
                value: 11,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Crew Capacity',
                value: 11,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Max Speed',
                value: 1000,
            },
            {
                spesificationId: '60b9b0b3b3b3b3b3b3b3b3e',
                name: 'Fuel Capacity',
                value: 99,
            },
        ],
        rating: 5,
        totalRentalCount: 300,
        shipApproved: true,
    },
];

export const seedShips = async () => {
    try {
        const shipFacilitiesTemp = [];
        const shipSpecificationsTemp = [];
        for (const ship of ships) {
            const category = await ShipCategory.findOne({
                name: ship.category,
            });

            const shipOwner = await ShipOwner.findOne({
                name: ship.shipOwnerId,
            });

            for (const facility of ship.facilities) {
                const facilityType = await ShipFacilityCategory.findOne({
                    name: facility.typeName,
                });
                shipFacilitiesTemp.push({
                    type: facilityType._id,
                    name: facility.name,
                    typeName: facility.typeName,
                });
            }

            for (const specification of ship.specifications) {
                const specificationType = await ShipSpecification.findOne({
                    name: specification.name,
                });

                shipSpecificationsTemp.push({
                    spesificationId: specificationType._id,
                    name: specification.name,
                    value: specification.value,
                });
            }

            const shipAdded = new Ship({
                shipOwnerId: shipOwner._id,
                name: ship.name,
                imageUrl: ship.imageUrl,
                province: ship.province,
                city: ship.city,
                desc: ship.desc,
                category: category._id,
                size: ship.size,
                shipDocuments: ship.shipDocuments,
                pricePerMonth: ship.pricePerMonth,
                facilities: shipFacilitiesTemp,
                specifications: shipSpecificationsTemp,
                rating: ship.rating,
                totalRentalCount: ship.totalRentalCount,
                shipApproved: ship.shipApproved,
            });
            await shipAdded.save();
            await ShipOwner.findOneAndUpdate(
                { name: ship.shipOwnerId },
                {
                    $push: {
                        ships: {
                            shipId: shipAdded._id,
                            shipName: shipAdded.name,
                        },
                    },
                },
            );
            shipFacilitiesTemp.length = 0;
            shipSpecificationsTemp.length = 0;
            console.log(`Ship ${ship.name} added`);
        }
    } catch (error) {
        console.error('Error seeding ships:', error);
    }
};
