'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  firstName: {
    type: String,
    default: '',
    trim: true
  },
  surname: {
    type: String,
    default: '',
    trim: true
  },
  suburb: {
    type: String,
    default: '',
    trim: true
  },
  country: {
    type: String,
    default: '',
    trim: true
  },
  industry: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  referred: {
    type: Boolean,
    default: false
  },
  channel: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


//CustomerSchema.pre('save', function(next) {
 // this.image.data = '';
 // console.log('PRESAVE', this);
//  next();
//});

mongoose.model('Customer', CustomerSchema);
