"use strict";

const Model               = require('./model');
const ControllerBase      = require('../base/controller');

class ApplianceData extends ControllerBase {

  constructor (db) {
    super('applianceData');
    this.dao = new Model(db);
  }

}

module.exports = ApplianceData;
