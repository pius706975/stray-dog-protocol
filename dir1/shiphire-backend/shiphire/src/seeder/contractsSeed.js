import Contract from '../models/Contract';
import Renter from '../models/Renter';
import ShipOwner from '../models/ShipOwner';
import Ship from '../models/Ship';

const contracts = [
    {
        ship: 'Island Hopper',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        renterCompanyName: 'Azis Company',
        contractUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/image%207.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=xuWAJywwyPjD%2BF40S6XHElpFsUXNMn1HaFAykT4vphSrrPj1YSaxBSkuwv305qUosJJRhNqldaRiJp06g1BD877Q335m9qVS7Cur1sYWk%2Bf%2B%2FjFUI837JRKkMl9QGJTdvntwqAtlV%2F6NGxsMpzX%2BU1QwGt1vlj9E7%2BcGE7J%2BXtV5Gfe68QSJBt3jXDKCg8vQY82ms1afk0x5iAP9jsgTY4dMR%2B0fntvWPqFjenMbipvTymAgW8fwLOS%2F5QmnfRfPxJtZNWfO%2FJfpV%2FRtWm2k26hyQNK3%2FpT1rseXjOzDF1YvqVbrwwqY4ufRYJGbcrEkaiHXbGne2GlR6A8%2BKtFweA%3D%3D',
    },
    {
        ship: 'MV Seaside Voyager',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        renterCompanyName: 'Azis Company',
        contractUrl:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Contract-658ccf63b81f20f1f2f86e82-SH-01112024-2b070a66?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=pcwon8F7JmL5JW2D6qzIrvTDODDjZ%2FbDlTnVml4fPFUif2TbqioPR1izAqzUZjE%2FUSqexjr5qvMxmCfNpy7MP0pKWe5ajdx75WXV8tagcm8ob4zpmK%2F%2F6vgnhRrdBO1EJz1j93Ig0iH25VqIELnlrVSK7ZJvjIC%2BIG4E6867gCuGxB9j%2FlamXjrCG7XdNlvZ62mr672xHPwgN%2BtbiRWzpfEZTl%2FoA0g7a%2B1NpbjUvs6sA1ukvxa5qSeoImzgtsKU7Ts8ZsII%2FbmVQc%2FeMIiGix%2FXVmWmBVQ%2Fe2HOTu5g9ydU1zqdbAsbrOy0gFHqmtRXnx8EcYWum2VbeLocQdTc%2Bw%3D%3D',
    },
];

export const seedContracts = async () => {
    try {
        for (const contract of contracts) {
            const ship = await Ship.findOne({ name: contract.ship });
            const renter = await Renter.findOne({ name: contract.renter });
            const shipOwner = await ShipOwner.findOne({
                name: contract.shipOwner,
            });

            const contractAdded = new Contract({
                ship: ship._id,
                renter: renter._id,
                shipOwner: shipOwner._id,
                contractUrl: contract.contractUrl,
                renterCompanyName: contract.renterCompanyName,
                isAccepted: true,
            });
            await contractAdded.save();
            console.log(`Contract ${contract.contractUrl} added`);
        }
    } catch (error) {
        console.error(`Error seeding contracts:`, error);
    }
};
