const express = require('express');
const csv  = require('csv-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const moment = require('moment');
const fixturesPath = './fixtures/';


readFile = (file, houses_map) => {
    return new Promise((resolve, reject) => {
        if(file.indexOf('values') > -1) {
            const house_id = parseInt(file.split('-')[0]);
            console.log("Reading data from " + house_id + ".values file");
            fs.createReadStream(fixturesPath + file)
            .pipe(csv())
            .on('data', (data) => {
                if(houses_map.has(house_id)) {
                    let time = null;
                    Object.keys(data).forEach(key => {
                        if (key === 'Time') {
                            time = data[key];
                        } else {
                            let appliance = houses_map.get(house_id).appliances.find(app => app.name === key);
                            console.log("house id : " + house_id);
                            console.log("house : " + houses_map.get(house_id));
                            console.log("appliance name : " + key);
                            console.log("appliance : " + appliance);
                            console.log("");
                            if (appliance) {
                                appliance.data.push({
                                    time: time,
                                    value: data[key]
                                });
                                console.log("appliance data", appliance.data);
                            } else {
                                console.error("appliance does not exist");
                            }
                        }
                    });
                } else {
                    reject("No house associated");
                }
            })
            .on('end', () => {
                resolve("Finished " + house_id + " house!");
            });
        }
    });
}

router.get('/populate', async function (req, res, next) {
    req.setTimeout(0);
    const houses_map = new Map();
    fs.readFile(fixturesPath + 'appliances.json', null, (err ,res) => {
        if (err) {
            console.error(err);
        } else {
            const appliancesData = JSON.parse(res);
            appliancesData.forEach(appliance => {
                let appliancesArray = [];
                appliance.appliances.forEach(appName => {
                    appliancesArray.push({
                        name: appName,
                        data: []
                    });
                });
                houses_map.set(appliance.id, {
                    name: appliance.id,
                    appliances: appliancesArray
                });
            });
            fs.readdir(fixturesPath, (err, files) => {
                if(err) {
                    res.status(500).send({error : 'csv files was not find'})
                } else {
                    let promises = [];                    
                    files.forEach((f) => {
                        promises.push(readFile(f, houses_map));
                    });
                    Promise.all(promises)
                    .then(results => {
                        console.log(results);
                    })
                    .catch(err => {
                        console.error(err);
                    })
                }
            })
        }
    });
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
