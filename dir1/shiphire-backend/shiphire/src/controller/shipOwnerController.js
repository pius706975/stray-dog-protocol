import Contract from '../models/Contract';
import DynamicForm from '../models/DynamicForm';
import DynamicInput from '../models/DynamicInput';
import Proposal from '../models/Proposal';
import Renter from '../models/Renter';
import Ship from '../models/Ship';
import ShipCategory from '../models/ShipCategory';
import ShipFacility from '../models/ShipFacility';
import ShipHistory from '../models/ShipHistory';
import ShipOwner from '../models/ShipOwner';
import ShipSpecification from '../models/ShipSpecification';
import Transaction from '../models/Transaction';
import User from '../models/User';
import firebaseAdmin from '../utils/firebaseAdmin';
import { deleteFile, uploadFile } from '../utils/firebaseService';
import _, { template } from 'lodash';
import moment from 'moment-timezone';

export const getShipOwnerData = async (req, res) => {
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
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

        res.status(200).json({ status: 'success', data: shipOwner });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitShip = async (req, res) => {
    const {
        name,
        location,
        desc,
        category,
        pricePerMonth,
        length,
        width,
        height,
        facilities,
        specifications,
    } = req.body;
    const splittedLocation = location.split('-').map(i => i.trim());
    const { firebaseId, googleId, appleId } = req.user;
    const size = {
        length,
        width,
        height,
    };
    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
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
        const existingCategory = await ShipCategory.findOne({ name: category });

        if (!existingCategory) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Category not found' });
        }

        const shipFacilities = await Promise.all(
            facilities.map(async facility => {
                const facilityExists = await ShipFacility.findOne({
                    name: facility,
                });
                if (facilityExists) {
                    return {
                        type: facilityExists.facilityCategory,
                        typeName: facilityExists.name,
                        name: facility,
                    };
                } else {
                    res.status(404).json({
                        status: 'fail',
                        message: 'Facility not found',
                    });
                }
            }),
        );

        const shipSpecifications = await Promise.all(
            specifications.map(async specification => {
                const specificationExists = await ShipSpecification.findOne({
                    name: specification.name,
                });

                if (specificationExists) {
                    return {
                        spesificationId: specificationExists.id,
                        name: specification.name,
                        value: Number(specification.value),
                    };
                } else {
                    res.status(404).json({
                        status: 'fail',
                        message: 'Specification not found',
                    });
                }
            }),
        );

        const defaultRfq = await DynamicForm.findOne({
            templateType: 'defaultRfq',
        });

        const ship = new Ship({
            name,
            province: splittedLocation[1],
            city: splittedLocation[0],
            desc,
            category: existingCategory.id,
            size,
            shipOwnerId: shipOwner.id,
            // rating: 5,
            pricePerMonth,
            totalRentalCount: 0,
            facilities: shipFacilities,
            specifications: shipSpecifications,
            rfqDynamicForm: defaultRfq._id,
        });
        const shipSaved = await ship.save();

        await ShipOwner.findOneAndUpdate(
            { userId: user.id },
            {
                $push: {
                    ships: {
                        shipId: shipSaved.id,
                        shipName: shipSaved.name,
                    },
                },
            },
        );

        res.status(200).json({
            status: 'success',
            data: {
                shipId: shipSaved.id,
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitProposal = async (req, res) => {
    const files = req.files;
    const { shipId, renterId, offeredPrice, rentalId, note } = req.body;
    const { firebaseId, googleId, appleId } = req.user;
    if (!files) {
        return res.status(400).json({ error: 'No file found' });
    }

    try {
        const bucket = firebaseAdmin.storage().bucket();
        if (!bucket) {
            return res.status(404).json({ error: 'Bucket not found' });
        }
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }
        const renter = await Renter.findOne({ _id: renterId });
        const shipOwner = await ShipOwner.findOne({ userId: user.id });
        const ship = await Ship.findOne({ _id: shipId }).populate(
            'category',
            'name',
        );

        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship owner not found' });
        }

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }
        const uploadedDocuments = [];
        if (files['otherDoc']) {
            if (files['otherDoc'].length > 0) {
                for (const file of files['otherDoc']) {
                    const uploadedFile = bucket.file(file.originalname);

                    await uploadedFile.save(file.buffer, {
                        contentType: file.mimetype,
                        public: true,
                    });

                    const [docUrl] = await uploadedFile.getSignedUrl({
                        action: 'read',
                        expires: '02-08-2030',
                    });
                    uploadedDocuments.push({
                        documentName: file.originalname,
                        documentUrl: docUrl,
                    });
                }
            }
        }

        const uploadedFile = bucket.file(
            files['draftContract'][0].originalname,
        );
        await uploadedFile.save(files['draftContract'][0].buffer, {
            contentType: files['draftContract'][0].mimetype,
            public: true,
        });
        const [draftContract] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '02-08-2030',
        });

        const newProposal = new Proposal({
            ship: shipId,
            renter: renterId,
            shipOwner: shipOwner._id,
            draftContract: draftContract,
            isAccepted: false,
            otherDoc: uploadedDocuments,
        });

        await newProposal.save();

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { rentalId },
            {
                $push: {
                    proposal: {
                        proposalId: newProposal._id,
                        proposalUrl: draftContract,
                        notes: note,
                        offeredPrice,
                    },
                },
                $set: {
                    offeredPrice,
                },
            },
            { new: true },
        );
        if (!updatedTransaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }
        updatedTransaction.addStatus('proposal 1', 'Draft contract sent');
        updatedTransaction.save();

        res.status(200).json({ status: 'success', newProposal });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const sendNegotiateContact = async (req, res) => {
    const file = req.file;
    const { shipId, renterId, rentalId, note, offeredPrice } = req.body;
    const { firebaseId, googleId, appleId } = req.user;
    if (!file) {
        return res.status(400).json({ error: 'No file found' });
    }
    try {
        const bucket = firebaseAdmin.storage().bucket();
        if (!bucket) {
            return res.status(404).json({ error: 'Bucket not found' });
        }
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }
        const renter = await Renter.findOne({ _id: renterId });
        const shipOwner = await ShipOwner.findOne({ userId: user.id });
        const ship = await Ship.findOne({ _id: shipId }).populate(
            'category',
            'name',
        );

        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship owner not found' });
        }

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

        const [draftContract] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '02-08-2030',
        });

        const newProposal = new Proposal({
            ship: shipId,
            renter: renterId,
            shipOwner: shipOwner._id,
            draftContract: draftContract,
            isAccepted: false,
        });

        await newProposal.save();

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { rentalId },
            {
                $push: {
                    proposal: {
                        proposalId: newProposal._id,
                        proposalUrl: draftContract,
                        notes: note,
                        offeredPrice,
                    },
                },
                $set: {
                    offeredPrice,
                },
            },
            { new: true },
        );
        if (!updatedTransaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }
        updatedTransaction.addStatus('proposal 1', 'Draft contract sent');
        updatedTransaction.save();

        res.status(200).json({ status: 'success', newProposal });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const approvePayment = async (req, res) => {
    const { rentalId } = req.body;
    if (!rentalId) {
        return res.status(400).json({ error: 'No rentalId found' });
    }

    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { rentalId, 'payment.paymentApproved': false },
            {
                // sailingStatus: 'afterSailing',
                $set: {
                    'payment.$.paymentApproved': true,
                },
            },
            { new: true },
        );

        if (!updatedTransaction) {
            console.log(updatedTransaction);
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        if (!updatedTransaction.sailingStatus) {
            updatedTransaction.sailingStatus = [];
        }

        // const latestSailingStatus =
        //     updatedTransaction.sailingStatus[
        //         updatedTransaction.sailingStatus.length - 1
        //     ];

        // if (
        //     latestSailingStatus &&
        //     latestSailingStatus.status !== 'afterSailing'
        // ) {
        //     latestSailingStatus.status = 'afterSailing';
        // }

        await updatedTransaction.save();

        if (
            updatedTransaction.payment &&
            updatedTransaction.payment.length === 1
        ) {
            const contract = await Contract.findOne({
                _id: updatedTransaction.contract.contractId,
            });

            const rentEndDate = updatedTransaction.rentalEndDate;
            const rentStartDate = updatedTransaction.rentalStartDate;
            const needs = updatedTransaction.needs;
            const locationDeparture = updatedTransaction.locationDeparture;
            const locationDestination = updatedTransaction.locationDestination;
            const renterCompanyName = contract?.renterCompanyName || '';

            const shipHistory = new ShipHistory({
                shipId: updatedTransaction.ship.shipId,
                price: updatedTransaction.offeredPrice,
                renter: updatedTransaction.renterId,
                locationDeparture: locationDeparture,
                locationDestination: locationDestination,
                rentStartDate,
                rentEndDate,
                needs: needs,
                renterCompanyName: renterCompanyName,
                source: 'automatic',
            });

            await shipHistory.save();

            await Ship.findOneAndUpdate(
                { _id: updatedTransaction.ship.shipId },
                { $inc: { totalRentalCount: 1 } },
            );
        }

        updatedTransaction.addStatus('payment 3', 'Payment approved');

        await updatedTransaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const submitContract = async (req, res) => {
    const file = req.file;
    const { shipId, renterId, rentalId } = req.body;
    const { firebaseId, googleId, appleId } = req.user;
    const bucket = firebaseAdmin.storage().bucket();

    if (!file) {
        return res.status(400).json({ error: 'No file found' });
    }

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }
        const renter = await Renter.findOne({
            _id: renterId,
        });
        const shipOwner = await ShipOwner.findOne({ userId: user.id });
        const ship = await Ship.findOne({ _id: shipId }).populate(
            'category',
            'name',
        );

        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship owner not found' });
        }

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

        const [contractUrl] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '02-08-2030',
        });

        const newContract = new Contract({
            ship: shipId,
            renter: renterId,
            shipOwner: shipOwner._id,
            contractUrl,
            isAccepted: false,
            renterCompanyName: renter.company.name,
        });

        await newContract.save();

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { rentalId },
            {
                contract: {
                    contractId: newContract._id,
                    contractUrl,
                },
            },
            { new: true },
        );

        if (!updatedTransaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }
        updatedTransaction.addStatus('contract 1', 'Contract received');
        await updatedTransaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitCompanyProfile = async (req, res) => {
    const {
        companyName,
        typeOfCompany,
        companyAddress,
        bankName,
        bankAccountName,
        bankAccountNumber,
    } = req.body;
    const files = req.files;
    const bucket = firebaseAdmin.storage().bucket();

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files found' });
    }

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }

    try {
        const uploadedDocuments = [];
        let imageUrl;

        for (const file of files) {
            const uploadedFile = bucket.file(file.originalname);
            const fileMimetype = {
                isImage:
                    file.mimetype === 'image/jpeg' ||
                    file.mimetype === 'image/jpg' ||
                    file.mimetype === 'image/png' ||
                    file.mimetype === 'image/gif',
                notImage:
                    file.mimetype !== 'image/jpeg' &&
                    file.mimetype !== 'image/jpg' &&
                    file.mimetype !== 'image/png' &&
                    file.mimetype !== 'image/gif',
            };

            if (fileMimetype.isImage) {
                const [url] = await uploadedFile.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491',
                    queryParams: { param: new Date().getTime().toString() },
                });

                imageUrl = url;
            }
            await uploadedFile.save(file.buffer, {
                contentType: file.mimetype,
                public: true,
            });
            if (fileMimetype.notImage) {
                const documentData = {
                    documentName: file.originalname,
                    documentUrl: uploadedFile.metadata.mediaLink,
                };
                uploadedDocuments.push(documentData);
            }
        }

        const updateUserData = await User.findOneAndUpdate(
            { _id: req.user._id },
            { isCompanySubmitted: true },
            { new: true },
        );

        const updatedShipOwner = await ShipOwner.findOneAndUpdate(
            { userId: req.user.id },
            {
                company: {
                    name: companyName,
                    companyType: typeOfCompany,
                    address: companyAddress,
                    bankName: bankName,
                    bankAccountName: bankAccountName,
                    bankAccountNumber: bankAccountNumber,
                    documentCompany: uploadedDocuments,
                    imageUrl,
                },
            },
            { new: true },
        );

        if (!updatedShipOwner && !updateUserData) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship Owner not found' });
        }
        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const editShipById = async (req, res) => {
    const { shipId } = req.params;
    const {
        name,
        location,
        desc,
        category,
        pricePerMonth,
        length,
        width,
        height,
        facilities,
        specifications,
    } = req.body;
    const { firebaseId, googleId, appleId } = req.user;
    const size = {
        length,
        width,
        height,
    };
    const splittedLocation = location
        ? location.split('-').map(i => i.trim())
        : null;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
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

        const existingCategory = category
            ? await ShipCategory.findOne({ name: category })
            : null;

        if (category && !existingCategory) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Category not found' });
        }

        const getExistingData = Ship.findById(shipId);

        const shipFacilities = facilities
            ? await Promise.all(
                  facilities.map(async facility => {
                      const facilityExists = await ShipFacility.findOne({
                          name: facility,
                      });
                      if (facilityExists) {
                          return {
                              type: facilityExists.id,
                              typeName: facilityExists.name,
                              name: facility,
                          };
                      } else {
                          res.status(404).json({
                              status: 'fail',
                              message: 'Facility not found',
                          });
                      }
                  }),
              )
            : getExistingData.facilities;

        const shipSpecifications = specifications
            ? await Promise.all(
                  specifications.map(async specification => {
                      const specificationExists =
                          await ShipSpecification.findOne({
                              name: specification.name,
                          });

                      if (specificationExists) {
                          return {
                              spesificationId: specificationExists.id,
                              name: specification.name,
                              value: Number(specification.value),
                          };
                      } else {
                          res.status(404).json({
                              status: 'fail',
                              message: 'Specification not found',
                          });
                      }
                  }),
              )
            : getExistingData.specifications;

        const ship = await Ship.findOneAndUpdate(
            { _id: shipId },
            {
                name,
                province: splittedLocation
                    ? splittedLocation[1]
                    : getExistingData.province,
                city: splittedLocation
                    ? splittedLocation[0]
                    : getExistingData.city,
                desc,
                category: existingCategory
                    ? existingCategory.id
                    : getExistingData.category,
                size,
                shipOwnerId: shipOwner.id,
                rating: 5,
                pricePerMonth,
                totalRentalCount: 0,
                facilities: shipFacilities,
                specifications: shipSpecifications,
            },
        );
        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No ship found' });
        }

        await ShipOwner.findOneAndUpdate(
            { userId: user.id },
            {
                $push: {
                    ships: {
                        shipId: ship.id,
                        shipName: ship.name,
                    },
                },
            },
        );

        res.status(200).json({
            status: 'success',
            data: {
                shipId: ship.id,
            },
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const editShipImageById = async (req, res) => {
    const image = req.file;
    const { shipId } = req.params;

    if (!image) {
        return res.status(400).json({ error: 'No image found' });
    }

    try {
        const shipData = await Ship.findOne({ _id: shipId });

        if (!shipData) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        const isImageDeleted = await deleteFile(shipData.imageUrl);

        const uploadedImageUrl = await uploadFile(res, image);

        if (!isImageDeleted || !uploadedImageUrl) {
            return res.status(500).json({
                status: 'fail',
                message: 'Error uploading file on firebase',
            });
        }

        await Ship.findOneAndUpdate(
            { _id: shipId },
            {
                imageUrl: uploadedImageUrl,
            },
        );

        res.status(200).json({
            status: 'success',
            data: {
                shipId: shipData.id,
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const editShipDocumentById = async (req, res) => {
    const files = req.file;
    const { shipId } = req.params;

    if (!files) {
        return res.status(400).json({ error: 'No Document found' });
    }

    try {
        const shipData = await Ship.findOne({ _id: shipId });

        if (!shipData) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        let isDocumentDeleted;
        let uploadedDocumentUrl;

        if (files.originalname.includes('Owner Document 1')) {
            isDocumentDeleted = deleteFile(
                shipData.shipDocuments[0].documentUrl,
            );
            uploadedDocumentUrl = await uploadFile(res, files);
            await Ship.findOneAndUpdate(
                { _id: shipId },
                {
                    shipDocuments: [
                        {
                            documentName: files.originalname,
                            documentUrl: uploadedDocumentUrl,
                        },
                        {
                            documentName:
                                shipData.shipDocuments[1].documentName,
                            documentUrl: shipData.shipDocuments[1].documentUrl,
                        },
                    ],
                },
            );
        } else {
            isDocumentDeleted = deleteFile(
                shipData.shipDocuments[1].documentUrl,
            );
            uploadedDocumentUrl = await uploadFile(res, files);

            await Ship.findOneAndUpdate(
                { _id: shipId },
                {
                    shipDocuments: [
                        {
                            documentName:
                                shipData.shipDocuments[0].documentName,
                            documentUrl: shipData.shipDocuments[0].documentUrl,
                        },
                        {
                            documentName: files.originalname,
                            documentUrl: uploadedDocumentUrl,
                        },
                    ],
                },
            );
        }

        if (!isDocumentDeleted || !uploadedDocumentUrl) {
            return res.status(500).json({
                status: 'fail',
                message: 'Error uploading file on firebase',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                shipId: shipData.id,
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteShipById = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;

    try {
        const shipData = await Ship.findOne({ _id: id });

        const isImageDeleted = await deleteFile(shipData.imageUrl);
        const isDoc1Deleted = await deleteFile(
            shipData.shipDocuments[0].documentUrl,
        );
        const isDoc2Deleted = await deleteFile(
            shipData.shipDocuments[1].documentUrl,
        );
        if (!isImageDeleted || !isDoc1Deleted || !isDoc2Deleted) {
            return res.status(500).json({
                status: 'fail',
                message: 'Error deleting file on firebase',
            });
        }

        await Ship.findOneAndDelete({ _id: id });

        await ShipOwner.findOneAndUpdate(
            { userId: _id },
            {
                $pull: {
                    ships: {
                        shipId: id,
                    },
                },
            },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getTopRentedShips = async (req, res) => {
    const { shipOwnerId } = req.user;

    if (!shipOwnerId) {
        return res
            .status(422)
            .json({ status: 'fail', message: 'Unprocessable data' });
    }

    try {
        const user = await User.findOne({ shipOwnerId });
        const topRentedShips = await Ship.find({
            totalRentalCount: { $gte: 5 },
            shipOwnerId,
        })
            .sort({ totalRentalCount: -1 })
            .limit(10)
            .populate('category', 'name');

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        if (topRentedShips.length === 0) {
            return res.status(200).json({
                status: 'fail',
                message: 'No top-rented ships found by owner',
            });
        }

        res.status(200).json({ status: 'success', data: topRentedShips });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getTopRatedShips = async (req, res) => {
    const { shipOwnerId } = req.user;

    if (!shipOwnerId) {
        return res
            .status(422)
            .json({ status: 'fail', message: 'Unprocessable data' });
    }

    try {
        const user = await User.findOne({ shipOwnerId });
        const topRatedShips = await Ship.find({
            rating: { $gte: 4 },
            shipOwnerId,
        })
            .sort({ rating: -1 })
            .limit(10)
            .populate('category', 'name');

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        if (topRatedShips.length === 0) {
            return res.status(200).json({
                status: 'fail',
                message: 'No top-rated ships found by owner',
            });
        }

        res.status(200).json({ status: 'success', data: topRatedShips });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getShipById = async (req, res) => {
    const { shipOwnerId } = req.user;

    try {
        const shipOwner = await ShipOwner.findById(shipOwnerId);

        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship Owner not found' });
        }

        const ship = await Ship.find({ shipOwnerId: shipOwnerId }).populate(
            'category',
            'name',
        );

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        res.status(200).json({ status: 'success', data: ship });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllTransaction = async (req, res) => {
    const { shipOwnerId } = req.user;

    try {
        const transactions = await Transaction.aggregate([
            {
                $match: {
                    'ship.shipOwnerId': shipOwnerId,
                },
            },
            {
                $lookup: {
                    from: 'ships',
                    localField: 'ship.shipId',
                    foreignField: '_id',
                    as: 'ship',
                },
            },
            {
                $unwind: '$ship',
            },
            {
                $project: {
                    'ship.desc': 0,
                    'ship.tags': 0,
                    'ship.pricePerMonth': 0,
                    'ship.facilities': 0,
                    'ship.specifications': 0,
                    'ship.rating': 0,
                    'ship.totalRentalCount': 0,
                    'ship.__v': 0,
                },
            },
            {
                $lookup: {
                    from: 'shipcategories',
                    localField: 'ship.category',
                    foreignField: '_id',
                    as: 'ship.category',
                },
            },
            {
                $unwind: '$ship.category',
            },
            {
                $project: {
                    'ship.category.__v': 0,
                },
            },
        ]);

        if (!transactions) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        res.status(200).json({ status: 'success', data: transactions });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const acceptRFQById = async (req, res) => {
    const { rentalId } = req.body;

    try {
        const updateTransaction = await Transaction.findOne({ rentalId });

        updateTransaction.addStatus('rfq 2', 'RFQ accepted');

        await updateTransaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getTransactionById = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findOne({
            rentalId: id,
        }).populate({
            path: 'ship.shipId',
            select: '-desc -tags -shipDocuments -pricePerMonth -facilities -specifications -rating -totalRentalCount -__v',
        });

        if (!transaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        const ship = transaction.ship;
        if (!ship) {
            return res.status(404).json({
                status: 'fail',
                message: 'Ship not found in the transaction',
            });
        }

        const shipId = ship.shipId;
        if (!shipId) {
            return res.status(404).json({
                status: 'fail',
                message: 'ShipId not found in the transaction',
            });
        }

        const shipCategory = await ShipCategory.findOne({
            _id: shipId.category,
        });

        const shipOwner = await ShipOwner.findOne({
            _id: transaction.ship.shipOwnerId,
        });

        if (!shipCategory) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship category not found' });
        }

        const {
            _id,
            rentalId,
            renterId,
            rentalDuration,
            rentalStartDate,
            rentalEndDate,
            locationDeparture,
            locationDestination,
            status,
            rfq,
            proposal,
            offeredPrice,
            createdAt,
            updatedAt,
            paymentExpireDate,
            contract,
            sailingStatus,
            beforeSailingPictures,
            afterSailingPictures,
        } = transaction;

        const { shipOwnerId, name, imageUrl, size } = ship.shipId;

        const destructedTransaction = {
            _id,
            rentalId,
            renterId,
            rentalDuration,
            rentalStartDate,
            rentalEndDate,
            locationDeparture,
            locationDestination,
            ship: {
                shipOwnerId: shipOwnerId,
                name: name,
                imageUrl: imageUrl,
                category: { name: shipCategory.name },
                size: size,
                companyName: shipOwner.company.name,
                companyType: shipOwner.company.companyType,
            },
            status,
            rfq,
            proposal,
            offeredPrice,
            createdAt,
            updatedAt,
            paymentExpireDate,
            contract,
            sailingStatus,
            beforeSailingPictures,
            afterSailingPictures,
        };

        res.status(200).json({
            status: 'success',
            data: destructedTransaction,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getRenterDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const renter = await Renter.findById({ _id: id });

        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        res.status(200).json({ status: 'success', data: renter });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const addShipHistory = async (req, res) => {
    const {
        shipId,
        price,
        rentStartDate,
        rentEndDate,
        locationDestination,
        locationDeparture,
    } = req.body;
    const { firebaseId, googleId, appleId } = req.user;

    const files = req.files;
    const bucket = firebaseAdmin.storage().bucket();

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }
    try {
        const uploadedDocuments = [];
        if (files.length > 0) {
            for (const file of files) {
                const uploadedFile = bucket.file(file.originalname);

                await uploadedFile.save(file.buffer, {
                    contentType: file.mimetype,
                    public: true,
                });

                const [docUrl] = await uploadedFile.getSignedUrl({
                    action: 'read',
                    expires: '02-08-2030',
                });
                uploadedDocuments.push({
                    fileName: file.originalname,
                    fileUrl: docUrl,
                });
            }
        }
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        const ship = await Ship.findOne({ _id: shipId });

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }
        const startDate = new Date(rentStartDate);
        const endDate = new Date(rentEndDate);

        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
        const newShipHistory = new ShipHistory({
            shipId: shipId,
            price,
            rentStartDate: startDate,
            rentEndDate: endDate,
            locationDestination,
            locationDeparture,
            source: 'manual',
            genericDocument: uploadedDocuments,
        });

        const savedShipHistory = await newShipHistory.save();

        res.status(200).json({ status: 'success', data: savedShipHistory });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const getRenterUserDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const renter = await Renter.findById({ _id: id });
        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }
        const renterUser = await User.findById({ _id: renter.userId });

        res.status(200).json({ status: 'success', data: renterUser });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

const InputTypes = [
    { inputType: 'textInput', type: 'string' },
    { inputType: 'numericInput', type: 'number' },
    { inputType: 'selectDropDown', type: 'arrayOfString' },
    { inputType: 'imageSelect', type: 'image' },
    { inputType: 'docSelect', type: 'document' },
    { inputType: 'datePickerCalendar', type: 'string' },
    { inputType: 'datePicker', type: 'date' },
    { inputType: 'radioDropdown', type: 'string' },
];

export const addDynamicInputRfqFormOwner = async (req, res) => {
    const {
        formType,
        templateType,
        inputType,
        label,
        unit,
        option,
        min,
        multiline,
        order,
        required,
    } = req.body;

    try {
        const regexPattern = new RegExp(label, 'i');
        const labelNotUnique = await DynamicInput.findOne({
            label: { $regex: regexPattern },
            templateType,
        });
        if (labelNotUnique) {
            return res.status(400).json({
                status: 'fail',
                message: 'Label already exists',
            });
        }

        const fieldName = _.camelCase(label);
        const fieldType = InputTypes.filter(
            item => item.inputType === inputType,
        );
        let placeholder;
        if (
            inputType === 'textInput' ||
            inputType === 'selectDropDown' ||
            inputType === 'radioDropDown' ||
            inputType === 'datePickerCalendar'
        ) {
            placeholder = `Enter your ${label}`;
        }

        const newDynamicInput = new DynamicInput({
            formType,
            templateType,
            inputType,
            label,
            fieldName,
            fieldType: fieldType[0].type,
            placeholder,
            unit,
            order,
        });

        const savedDynamicInput = await newDynamicInput.save();

        // Fetch the dynamic form based on templateType
        const dynamicForm = await DynamicForm.findOne({
            formType,
            templateType:
                templateType === 'defaultRfq' ? 'defaultRfq' : templateType,
        });

        let validation;
        if (min || multiline) {
            validation = {
                min,
                multiline,
            };
        }

        // Add the new dynamic input to the dynamic form
        dynamicForm.dynamicForms.push({
            dynamicInput: savedDynamicInput._id,
            required,
            option,
            validation,
        });

        // Save the updated dynamic form to the database
        await dynamicForm.save();

        res.status(200).json({
            status: 'success',
            data: dynamicForm,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};
export const getTemplateShipRFQFormsByShipCategory = async (req, res) => {
    const { shipCategory } = req.params;
    console.log(shipCategory);
    try {
        if (!shipCategory) {
            return res.status(400).json({
                status: 'fail',
                message: 'Ship category not provided.',
            });
        }

        const categoryExists = await ShipCategory.findOne({
            name: shipCategory,
        });
        if (!categoryExists) {
            return res.status(400).json({
                status: 'fail',
                message: 'Ship category does not exist.',
            });
        }

        // Find dynamic forms by templateType, shipId: !exists, active: true
        const dynamicForms = await DynamicForm.findOne({
            templateType: `${shipCategory}Rfq`,
            shipId: { $exists: false },
            active: true,
        }).populate({
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        // Check if dynamic forms exist
        if (!dynamicForms || dynamicForms.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: {},
            });
        }

        // Return the dynamic forms data
        res.status(200).json({
            status: 'success',
            data: dynamicForms,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const submitShipPicturesBeforeSailing = async (req, res) => {
    const files = req.files;
    const { transactionId, descriptions } = req.body;
    const bucket = firebaseAdmin.storage().bucket();

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files found' });
    }

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }

    try {
        const uploadedDocuments = [];

        // Convert descriptions to an array if it's a string
        const descriptionsArray = Array.isArray(descriptions)
            ? descriptions
            : [descriptions];

        if (descriptionsArray.length !== files.length) {
            return res.status(400).json({
                error: 'Mismatch between images and descriptions',
            });
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const description = descriptionsArray[i];

            // Check if the file is an image
            if (!file.mimetype.startsWith('image/')) {
                return res
                    .status(400)
                    .json({ error: 'Only image files are allowed' });
            }

            const uploadedFile = bucket.file(file.originalname);

            await uploadedFile.save(file.buffer, {
                contentType: file.mimetype,
                public: true,
            });

            const documentData = {
                documentName: file.originalname,
                documentUrl: uploadedFile.metadata.mediaLink,
                description: description,
            };
            uploadedDocuments.push(documentData);
        }

        const transaction = await Transaction.findOne({ _id: transactionId });

        if (!transaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        // const latestSailingStatus =
        //     transaction.sailingStatus[transaction.sailingStatus.length - 1];

        // if (
        //     !latestSailingStatus ||
        //     latestSailingStatus.status !== 'beforeSailing'
        // ) {
        //     return res.status(400).json({
        //         status: 'fail',
        //         message: 'Cannot upload after sailing',
        //     });
        // }

        const ship = await Ship.findOne(transaction.ship.shipId)
        
        await transaction.addStatus('sailing 1', `${ship.name} sudah siap`);

        // let sailingStatusDesc = ''
        // switch(status) {
        //     case 'beforeSailing':
        //         sailingStatusDesc = `${ship.name} sudah siap`;
        //         break;
        // }

        const latestSailingStatus =
        transaction.sailingStatus.length > 0
            ? transaction.sailingStatus[
                  transaction.sailingStatus.length - 1
              ].status
            : null;

        if (latestSailingStatus === 'beforeSailing') {
            return res.status(400).json({status: 'fail', message: 'tracking udpate failed'})
        }

        await transaction.sailingStatus.push({
            status: 'beforeSailing',
            desc: `${ship.name} sudah siap`,
            trackedBy: 'System',
            date: new Date()
        })

        transaction.beforeSailingPictures = uploadedDocuments;

        await transaction.save();

        res.status(200).json({ status: 'success', data: transaction });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const createTemplateDefaultRFQForm = async (req, res) => {
    try {
        const { templateType } = req.body;
        const { shipId } = req.params;

        // Fetch the default dynamic inputs
        const defaultDynamicInputs = await DynamicInput.find({
            templateType: 'defaultRfq',
        });

        // Create a new dynamic form using the default dynamic inputs
        const dynamicForm = await DynamicForm.findOne({
            formType: 'rfqForm',
            templateType: templateType,
        });

        // Update the Ship document with the new RFQ dynamic form
        const updateShip = await Ship.findByIdAndUpdate(
            shipId,
            { $set: { rfqDynamicForm: dynamicForm._id } },
            { new: true },
        );

        res.status(201).json({
            status: 'success',
            data: updateShip,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const getDynamicInputRFQByTemplateTypeOwner = async (req, res) => {
    const { shipId } = req.params;

    try {
        const dynamicInput = await DynamicForm.findOne({
            formType: 'rfqForm',
            templateType: `${shipId}CustomRfq`,
        }).populate({
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        if (!dynamicInput) {
            return res.status(404).json({
                status: 'fail',
                message: 'Dynamic input not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: dynamicInput,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const createTemplateCustomRFQForm = async (req, res) => {
    try {
        // Extract form type and template type from the request body or parameters
        const { shipId } = req.params;
        const { templateType } = req.body;
        // Check if the templateType is set to "default"
        if (templateType === 'defaultRfq') {
            // Fetch the default dynamic inputs
            const defaultDynamicInputs = await DynamicInput.find({
                templateType: 'defaultRfq',
            });

            // Create a new dynamic form using the default dynamic inputs
            const dynamicForm = new DynamicForm({
                formType: 'rfqForm',
                templateType,
                dynamicForms: defaultDynamicInputs.map(input => ({
                    dynamicInput: input._id,
                    required: true, // Set your desired default value
                    option: [], // Set your desired default value
                    validation: {}, // Set your desired default value
                })),
                shipId,
            });

            // Save the dynamic form to the database
            const savedDynamicForm = await dynamicForm.save();

            // Update the Ship documents with the new RFQ dynamic form
            await Ship.updateMany(
                {},
                { $set: { rfqDynamicForm: savedDynamicForm._id } },
            );

            return res.status(201).json({
                status: 'success',
                data: savedDynamicForm,
            });
        }

        // // If templateType is not "default", fetch the default dynamic forms
        let defaultDynamicForms = await DynamicForm.findOne({
            templateType: 'defaultRfq',
        });

        // If default dynamic forms do not exist, create an empty template
        if (!defaultDynamicForms) {
            defaultDynamicForms = { dynamicForms: [] };
        }

        // Use the default dynamic forms for the new dynamic form
        const dynamicForm = new DynamicForm({
            formType: 'rfqForm',
            templateType: `${shipId}CustomRfq`,
            dynamicForms: defaultDynamicForms.dynamicForms.map(form => ({
                dynamicInput: form.dynamicInput,
                required: true, // Set your desired default value
                option: form?.option, // Set your desired default value
                validation: form?.validation, // Set your desired default value
            })),
            shipId,
        });

        // Save the dynamic form to the database
        const savedDynamicForm = await dynamicForm.save();

        await Ship.findByIdAndUpdate(
            shipId,
            { $set: { rfqDynamicForm: savedDynamicForm._id } },
            { new: true },
        );

        res.status(201).json({
            status: 'success',
            data: savedDynamicForm,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const editDynamicInputOwnerRfqForm = async (req, res) => {
    const { id } = req.params;
    const {
        formType,
        templateType,
        inputType,
        label,
        unit,
        option,
        min,
        multiline,
        order,
        required,
    } = req.body;

    try {
        const oldInput = await DynamicInput.findOne({ _id: id });
        if (label !== oldInput.label) {
            // Check if the new label already exists
            const labelNotUnique = await DynamicInput.findOne({
                templateType: oldInput.templateType,
                label: { $regex: new RegExp(`^${label}$`, 'i') },
            });

            if (labelNotUnique) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Label already exists',
                });
            }
        }

        const updatedFields = {
            formType,
            templateType,
            inputType,
            label,
            unit,
            order,
        };

        const fieldType = InputTypes.filter(
            item => item.inputType === inputType,
        );

        let placeholder;
        if (
            inputType === 'textInput' ||
            inputType === 'selectDropDown' ||
            inputType === 'radioDropDown' ||
            inputType === 'datePickerCalendar'
        ) {
            placeholder = `Enter your ${label}`;
        }

        updatedFields.fieldName = _.camelCase(label);
        updatedFields.fieldType = fieldType[0].type;
        updatedFields.placeholder = placeholder;

        if (min || multiline) {
            updatedFields.validation = {
                min,
                multiline,
            };
        } else {
            updatedFields.validation = undefined;
        }

        const updatedDynamicInput = await DynamicInput.findByIdAndUpdate(
            { _id: id },
            updatedFields,
            { new: true },
        );

        // Fetch the dynamic form based on templateType
        const dynamicForm = await DynamicForm.findOne({
            formType,
            templateType:
                templateType === 'defaultRfq' ? 'defaultRfq' : templateType,
        });

        // Find the index of the dynamic input in the dynamic form
        const dynamicInputIndex = dynamicForm.dynamicForms.findIndex(
            form => form.dynamicInput.toString() === id,
        );

        // Update the dynamic input in the dynamic form
        dynamicForm.dynamicForms[dynamicInputIndex].required = required;
        dynamicForm.dynamicForms[dynamicInputIndex].option = option;
        dynamicForm.dynamicForms[dynamicInputIndex].validation = {
            min,
            multiline,
        };

        // Save the updated dynamic form to the database
        await dynamicForm.save();

        res.status(200).json({
            status: 'success',
            data: dynamicForm,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const getDynamicInputRFQOwnerById = async (req, res) => {
    const { _id } = req.params;

    try {
        const ship = await Ship.findOne({ rfqDynamicForm: _id });

        if (!ship) {
            return res.status(404).json({
                status: 'fail',
                message: 'Dynamic form not found',
            });
        }

        const rfqDynamicFormId = ship.rfqDynamicForm;

        // Temukan DynamicForm menggunakan rfqDynamicFormId
        const dynamicForm = await DynamicForm.findOne({
            _id: rfqDynamicFormId,
        }).populate({
            // Populate dynamicForms dengan DynamicInput
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        if (!dynamicForm) {
            return res.status(404).json({
                status: 'fail',
                message: 'RFQ Dynamic Form not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: dynamicForm,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const activateDynamicInput = async (req, res) => {
    const { _id } = req.params;

    try {
        const dynamicInput = await DynamicInput.findById(_id);

        if (!dynamicInput) {
            return res.status(404).json({
                status: 'fail',
                message: 'DynamicInput not found',
            });
        }

        // Toggle the active status
        const activateValue = dynamicInput.active;
        await DynamicInput.findOneAndUpdate(
            { _id },
            { $set: { active: !activateValue } },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const submitShipPicturesAfterSailing = async (req, res) => {
    const files = req.files;
    const { transactionId } = req.body;
    const bucket = firebaseAdmin.storage().bucket();

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files found' });
    }

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }

    try {
        const uploadedDocuments = [];
        let imageUrl;

        for (const file of files) {
            // Check if the file is an image
            if (!file.mimetype.startsWith('image/')) {
                return res
                    .status(400)
                    .json({ error: 'Only image files are allowed' });
            }

            const uploadedFile = bucket.file(file.originalname);

            const [url] = await uploadedFile.getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            });

            imageUrl = url;

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

        const transaction = await Transaction.findOne({ _id: transactionId });

        if (!transaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        const latestSailingStatus =
            transaction.sailingStatus[transaction.sailingStatus.length - 1];

        if (
            !latestSailingStatus ||
            latestSailingStatus.status !== 'afterSailing'
        ) {
            return res.status(400).json({
                status: 'fail',
                message: 'Cannot upload before sailing',
            });
        }

        // Check if there are corresponding "beforeSailing" pictures
        const beforeSailingPictures = transaction.beforeSailingPictures;

        if (beforeSailingPictures.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message:
                    'Cannot upload "afterSailing" pictures without corresponding "beforeSailing" pictures',
            });
        }

        // Ensure that each "afterSailing" picture has a corresponding "beforeSailing" picture
        if (uploadedDocuments.length !== beforeSailingPictures.length) {
            return res.status(400).json({
                status: 'fail',
                message:
                    'Number of "afterSailing" pictures must match the number of "beforeSailing" pictures',
            });
        }

        // Update "afterSailing" pictures with corresponding "beforeSailing" picture ids
        const afterSailingPictures = uploadedDocuments.map(
            (afterPicture, index) => ({
                ...afterPicture,
                beforeSailingPictureId: beforeSailingPictures[index]._id,
            }),
        );

        transaction.afterSailingPictures = afterSailingPictures;

        await transaction.addStatus('complete', 'Transaction is completed')

        await transaction.save();

        res.status(200).json({ status: 'success', data: transaction });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const getTransactionNegoById = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findOne(
            {
                _id: id,
            },
            {
                __v: 0,
                rfq: 0,
            },
        )

            .populate({
                path: 'renterId',
                strictPopulate: false,
                select: ['name'],
            })
            .populate({
                path: 'ship.shipId',
                strictPopulate: false,
                select: ['size', 'name', 'imageUrl', 'shipDocuments'],
            })
            .populate({
                path: 'ship.shipOwnerId',
                strictPopulate: false,
                select: ['name'],
            })
            .populate({
                path: 'proposal.proposalId',
                strictPopulate: false,
                select: ['otherDoc'],
            });
        if (!transaction) {
            res.status(400).json({
                status: 'fail',
                message: 'Transaction not found',
            });
        }
        if (transaction && transaction.status) {
            transaction.status.sort(
                (a, b) => new Date(b.date) - new Date(a.date),
            );
        }
        res.status(200).json({ status: 'success', data: transaction });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const updateTracking = async (req, res) => {
    const { id } = req.params;
    const { status, imgDesc, desc, date, time } = req.body;
    const { firebaseId, googleId, _id: userId, appleId } = req.user;
    const files = req.files;
    const bucket = firebaseAdmin.storage().bucket();

    if (!bucket) {
        return res
            .status(404)
            .json({ status: 'fail', message: 'No bucket found' });
    }

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        // if (!date || !time) {
        //     return res
        //         .status(400)
        //         .json({ status: 'fail', message: `fields can't be empty` });
        // }

        const transaction = await Transaction.findOne({ rentalId: id });
        if (!transaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No transaction found' });
        }

        const latestSailingStatus =
            transaction.sailingStatus.length > 0
                ? transaction.sailingStatus[
                      transaction.sailingStatus.length - 1
                  ].status
                : null;
        const latestTransactionStatus =
            transaction.status.length > 0
                ? transaction.status[transaction.status.length - 1]
                : null;

        if (latestSailingStatus === 'sailing') {
            return res
                .status(400)
                .json({ status: 'fail', message: 'ship has been sailing' });
        } else if (latestSailingStatus === 'afterSailing') {
            return res
                .status(400)
                .json({ status: 'fail', message: 'ship is already docked' });
        } else if (
            latestTransactionStatus.name === 'complete' ||
            latestTransactionStatus.desc === 'Transaction is completed'
        ) {
            return res.status(400).json({
                status: 'fail',
                message: 'transaction status is completed',
            });
        }

        const ship = await Ship.findOne(transaction.ship.shipId);

        let autoFillDesc = '';
        switch (status) {
            case 'beforeSailing':
                autoFillDesc = `${ship.name} sudah siap`;
                break;
            case 'sailing':
                autoFillDesc = `${ship.name} bergerak dari ${transaction.locationDeparture} menuju ${transaction.locationDestination}`;
                break;
            case 'afterSailing':
                autoFillDesc = `${ship.name} sudah berlabuh`;
        }

        const trackedBy = {
            name: user.name,
            role: user.roles,
        };

        let sailingNumber = 1;
        const latestStatus = transaction.status[transaction.status.length - 1];

        if (latestStatus && latestStatus.name.startsWith('sailing')) {
            const parts = latestStatus.name.split(' ');
            if (parts.length === 2 && !isNaN(parts[1])) {
                sailingNumber = parseInt(parts[1], 10) + 1;
            }
        }

        let images = [];

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const imgDescription = Array.isArray(imgDesc)
                    ? imgDesc[i]
                    : imgDesc;
                const uploadedFile = bucket.file(file.originalname);

                await uploadedFile.save(file.buffer, {
                    contentType: file.mimetype,
                    public: true,
                });

                const [imageUrl] = await uploadedFile.getSignedUrl({
                    action: 'read',
                    expires: '02-08-2030',
                });

                images.push({
                    imageName: imgDescription,
                    imageUrl: imageUrl,
                });
            }
        }

        // const dateTimeString = `${date} ${time}`;
        // const dateTime = moment
        //     .tz(dateTimeString, 'DD-MM-YYYY HH:mm:ss', 'Indonesia/Jakarta')
        //     .toDate();

        transaction.sailingStatus.push({
            status: status,
            desc: autoFillDesc,
            image: images,
            trackedBy: trackedBy,
            date: Date.now(),
        });

        transaction.addStatus(`sailing ${sailingNumber}`, autoFillDesc);

        await transaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getTrackingHistory = async (req, res) => {
    const { firebaseId, googleId, _id: userId, appleId } = req.user;
    const { id } = req.params;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        const pipeline = [
            { $match: { rentalId: id } },
            {
                $lookup: {
                    from: 'ships',
                    localField: 'ship.shipId',
                    foreignField: '_id',
                    as: 'ship',
                },
            },
            { $unwind: '$ship' },
            {
                $lookup: {
                    from: 'shipowners',
                    localField: 'ship.shipOwnerId',
                    foreignField: '_id',
                    as: 'shipowner',
                },
            },
            { $unwind: '$shipowner' },
            {
                $project: {
                    'ship._id': 1,
                    'ship.name': 1,
                    sailingStatus: 1,
                    updatedAt: 1,
                    locationDeparture: 1,
                    locationDestination: 1,
                    'shipowner.company.name': 1,
                    'shipowner.company.companyType': 1,
                },
            },
            { $unwind: '$sailingStatus' },
            { $sort: { 'sailingStatus.date': -1 } },
            {
                $group: {
                    _id: '$_id',
                    ship: { $first: '$ship' },
                    company: { $first: '$shipowner' },
                    locationDeparture: { $first: '$locationDeparture' },
                    locationDestination: { $first: '$locationDestination' },
                    trackingHistory: {
                        $push: '$sailingStatus',
                    },
                },
            },
        ];

        const trackingHistory = await Transaction.aggregate(pipeline);
        if (!trackingHistory || trackingHistory <= 0) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No tracking data found' });
        }

        res.status(200).json({ status: 'success', data: trackingHistory });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};
