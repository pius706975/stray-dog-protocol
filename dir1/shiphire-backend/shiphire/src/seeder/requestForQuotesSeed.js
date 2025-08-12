import RequestForQuote from '../models/RequestForQuote';
import Renter from '../models/Renter';
import ShipOwner from '../models/ShipOwner';
import ShipCategory from '../models/ShipCategory';
import Ship from '../models/Ship';

const rfqs = [
    {
        ship: 'Barge Hauler',
        category: 'Barge',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        rfqUrl: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a67c0b032b67aaa4ebb29-650a67c0b032b67aaa4ebb29?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=ExwRmheVVVt%2BHCqscHubc8BTlmLIlBThQ25t28r4DrDSgUsC4ALbPtdfyJuDJkGrmySO0oUwNXgGJYFjNmVsuh395OI%2BWlqM4f82sqOV%2Bqenw7xqqdenG8yPK9dkgKxHITirRWWcAAgFX85iwpoTAKqqPa4QqvxqgkGCcYbCDY5MNTUWRD1z3mrKi1ASXSVBJSFPfFUkp6spQVkNajJjUyMhPwK1x6NcfdLTJU1vH8Sly%2FEhchXbjUlOHDafD1WxneJXHNhgItw4Boov5RsLAwOK0AMMYw%2B4vURECBHnEPcntL9JbXzOMp0s7rudiijjlySgdLiGmlIQGpcZcFdKLA%3D%3D',
    },
    {
        ship: 'Mighty Tug',
        category: 'Tugboat',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        rfqUrl: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a6bd7b032b67aaa4ebd54-650a6bd7b032b67aaa4ebd54?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=Vt3y0F%2FDd%2Fh7zK6VnDgF8e8L398AKEqTnNaW7c%2F978bKH6b1Ql7GaGmnQOPK6j9eYx8FPjXHeeyCeZFBZ9pP8yXlIuslAbhK0hE3JVEzGT4W%2B77G2MF47MGO3wU61%2FhPzsnY%2B8Gv8k%2BI%2BE8O%2FgyFYr1c9qvOdyx6werAjXqW0r3LrhDchxl0DFUftNKiXkDrR3eMkbHTJPP%2BFUA3CU9GafII6TphIR7lSbnz10PCGKYcEudI5sEx75mCHvVQfN%2F0smwvaw33rfrFWNQzS%2FvoHIJyZp%2FCA1qwF2O4yVTZz8%2Fr0zJooeOY2K%2FcW1oLr45tlHk2CP2IX4eV5PwL0yh1bQ%3D%3D',
    },
    {
        ship: 'Island Hopper',
        category: 'Tugboat',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        rfqUrl: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a66ccb032b67aaa4eba7f-650a66ccb032b67aaa4eba7f?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=hGwTwCakRg5oP6miRJB8eC1LzAcbPW3TJq3Isd%2BCNcr98VJ%2FokidKjDYNAZCX3hoATtPmkwMrIqaPMXFQ5xxD%2Fyicp6emg9EhJCt0Vk8bvJ%2FthPsS78ECDgDUA8gtUvTDId1f8zp%2F7m6INhqSMfIKGtq0qNLRzIyg2JyAoC8Lh94REgHAtAkBf%2BR92f69F0HCJR9J78hOungkGQwcqhOrIOtSCm3tBj1F8lYF7grCSfN9yYXTm2y8tposFVhOPETyx1EEA%2BCWKgqsSLD18W%2BNNKS9dR%2B8KHgZLBZoci0BXPp58Bd2rdDSFSobyQHOAUGn%2FEpJWWk8L6GOv26vNL7dQ%3D%3D',
    },
    {
        ship: 'Cargo Carrier',
        category: 'Barge',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        rfqUrl: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-650a6891b032b67aaa4ebbc5-650a6891b032b67aaa4ebbc5?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=nP%2Bq3vHiqkN%2FVWz0HJ4U1X3Z9IsInCT7dg%2BSjL6xxU4jRi6tyS23VJdu5%2BhYPrgHnwvEDvvqqryz%2Fqco%2FvXmLirRzaHByvsn%2Bewq%2F0CWp94PsNJLbkWgs7awAOFHa8P0g6A8h94CZqg4OFtOADVX7TNwH0nZSsnnLeWJCoHf80x3UsL2QGJH8f3K9KWlb13nyagbuGk81nxzZVTE0w%2FlBo0cKDOXlqulryIQVhihYF49mtdsc5Yxb5LK6oO7NNxwhZQGKJkt%2FwH8WPSmGeZK1GCI%2FubV97P9BK%2Fm9srXPdproYAcxY%2FpoqpCEuPFjYtMCqhUsve2C%2BBKaJ9oMX97ng%3D%3D',
    },
    {
        ship: 'MV Seaside Voyager',
        category: 'Ferry',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        rfqUrl: 'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/RFQ-658ccf63b81f20f1f2f86e82-658ccf63b81f20f1f2f86e82?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=xnFVp7QfigLJOaLrMdMFxCqHLVXukxWp2ndAchTnF10wDw21lcvhJo%2B1MZtFu5nZH9%2FFu%2FPIexCwT3Y6MqVgA71A2H2otq2NFi5G%2BzBMRoiMUV3Iz9YW6Fwg04qEuPNgMda0eOzBL4sezv3BUUudvdeSfcYbOfpdq0dld%2FnTIzFvfggWQPbzFfoxif2gPQgzABQdxEKD4p6468CFlztjja0NKlHtsp462eJMo3URBml8ZDF4mN9PF3Hkn1oXjQXT4kSXIGkzAmFm7FZsbirNWb9iaGbGqLhvhqVs34ph0HZpmyCQ2DVVix6xlgueJlzwsID5OoGSB2wXl3uQUEy8KA%3D%3D',
    },
];

export const seedRequestForQuotes = async () => {
    try {
        for (const rfq of rfqs) {
            const ship = await Ship.findOne({ name: rfq.ship });
            const renter = await Renter.findOne({ name: rfq.renter });
            const shipOwner = await ShipOwner.findOne({ name: rfq.shipOwner });
            const shipCategory = await ShipCategory.findOne({
                name: rfq.category,
            });
            const requestForQuote = new RequestForQuote({
                ship: ship._id,
                category: shipCategory._id,
                renter: renter._id,
                shipOwner: shipOwner._id,
                rfqUrl: rfq.rfqUrl,
            });
            await requestForQuote.save();
            // console.log(`Request For Quote ${rfq.rfqUrl} added`);
        }
    } catch (error) {
        console.error('Error seeding RFQs:', error);
    }
};
