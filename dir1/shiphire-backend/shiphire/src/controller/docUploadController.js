import Ship from '../models/Ship';
import ShipOwner from '../models/ShipOwner';
import User from '../models/User';
import firebaseAdmin from '../utils/firebaseAdmin';

export const submitShipOwnerDocument = async (req, res) => {
    const files = req.files;
    const { firebaseId, googleId, appleId } = req.user;
    const bucket = firebaseAdmin.storage().bucket();

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files found' });
    }

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }

    try {
        const uploadedDocuments = [];
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }
        const shipOwner = await ShipOwner.findOne({ userId: user.id });

        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship Owner not found' });
        }

        for (const file of files) {
            const uploadedFile = bucket.file(file.originalname);
            await uploadedFile.save(file.buffer, {
                contentType: file.mimetype,
                public: true,
            });

            const documentData = {
                documentName: file.originalname,
                documentUrl: uploadedFile.metadata.mediaLink,
            };

            uploadedDocuments.push(documentData);
        }

        await ShipOwner.findOneAndUpdate(
            { userId: user.id },
            { shipOwnerDocuments: uploadedDocuments },
            { new: true },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const submitShipDocument = async (req, res) => {
    const files = req.files;
    const { shipId } = req.params;
    const { docExpired } = req.body;
    const { firebaseId, googleId, appleId } = req.user;
    const bucket = firebaseAdmin.storage().bucket();

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files found' });
    }

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }

    try {
        const uploadedDocuments = [];
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }
        const shipOwner = await ShipOwner.findOne({ userId: user.id });
        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship Owner not found' });
        }

        const ship = await Ship.findOne({ shipOwnerId: shipOwner.id, _id: shipId });
        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        for (const [index, file] of files.entries()) {
            const uploadedFile = bucket.file(file.originalname);
            await uploadedFile.save(file.buffer, {
                contentType: file.mimetype,
                public: true,
            });
            let docExp;

            if (files.length > 1) {
                docExp =
                    docExpired[index] !== 'null'
                        ? new Date(docExpired[index])
                        : undefined;
            } else {
                docExp = new Date(docExpired);
            }

            const documentData = {
                documentExpired: docExp,
                documentName: file.originalname,
                documentUrl: uploadedFile.metadata.mediaLink,
            };

            uploadedDocuments.push(documentData);
        }

        await Ship.findOneAndUpdate(
            { _id: shipId },
            { shipDocuments: uploadedDocuments },
            { new: true },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitShipImage = async (req, res) => {
    const file = req.file;
    const { shipId } = req.params;
    const { firebaseId, googleId, appleId } = req.user;
    const bucket = firebaseAdmin.storage().bucket();

    if (!file) {
        return res.status(400).json({ error: 'No files found' });
    }

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        const shipOwner = await ShipOwner.findOne({ userId: user.id });

        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship Owner not found' });
        }

        const ship = await Ship.findOne({ shipOwnerId: shipOwner.id, _id: shipId });

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        const uploadedFile = bucket.file(file.originalname);
        await uploadedFile.save(file.buffer, {
            contentType: file.mimetype,
            public: true,
        });

        const [imageUrl] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '02-08-2030',
            queryParams: { param: new Date().getTime().toString() },
        });

        const updateShipImage = await Ship.findOneAndUpdate(
            { _id: shipId },
            { imageUrl: imageUrl },
            { new: true },
        );

        if (!updateShipImage) {
            return res
                .status(400)
                .json({ status: 'fail', message: 'Ship image upload failed' });
        }

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};
