/* eslint-disable linebreak-style */
const router = require('express').Router();

const rubricRoute = require('./routes/RubricRoute');


router.use('/app', rubricRoute);

module.exports = router;
