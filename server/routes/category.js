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
    list,
    getSubs, 
} = require('../controllers/category');

// const myMiddleware = (req, res, next) => {
//     console.log('IM A MIDDLEWARE YAY!');
//     next()
// }

router.post('/category', authCheck, adminCheck, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.put('/category/:slug', authCheck, adminCheck, update);
router.delete('/category/:slug', authCheck, adminCheck, remove);
router.get('/category/subs/:_id', getSubs);

// router.get('/testing', myMiddleware, (req, res) => {
//     res.json({
//         data: "you successfully tried middleware",
//     });
// });

module.exports = router;