(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListIconController', CustomersListIconController);


  CustomersListIconController.$inject = ['$scope', '$state', 'CustomersService', '$uibModal', '$log', 'CustomerModal'];

  function CustomersListIconController($scope, $state, customers, $modal, $log, customerModal) {
//    var vm = this;

    $scope.customers = customers.query();

    $scope.modalUpdate = function(selectedCustomer) {
      var scope = $scope;
      customerModal.editCustomer(scope, selectedCustomer);
    };


    
    
/*
	  // Find a list of customer
    $scope.find = function () {
      $scope.customers = customers.query();
      console.log('customers -', $scope.customers);
    };
*/
  }
}());
