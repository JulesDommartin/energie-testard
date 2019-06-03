const express = require('express');
const router = express.Router();


router.get('/populate', async function (req, res, next) {
    req.setTimeout(0);
    // todo populate mongo db
});
router.get('/drop', async function (req, res, next) {
    // todo drop mongo db
});

router.get('/all', function (req, res) {
    // todo print the number of docs (test route to know if database is populated
});

module.exports = router;
