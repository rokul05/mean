(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListIconController', CustomersListIconController);


  CustomersListIconController.$inject = ['$scope', '$state', 'CustomersService', '$modal', '$log'];

  function CustomersListIconController($scope, $state, customers, $modal, $log) {
//    var vm = this;

    $scope.customers = customers.query();

    $scope.modalUpdate = function (selectedCustomer) {
      var modalInstance = $modal.open({
        templateUrl: 'modules/customers/client/views/form-customer.client.view.html',
        controller: function ($scope, $modalInstance, customer) {
          $scope.customer = customer;

          $scope.ok = function () {
            $modalInstance.close($scope.customer);
   //         $scope.customers.push($scope.customer);

          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: 'lg',
        resolve: {
          customer: function () {
            return selectedCustomer;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;}, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

	  // Find a list of customer
 /*   $scope.find = function () {
      $scope.customers = customers.query();
      console.log('customers -', $scope.customers);
    };
*/
  }
}());
