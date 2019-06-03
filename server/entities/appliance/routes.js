'use strict';

const Controller          = require('./controller');
const RouteBase           = require('../base/routes');

class Appliance extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl               = new Controller(db);
  }

}

module.exports = Appliance;
