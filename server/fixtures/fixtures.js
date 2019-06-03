const express = require('express');
const csv  = require('csv-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();


router.get('/populate', async function (req, res, next) {
    req.setTimeout(0);
    const path = './fixtures/';
    fs.readdir(path, (err, files) => {
        if(err) {
            res.status(500).send({error : 'csv files was not find'})
        } else {
            const houses_map = new Map();
            const appliances = new Map();
            files.forEach((f) => {
                if(f.indexOf('values') > -1) {
                    const house_id = f.split('-')[0];
                    fs.createReadStream(path + f)
                        .pipe(csv())
                        .on('data', (data) => {
                            if(houses_map.has(house_id)) {
                                houses_map.get(house_id).push(data)
                            } else {
                                houses_map.set(house_id, new Array(data))
                            }
                        })
                        .on('end', () => {
                            // houses_map.forEach((value, key, map) => {
                            //     console.log(key);
                            //     console.log(value);
                            // })
                        })
                }
                if(f.indexOf('appliances') > -1) {
                    fs.createReadStream(path + f)
                        .pipe(csv())
                        .on('data', (data) => {
                            console.log(data);
                        })
                        .on('end', () => {
                            console.log('finished');

                        })
                }
            })
        }
    })
});
router.get('/drop', async function (req, res, next) {
    // todo drop mongo db
});

router.get('/all', function (req, res) {
    // todo print the number of docs (test route to know if database is populated
});


router.get('/nested/populate', async function (req, res, next) {
    req.setTimeout(0);

    // todo populate mongo db
});
router.get('/nested/drop', async function (req, res, next) {
    // todo drop mongo db
});

router.get('/nested/all', function (req, res) {
    // todo print the number of docs (test route to know if database is populated
});

module.exports = router;
