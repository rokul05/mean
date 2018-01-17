'use strict';

// Configuring the Customers module
angular.module('customers').run(['Menus',
  function (Menus) {
    // Add the customers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Customers',
      state: 'customers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'List Customers',
      state: 'customers.list',
      roles: ['*']
    });

    // Add the dropdown icons list item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'List Customers (Icons)',
      state: 'customers.listicon',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'Create Customer',
      state: 'customers.create',
      roles: ['user']
    });
  }
]);
