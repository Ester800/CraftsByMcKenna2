const express = require('express');

const router = express.Router();

// middlewares
const { authCheck } = require('../middlewares/auth');

// controller
const {
    userCart, 
    getUserCart, 
    emptyCart, 
    saveAddress, 
    applyCouponToUserCart, 
    createOrder,
    } = require('../controllers/user');

router.post('/user/cart', authCheck, userCart); // save cart
router.get('/user/cart', authCheck, getUserCart); // get cart
router.delete('/user/cart', authCheck, emptyCart);  // empty cart
router.post('/user/address', authCheck, saveAddress);
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);  // coupon

router.post('/user/order', authCheck, createOrder );  // order

// below was temporary
// router.get('/user', (req, res) => {
//     res.json({
//         data: 'hey you hit user API endpoint',
//     });
// });

module.exports = router;