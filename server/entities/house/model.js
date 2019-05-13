"use strict";

const mongoose    = require('mongoose');
const _           = require('underscore');
const BaseFields  = require('../BaseFields');

const fields = _.extend(_.clone(BaseFields), {
  name: {type: String, required: true},
  appliances: [String]
});

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('house', schema);
};
