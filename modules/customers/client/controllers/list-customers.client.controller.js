(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['$rootScope', '$scope', 'CustomersService', '$state', 'Presets', 'CustomerModal'];

  function CustomersListController($rootScope, $scope, customers, $state, presets, customerModal){

  /*
    if (DesktopApplication.enabled) {
      $state.go('customers.desktop');
      return;
    }
  */
    var vm = this;

    vm.filterList = presets.filterList;

    vm.filter = 'all';
    $scope.listMode = 'list';

    vm.modalUpdate = function(selectedCustomer) {
      var scope = $scope;
      customerModal.editCustomer(scope, selectedCustomer);
    };

    vm.setFilter = function(index){
      vm.filter = vm.filterList[index].value;
      vm.searchValue = null;
      if(vm.filter !== 'all')//channel
        $scope.tableState.search.predicateObject = { 'channel': vm.filterList[index].value };
      else
        $scope.tableState.search.predicateObject = { '$':'' };
      vm.getPageCustomers();
    };
    console.log('vm - ',vm);

    vm.searchValue = null;
    vm.search = function(){
      console.log('input - ',vm.searchValue);
//      if((input === 'text' && vm.searchValue.length === 0) || input === 'button') {
      vm.filter = 'all';
      $scope.tableState.search.predicateObject = { '$':vm.searchValue };
      vm.getPageCustomers();
 //     }
    };

    vm.currentItem = 0;
   // $scope.page = 1;
    vm.pageSizes = [5,10,25,50];

    vm.setItemsPerPage = function(itemsPage) {
      vm.itemsPerPage = itemsPage;
//      localStorageService.set('itemsPerPage',itemsPage);
      console.debug('itemsPerPage - '+ vm.itemsPerPage);
    };

    //Local Storage Service
/*
    var stgItemsPerPage = localStorageService.get('itemsPerPage');
    if(stgItemsPerPage > 0)
      vm.setItemsPerPage(stgItemsPerPage);
    else
      vm.setItemsPerPage(vm.pageSizes[0]);    
*/
    vm.setItemsPerPage(vm.pageSizes[0]);    

    vm.isLoading = false;

    vm.getPageCustomers = function(tableState) {
      if (tableState === undefined) {
        tableState = $scope.tableState;
      } else {
        $scope.tableState = tableState;
      }
      // Change setting of combobox - Items per Page 
      if(tableState.pagination.number !== vm.itemsPerPage)
        tableState.pagination.start = 0;

      tableState.pagination.number = vm.itemsPerPage;
      vm.setItemsPerPage(vm.itemsPerPage);
      //console.debug('Call server', tableState);
      if (tableState === undefined) {
        console.log('nothing to do');
        return;
      }
      if (vm.isLoading) {
        console.log('skipping');
        return;
      }

      vm.isLoading = true;

      var start = tableState.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = tableState.pagination.number || 10;  // Number of entries showed per page.
      var sort = JSON.stringify(tableState.sort);
      var search = JSON.stringify(tableState.search.predicateObject);
      console.log('Search',JSON.stringify(tableState.search.predicateObject));
 
      var items = customers.query({ start: start, number: number, search: search, sort:sort }, function(data, responseHeaders) {
        
        var total = parseInt(responseHeaders('total'));
        vm.totalCount = total;
// vm.currentItem = localStorageService.get('currentItem');

        tableState.pagination = {
          start: start,
          number: number,
          numberOfPages: Math.ceil(total / vm.itemsPerPage) //set the number of pages so the pagination can update
        };
        if(items) {
          vm.customers = items;
          if(vm.currentItem >= items.length) {
            vm.currentItem = 0;
          }

          if (items.length > 0) {
            vm.select(vm.customers[vm.currentItem],vm.currentItem);
          }
        }
        
        vm.isLoading = false;
        
        console.log('tableState', $scope.tableState);
        console.log('done loading');
      });
    };

    vm.isSelected = function(customer) {
      return (customer._id === $state.params.customerId);
    };

    vm.select = function(customer, index) {
      if(customer) {
        vm.currentItem = index;
 //       localStorageService.set('currentItem',index);
   //     $state.go('customers.list.view', { customerId: customer._id });
      }
    };

    vm.edit = function(customer, index, $event) {
      console.log('edit ', customer._id);
      //console.log($event);
      vm.currentItem = index;
//      localStorageService.set('currentItem',index);
      $state.go('customers.edit', { customerId: customer._id });
      $event.stopImmediatePropagation();
    };


    vm.delete = function(customer) {
 
      var title = 'Delete Template';
      var mes = 'Do you wish to delete the customer?';

//      var dlg = dialogs.confirm(title, mes,
//        {
//          yesLabel: 'Delete',
//          noLabel: 'Cancel'
//        });
//      dlg.result.then(function(/*reason*/) {
/*        if (customer) {
          var i;
          for (i in vm.customers) {
            if (vm.customers[i] === customer) {
              vm.customers.splice(i, 1);
              customers.remove(template._id);
              if(i >= vm.customers.length)
                i--; 
              break;
            }
          }
          if(vm.customers.length > 0) {
            $state.go('customers.list.view', {
              customersId: vm.customers[i]._id
            });
          }
        }
      });*/
    };

    // Diagnostics...

    $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      console.log('state change success', toState.name);
    });

    $rootScope.$on('$stateChangeError',
    function(event, toState, toParams, fromState, fromParams, error){
      console.log('state change error', toState.name, error);
    });

    // somewhere else
    $scope.$on('$stateNotFound',
    function(event, unfoundState, fromState, fromParams){
      console.log(unfoundState.to); // "lazy.state"
      console.log(unfoundState.toParams); // {a:1, b:2}
      console.log(unfoundState.options); // {inherit:false} + default options
    });
  }

  angular.module('customers').filter('statusFilter',
    function($filter) {
      return function(input, predicate) {
        var strict = true;
        if (predicate) { // some conditional if I want strict
          strict = true;
        }
        strict = false;
        return $filter('filter')(input, predicate, strict);
      };
    }
  );

})();
