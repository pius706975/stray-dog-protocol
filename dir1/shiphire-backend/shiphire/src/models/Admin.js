import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fcmToken: {
        type: String,
    },
    level: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
