(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['$rootScope', '$scope', 'CustomersService', '$state', 'Presets', 'CustomerUtils', 'Menus'];

  function CustomersListController($rootScope, $scope, customers, $state, presets, customerUtils, menus){

  /*
    if (DesktopApplication.enabled) {
      $state.go('customers.desktop');
      return;
    }
  */

    var vm = this;
    $scope.customerForm = 'customerFormView';
    $scope.read = true;
    $scope.maxHeight = '90%';
    $scope.maxWidth = '90%';

    if($scope.customer) $scope.image = $scope.customer.image;
    $scope.presets = presets;

    vm.currentItem = 0;

    vm.firstName = 'George';
    vm.state = 'none';

    vm.onClick = function() {
      vm.firstName = 'Stacy';
    };

    vm.onMouseEnter = function() {
      vm.state = 'mouse in';
      vm.firstName = 'Nick';
    };

    vm.onMouseLeave = function() {
      vm.state = 'mouse out';
      vm.firstName = 'Micle';
    };   


    
    vm.filterList = presets.filterList;

    vm.filter = 'all';
    $scope.listMode = 'list';


    if($state.current.name === 'customers.create') {
      vm.update();
      $state.go('customers.list');
      menus.removeSubMenuItem('topbar', 'customers.create');
 //     console.log('menu - ', menus.getMenu('topbar'));
    }

    vm.setFilter = function(index){
      vm.filter = vm.filterList[index].value;
      vm.searchValue = null;
      if(vm.filter !== 'all')//channel
        $scope.tableState.search.predicateObject = { 'channel': vm.filterList[index].value };
      else
        $scope.tableState.search.predicateObject = { '$':'' };
      vm.getPageCustomers();
    };
  //  console.log('state - ',$state.current.name);


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
//      console.debug('itemsPerPage - '+ vm.itemsPerPage);
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
      if (tableState === undefined) {
        return;
      }
      if (vm.isLoading) {
        return;
      }

      vm.isLoading = true;

      var start = tableState.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = tableState.pagination.number || 10;  // Number of entries showed per page.
      var sort = JSON.stringify(tableState.sort);
      var search = JSON.stringify(tableState.search.predicateObject);
      //console.log('Search',JSON.stringify(tableState.search.predicateObject));
 
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
//          console.log("ITEM", vm.currentItem);
          if (items.length > 0) {
            vm.select(vm.customers[vm.currentItem], vm.currentItem);
          }
        }
        vm.isLoading = false;
      });
    };

    vm.isSelected = function(item) {
      return (vm.currentItem === item);
    };

/*    vm.isSelected = function(customer) {
      return (customer._id === $state.params.customerId);
    };
*/
    vm.select = function(customer, index) {
      if(customer) {
        vm.currentItem = index;
        $scope.customer = customer;
        $scope.image = $scope.customer.image;

 //       localStorageService.set('currentItem',index);
   //     $state.go('customers.list.view', { customerId: customer._id });
      }
    };


    vm.update = function(selectedCustomer) {
      customerUtils.update(selectedCustomer, $scope).then(function() {
        vm.getPageCustomers();
      });
    };


    vm.duplicate = function(selectedCustomer) {
      var res = customerUtils.update(selectedCustomer, $scope, true).then(function() {
        if(res) {
          vm.currentItem ++;
          vm.getPageCustomers();
        }
      });
    };

/*
    vm.edit = function(customer, index, $event) {
      vm.currentItem = index;
//      localStorageService.set('currentItem',index);
      $state.go('customers.edit', { customerId: customer._id });
      $event.stopImmediatePropagation();
    };
*/
    vm.delete = function(customer) {
      var res = customerUtils.deleteDealog(customer, vm.customers).then(function() {
        if(res) {
          vm.currentItem = (vm.currentItem > 0) ? vm.currentItem-- : 0;
          vm.getPageCustomers();
        }
      });
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
