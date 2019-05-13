'use strict';

const Controller          = require('./controller');
const RouteBase           = require('../base/routes');

class ApplianceData extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl               = new Controller(db);
  }

}

module.exports = ApplianceData;
