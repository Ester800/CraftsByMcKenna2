const admin = require('../firebase');
const User = require('../models/user');

exports.authCheck = async (req, res, next) => {
    //console.log(req.headers); // token
    try {
        const firebaseUser = await admin
            .auth()
            .verifyIdToken(req.headers.authtoken);  // req.body.idToken
            //console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);
            //console.log(req.headers.authtoken);
            req.user = firebaseUser;
            next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            err: 'Invalid or expired token',
        });
    }
};


// use middle to check if the user's role is 'admin'.
exports.adminCheck = async (req, res, next) => {
    const { email } = req.user; // get user's email from the request

    const adminUser = await User.findOne({ email }).exec(); // 

    if (adminUser.role !== 'admin') {
        res.status(403).json({
            err: 'Admin resource. Access denied!',
        });
    } else {
        next();
    }
};

