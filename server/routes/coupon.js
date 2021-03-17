const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const { 
    create, 
    remove, 
    list 
} = require('../controllers/coupon');

// const myMiddleware = (req, res, next) => {
//     console.log('IM A MIDDLEWARE YAY!');
//     next()
// }

router.post('/coupon', authCheck, adminCheck, create);
router.get('/coupons', list);
router.delete('/coupon/:couponId', authCheck, adminCheck, remove);

// router.get('/testing', myMiddleware, (req, res) => {
//     res.json({
//         data: "you successfully tried middleware",
//     });
// });

module.exports = router;