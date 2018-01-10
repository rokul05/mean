// Customers service used to communicate Customers REST endpoints
(function () {
  'use strict';

  angular.module('customers')
    .factory('CustomersService', CustomersService);


  CustomersService.$inject = ['$resource'];

  function CustomersService($resource) {
    return $resource('api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      countCustomers: {
        method: 'GET',
        url: '/api/customers/custCount',
        isArray: false
      },
      query: {
        method: 'GET',
        url: 'api/customers?start=:start&number=:number&search=:search&sort=:sort&group&show',
        params: {
          start: '@start', 
          number: '@number',
          search: '@search',
          sort: '@sort'
        },
        isArray: true
      }
      
    });


  }

}());


