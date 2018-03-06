(function () {
  'use strict';

  angular
    .module('customers')
    .service('CustomerModal', CustomerModalServise);

  CustomerModalServise.$inject = ['$uibModal', 'CustomersService'];

  function CustomerModalServise($modal, Customers) {
    var vm = this;

    vm.editCustomer = function($scope, selectedCustomer) {


      return $modal.open({
 
        templateUrl: 'modules/customers/client/views/form-customer.client.view.html',
        controller: function ($scope, $uibModalInstance, customer) {
          $scope.customer = customer;
          console.log('Modal',$uibModalInstance);
    
          $scope.ok = function () {
            $uibModalInstance.close($scope.customer);
   //         $scope.customers.push($scope.customer);

          };

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: 'lg',

        resolve: {
          customer: function () {
            return selectedCustomer;
          }
        }
      });

   
/*      var modalInstance = $modal.open({
 
        templateUrl: 'modules/customers/client/views/form-customer.client.view.html',
        controller: function ($scope, $uibmodalInstance, customer) {
          $scope.customer = customer;

          $scope.ok = function () {
            $uibmodalInstance.close($scope.customer);
   //         $scope.customers.push($scope.customer);

          };

          $scope.cancel = function () {
            $uibmodalInstance.dismiss('cancel');
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
        //$scope.customers = Customers.query();
        //console.log('customer', $scope.customers);
        $scope.selected = selectedItem;}, function () {
 //       $log.info('Modal dismissed at: ' + new Date());
      });

      */
    };
  


  }
})();
