'use strict';
angular
.module('customers')
.directive('customerList',['CustomersService', 'Notify', function(customers, notify) {
  return {
    restrict: 'E',
//    transclude: true,
    templateUrl: 'modules/customers/client/views/list-customer.template.html',
    link: function(scope, element, attr) {
      notify.getMsg('NewCustomer', function(event, data) {
        scope.customers = customers.query();
      });
    }
  };
}]);
