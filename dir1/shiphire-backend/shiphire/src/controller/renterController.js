import moment from 'moment';
import { v4 as uuid } from 'uuid';
import Contract from '../models/Contract';
import Renter from '../models/Renter';
import RequestForQuote from '../models/RequestForQuote';
import Ship from '../models/Ship';
import ShipHistory from '../models/ShipHistory';
import Transaction from '../models/Transaction';
import User from '../models/User';
import agenda from '../utils/agenda';
import firebaseAdmin from '../utils/firebaseAdmin';
import { sendEmail } from '../utils/sendEmail';
import Proposal from './../models/Proposal';
import ShipCategory from './../models/ShipCategory';
import { generateOTP } from './../utils/generateOTP';
import axios from 'axios';
import Admin from '../models/Admin';
import momenttz from 'moment-timezone';
import ShipOwner from './../models/ShipOwner';

export const getRenterData = async (req, res) => {
    try {
        const renter = await Renter.findOne({ userId: req.user._id })
            .populate({
                path: 'shipReminded.ship.id',
                strictPopulate: false,
                select: 'name imageUrl',
            })
            .populate({
                path: 'userId',
                strictPopulate: false,
                select: 'name email phoneNumber isVerified isPhoneVerified isCompanySubmitted imageUrl isCompanyVerified isCompanyRejected',
            });
        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        res.status(200).json({ status: 'success', data: renter });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getRenterById = async (req, res) => {
    try {
        const renter = await Renter.findById(req.params.renterId);

        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        res.status(200).json({ status: 'success', data: renter });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitRenterPreference = async (req, res) => {
    try {
        const renter = await Renter.findOneAndUpdate(
            { userId: req.user.id },
            { renterPreference: req.body.renterPreference },
            { new: true },
        );
        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        res.status(200).json({ status: 'success', data: renter });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitRequestForQuote = async (req, res) => {
    const file = req.file;
    const {
        categoryId,
        shipId,
        shipOwnerId,
        rentalDuration,
        rentalDate,
        needs,
        locationDeparture,
        locationDestination,
        shipRentType,
    } = req.body;
    const { firebaseId, googleId, appleId } = req.user;
    const bucket = firebaseAdmin.storage().bucket();
    let rentalId;

    const dateTime = new Date().toLocaleString();
    const date = dateTime.split(', ')[0];
    const dateParts = date.split('/');

    const month = dateParts[0];
    const day = dateParts[1];
    const year = dateParts[2];

    const formattedDate =
        (month.length === 1 ? '0' + month : month) +
        (day.length === 1 ? '0' + day : day) +
        year;
    const uniqueString = uuid();
    const rentalIdTail = uniqueString.split('-')[0];

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

        const renter = await Renter.findOne({ userId: user.id });

        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        const shipOwner = await ShipOwner.findOne({ _id: shipOwnerId });

        if (!shipOwner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship owner not found' });
        }

        const ship = await Ship.findOne({ _id: shipId }).populate(
            'category',
            'name',
        );

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        const shipForTransaction = {
            shipId: ship._id,
            shipOwnerId: shipOwner._id,
        };

        const dateSplitting = rentalDate.split(' to ');
        // const startDate = moment(dateSplitting[0], 'DD MMM YYYY');
        // const endDate = moment(dateSplitting[1], 'DD MMM YYYY');
        const startDate = new Date(dateSplitting[0]);
        const endDate = new Date(dateSplitting[1]);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        const uploadedFile = bucket.file(file.originalname);
        await uploadedFile.save(file.buffer, {
            contentType: file.mimetype,
            public: true,
        });

        const [rfqUrl] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '02-08-2030',
        });

        const newRFQ = new RequestForQuote({
            ship: shipId,
            renter: renter._id,
            category: categoryId,
            shipOwner: shipOwnerId,
            rfqUrl,
        });

        await newRFQ.save();

        rentalId = 'SH-' + formattedDate + '-' + rentalIdTail;
        const newTransaction = new Transaction({
            rentalId,
            renterId: renter._id,
            rentalStartDate: startDate,
            rentalEndDate: endDate,
            rentalDuration,
            ship: shipForTransaction,
            rfq: {
                rfqId: newRFQ._id,
                rfqUrl,
            },
            status: [],
            needs,
            locationDeparture,
            locationDestination,
            shipRentType,
            isReviewed: false,
        });

        newTransaction.addStatus('rfq 1', 'RFQ sent');
        newTransaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log('error', error);
    }
};

export const getAllTransaction = async (req, res) => {
    const { firebaseId, googleId, _id: userId, appleId } = req.user;

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

        const renter = await Renter.findOne({ userId });

        if (!renter) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }

        const transaction = await Transaction.aggregate([
            {
                $match: {
                    renterId: renter._id,
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
                    'ship.shipDocuments': 0,
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

        if (!transaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        res.status(200).json({ status: 'success', data: transaction });
    } catch (error) {
        console.log(error);
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

        const shipOwner = await ShipOwner.findOne({
            _id: transaction.ship.shipOwnerId,
        });

        const shipCategory = await ShipCategory.findOne({
            _id: shipId.category,
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
            payment,
            contract,
            sailingStatus,
            beforeSailingPictures,
            afterSailingPictures,
            shipRentType,
            isReviewed,
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
                shipId: shipId,
                shipOwnerId: shipOwnerId,
                name: name,
                imageUrl: imageUrl,
                category: shipCategory,
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
            payment,
            contract,
            sailingStatus,
            beforeSailingPictures,
            afterSailingPictures,
            shipRentType,
            isReviewed,
        };

        res.status(200).json({
            status: 'success',
            data: destructedTransaction,
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitCompanyProfile = async (req, res) => {
    const { companyName, typeOfCompany, companyAddress } = req.body;
    const files = req.files;
    const bucket = firebaseAdmin.storage().bucket();
    const { firebaseId, googleId, appleId } = req.user;

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
            {
                $or: [
                    { firebaseId: firebaseId === undefined ? '' : firebaseId },
                    { googleId: googleId === undefined ? '' : googleId },
                    { appleId: appleId === undefined ? '' : appleId },
                ],
            },
            { isCompanySubmitted: true },
            { new: true },
        );

        const updatedRenter = await Renter.findOneAndUpdate(
            { userId: req.user.id },
            {
                company: {
                    name: companyName,
                    companyType: typeOfCompany,
                    address: companyAddress,
                    documentCompany: uploadedDocuments,
                    imageUrl,
                },
            },
            { new: true },
        );

        if (!updatedRenter && !updateUserData) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Renter not found' });
        }
        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const sendOTPVerifEmail = async (req, res) => {
    const emailVerifOTP = generateOTP(4);

    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOneAndUpdate(
            {
                $or: [
                    { firebaseId: firebaseId === undefined ? '' : firebaseId },
                    { googleId: googleId === undefined ? '' : googleId },
                    { appleId: appleId === undefined ? '' : appleId },
                ],
            },
            { emailVerifOTP },
            { new: true },
        );

        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        if (user.isVerified === true) {
            return res.status(401).json({
                status: 'fail',
                message: 'Your account has been verified!',
            });
        }

        await sendEmail({
            to: user.email,
            from: 'smishiphire.noreply@gmail.com',
            subject: 'Shiphire email verification',
            text: `Your Shiphire email verification code is ${user.emailVerifOTP}`,
        });

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const VerifyEmailOTP = async (req, res) => {
    const { emailVerifOTP } = req.body;
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        if (user.emailVerifOTP !== emailVerifOTP) {
            res.status(422).json({ status: 'fail', message: 'Wrong otp' });
        } else {
            await User.findOneAndUpdate(
                {
                    $or: [
                        { firebaseId: firebaseId },
                        { googleId: googleId === undefined ? '' : googleId },
                        { appleId: appleId === undefined ? '' : appleId },
                    ],
                },
                { $unset: { emailVerifOTP: 1 } },
                { new: true },
            );

            await User.findOneAndUpdate(
                {
                    $or: [
                        {
                            firebaseId:
                                firebaseId === undefined ? '' : firebaseId,
                        },
                        { googleId: googleId === undefined ? '' : googleId },
                        { appleId: appleId === undefined ? '' : appleId },
                    ],
                },
                { isVerified: true },
                { new: true },
            );

            res.status(200).json({ status: 'success' });
        }
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
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

export const respondNegotiateContract = async (req, res) => {
    const { rentalId, note, imageNotes, offeredPrice } = req.body;
    const files = req.files;
    const { firebaseId, googleId, appleId } = req.user;
    const bucket = firebaseAdmin.storage().bucket();

    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }
    try {
        let uploadedImage = [];
        if (files) {
            for (const [index, file] of files.entries()) {
                const uploadedFile = bucket.file(file.originalname);

                const [url] = await uploadedFile.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491',
                    queryParams: { param: new Date().getTime().toString() },
                });

                await uploadedFile.save(file.buffer, {
                    contentType: file.mimetype,
                    public: true,
                });
                let note;
                if (files.length > 1) {
                    note =
                        imageNotes[index] !== 'null'
                            ? imageNotes[index]
                            : undefined;
                } else {
                    note = imageNotes;
                }
                uploadedImage.push({
                    imageUrl: url,
                    imageDescription: note,
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
        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { rentalId },
            {
                $push: {
                    proposal: {
                        notes: note,
                        additionalImage: uploadedImage,
                        offeredPrice,
                    },
                },
            },
            { new: true },
        );
        if (!updatedTransaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }
        updatedTransaction.addStatus(
            'proposal 1',
            'Negotiate draft contract sent',
        );
        updatedTransaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const completeNegotiate = async (req, res) => {
    const { rentalId } = req.body;
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

        if (user.roles !== 'renter') {
            return res.status(403).json({
                status: 'fail',
                message: 'Only renters are allowed to complete negotiations.',
            });
        }

        const updatedTransaction = await Transaction.findOne({ rentalId });

        if (!updatedTransaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        updatedTransaction.addStatus('proposal 2', 'Waiting for contract');
        updatedTransaction.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const sendOTPSignProposal = async (req, res) => {
    const signProposalOTP = generateOTP(4);
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

        const proposal = await Proposal.findOneAndUpdate(
            { renter: user.renterId },
            { signProposalOTP },
            { new: true },
        );

        if (!proposal) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Proposal not found' });
        }

        await sendEmail({
            to: user.email,
            from: 'smishiphire.noreply@gmail.com',
            subject: 'Shiphire signing proposal',
            text: `Your Shiphire signing proposal OTP code is ${signProposalOTP}`,
        });

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const VerifySignProposalOTP = async (req, res) => {
    const { signProposalOTP, rentalId } = req.body;
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        const renterProposal = await Proposal.findOne({
            renter: user.renterId,
        });

        if (!renterProposal) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Proposal not found' });
        }

        if (renterProposal.signProposalOTP !== signProposalOTP) {
            res.status(422).json({ status: 'fail', message: 'Wrong otp' });
        } else {
            const currentDate = moment(Date.now());
            const expireDate = currentDate.add(7, 'days');
            const updatedTransaction = await Transaction.findOneAndUpdate(
                { rentalId },
                { paymentExpireDate: expireDate },
                { new: true },
            );

            await Proposal.findOneAndUpdate(
                { renter: user.renterId },
                { isAccepted: true },
                { new: true },
            );

            await Proposal.findOneAndUpdate(
                { renter: user.renterId },
                { $unset: { signProposalOTP: 1 } },
                { new: true },
            );

            updatedTransaction.addStatus('proposal 2', 'Proposal signed');
            updatedTransaction.save();

            res.status(200).json({ status: 'success' });
        }
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const uploadPaymentReceipt = async (req, res) => {
    const { rentalId, token } = req.body;
    const file = req.file;
    const bucket = firebaseAdmin.storage().bucket();
    const { firebaseId, googleId, appleId } = req.user;
    console.log(file);
    if (!file) {
        return res.status(400).json({ error: 'No files found' });
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

        const uploadedFile = bucket.file(file.originalname);
        await uploadedFile.save(file.buffer, {
            contentType: file.mimetype,
            public: true,
        });

        const [receiptUrl] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '02-08-2030',
            queryParams: { param: new Date().getTime().toString() },
        });

        console.log(receiptUrl);

        const transaction = await Transaction.findOne({ rentalId });

        if (!transaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        let currentDate;

        if (transaction.payment && transaction.payment.length > 1) {
            // Use the current date for subsequent payments
            currentDate = new Date();
        } else {
            // Use rentalStartDate for the first payment
            currentDate = new Date(transaction.rentalStartDate);
        }

        const scheduledTime = new Date(
            currentDate.getTime() + 23 * 24 * 60 * 60 * 1000,
        );

        const rentEndDate = new Date(transaction.rentalEndDate);

        const rentType = transaction.shipRentType;

        if (rentType === 'Monthly Rent') {
            if (scheduledTime < rentEndDate) {
                await agenda.schedule(scheduledTime, 'sendPaymentReminder', {
                    token,
                    rentalId,
                    userId: user.id,
                });
            }
        }

        let paymentId;

        const dateTime = new Date().toLocaleString();
        const date = dateTime.split(', ')[0];
        const dateParts = date.split('/');

        const month = dateParts[0];
        const day = dateParts[1];
        const year = dateParts[2];

        const formattedDate =
            (month.length === 1 ? '0' + month : month) +
            (day.length === 1 ? '0' + day : day) +
            year;
        const uniqueString = uuid();
        const rentalIdTail = uniqueString.split('-')[0];

        paymentId = 'PY-' + formattedDate + '-' + rentalIdTail;

        await Transaction.findOneAndUpdate(
            { rentalId, 'payment.paymentExpiredDate': { $exists: true } },
            {
                $unset: { 'payment.$.paymentExpiredDate': 1 },
                $set: {
                    'payment.$.paymentId': paymentId,
                    'payment.$.paymentApproved': false,
                    'payment.$.receiptUrl': receiptUrl,
                    'payment.$.createdAt': new Date(),
                },
            },
        );

        transaction.addStatus('payment 2', 'Payment receipt sent');

        // const ship = await Ship.findOne(transaction.ship.shipId)

        // await transaction.addStatus('sailing 1', `${ship.name} sudah siap`);

        // let sailingStatusDesc = ''
        // switch(status) {
        //     case 'beforeSailing':
        //         sailingStatusDesc = `${ship.name} sudah siap`;
        //         break;
        // }

        // const latestSailingStatus =
        // transaction.sailingStatus.length > 0
        //     ? transaction.sailingStatus[
        //           transaction.sailingStatus.length - 1
        //       ].status
        //     : null;

        // if (latestSailingStatus === 'beforeSailing') {
        //     return res.status(400).json({status: 'fail', message: 'tracking udpate failed'})
        // }

        // await transaction.sailingStatus.push({
        //     status: 'beforeSailing',
        //     desc: `${ship.name} sudah siap`,
        //     trackedBy: 'System',
        // date: dateTime
        // })

        // console.log(transaction.sailingStatus);

        await transaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllPayment = async (req, res) => {
    const { rentalId } = req.params;

    if (!rentalId) {
        return res.status(400).json({ error: 'No rentalId found' });
    }

    try {
        const payment = await Transaction.find(
            { rentalId },
            { shipRentType: 1, payment: 1 },
        );

        if (!payment) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Payment not found' });
        }
        res.status(200).json({ status: 'success', data: payment });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const renterOpenTransaction = async (req, res) => {
    const { rentalId } = req.body;

    if (!rentalId) {
        return res.status(400).json({ error: 'No rentalId found' });
    }

    try {
        const transaction = await Transaction.findOne({ rentalId });

        if (!transaction) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Transaction not found' });
        }

        const lastStatus = transaction.status[transaction.status.length - 1];

        lastStatus.isOpened = true;

        await transaction.save();

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const sendOTPSignContract = async (req, res) => {
    const signContractOTP = generateOTP(4);
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        const contract = await Contract.findOneAndUpdate(
            { renter: user.renterId },
            { signContractOTP },
            { new: true },
        );

        if (!contract) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Contract not found' });
        }

        await sendEmail({
            to: user.email,
            from: 'smishiphire.noreply@gmail.com',
            subject: 'Shiphire signing contract',
            text: `Your Shiphire signing contract OTP code is ${signContractOTP}`,
        });

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const verifySignContractOTP = async (req, res) => {
    const { signContractOTP, rentalId } = req.body;
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        const renterContract = await Contract.findOne({
            renter: user?.renterId,
        });

        if (!renterContract) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Contract not found' });
        }

        if (renterContract.signContractOTP !== signContractOTP) {
            res.status(422).json({ status: 'fail', message: 'Wrong otp' });
        } else {
            const currentDate = moment(Date.now());
            const expireDate = currentDate.add(7, 'days');
            const transaction = await Transaction.findOne({ rentalId });

            const newPayment = {
                paymentExpiredDate: expireDate,
            };
            await Transaction.findOneAndUpdate(
                { rentalId },
                {
                    $push: {
                        payment: newPayment,
                    },
                },
                { new: true },
            );
            await Contract.findOneAndUpdate(
                { renter: user.renterId },
                { isAccepted: true },
                { new: true },
            );

            await Contract.findOneAndUpdate(
                { renter: user.renterId },
                { $unset: { signContractOTP: 1 } },
                { new: true },
            );

            const contract = await Contract.findOne({
                renter: user.renterId,
                contractUrl: transaction.contract.contractUrl,
            });
            const rentEndDate = transaction.rentalEndDate;
            const rentStartDate = transaction.rentalStartDate;
            const needs = transaction.needs;
            const locationDeparture = transaction.locationDeparture;
            const locationDestination = transaction.locationDestination;
            const renterCompanyName = contract.renterCompanyName;

            const shipHistory = new ShipHistory({
                shipId: transaction.ship.shipId,
                price: transaction.offeredPrice,
                renter: user.renterId,
                locationDeparture: locationDeparture,
                locationDestination: locationDestination,
                rentStartDate,
                rentEndDate,
                needs: needs,
                renterCompanyName: renterCompanyName,
                source: 'automatic',
            });

            await shipHistory.save();

            await transaction.addStatus('contract 2', 'Contract signed');
            await transaction.addStatus('payment 1', 'Waiting for payment');

            console.log('shipHistory', shipHistory);
            await shipHistory.save();

            await transaction.addStatus('contract 2', 'Contract signed');
            await transaction.addStatus('payment 1', 'Waiting for payment');

            transaction.save();

            res.status(200).json({ status: 'success' });
        }
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log('error sign contract: ', error);
    }
};

export const sendOTPVerifyPhoneNumber = async (req, res) => {
    const { firebaseId, googleId, appleId } = req.user;
    // const phoneNumber = req.body.phoneNumber;
    const otp = generateOTP(4);

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

        if (user.isPhoneVerified === true) {
            return res.status(401).json({
                status: 'fail',
                message: 'Your phone number has been verified!',
            });
        }

        const updated = await User.findOneAndUpdate(
            { firebaseId },
            { phoneVerifOTP: otp },
            { new: true },
        );

        let formattedPhoneNumber = updated.phoneNumber;

        if (updated.phoneNumber.startsWith('0')) {
            formattedPhoneNumber = `62${updated.phoneNumber.slice(1)}`;
        }

        const message = {
            recipient: `${formattedPhoneNumber}@c.us`,
            message: `Hi, *${updated.name}*! \nYour OTP verification code is *${updated.phoneVerifOTP}*. \n\nDon't share this code to anyone else and ignore this message if you did't request this code. \n\n*SHIPHIRE*`,
        };

        // send the otp verification to whatsapp
        await axios.post(process.env.SHIPHIRE_WA_API, message);

        res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error.message);
    }
};

export const VerifyPhoneOTP = async (req, res) => {
    const { phoneVerifOTP } = req.body;
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        if (user.phoneVerifOTP !== phoneVerifOTP) {
            res.status(422).json({ status: 'fail', message: 'Wrong otp' });
        } else {
            await User.findOneAndUpdate(
                { firebaseId },
                { $unset: { phoneVerifOTP: 1 } },
                { new: true },
            );

            await User.findOneAndUpdate(
                { firebaseId },
                { isPhoneVerified: true },
                { new: true },
            );

            res.status(200).json({ status: 'success' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const VerifyPhoneNumberByAdmin = async (req, res) => {
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

        const admin = await Admin.find();
        const fcmAdmin = admin[0].fcmToken;
        // console.log(admin[0].fcmToken);

        const message = {
            notification: {
                title: 'Verification Request',
                body: `${user.name} requests for phone number verification`,
            },
            token: fcmAdmin,
        };

        if (fcmAdmin !== '') {
            try {
                await firebaseAdmin.messaging().send(message);
            } catch (error) {
                if (error.code === 'messaging/invalid-argument') {
                    await sendEmail({
                        to: admin[0].email,
                        from: 'smishiphire.noreply@gmail.com',
                        subject: 'Shiphire signing proposal',
                        text: `${user.name} requests for phone number verification`,
                    });
                } else {
                    throw error;
                }
            }
        } else {
            await sendEmail({
                to: admin[0].email,
                from: 'smishiphire.noreply@gmail.com',
                subject: 'Shiphire signing proposal',
                text: `${user.name} requests for phone number verification`,
            });
        }

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

// REFACTOR THIS SEND NOTIF

export const sendNotification = async (req, res) => {
    const { token, title, body } = req.body;

    const message = {
        notification: {
            title,
            body,
        },
        token,
    };

    try {
        const sendMessage = await firebaseAdmin.messaging().send(message);

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const setShipReminderNotif = async (req, res) => {
    const { token, scheduleTime, shipId } = req.body;
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const scheduledTime = new Date(scheduleTime);

        const ship = await Ship.findOne({ _id: shipId });
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId === undefined ? '' : firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        await agenda.schedule(scheduledTime, 'sendShipReminder', {
            token,
            shipId,
            userId: user.id,
        });

        await Renter.findOneAndUpdate(
            { userId: user.id },
            {
                $push: {
                    shipReminded: {
                        ship: {
                            id: ship.id,
                            reminderDate: scheduledTime,
                        },
                    },
                },
            },
            { new: true },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const getShipOwnerPaymentAccount = async (req, res) => {
    const transactionId = req.params.transactionId;

    try {
        console.log('transactionId', transactionId);
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                status: 'fail',
                message: 'Transaction not found',
            });
        }

        const shipOwnerId = transaction.ship.shipOwnerId;

        const owner = await ShipOwner.findOne({ _id: shipOwnerId });

        if (!owner) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship owner not found' });
        }

        const shipOwnerPaymentData = {
            name: owner.company.name,
            companyType: owner.company.companyType,
            bankName: owner.company.bankName,
            bankAccountName: owner.company.bankAccountName,
            bankAccountNumber: owner.company.bankAccountNumber,
        };

        res.status(200).json({
            status: 'success',
            data: shipOwnerPaymentData,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
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

        if (!date || !time) {
            return res
                .status(400)
                .json({ status: 'fail', message: `fields can't be empty` });
        }

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

        if (
            latestSailingStatus !== 'sailing' ||
            latestSailingStatus === 'returning'
        ) {
            return res.status(400).json({
                status: 'fail',
                message: 'Update tracking data is currently unavailable',
            });
        }

        const ship = await Ship.findOne(transaction.ship.shipId);

        let sailingNumber = 1;
        const latestStatus = transaction.status[transaction.status.length - 1];

        if (latestStatus && latestStatus.name.startsWith('sailing')) {
            const parts = latestStatus.name.split(' ');
            if (parts.length === 2 && !isNaN(parts[1])) {
                sailingNumber = parseInt(parts[1], 10) + 1;
            }
        }

        let autoFillDesc = '';
        switch (status) {
            case 'sailing':
                autoFillDesc = desc;
                break;
            case 'returning':
                autoFillDesc = `${ship.name} sedang kembali dari pelayaran`;
                transaction.addStatus(`sailing ${sailingNumber}`, autoFillDesc);
        }

        const trackedBy = {
            name: user.name,
            role: user.roles,
        };

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
                    queryParams: { param: new Date().getTime().toString() },
                });

                images.push({
                    imageName: imgDescription,
                    imageUrl: imageUrl,
                });
            }
        }

        const dateTimeString = `${date} ${time}`;
        const dateTime = momenttz
            .tz(dateTimeString, 'DD-MM-YYYY HH:mm:ss', 'Indonesia/Jakarta')
            .toDate();

        transaction.sailingStatus.push({
            status: status,
            desc: autoFillDesc,
            image: images,
            trackedBy: trackedBy,
            date: dateTime,
        });

        await transaction.save();

        const oneDayBeforeEndDate = momenttz(transaction.rentalEndDate)
            .subtract(1, 'day')
            .startOf('day')
            .toDate();

        await agenda.schedule(
            oneDayBeforeEndDate,
            'autoUpdateReturningStatus',
            { transactionId: transaction._id },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error.message);
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
        console.log(error.message);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const addRating = async (req, res) => {
    const { shipId, rate, review } = req.body;
    const { firebaseId, googleId, _id: userId, appleId } = req.user;

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

        const ship = await Ship.findOne({ _id: shipId });
        if (!ship) {
            res.status(404).json({ status: 'fail', message: 'Ship not found' });
        }

        let reviewMessage = review ? review : '';

        ship.rating.push({ rate: rate, review: reviewMessage });

        await ship.save();

        const transaction = await Transaction.findOne({ 'ship.shipId': shipId, renterId: user.renterId });
        if (transaction) {
            transaction.isReviewed = true;
            await transaction.save()
        }

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// export const shipIsReviewed = async (req, res) => {
//     const { rentalId, isReviewed } = req.body;
//     const { firebaseId, googleId, _id: userId, appleId } = req.user;

//     try {
//         const user = await User.findOne({
//             $or: [
//                 { firebaseId: firebaseId === undefined ? '' : firebaseId },
//                 { googleId: googleId === undefined ? '' : googleId },
//                 { appleId: appleId === undefined ? '' : appleId },
//             ],
//         });

//         if (!user) {
//             return res
//                 .status(404)
//                 .json({ status: 'fail', message: 'User not found' });
//         }

//         await Transaction.findOneAndUpdate(
//             { rentalId },
//             { isReviewed },
//             {
//                 projection: {
//                     isReviewed: 1,
//                 },
//                 new: true,
//             },
//         );

//         res.status(200).json({ status: 'success' });
//     } catch (error) {
//         res.status(500).json({ status: 'fail', message: error.message });
//     }
// };
