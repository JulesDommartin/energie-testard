const express = require('express');
const csv  = require('csv-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const moment = require('moment');
const fixturesPath = './fixtures/';
const mongoose = require('mongoose');
const houseController = require('../entities/house/controller');
const houseNesterController = require('../entities/houseNested/controller');
const applianceController = require('../entities/appliance/controller');
const applianceDataController = require('../entities/applianceData/controller');


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
                            // console.log("house id : " + house_id);
                            // console.log("house : " + houses_map.get(house_id));
                            // console.log("appliance name : " + key);
                            // console.log("appliance : " + appliance);
                            // console.log("");
                            if (appliance) {
                                appliance.data.push({
                                    time: time,
                                    value: data[key]
                                });
                                // console.log("appliance data", appliance.data);
                            } else {
                                // console.error("appliance does not exist");
                            }
                        }
                    });
                } else {
                    reject("No house associated");
                }
            })
            .on('end', () => {
                console.log("Finished " + house_id + " house!");
                resolve("Finished " + house_id + " house!");
            });
        } else {
            resolve("Not a necessary file.")
        }
    });
}

function insertNestedCollection(houses_map) {
    const promises = [];
    const ctrl = new houseNesterController(mongoose);
    houses_map.forEach((value, key, map) => {
        // todo remove that if
        if(key === 2000903) {
            console.log("Insert "+ value.name);
            promises.push(ctrl.insertPromise({
                name: Number(value.name),
                appliance : []
            }));
        }
    });
    Promise.all(promises).then(() => {
        console.log("finished");
    }).catch((err) => {
        console.log(err);
    })
}

function insertRelationalCollection(houses_map) {
    console.log("Insert relational collections");
    const promises = [];
    const houseCtrl = new houseController(mongoose);
    const applianceCtrl = new applianceController(mongoose);
    const applianceDataCtrl = new applianceDataController(mongoose);

    houses_map.forEach((value, key, map) => {
        if(key === 2000903) {
            console.log("Insert "+ value.name);
            const house = {
                name: value.name,
                appliances: value.appliances.map(appliance => appliance.name)
            };
            houseCtrl.insert(house, (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    const mongooseHouseId = res._id;
                    value.appliances.forEach(appliance => {
                        console.log("Inserting ", mongooseHouseId, appliance.name);
                        let relationalAppliance = {
                            houseId: mongooseHouseId,
                            applianceName: appliance.name,
                        };
                        promises.push(applianceCtrl.insertPromise(relationalAppliance));
                    });
                    console.log("Inserting all appliances");
                    Promise.all(promises).then(appliancesResult => {
                        console.log("Inserted appliances for house ", mongooseHouseId);
                        let promisesData = [];
                        let splittedAppliancesData = [];
                        appliancesResult.forEach((result, i) => {
                            // console.log(value.appliances[i]);
                            let size = 1000;
                            for (let index=0; index < value.appliances[i].data.length; index+=size) {
                                splittedAppliancesData.push(value.appliances[i].data.slice(index,index+size));
                            }
                            console.log(splittedAppliancesData.length);
                            splittedAppliancesData.forEach(arrayOfSplittedData => {
                                let promises = [];
                                arrayOfSplittedData.forEach(data => {
                                    if (data.value) {
                                        let applianceData = {
                                            applianceId: result._id,
                                            time: data.time,
                                            value: data.value
                                        };
                                        promises.push(applianceDataCtrl.insertPromise(applianceData));
                                    }
                                });
                                promisesData.push(promises);
                            });
                        });
                        console.log(promisesData.length);
                        this.execArrayOfArrayOfPromises(promisesData)
                        .then(() => {
                            console.log("finished");
                        }).catch((err) => {
                            console.log(err);
                        })
                    }).catch((err) => {
                        console.log("test");
                        console.log(err);
                        
                    })
                }
            })
        }
    });
}

function execArrayOfArrayOfPromises(promises) {
    console.log(promises.length);
    return new Promise((resolve,reject) => {
        if (promises.length) {
            let promiseArray = promises.pop();
            Promise.all(promiseArray)
            .then(() => {
                execArrayOfArrayOfPromises(promises)
                .then(() => {})
                .catch(reject)
            })
            .catch(reject);
        } else {
            resolve();
        }
    });
}

function insertHouseApplianceData(key, value) {
    return new Promise((resolve, reject) => {
        console.log("Insert "+ value.name);
        const promises = [];
        const house = {
            name: value.name,
            appliances: value.appliances.map(appliance => appliance.name)
        };
        houseCtrl.insert(house, (err, res) => {
            if (err) {
                console.error(err);
            } else {
                const mongooseHouseId = res._id;
                
            }
        })
    });
}

function insertApplianceData() {
    
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
                    name: appliance.id.toString(),
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
                        insertRelationalCollection(houses_map);
                        insertNestedCollection(houses_map);
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

router.get('/nested/all', function (req, res) {
    // todo print the number of docs (test route to know if database is populated
});

module.exports = router;
