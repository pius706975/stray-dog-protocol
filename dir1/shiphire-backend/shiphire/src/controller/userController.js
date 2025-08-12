import Notification from '../models/Notification';
import Renter from '../models/Renter';
import ShipOwner from '../models/ShipOwner';
import User from '../models/User';
import { generateOTP } from '../utils/generateOTP';
import { sendEmail } from '../utils/sendEmail';
import { signInWithEmailAndPassword } from 'firebase/auth';
import firebaseAdmin from '../utils/firebaseAdmin';
import auth from '../utils/firebaseAuth';
import Ship from '../models/Ship';
import Transaction from '../models/Transaction';
import Contract from '../models/Contract';
import Proposal from '../models/Proposal';
import RequestForQuote from '../models/RequestForQuote';
import ShipHistory from '../models/ShipHistory';

export const getUserProfile = async (req, res) => {
    const { firebaseId, googleId, appleId } = req.user;
    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const submitUserRole = async (req, res) => {
    const { roleSubmitted } = req.body;
    let { firebaseId, googleId, appleId } = req.user;

    //reasign firebaseId and googleId to empty string if undefined
    firebaseId = firebaseId === undefined ? '' : firebaseId;
    googleId = googleId === undefined ? '' : googleId;
    appleId = appleId === undefined ? '' : appleId;

    try {
        const updatedUser = await User.findOneAndUpdate(
            {
                $or: [{ firebaseId }, { googleId }, { appleId }],
            },
            { roles: roleSubmitted },
            { new: true },
        );
        if (roleSubmitted === 'renter') {
            const renter = new Renter({
                userId: updatedUser._id,
                name: updatedUser.name,
                renterPreference: [],
            });
            const renterSaved = await renter.save();
            const userUpdated = await User.findOneAndUpdate(
                {
                    $or: [{ firebaseId }, { googleId }, { appleId }],
                },
                { renterId: renter._id },
            );

            if (!renterSaved || userUpdated.roles !== 'renter') {
                res.status(500).json({
                    status: 'fail',
                    message: 'failed save renter role ',
                });
            }
        }

        if (roleSubmitted === 'shipOwner') {
            const shipOwner = new ShipOwner({
                userId: updatedUser._id,
                name: updatedUser.name,
                shipOwnerDocuments: [],
            });
            const shipOwnerSaved = await shipOwner.save();
            const userUpdated = await User.findOneAndUpdate(
                {
                    $or: [{ firebaseId }, { googleId }, { appleId }],
                },
                { shipOwnerId: shipOwner._id },
            );
            if (!shipOwnerSaved || userUpdated.roles !== 'shipOwner') {
                res.status(500).json({
                    status: 'fail',
                    message: 'failed save ship owner role ',
                });
            }
        }

        res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const testEmailRenter = async (req, res) => {
    try {
        await sendEmail({
            to: 'gabriel.jamrewav+test1@gmail.com',
            from: 'smishiphire.noreply@gmail.com',
            subject: 'Test email',
            text: 'This is a test email',
            html: '<h1>This is a test email with html</h1>',
        });
        const OTP = generateOTP(4);
        res.status(200).json({ status: 'success', OTP });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const addPhoneNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        let { firebaseId, googleId, appleId } = req.user;

        firebaseId = firebaseId === undefined ? '' : firebaseId;
        googleId = googleId === undefined ? '' : googleId;
        appleId = appleId === undefined ? '' : appleId;

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'Phone number already exists',
            });
        }

        const userUpdated = await User.findOneAndUpdate(
            {
                $or: [{ firebaseId }, { googleId }, { appleId }],
            },
            { $set: { phoneNumber } },
            { new: true },
        );

        res.status(200).json({ status: 'success', data: userUpdated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getNotif = async (req, res) => {
    const { firebaseId, googleId, appleId } = req.user;

    try {
        const user = await User.findOne({
            $or: [
                { firebaseId: firebaseId },
                { googleId: googleId === undefined ? '' : googleId },
                { appleId: appleId === undefined ? '' : appleId },
            ],
        });

        const notifications = await Notification.find({
            userId: user.id,
        });

        res.status(200).json({ status: 'success', data: notifications });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const userOpenNotification = async (req, res) => {
    const { notifId } = req.body;

    try {
        const notifOpened = await Notification.findOneAndUpdate(
            { _id: notifId },
            { isReaded: true },
            { new: true },
        );
        if (!notifOpened)
            res.status(404).json({
                status: 'fail',
                message: 'Notification not found',
            });

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const deleteAccount = async (req, res) => {
    const { password } = req.body;
    const { email, googleId, renterId, shipOwnerId } = req.user;

    try {
        if (!googleId) {
            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            if (!credential) {
                return res
                    .status(404)
                    .json({ status: 'fail', message: 'Wrong password' });
            }
        }
        const { uid } = await firebaseAdmin.auth().getUserByEmail(email);
        if (shipOwnerId) {
            const shipId = [];
            const ship = await Ship.find(
                {
                    shipOwnerId,
                },
                { _id: 1 },
            );
            ship.forEach(item => {
                shipId.push(item._id);
            });
            await ShipHistory.deleteMany({
                shipId: { $in: shipId },
            });
            await Ship.deleteMany({
                shipOwnerId,
            });

            await Transaction.deleteMany({
                'ship.shipOwnerId': shipOwnerId,
            });

            await Contract.deleteMany({
                shipOwner: shipOwnerId,
            });
            await Proposal.deleteMany({
                shipOwner: shipOwnerId,
            });
            await RequestForQuote.deleteMany({
                shipOwner: shipOwnerId,
            });
            await ShipOwner.deleteOne({
                _id: shipOwnerId,
            });
            await firebaseAdmin.auth().deleteUser(uid);
            await User.deleteOne({
                shipOwnerId,
            });
        } else {
            await Transaction.deleteMany({
                renterId,
            });

            await Contract.deleteMany({
                renter: renterId,
            });
            await Proposal.deleteMany({
                renter: renterId,
            });
            await RequestForQuote.deleteMany({
                renter: renterId,
            });
            await Renter.deleteOne({
                _id: renterId,
            });
            await firebaseAdmin.auth().deleteUser(uid);
            await User.deleteOne({
                renterId,
            });
        }

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};
