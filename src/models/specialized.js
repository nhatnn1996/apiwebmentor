"use strict"
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const SpecializedSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: false,
  },
  trash: {
    type: Boolean,
    default: false
  }
});
module.exports = mongoose.model('Specialized', SpecializedSchema);