import User from '../models/User';
import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    let token;
    if (!authorization)
        return res.status(401).json({ message: 'Authorization required.' });
    else token = authorization.split(' ')[1];

    try {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res
                        .status(401)
                        .json({ status: 'fail', message: 'Invalid Token' });
                }
                try {
                    let user;
                    const userFirebase = await User.findOne({
                        firebaseId: decoded.id,
                    });
                    const userGoogle = await User.findOne({
                        googleId: decoded.id,
                    });
                    const userApple = await User.findOne({
                        appleId: decoded.id,
                    });

                    if (userFirebase) {
                        user = userFirebase;
                    } else if (userGoogle) {
                        user = userGoogle;
                    } else if (userApple) {
                        user = userApple;
                    }

                    if (!user) {
                        return res.status(404).json({
                            status: 'fail',
                            message: 'User not found',
                        });
                    }
                    req.user = user;
                } catch (error) {
                    return res
                        .status(401)
                        .json({ status: 'fail', message: error });
                }
                next();
            },
        );
    } catch (error) {
        res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
};

export default verifyToken;
