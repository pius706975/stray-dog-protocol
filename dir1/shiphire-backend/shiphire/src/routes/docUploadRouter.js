import { Router } from 'express';
import multer from 'multer';
import {
    submitShipDocument,
    submitShipImage,
    submitShipOwnerDocument,
} from '../controller/docUploadController';
import verifyToken from '../middleware/verifyToken';

const docUploadRouter = Router();
const upload = multer();

docUploadRouter.post(
    '/submit-ship-owner-document',
    upload.array('document', 10),
    verifyToken,
    submitShipOwnerDocument,
);
docUploadRouter.post(
    '/submit-ship-document/:shipId',
    upload.array('document', 10),
    verifyToken,
    submitShipDocument,
);
docUploadRouter.post(
    '/submit-ship-image/:shipId',
    upload.single('image'),
    verifyToken,
    submitShipImage,
);

export default docUploadRouter;
