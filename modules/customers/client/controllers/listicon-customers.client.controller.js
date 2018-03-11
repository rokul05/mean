(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListIconController', CustomersListIconController);


  CustomersListIconController.$inject = ['$scope', '$state', 'CustomersService', '$uibModal', 'CustomerUtils'];

  function CustomersListIconController($scope, $state, customers, $modal, customerUtils) {

    var vm = this;
    vm.customer = {
      firstName: '',
      surname: ''
    }; 
    $scope.listMode = 'icon';

    var result = customers.query(function() {
      if(result) {
        vm.customers = result;
      }
    });
   

    vm.update = function(selectedCustomer) {
      customerUtils.update(selectedCustomer, $scope).then(function() {
      });
    };

    vm.duplicate = function(selectedCustomer) {
      customerUtils.update(selectedCustomer, $scope, true).then(function() {
      });
    };

    vm.delete = function(customer) {
      customerUtils.deleteDealog(customer, vm.customers).then(function(res) {
      });
    };

    

  }
}());
