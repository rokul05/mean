(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListIconController', CustomersListIconController);


  CustomersListIconController.$inject = ['$scope', '$state', 'CustomersService', '$uibModal', '$log', 'CustomerModal'];

  function CustomersListIconController($scope, $state, customers, $modal, $log, customerModal) {

    var vm = this;
    vm.customer = {
      firstName: '',
      surname: ''
    }; 

    var result = customers.query(function() {
      if(result) {
        vm.customers = result;
      //  vm.customer = vm.customers[0];
      }
    });


    
    $scope.listMode = 'icon';

    $scope.modalUpdate = function(selectedCustomer) {
      var scope = $scope;
      customerModal.editCustomer(scope, selectedCustomer);
    };


    vm.firstName = 'George';
    vm.state = 'none';

    vm.onClick = function() {
      vm.firstName = 'Stacy';
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
