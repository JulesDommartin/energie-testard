"use strict";

const mongoose    = require('mongoose');
const _           = require('underscore');
const BaseFields  = require('../BaseFields');

const fields = _.extend(_.clone(BaseFields), {
  houseId:        {type: mongoose.Schema.Types.ObjectId, required: true},
  applianceName:  {type: String, required: true},
  // applianceType:  {type: String, required: true}
});

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('appliance', schema);
};
