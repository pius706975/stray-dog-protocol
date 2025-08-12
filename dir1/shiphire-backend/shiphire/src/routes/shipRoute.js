import { Router } from 'express';
import {
    getAllShip,
    getPopularShips,
    getSearchShip,
    getShipCategories,
    getShipRFQForm,
    getShipbyId,
    getTopRatedShips,
    deleteShipHistory,
    getAllShipHistoryPending,
    editShipHistory,
    addShipRFQForm,
    getShipByLocation,
    getCoordinate,
} from '../controller/shipController';
import multer from 'multer';

const shipRoute = Router();
const upload = multer();

shipRoute.get('/', getAllShip);
shipRoute.get('/get-top-rated-ships', getTopRatedShips);
shipRoute.get('/get-popular-ships', getPopularShips);
shipRoute.get('/get-ship-categories', getShipCategories);
shipRoute.get('/get-ship-by-id/:id', getShipbyId);
shipRoute.get('/get-ship-by-current-location', getCoordinate);
shipRoute.get('/search-ship', getSearchShip);
shipRoute.get('/get-ship-rfq-form/:id', getShipRFQForm);
shipRoute.post('/delete-ship-history', deleteShipHistory);
shipRoute.get('/get-ship-history-pending', getAllShipHistoryPending);
shipRoute.post(
    '/edit-ship-history/:id',
    upload.array('files', 50),
    editShipHistory,
);
shipRoute.post('/add-ship-rfq-form', addShipRFQForm);

export default shipRoute;
