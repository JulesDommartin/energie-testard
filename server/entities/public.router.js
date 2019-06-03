'use strict';

var express = require('express');

class Router {

  constructor(db) {
    this.router = express.Router();
    this.init(db);
  }

  init(db) {

    let Appliance       = require('./appliance/routes');
    let ApplianceData	  = require('./applianceData/routes');
    let House           = require('./house/routes');

    let appliance       = new Appliance(db);
    let applianceData 	= new ApplianceData(db);
    let house           = new House(db);

    this.router.use('/appliances',      appliance.router);
    this.router.use('/applianceDatas',  applianceData.router);
    this.router.use('/houses',          house.router);

  }

}

module.exports = Router;
