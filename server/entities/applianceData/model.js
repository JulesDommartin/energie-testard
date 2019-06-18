"use strict";

const mongoose    = require('mongoose');
const _           = require('underscore');
const BaseFields  = require('../BaseFields');

const fields = _.extend(_.clone(BaseFields), {
  applianceId:    {type: mongoose.Schema.Types.ObjectId, required: true},
  time:           {type: String, required: true},
  value:          {type: Number, required: true}
});

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('applianceData', schema);
};
