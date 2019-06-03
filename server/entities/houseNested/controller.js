"use strict";

const Model               = require('./model');
const ControllerBase      = require('../base/controller');

class House extends ControllerBase {

  constructor (db) {
    super('house_nested');
    this.dao = new Model(db);
  }

}

module.exports = House;
