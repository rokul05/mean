
'use strict';

angular.module('customers').service('CustomerUtils', ['$uibModal', 'CustomersService', 'dialogs', '$state',
  function ($modal, customers, dialogs, $state) {

    var vm = this;

    vm.editCustomer = function($scope, selectedCustomer) {
      return $modal.open({
        templateUrl: 'modules/customers/client/views/modal-customer.client.view.html',

        controller: function ($scope, $uibModalInstance, customer) {
          $scope.customer = customer;
          console.log('Modal',$uibModalInstance);
          $scope.ok = function () {
            $uibModalInstance.close($scope.customer);
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
    };


    vm.update = function(selectedCustomer, $scope, dublicated) {
      var scope = $scope;
      if(!selectedCustomer) selectedCustomer = new customers();
      else if(dublicated) selectedCustomer._id = null; 
      console.log('DUBLICATED', selectedCustomer);
      var dlgCust = vm.editCustomer(scope, selectedCustomer);

      return (
        dlgCust.result.catch(function(res) {
          if (!(res === 'cancel' || res === 'escape key press')) {
            throw res;
          }
        }));
    };


    vm.deleteDealog = function(customer, customers) {
      var title = 'Delete Customer';
      var mes = 'Do you wish to delete the customer?';
      var opt = { yesLabel: 'Delete', noLabel: 'Cancel' };
      var dlg = dialogs.confirm(title, mes, opt);

      return (
        dlg.result.then(function(res) {
          if (customer) {
            customer.$remove();
            for (var i in customers) {
              if (customers[i] === customer) {
                customers.splice(i, 1);
                break;
              }
            }
          } else {
            customer.$remove(function () {
              $state.go('customers.list');
            });
          }
        }));
    };



  }]);

