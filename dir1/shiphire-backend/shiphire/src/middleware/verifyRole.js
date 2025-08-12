import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';


export const verifyAdminToken = async (req, res, next) => {
    const { authorization } = req.headers;
    let token;
    if (!authorization) {
        return res.status(401).json({ message: 'Missing authorization' });
    } else {
        token = authorization.split(' ')[1];
    }

    const decodedToken = async (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ status: 'fail', message: 'Invalid Token' });
        }

        try {
            let admin;
            const adminData = await Admin.findOne({ _id: decoded.id });

            if (adminData) {
                admin = adminData;
            } 

            if (!admin) {
                return res
                    .status(401)
                    .json({ status: 'fail', message: 'Only admin can access' });
            }

            req.admin = admin;
        } catch (error) {
            return res
                .status(401)
                .json({ status: 'fail', message: 'Only admin can access'});
        }
        next();
    };

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, decodedToken);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};