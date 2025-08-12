import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    isPhoneVerified: {
        type: Boolean,
        required: true,
    },
    isCompanySubmitted: {
        type: Boolean,
        required: true,
    },
    phoneNumber: {
        type: String,
        // unique: true,
        // sparse: true,
        // index: true,
    },
    firebaseId: {
        type: String,
    },
    appleId: {
        type: String,
    },
    googleId: {
        type: String,
    },
    emailVerifOTP: {
        type: Number,
    },
    roles: {
        type: String,
    },
    renterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Renter',
    },
    shipOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipOwner',
    },
    forgotPassOTP: {
        type: Number,
    },
    imageUrl: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    phoneVerifOTP: {
        type: Number,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
