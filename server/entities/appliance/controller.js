"use strict";

const Model               = require('./model');
const ControllerBase      = require('../base/controller');

class Appliance extends ControllerBase {

  constructor (db) {
    super('appliance');
    this.dao = new Model(db);
  }

}

module.exports = Appliance;
