
const express = require('express');
const path = require('path');

const listRouter = require('./listRouter');
const cardRouter = require('./cardRouter');
const tagRouter = require('./tagRouter');
const errorController = require('../controllers/errorController');

const router = express.Router();

router.get('/', (req, res) => {
    const indexFilePath = path.join(__dirname, '../index.html');
    res.sendFile(indexFilePath);
});


router.use('/lists', listRouter);

router.use('/cards', cardRouter);
router.use('/tags', tagRouter);

router.use(errorController.error);

router.use(errorController.notFound);

module.exports = router;