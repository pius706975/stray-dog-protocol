import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
    {
        firebaseId: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
