const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const { 
    create, 
    listAll, 
    remove, 
    read, 
    update, 
    list, 
    productsCount,
    productStar, 
    listRelated,
    searchFilters,
    } = require('../controllers/product');

// const myMiddleware = (req, res, next) => {
//     console.log('IM A MIDDLEWARE YAY!');
//     next()
// }

router.post('/product', authCheck, adminCheck, create);
router.get('/products/total', productsCount);
router.get('/products/:count', listAll);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, adminCheck, update);
router.post('/products', list);

// rating
router.put('/product/star/:productId', authCheck, productStar);

// related
router.get('/product/related/:productId', listRelated);

// search  -one endpoint that is flexible to handle any search: price, brand, text, star rating etc...
router.post('/search/filters', searchFilters);


// router.get('/testing', myMiddleware, (req, res) => {
//     res.json({
//         data: "you successfully tried middleware",
//     });
// });

module.exports = router;