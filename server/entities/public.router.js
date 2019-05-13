'use strict';

var express = require('express');

class Router {

  constructor(db) {
    this.router = express.Router();
    this.init(db);
  }

  init(db) {

    let ApplianceData	  = require('./applianceData/routes');
    let House           = require('./house/routes');

    let applianceData 	= new ApplianceData(db);
    let house           = new House(db);

    this.router.use('/applianceDatas',  applianceData.router);
    this.router.use('/houses',          house.router);

  }

}

module.exports = Router;
