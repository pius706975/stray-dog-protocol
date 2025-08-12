import Transaction from '../models/Transaction';
import Renter from '../models/Renter';
import ShipCategory from '../models/ShipCategory';
import Ship from '../models/Ship';
import RequestForQuote from '../models/RequestForQuote';
import Proposal from '../models/Proposal';
import Contract from '../models/Contract';
import moment from 'moment';

const rentalStartDate = moment(new Date());
const rentalEndDate = moment(new Date()).add(10, 'days');

const transactions = [
    // {
    //     rentalId: 'SH-09212023-1f5a3e42',
    //     renter: 'Azis',
    //     offeredPrice: 1234009000,
    //     rentalDuration: 127,
    //     rentalStartDate: rentalStartDate,
    //     rentalEndDate: rentalEndDate,
    //     ship: 'MV Seaside Voyager',
    //     category: 'Ferry',
    //     shipRentType: 'One Time Rent',
    //     rfq: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a97b63051e32687e20397-650a97b63051e32687e20397?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=j8rZE5yjfeaUVJ60pj22RQ13Bxohy7DIfecUkjixPLyDnPvSfEdjYA5AkWbPInCcAb7Ql2WI2%2FcPaj3Sf3h%2FktTLKDteOzuxG%2FhHTsS%2BMMSjxwRCZ8BRgAdkoRtjXAtyt0kjcyPLHy9NUejChl1wNCm%2FWlta5tFlugS4mNj46dmt%2FkdEUTOM%2F%2FwRyw21i9VXE9%2FH6znPs%2Bv%2Bl21TR5g4Oipw7DFJfrTeronBo7eMT%2FrYBoSiVnroeQkzvyCA%2BfLdMvrM5QxS99CxwxmyQkRkiiQtACs7S7mSrylCIxgXNervMCMZn4ahRENVvmvGUCXlgdz33%2BHvZgiHXqRiqqJB7Q%3D%3D',
    // proposal: {
    //     url: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/thereactnativebook-sample.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=AvVM%2BcUmY0z%2FgeUTxT9i%2F4XqkC8zJ3KYX23svHDzZcU6%2BYk3ZFDeUHgeAL2NndbdEOlmEIUBlcQB5drzvMGLO3AECyel9cn5VSwlF3wZA%2BYKHPkFqzEs%2F%2FudniYpUwN%2F5o1%2FPll18hgaWRxDDKp7GtH44pxAbsKjOdV9SuSPy0XDP8bkloclgEg6E53TApjlPXItLki8pjWuwPMdXu8Ombkip2i1bfabtDtkDV42o%2BFHn2jZCCT4u3d31WFg0j4VhvnkGh82rERyyXbduJv05zhPM1NWF5I9XHMHOGUZfT%2F4RowuIqOWjH2P3khhV15yK2BrfwiXvFPam3YzmttKZg%3D%3D',
    // },
    // status: [
    //     {
    //         name: 'rfq 1',
    //         desc: 'RFQ sent',
    //         date: new Date(),
    //         isOpened: false,
    //     },
    // {
    //     name: 'rfq 2',
    //     desc: 'RFQ accepted',
    //     // one day after rfq sent
    //     date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    //     isOpened: true,
    // },
    // {
    //     name: 'proposal 1',
    //     desc: 'Proposal received',
    //     // two days after rfq accepted
    //     date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    //     isOpened: true,
    // },
    // {
    //     name: 'proposal 2',
    //     desc: 'Proposal signed',
    //     date: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
    //     isOpened: true,
    // },
    // {
    //     name: 'proposal 3',
    //     desc: 'Payment receipt sent',
    //     date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    //     date: new Date(),
    //     isOpened: true,
    // },
    // {
    //     name: 'proposal 4',
    //     desc: 'Payment approved',
    //     date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    //     isOpened: false,
    // },
    // {
    //     name: 'contract 1',
    //     desc: 'Contract received',
    //     date: new Date(),
    //     isOpened: false,
    // },
    // {
    //     name: 'complete',
    //     desc: 'Contract signed',
    //     date: new Date(),
    //     isOpened: false,
    // },
    //     ],
    //     receiptUrl:
    //         'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/SH-09212023-1f5a3e42%20payment%20receipt?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=RhaVEbpKTvDcyZ2K4vAf%2FYm9I3w1d%2BwngKD32%2BuMYkmrxZMkDCEVf2oTjb8EfsPMUO%2FKd74G1P%2FWpvUxqhtFhqvMjzWLApgW8ILAsTcIMaXvvoW01rtPKo9bi%2BimI0M8WDshnvwiYRmGm3pk6BuBm1LC18Rvx2w%2BgnDDr9B1zN%2BnLt%2FcAxNGvBNC%2BwGOiFSuozP9zIs0vuT2PKOWmYHLOsU3p2bTF5L1ltUAq06MzlZoin0Im%2BGAC0qGaV4Z144gBaDREzUsZEIP1u0HVRgqLJ9AK59tFq%2FOSPHlhjKSmiMCiUDhm1xLr17IJczL3VHdLs8zWbnQUQtWK7wWxYXSAg%3D%3D',
    //     paymentApproved: true,
    // },
    // {
    //     rentalId: 'SH-09212023-63c96de3',
    //     renter: 'Azis',
    //     rentalDuration: 456,
    //     rentalStartDate: moment('21 September 2023', 'DD MMMM YYYY').toDate(),
    //     rentalEndDate: moment('21 December 2024', 'DD MMMM YYYY').toDate(),
    //     ship: 'Cargo Carrier',
    //     category: 'Barge',
    //     shipRentType: 'One Time Rent',
    //     rfq: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a6891b032b67aaa4ebbc5-650a6891b032b67aaa4ebbc5?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=nP%2Bq3vHiqkN%2FVWz0HJ4U1X3Z9IsInCT7dg%2BSjL6xxU4jRi6tyS23VJdu5%2BhYPrgHnwvEDvvqqryz%2Fqco%2FvXmLirRzaHByvsn%2Bewq%2F0CWp94PsNJLbkWgs7awAOFHa8P0g6A8h94CZqg4OFtOADVX7TNwH0nZSsnnLeWJCoHf80x3UsL2QGJH8f3K9KWlb13nyagbuGk81nxzZVTE0w%2FlBo0cKDOXlqulryIQVhihYF49mtdsc5Yxb5LK6oO7NNxwhZQGKJkt%2FwH8WPSmGeZK1GCI%2FubV97P9BK%2Fm9srXPdproYAcxY%2FpoqpCEuPFjYtMCqhUsve2C%2BBKaJ9oMX97ng%3D%3D',
    // proposal: {
    //     url: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/thereactnativebook-sample.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=AvVM%2BcUmY0z%2FgeUTxT9i%2F4XqkC8zJ3KYX23svHDzZcU6%2BYk3ZFDeUHgeAL2NndbdEOlmEIUBlcQB5drzvMGLO3AECyel9cn5VSwlF3wZA%2BYKHPkFqzEs%2F%2FudniYpUwN%2F5o1%2FPll18hgaWRxDDKp7GtH44pxAbsKjOdV9SuSPy0XDP8bkloclgEg6E53TApjlPXItLki8pjWuwPMdXu8Ombkip2i1bfabtDtkDV42o%2BFHn2jZCCT4u3d31WFg0j4VhvnkGh82rERyyXbduJv05zhPM1NWF5I9XHMHOGUZfT%2F4RowuIqOWjH2P3khhV15yK2BrfwiXvFPam3YzmttKZg%3D%3D',
    // },
    //     status: [
    //         {
    //             name: 'rfq 1',
    //             desc: 'RFQ sent',
    //             date: new Date(),
    //             isOpened: false,
    //         },
    //         {
    //             name: 'rfq 2',
    //             desc: 'RFQ accepted',
    //             // one day after rfq sent
    //             date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    //             isOpened: true,
    //         },
    //     ],
    // },
    // {
    //     rentalId: 'SH-09212023-f42e6b08',
    //     renter: 'Azis',
    //     offeredPrice: 4366999900,
    //     rentalDuration: 108,
    //     rentalStartDate: moment('21 September 2023', 'DD MMMM YYYY').toDate(),
    //     rentalEndDate: moment('08 January 2024', 'DD MMMM YYYY').toDate(),
    //     ship: 'Island Hopper',
    //     category: 'Ferry',
    //     shipRentType: 'Monthly Rent',
    //     rfq: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a66ccb032b67aaa4eba7f-650a66ccb032b67aaa4eba7f?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=hGwTwCakRg5oP6miRJB8eC1LzAcbPW3TJq3Isd%2BCNcr98VJ%2FokidKjDYNAZCX3hoATtPmkwMrIqaPMXFQ5xxD%2Fyicp6emg9EhJCt0Vk8bvJ%2FthPsS78ECDgDUA8gtUvTDId1f8zp%2F7m6INhqSMfIKGtq0qNLRzIyg2JyAoC8Lh94REgHAtAkBf%2BR92f69F0HCJR9J78hOungkGQwcqhOrIOtSCm3tBj1F8lYF7grCSfN9yYXTm2y8tposFVhOPETyx1EEA%2BCWKgqsSLD18W%2BNNKS9dR%2B8KHgZLBZoci0BXPp58Bd2rdDSFSobyQHOAUGn%2FEpJWWk8L6GOv26vNL7dQ%3D%3D',
    //     proposal: {
    //         url: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/thereactnativebook-sample.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=AvVM%2BcUmY0z%2FgeUTxT9i%2F4XqkC8zJ3KYX23svHDzZcU6%2BYk3ZFDeUHgeAL2NndbdEOlmEIUBlcQB5drzvMGLO3AECyel9cn5VSwlF3wZA%2BYKHPkFqzEs%2F%2FudniYpUwN%2F5o1%2FPll18hgaWRxDDKp7GtH44pxAbsKjOdV9SuSPy0XDP8bkloclgEg6E53TApjlPXItLki8pjWuwPMdXu8Ombkip2i1bfabtDtkDV42o%2BFHn2jZCCT4u3d31WFg0j4VhvnkGh82rERyyXbduJv05zhPM1NWF5I9XHMHOGUZfT%2F4RowuIqOWjH2P3khhV15yK2BrfwiXvFPam3YzmttKZg%3D%3D',
    //     },
    //     status: [
    //         {
    //             name: 'rfq 1',
    //             desc: 'RFQ sent',
    //             date: new Date(),
    //             isOpened: true,
    //         },
    //         {
    //             name: 'rfq 2',
    //             desc: 'RFQ accepted',
    //             // one day after rfq sent
    //             date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    //             isOpened: true,
    //         },
    //         {
    //             name: 'proposal 1',
    //             desc: 'Proposal received',
    //             // two days after rfq accepted
    //             date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    //             isOpened: true,
    //         },
    //         {
    //             name: 'proposal 2',
    //             desc: 'Proposal signed',
    //             date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    //             isOpened: true,
    //         },
    //         {
    //             name: 'proposal 3',
    //             desc: 'Payment receipt sent',
    //             date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    //             date: new Date(),
    //             isOpened: true,
    //         },
    //         {
    //             name: 'proposal 4',
    //             desc: 'Payment approved',
    //             date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    //             isOpened: false,
    //         },
    //         // {
    //         //   name: "contract 1",
    //         //   desc: "Contract received",
    //         //   date: new Date(),
    //         //   isOpened: false,
    //         // },
    //         // {
    //         //   name: "complete",
    //         //   desc: "Contract signed",
    //         //   date: new Date(),
    //         //   isOpened: true,
    //         // },
    //     ],
    //     receiptUrl:
    //         'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/SH-09212023-f42e6b08%20payment%20receipt?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=M8jGaoKYjBN%2FnIbM08TfCN1vh0%2Ft78bPe6aE0W9ljUUlD8HdMDcPSvYECiOgWaI3wDp26Qc6vi03oQNLi6sLEdfexh7VaxLV0A4Ke5Eqne%2B6usoX%2FqkIqcFjy51C3gL0Ug0V0cYZi3zWJRnoCep%2BZh3BVYaDESfiaFAjl%2BFsiY7wHBOuAx3i5vL0iWPlfO6mbugC6mnZkrGrnuVT%2BWzEyVzFoMWPpQsDHfmxeZKCbBdWZe8uwTEL7xlourKf34z0oBeGKxkjWyElAgcT2GCrrdKC1mnoXfVkDVmNTVeTBjQ%2Fselxj3ms8vvxsQU%2FpgMLNxQi3IV6JaZ9kgYI%2F6TINA%3D%3D',
    //     paymentApproved: true,
    // },
    {
        rentalId: 'SH-01112024-2b070a66',
        renter: 'Azis',
        rentalDuration: 10,
        rentalStartDate: rentalStartDate,
        rentalEndDate: rentalEndDate,
        needs: 'Human Trafficking',
        locationDestination: 'Shanghai',
        locationDeparture: 'Samarinda',
        shipName: 'MV Seaside Voyager',
        rfq: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-658ccf63b81f20f1f2f86e82-658ccf63b81f20f1f2f86e82?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=xnFVp7QfigLJOaLrMdMFxCqHLVXukxWp2ndAchTnF10wDw21lcvhJo%2B1MZtFu5nZH9%2FFu%2FPIexCwT3Y6MqVgA71A2H2otq2NFi5G%2BzBMRoiMUV3Iz9YW6Fwg04qEuPNgMda0eOzBL4sezv3BUUudvdeSfcYbOfpdq0dld%2FnTIzFvfggWQPbzFfoxif2gPQgzABQdxEKD4p6468CFlztjja0NKlHtsp462eJMo3URBml8ZDF4mN9PF3Hkn1oXjQXT4kSXIGkzAmFm7FZsbirNWb9iaGbGqLhvhqVs34ph0HZpmyCQ2DVVix6xlgueJlzwsID5OoGSB2wXl3uQUEy8KA%3D%3D',
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: new Date(new Date().getTime() + 2 * 60 * 1000),
                isOpened: true,
            },
            {
                name: 'rfq 2',
                desc: 'RFQ accepted',
                isOpened: true,
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: new Date(new Date().getTime() + 29 * 60 * 60 * 1000),
                isOpened: true,
            },
            {
                name: 'proposal 1',
                desc: 'Negotiate draft contract sent',
                date: new Date(new Date().getTime() + 29 * 60 * 60 * 1000),
                isOpened: true,
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: new Date(
                    new Date().getTime() + 29 * 60 * 60 * 1000 + 20 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'proposal 1',
                desc: 'Negotiate draft contract sent',
                date: new Date(
                    new Date().getTime() + 29 * 60 * 60 * 1000 + 25 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: new Date(
                    new Date().getTime() + 29 * 60 * 60 * 1000 + 45 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'proposal 2',
                desc: 'Waiting for contract',
                date: new Date(
                    new Date().getTime() + 29 * 60 * 60 * 1000 + 47 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'contract 1',
                desc: 'Contract received',
                date: new Date(
                    new Date().getTime() + 30 * 60 * 60 * 1000 + 20 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'contract 2',
                desc: 'Contract signed',
                date: new Date(
                    new Date().getTime() + 30 * 60 * 60 * 1000 + 30 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'payment 1',
                desc: 'Waiting for payment',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 40 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'payment 2',
                desc: 'Payment receipt sent',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 50 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'payment 3',
                desc: 'Payment approved',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 50 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'sailing 1',
                desc: 'MV Seaside Voyager sudah siap',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 55 * 60 * 1000,
                ),
                isOpened: false,
            },
            {
                name: 'sailing 2',
                desc: 'MV Seaside Voyager bergerak dari Samarinda menuju Shanghai',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 55 * 60 * 1000,
                ),
                isOpened: false,
            },
            {
                name: 'sailing 3',
                desc: 'MV Seaside Voyager sedang kembali dari pelayaran',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 55 * 60 * 1000,
                ),
                isOpened: false,
            },
            {
                name: 'sailing 4',
                desc: 'MV Seaside Voyager sudah berlabuh',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 55 * 60 * 1000,
                ),
                isOpened: false,
            },
            {
                name: 'completed',
                desc: 'Transaction is completed',
                date: new Date(
                    new Date().getTime() + 32 * 60 * 60 * 1000 + 55 * 60 * 1000,
                ),
                isOpened: false,
            },
        ],
        shipRentType: 'One Time Rent',
        sailingStatus: [
            {
                status: 'beforeSailing',
                desc: 'MV Seaside Voyager sudah siap',
                image: [],
                trackedBy: {
                    name: 'Fauzan',
                    role: 'shipOwner'
                },
                date: '2024-05-15T19:00:00.000Z'
            },
            {
                status: 'sailing',
                desc: 'MV Seaside Voyager bergerak dari Samarinda menuju Shanghai',
                image: [],
                trackedBy: {
                    name: 'Fauzan',
                    role: 'shipOwner'
                },
                date: '2024-05-15T19:10:00.000Z'
            },
            {
                status: 'sailing',
                desc: 'Sedang melewati palung mariana',
                image: [
                    {
                        imageName: "sailing picture 1",
                        imageUrl: "https://storage.googleapis.com/shiphire-fdb0e.appspot.com/MV%20Seaside%20Voyager.jpg?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=VKs4XNoraDP5TopxeVfhLnu80ORvoPt4Zehtjoj0ebZTlJ%2FidyWi28meJcw%2F8mrsLD7hXBYtlKQxsShimvSicNoZE2p8jtJ2tf5L88rih6Wt6a7jizfsGvV3hzqB%2BPlIYt3CYQGff4jUA2KoE8R4CTR0%2BA8iL4dXxA9AzcBiffXmiFN0xlyO1u29N1XydX3775fBJ9X1Qky%2BDH5zRpvakguKFtQi5X5X8bjEpsz4asJ3GB3J6Av5RFJlHkfNOGB%2BLXHbSZXVH0HGqGqfP%2B6sX13A%2FxzyKd5ezjN4n2QASRb2Fdin26xC66BB3dfJ%2Bz3rdWCIroVbc0D2XhAb2XvZAQ%3D%3D",
                        "_id": "664abfc4f1c4ca2fb9857bb6"
                    },
                    {
                        imageName: "sailing picture 2",
                        imageUrl: "https://storage.googleapis.com/shiphire-fdb0e.appspot.com/MV%20Seaside%20Voyager2.jpg?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=iRuTmCKy1KZ4f0FUbmM4lgLNfrkjp2YTSNWoAit3RB9gfljsz0%2F3469HTPO9fWxcNjW3DmetM4Llf8WXBxPARpk4tNrLsmb8L02FH%2Ff3ait3s5NpQ2kTaZHUydtfX3c5NovBBZmeIUcDHaxUkVkxMO67cWfJ1wC6R7hufA93ZrmSOk5ToUT1RpwX8ptY64TXey%2B%2BZm1z2jjQ3fpgYpMcMCwyaJZ%2FyM2mZWCkm6YTvrVUH5T5Cc70RlsJBnk601Vvih6rkpYToLJAwcj1WLwqZI6JttJsBnYXDm%2B91jZOgyXpoOsSTxm8jKnzJEU%2Fe85cGuLdO5KG%2FLFdOgf54E8N9w%3D%3D",
                        "_id": "664abfc4f1c4ca2fb9857bb7"
                    }
                ],
                trackedBy: {
                    name: 'Azis',
                    role: 'renter'
                },
                date: '2024-05-16T19:30:00.000Z'
            },
            {
                status: 'sailing',
                desc: 'Sedang melewati segitiga bermuda',
                image: [],
                trackedBy: {
                    name: 'Azis',
                    role: 'renter'
                },
                date: '2024-05-16T20:45:00.000Z'
            },
            {
                status: 'returning',
                desc: 'MV Seaside Voyager sedang kembali dari pelayaran',
                image: [],
                trackedBy: {
                    name: 'Azis',
                    role: 'renter'
                },
                date: '2024-05-18T20:45:00.000Z'
            },
            {
                status: 'afterSailing',
                desc: 'MV Seaside Voyager sudah berlabuh',
                image: [],
                trackedBy: {
                    name: 'Fauzan',
                    role: 'shipOwner'
                },
                date: '2024-05-19T10:10:00.000Z'
            },
            
        ],
        payment: [
            {
                paymentReminded: [],
                paymentApproved: true,
                paymentId: 'PY-01112024-8eae38a6',
                receiptUrl:
                    'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/SH-01112024-2b070a66%20payment%20receipt?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=cnf2aQraskhOhvtoYrpGMsuwI0MaMn7um%2FcxbM7MPREf%2BFs5kLo2hxnewJ%2BoFRBTcKfDbEd1OR2t%2BAXUerNdwlzJw7UH5dDWVPrTGlqUn%2FqKyqUztuFTK1r3Mp%2FOzupmJO7P0Fxf%2F5PFFN7La8ZnW9Vv2fyfWr1mD05pK7INZCC73JvaBuiO2cgRh%2BPxLY15b69IoV%2Fzsf5dSunK7lWOC6F2BvO7Yd1%2FaKftQcuq9wQqEi%2BldwwFE0JhoFVYiS1nhZIA8%2BlBEz0tR0WzxqtdDMyr7iaLYz%2BIGe%2F1%2FWaWvQ8eowbeGokiO0orB7cj%2BleYMn6NlD1J5xB427QDEbPtjg%3D%3D&param=1704959126961',
            },
        ],
        proposal: [
            {
                proposalUrl:
                    'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Proposal-658ccf63b81f20f1f2f86e82-658ccf63b81f20f1f2f86e82?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=iyr5NgFFGdnn37m35RsiOxZrqyEQKpANHOwPGCGzeMDm35xdduvpvJmVVyMohvKVI3TV1I98wQBeTltAarAhpdxsiINdUmslBKVg3O0yr8bThK%2FbqkR5Jz18DPldYg8Q%2BGbZJvvzdi0ayAIHwnQDMBXm15gwnnfzCDA5JLLKc0BhCjnUOqd2ZSJ7lZ4sJsNZ%2FHYtZ5287ADKKbpstINp4ecMdvkBjXp%2BtjYfz18OZpsk7IF4oYHEpoti%2Fxta2uc0Y8W9sob4ChMPkaraIbN5ZowNnme%2FaatFqiBjrGUjpZFDgBl13bpjY6RVUkipaJK1QDeQv0VVsaPOTku%2FueXOzg%3D%3D',
                notes: 'Hati Hati ya bang ;)',
                offeredPrice: 50000000,
                additionalImage: [],
            },
            {
                notes: 'Gabut bang?',
                additionalImage: [
                    {
                        imageUrl:
                            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20Negotiate%201?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=MaRo0hX0CBHaK3rdlEH9Z1ZUOlueMFyxIKcUOpneYwoFzWM9%2F5%2BLDOPi5qdyiYsUEEa1h5zI7HdoQdnO1zrqthqLVb4yF3u3LSxYw6wiuLIyVQNFps8oCvX30JhKK%2FWJpYjD1xdscJ73yXnXZd%2FPgGs%2BIHax2Sc%2FtQtJ4Qo1WMMgw883XUXJCceD9hbXgJz6TqmvfcU7qPgBAzvpADR7KlnYMTS5VnYW6rOeLKnWOamvq1xqpkbpS7uZC88kyra84oX3MHzkJIEVh1vzY7VGWVyy1yanTj735mpNIztNWZLnoOQ9XLCQ7D9nT9rREheEmZK0sPTsSZCSio%2F6DjZa%2FQ%3D%3D&param=1704958908451',
                        imageDescription: 'Coba liat ini hehe',
                    },
                ],
                offeredPrice: 50000000,
            },
            {
                proposalUrl:
                    'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Draft%20Contract?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=nIOU26OVCeQHryq2%2F7K2yB9YbQn2R8FAHU0b4AQC4Sz4W6%2BwRTyey3RpuMOxl1ELMWMxz6%2BaTnCSfBQ0Sr7CxAPiOe9q7TETvcp0XmOnrhQdB2mwWISHoil1CPFB09vV4MVxA4YRxqQsy64q8BJMwZTglYmRo9NsGfUA7aWBtGz0XrR0TqYVksUBdMDJAL3g3LkAEyxSQK8tDXMHG%2B4nMGoVAxYZnu2BbOayg9bwdFCmcZQlNmPeIvqjSrfRQd5kdvavuTy%2F0YvVixHW1NzlhxOMIuwGWDrJHnQB1F%2F4uthPvLRtkWwh%2BanudcxPeY8EW9Bct%2BtxLaCJCR5KNw7NWg%3D%3D',
                notes: 'Ape tu Bang?',
                offeredPrice: 50000000,
                additionalImage: [],
            },
            {
                notes: 'Bukan apa apa -_-',
                additionalImage: [],
                offeredPrice: 50000000,
            },
            {
                proposalUrl:
                    'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Draft%20Contract?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=nIOU26OVCeQHryq2%2F7K2yB9YbQn2R8FAHU0b4AQC4Sz4W6%2BwRTyey3RpuMOxl1ELMWMxz6%2BaTnCSfBQ0Sr7CxAPiOe9q7TETvcp0XmOnrhQdB2mwWISHoil1CPFB09vV4MVxA4YRxqQsy64q8BJMwZTglYmRo9NsGfUA7aWBtGz0XrR0TqYVksUBdMDJAL3g3LkAEyxSQK8tDXMHG%2B4nMGoVAxYZnu2BbOayg9bwdFCmcZQlNmPeIvqjSrfRQd5kdvavuTy%2F0YvVixHW1NzlhxOMIuwGWDrJHnQB1F%2F4uthPvLRtkWwh%2BanudcxPeY8EW9Bct%2BtxLaCJCR5KNw7NWg%3D%3D',
                notes: 'Hehe',
                offeredPrice: 50000000,
                additionalImage: [],
            },
        ],
        beforeSailingPictures: [
            {
                documentName: 'Image Before Kondisi Awal',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Image%20Before%20Kondisi%20Awal?generation=1704959205275298&alt=media',
                description: 'Kondisi Awal',
            },
        ],
        afterSailingPictures: [
            {
                documentName: 'Image After Kondisi Awal',
                documentUrl:
                    'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Image%20Before%20Kondisi%20Awal?generation=1704959205275298&alt=media',
            },
        ],
        offeredPrice: 50000000,
        contract:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Contract-658ccf63b81f20f1f2f86e82-SH-01112024-2b070a66?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=pcwon8F7JmL5JW2D6qzIrvTDODDjZ%2FbDlTnVml4fPFUif2TbqioPR1izAqzUZjE%2FUSqexjr5qvMxmCfNpy7MP0pKWe5ajdx75WXV8tagcm8ob4zpmK%2F%2F6vgnhRrdBO1EJz1j93Ig0iH25VqIELnlrVSK7ZJvjIC%2BIG4E6867gCuGxB9j%2FlamXjrCG7XdNlvZ62mr672xHPwgN%2BtbiRWzpfEZTl%2FoA0g7a%2B1NpbjUvs6sA1ukvxa5qSeoImzgtsKU7Ts8ZsII%2FbmVQc%2FeMIiGix%2FXVmWmBVQ%2Fe2HOTu5g9ydU1zqdbAsbrOy0gFHqmtRXnx8EcYWum2VbeLocQdTc%2Bw%3D%3D',
    },
    {
        rentalId: 'SH-09212023-f42e6b08',
        renter: 'Azis',
        rentalDuration: 456,
        rentalStartDate: moment('21 September 2023', 'DD MMMM YYYY').toDate(),
        rentalEndDate: moment('21 December 2024', 'DD MMMM YYYY').toDate(),
        needs: 'Coal Shipment',
        locationDestination: 'Sulawesi',
        locationDeparture: 'Samarinda',
        shipName: 'Island Hopper',
        rfq: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a66ccb032b67aaa4eba7f-650a66ccb032b67aaa4eba7f?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=hGwTwCakRg5oP6miRJB8eC1LzAcbPW3TJq3Isd%2BCNcr98VJ%2FokidKjDYNAZCX3hoATtPmkwMrIqaPMXFQ5xxD%2Fyicp6emg9EhJCt0Vk8bvJ%2FthPsS78ECDgDUA8gtUvTDId1f8zp%2F7m6INhqSMfIKGtq0qNLRzIyg2JyAoC8Lh94REgHAtAkBf%2BR92f69F0HCJR9J78hOungkGQwcqhOrIOtSCm3tBj1F8lYF7grCSfN9yYXTm2y8tposFVhOPETyx1EEA%2BCWKgqsSLD18W%2BNNKS9dR%2B8KHgZLBZoci0BXPp58Bd2rdDSFSobyQHOAUGn%2FEpJWWk8L6GOv26vNL7dQ%3D%3D',
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: rentalStartDate,
                isOpened: false,
            },
        ],
        shipRentType: 'One Time Rent',
        sailingStatus: [], //subject to change
        payment: [],
        proposal: [],
        beforeSailingPictures: [],
        afterSailingPictures: [],
        offeredPrice: 4366999900,
    },
    {
        rentalId: 'SH-09212023-1f5a3e42',
        renter: 'Azis',
        rentalDuration: 127,

        rentalStartDate: rentalStartDate,
        rentalEndDate: rentalEndDate,
        needs: 'Coal Shipment',
        locationDestination: 'Sulawesi',
        locationDeparture: 'Samarinda',
        shipName: 'Cargo Carrier',
        rfq: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a6891b032b67aaa4ebbc5-650a6891b032b67aaa4ebbc5?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=nP%2Bq3vHiqkN%2FVWz0HJ4U1X3Z9IsInCT7dg%2BSjL6xxU4jRi6tyS23VJdu5%2BhYPrgHnwvEDvvqqryz%2Fqco%2FvXmLirRzaHByvsn%2Bewq%2F0CWp94PsNJLbkWgs7awAOFHa8P0g6A8h94CZqg4OFtOADVX7TNwH0nZSsnnLeWJCoHf80x3UsL2QGJH8f3K9KWlb13nyagbuGk81nxzZVTE0w%2FlBo0cKDOXlqulryIQVhihYF49mtdsc5Yxb5LK6oO7NNxwhZQGKJkt%2FwH8WPSmGeZK1GCI%2FubV97P9BK%2Fm9srXPdproYAcxY%2FpoqpCEuPFjYtMCqhUsve2C%2BBKaJ9oMX97ng%3D%3D',
        status: [
            {
                name: 'rfq 1',
                desc: 'RFQ sent',
                date: new Date(),
                isOpened: true,
            },
            {
                name: 'rfq 2',
                desc: 'RFQ accepted',
                date: new Date(rentalStartDate + 24 * 60 * 60 * 1000),
                isOpened: true,
            },
            {
                name: 'proposal 1',
                desc: 'Draft contract sent',
                date: new Date(rentalStartDate + 29 * 60 * 60 * 1000),
                isOpened: true,
            },
            {
                name: 'proposal 1',
                desc: 'Negotiate draft contract sent',
                date: new Date(rentalStartDate + 29 * 60 * 60 * 1000),
                isOpened: true,
            },
            {
                name: 'proposal 2',
                desc: 'Draft contract sent',
                date: new Date(
                    rentalStartDate + 29 * 60 * 60 * 1000 + 20 * 60 * 1000,
                ),
                isOpened: true,
            },
            {
                name: 'proposal 2',
                desc: 'Waiting for contract',
                date: new Date(
                    rentalStartDate + 29 * 60 * 60 * 1000 + 25 * 60 * 1000,
                ),
                isOpened: true,
            },
        ],
        shipRentType: 'One Time Rent',
        sailingStatus: [], //subject to change
        payment: [],
        proposal: [
            {
                proposalUrl:
                    'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/thereactnativebook-sample.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=AvVM%2BcUmY0z%2FgeUTxT9i%2F4XqkC8zJ3KYX23svHDzZcU6%2BYk3ZFDeUHgeAL2NndbdEOlmEIUBlcQB5drzvMGLO3AECyel9cn5VSwlF3wZA%2BYKHPkFqzEs%2F%2FudniYpUwN%2F5o1%2FPll18hgaWRxDDKp7GtH44pxAbsKjOdV9SuSPy0XDP8bkloclgEg6E53TApjlPXItLki8pjWuwPMdXu8Ombkip2i1bfabtDtkDV42o%2BFHn2jZCCT4u3d31WFg0j4VhvnkGh82rERyyXbduJv05zhPM1NWF5I9XHMHOGUZfT%2F4RowuIqOWjH2P3khhV15yK2BrfwiXvFPam3YzmttKZg%3D%3D',
                notes: 'This is a contract draft, please review it carefully',
                offeredPrice: 50000000,
                additionalImage: [],
            },
        ],
        beforeSailingPictures: [],
        afterSailingPictures: [],
        offeredPrice: 1234009000,
    },
];

export const seedTransactions = async () => {
    try {
        for (const transaction of transactions) {
            const renter = await Renter.findOne({ name: transaction.renter });

            const ship = await Ship.findOne({ name: transaction.shipName });
            const rfq = await RequestForQuote.findOne({
                rfqUrl: transaction.rfq,
            });
            var proposal = null;
            for (const data of transaction.proposal) {
                if (data.proposalUrl) {
                    const proposalId = await Proposal.findOne({
                        draftContract: data.proposalUrl,
                    });
                    proposal = {
                        proposalId: proposalId._id,
                        notes: data.notes,
                        proposalUrl: data.proposalUrl,
                        additionalImage: data.additionalImage,
                        offeredPrice: data.offeredPrice,
                    };
                } else {
                    proposal = {
                        notes: data.notes,
                        additionalImage: data.additionalImage,
                        offeredPrice: data.offeredPrice,
                    };
                }
            }
            const contract = await Contract.findOne({
                contractUrl: transaction.contract,
            });

            const transactionAdded = new Transaction({
                rentalId: transaction.rentalId,
                renterId: renter._id,
                rentalDuration: transaction.rentalDuration,
                rentalStartDate: transaction.rentalStartDate,
                rentalEndDate: transaction.rentalEndDate,
                needs: transaction.needs,
                locationDestination: transaction.locationDestination,
                locationDeparture: transaction.locationDeparture,
                ship: {
                    shipId: ship._id,
                    shipOwnerId: ship.shipOwnerId,
                },
                rfq: {
                    rfqId: rfq._id,
                    rfqUrl: transaction.rfq,
                },
                shipRentType: transaction.shipRentType,
                sailingStatus: transaction.sailingStatus,
                proposal,
                payment: transaction.payment,
                contract: {
                    contractId: contract?._id,
                    contractUrl: transaction.contract,
                },
                status: transaction.status,
                receiptUrl: transaction.receiptUrl,
                paymentAprroved: transaction.paymentApproved,
                shipRentType: transaction.shipRentType,
                offeredPrice: transaction.offeredPrice,
                beforeSailingPictures: transaction.beforeSailingPictures,
                afterSailingPictures: transaction.afterSailingPictures,
            });

            await transactionAdded.save();
            console.log(`Transaction ${transaction.rentalId} added`);
        }
    } catch (error) {
        console.error(`Error seeding transactions:`, error);
    }
};
