const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const { create, listAll } = require('../controllers/product');

// const myMiddleware = (req, res, next) => {
//     console.log('IM A MIDDLEWARE YAY!');
//     next()
// }

router.post('/product', authCheck, adminCheck, create);
router.get('/products:count', listAll);

// router.get('/testing', myMiddleware, (req, res) => {
//     res.json({
//         data: "you successfully tried middleware",
//     });
// });

module.exports = router;