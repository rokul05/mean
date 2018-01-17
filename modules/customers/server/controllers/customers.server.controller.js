'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



/**
 * Count of Customers
 */
exports.custCount = function(req, res) {
  Customer.count({}, function(err, customerCount) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var data = {};
      data.count = customerCount;
      res.jsonp(data);
    }
  });
};


/**
 * Create a Customer
 */
exports.create = function(req, res) {
  var customer = new Customer(req.body);
  customer.user = req.user;

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
/*
  // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = req.user && customer.user && customer.user._id.toString() === req.user._id.toString();

  res.jsonp(customer);*/
  res.jsonp(req.customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
  var customer = req.customer;

  customer = _.extend(customer, req.body);

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
  var customer = req.customer;
  console.log('delete ', customer);  
  customer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * List of Customers
 */
/*
exports.list = function(req, res) {
  Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};
*/

var tryParseObject = function(obj, option, defaultValue) {
  try {

    if (obj !== undefined && obj !== null && obj !== '' && obj.length > 2) {
      obj = JSON.parse(obj);
      var field, value;
      var objPars = {};
      if(option === 'search') {
        field = Object.keys(obj)[0];
        console.log('search - ',obj);
        console.log('option - ',option);
        console.log('field - ',field);
        if (field === '$') { //Global search (now by a Customer Name)
          // Full word text search (index text)
//          value = obj[Object.keys(obj)[0]];
//          objPars = { $text: { $search: value } };
          // RegExy search in one field
          value = new RegExp(obj[Object.keys(obj)[0]]);
          objPars = { surname: { $regex: value } };

          return objPars;
        }
        else if (field === 'channel') {
          value = new RegExp(obj[Object.keys(obj)[0]]);
          objPars = { channel: { $regex: value } };

          return objPars;
        }
        else
        {
          obj = obj[Object.keys(obj)[0]];
          field += '.' + Object.keys(obj)[0];
          value = obj[Object.keys(obj)[0]];
          if(value.length <= 0) return null;
        }
      }
      else { // Sort
        field = obj[Object.keys(obj)[0]]; // Get key: Object.keys(obj)[0];
        value = (obj[Object.keys(obj)[1]]===true) ? 1 : -1; // Get value
      }

      objPars[field] = value;        
      
      return objPars;
    }
  }
  catch(err) {
    console.error('Error parsing object: ' + obj, err);
  }

  return defaultValue;
};


exports.list = function(req, res) { 
  var start = parseInt(req.query.start) || 0;
  var number = parseInt(req.query.number) || 100;
  var sort = tryParseObject(req.query.sort, 'sort', { 'created':-1 });
  var total;
  var search = tryParseObject(req.query.search, 'search');
  //async: https://caolan.github.io/async/docs.html#filter
  //array - lodash: https://lodash.com/docs/4.16.4#findIndex
  async.waterfall([  
    // task1
    function(next) {
      Customer
      .find(search)
      .count(next);
    },
    // task2, receives result from task 1
    function(count, next) {
      total = count;
      //table.query({}, next); 
      Customer.find(search)
      .sort(sort)
      .skip(start)
      .limit(number)
      .exec(next);
    }], 
    function(err, customers) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.setHeader('start', start);
        res.setHeader('total', total);
        res.jsonp(customers);
      }
    });
};



/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).populate('user', 'displayName').exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};
