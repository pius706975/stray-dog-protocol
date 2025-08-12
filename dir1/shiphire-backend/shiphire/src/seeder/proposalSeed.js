import Proposal from '../models/Proposal';
import Ship from '../models/Ship';
import Renter from '../models/Renter';
import ShipOwner from '../models/ShipOwner';

const proposals = [
    {
        ship: 'MV Seaside Voyager',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        draftContract:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Proposal-658ccf63b81f20f1f2f86e82-658ccf63b81f20f1f2f86e82?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=iyr5NgFFGdnn37m35RsiOxZrqyEQKpANHOwPGCGzeMDm35xdduvpvJmVVyMohvKVI3TV1I98wQBeTltAarAhpdxsiINdUmslBKVg3O0yr8bThK%2FbqkR5Jz18DPldYg8Q%2BGbZJvvzdi0ayAIHwnQDMBXm15gwnnfzCDA5JLLKc0BhCjnUOqd2ZSJ7lZ4sJsNZ%2FHYtZ5287ADKKbpstINp4ecMdvkBjXp%2BtjYfz18OZpsk7IF4oYHEpoti%2Fxta2uc0Y8W9sob4ChMPkaraIbN5ZowNnme%2FaatFqiBjrGUjpZFDgBl13bpjY6RVUkipaJK1QDeQv0VVsaPOTku%2FueXOzg%3D%3D',
        isAccepted: false,
    },
    {
        ship: 'MV Seaside Voyager',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        draftContract:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Draft%20Contract?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=nIOU26OVCeQHryq2%2F7K2yB9YbQn2R8FAHU0b4AQC4Sz4W6%2BwRTyey3RpuMOxl1ELMWMxz6%2BaTnCSfBQ0Sr7CxAPiOe9q7TETvcp0XmOnrhQdB2mwWISHoil1CPFB09vV4MVxA4YRxqQsy64q8BJMwZTglYmRo9NsGfUA7aWBtGz0XrR0TqYVksUBdMDJAL3g3LkAEyxSQK8tDXMHG%2B4nMGoVAxYZnu2BbOayg9bwdFCmcZQlNmPeIvqjSrfRQd5kdvavuTy%2F0YvVixHW1NzlhxOMIuwGWDrJHnQB1F%2F4uthPvLRtkWwh%2BanudcxPeY8EW9Bct%2BtxLaCJCR5KNw7NWg%3D%3D',
        isAccepted: false,
    },
    {
        ship: 'MV Seaside Voyager',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        draftContract:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Draft%20Contract?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=nIOU26OVCeQHryq2%2F7K2yB9YbQn2R8FAHU0b4AQC4Sz4W6%2BwRTyey3RpuMOxl1ELMWMxz6%2BaTnCSfBQ0Sr7CxAPiOe9q7TETvcp0XmOnrhQdB2mwWISHoil1CPFB09vV4MVxA4YRxqQsy64q8BJMwZTglYmRo9NsGfUA7aWBtGz0XrR0TqYVksUBdMDJAL3g3LkAEyxSQK8tDXMHG%2B4nMGoVAxYZnu2BbOayg9bwdFCmcZQlNmPeIvqjSrfRQd5kdvavuTy%2F0YvVixHW1NzlhxOMIuwGWDrJHnQB1F%2F4uthPvLRtkWwh%2BanudcxPeY8EW9Bct%2BtxLaCJCR5KNw7NWg%3D%3D',
        isAccepted: true,
    },
    {
        ship: 'Mighty Tug',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        draftContract:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/thereactnativebook-sample.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=AvVM%2BcUmY0z%2FgeUTxT9i%2F4XqkC8zJ3KYX23svHDzZcU6%2BYk3ZFDeUHgeAL2NndbdEOlmEIUBlcQB5drzvMGLO3AECyel9cn5VSwlF3wZA%2BYKHPkFqzEs%2F%2FudniYpUwN%2F5o1%2FPll18hgaWRxDDKp7GtH44pxAbsKjOdV9SuSPy0XDP8bkloclgEg6E53TApjlPXItLki8pjWuwPMdXu8Ombkip2i1bfabtDtkDV42o%2BFHn2jZCCT4u3d31WFg0j4VhvnkGh82rERyyXbduJv05zhPM1NWF5I9XHMHOGUZfT%2F4RowuIqOWjH2P3khhV15yK2BrfwiXvFPam3YzmttKZg%3D%3D',
    },
    {
        ship: 'Island Hopper',
        renter: 'Azis',
        shipOwner: 'Fauzan',
        draftContract:
            'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/thereactnativebook-sample.pdf?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=1896710400&Signature=AvVM%2BcUmY0z%2FgeUTxT9i%2F4XqkC8zJ3KYX23svHDzZcU6%2BYk3ZFDeUHgeAL2NndbdEOlmEIUBlcQB5drzvMGLO3AECyel9cn5VSwlF3wZA%2BYKHPkFqzEs%2F%2FudniYpUwN%2F5o1%2FPll18hgaWRxDDKp7GtH44pxAbsKjOdV9SuSPy0XDP8bkloclgEg6E53TApjlPXItLki8pjWuwPMdXu8Ombkip2i1bfabtDtkDV42o%2BFHn2jZCCT4u3d31WFg0j4VhvnkGh82rERyyXbduJv05zhPM1NWF5I9XHMHOGUZfT%2F4RowuIqOWjH2P3khhV15yK2BrfwiXvFPam3YzmttKZg%3D%3D',
    },
];

export const seedProposals = async () => {
    try {
        for (const proposal of proposals) {
            const ship = await Ship.findOne({ name: proposal.ship });
            const renter = await Renter.findOne({ name: proposal.renter });
            const shipOwner = await ShipOwner.findOne({
                name: proposal.shipOwner,
            });

            const proposalAdded = new Proposal({
                ship: ship._id,
                renter: renter._id,
                shipOwner: shipOwner._id,
                draftContract: proposal.draftContract,
                isAccepted: proposal.isAccepted ? proposal.isAccepted : true,
            });

            await proposalAdded.save();
            //   console.log(`Proposal ${proposal.proposalUrl} added`);
        }
    } catch (error) {
        console.error(`Error seeding proposals:`, error);
    }
};
