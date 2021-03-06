"use strict";

const mongoose    = require('mongoose');
const _           = require('underscore');
const BaseFields  = require('../BaseFields');

const fields = _.extend(_.clone(BaseFields), {
  name: {type: String, required: true},
  appliances: [{
    name : String,
    data : [{
      date : String,
      value : Number,
    }]
  }]
});

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('house_nested', schema);
};
