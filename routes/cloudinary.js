const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controllers
const { upload, remove} = require('../controllers/cloudinary');

// routes  -- not camelcase because it's a URL! -- notice plural for posts and singular for remove --
router.post('/uploadimages', authCheck, adminCheck, upload);
router.post('/removeimage', authCheck, adminCheck, remove);

module.exports = router;