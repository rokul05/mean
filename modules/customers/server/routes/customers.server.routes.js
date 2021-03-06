'use strict';

/**
 * Module dependencies
 */
var customersPolicy = require('../policies/customers.server.policy'),
  customers = require('../controllers/customers.server.controller');

module.exports = function(app) {
  // Customers Routes
  app.route('/api/customers').all(customersPolicy.isAllowed)
    .get(customers.list)
    .post(customers.create);

  app.route('/api/customers/custCount').all()
    .get(customers.custCount);

  app.route('/api/customers/saveFile').all()
    .post(customers.saveFile);

  app.route('/api/customers/:customerId').all(customersPolicy.isAllowed)
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);
  // Finish by binding the Customer middleware
  app.param('customerId', customers.customerByID);
};
/*
  app.route('/api/customers/saveFile').all()
    .get(customers.saveFile);

  app.route('/api/customers/fileLoad').all()
    .get(customers.fileLoad);
*/