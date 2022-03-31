require('dotenv').config();

const express = require('express');
const router = require('./app/routers');
const cors = require('cors');
const bodySanitizer = require('./app/middlewares/bodySanitizer');

const multer = require('multer');
const bodyParser = multer();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({origin: true}));

app.use(express.urlencoded({ extended: true }));

app.use(bodySanitizer);
app.use( bodyParser.none() );

app.use(express.static('assets'));

app.use(router);

app.listen(port, _ => {
    console.log(`http://localhost:${port}`);
});