/* eslint-disable no-console */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import Notification from './models/Notification';
import { seedContracts } from './seeder/contractsSeed';
import { seedDynamicForms } from './seeder/dynamicFormsSeed';
import { seedProposals } from './seeder/proposalSeed';
import { seedRequestForQuotes } from './seeder/requestForQuotesSeed';
import { seedShipCategories } from './seeder/shipCategoriesSeed';
import { seedShipFacilities } from './seeder/shipFacilitiesSeed';
import { seedShipFacilityCategories } from './seeder/shipFacilityCategoriesSeed';
import { seedShipHistory } from './seeder/shipHistorySeed';
import { seedShips } from './seeder/shipSeed';
import { seedShipSpecifications } from './seeder/shipSpecificationSeed';
import { seedStatuses } from './seeder/statusSeed';
import { seedTransactions } from './seeder/transactionsSeed';
import { seedRolesToUsers } from './seeder/userSeed';
import Agenda from 'agenda';
import agenda from './utils/agenda';

const env = process.env.NODE_ENV || 'LOCAL';
dotenv.config({ path: path.join(__dirname, '..', `.env.${env}`) });

const db = process.env.DATABASE_URL;

async function clearCollections(model) {
    try {
        await model.deleteMany({});
        console.log(`${model.modelName} collection cleared`);
    } catch (error) {
        console.error(`Error clearing ${model.modelName} collection:`, error);
    }
}

async function seedDatabase() {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await clearCollections(mongoose.models.Admin);
        await clearCollections(mongoose.models.User);
        await clearCollections(mongoose.models.Renter);
        await clearCollections(mongoose.models.ShipOwner);
        await clearCollections(mongoose.models.ShipCategory);
        await clearCollections(mongoose.models.ShipFacilityCategory);
        await clearCollections(mongoose.models.ShipFacility);
        await clearCollections(mongoose.models.ShipSpecification);
        await clearCollections(mongoose.models.Ship);
        await clearCollections(mongoose.models.ShipHistory);
        await clearCollections(mongoose.models.RequestForQuote);
        await clearCollections(mongoose.models.Proposal);
        await clearCollections(mongoose.models.Contract);
        await clearCollections(mongoose.models.Status);
        await clearCollections(mongoose.models.Transaction);
        await clearCollections(mongoose.models.DynamicForm);
        await clearCollections(mongoose.models.DynamicInput);
        await clearCollections(mongoose.models.Notification);
        // await agenda.cancel({}); //clear agendaJobs collection

        await seedRolesToUsers();
        await seedShipCategories();
        await seedShipFacilityCategories();
        await seedShipFacilities();
        await seedShipSpecifications();
        await seedShips();
        await seedDynamicForms();
        await seedShipHistory();
        await seedRequestForQuotes();
        await seedProposals();
        await seedContracts();
        await seedStatuses();
        await seedTransactions();

        console.log('Database seeded');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
}

seedDatabase();
