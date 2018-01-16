(function () {
  'use strict';

  angular
    .module('customers')
    .service('CustomerModal', CustomerModalServise);

  CustomerModalServise.$inject = ['$uibModal'];

  function CustomerModalServise($modal) {
    var vm = this;

    vm.editCustomer = function($scope, selectedCustomer) {
   

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
 //       $log.info('Modal dismissed at: ' + new Date());
      });
    };
  


  }
})();
