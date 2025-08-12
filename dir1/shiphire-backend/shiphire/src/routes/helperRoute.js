import { Router } from 'express';
import {
    addFacility,
    addFacilityCategory,
    addShipSpesification,
    getShipLocations,
    getShipFacilityByShipType,
    getShipSpesificationByShipType,
    submitStatus,
} from '../controller/helperController';

const helperRoute = Router();

helperRoute.post('/submit-status', submitStatus);
helperRoute.post('/addFacilityCategory', addFacilityCategory);
helperRoute.post('/addFacility', addFacility);
helperRoute.post('/addShipSpesification', addShipSpesification);
helperRoute.post('/getShipFacility/:shipType', getShipFacilityByShipType);
helperRoute.post(
    '/getShipSpesification/:shipType',
    getShipSpesificationByShipType,
);
helperRoute.get('/getShipLocations', getShipLocations);

export default helperRoute;
