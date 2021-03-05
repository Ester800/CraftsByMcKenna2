const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const { 
    create, 
    read, 
    update, 
    remove, 
    list 
} = require('../controllers/subCategory');

// const myMiddleware = (req, res, next) => {
//     console.log('IM A MIDDLEWARE YAY!');
//     next()
// }

router.post('/subCategory', authCheck, adminCheck, create);
router.get('/subCategories', list);
router.get('/subCategory/:slug', read);
router.put('/subCategory/:slug', authCheck, adminCheck, update);
router.delete('/subCategory/:slug', authCheck, adminCheck, remove);

// router.get('/testing', myMiddleware, (req, res) => {
//     res.json({
//         data: "you successfully tried middleware",
//     });
// });

module.exports = router;