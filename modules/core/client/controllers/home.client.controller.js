'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'CustomersService', '$state',
  function ($scope, Authentication, Customers, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;


    $scope.customersCount = Customers.countCustomers(function(data) {
      $scope.customersCount = data;
      $scope.alerts[0].total = $scope.customersCount.count;
      console.log('Virtual customers ', $scope.customersCount);
    });

    $scope.selectTool = function(button) {
      if(button === 'totalCustomers') {
        $state.go('customers.listicon');
      }
    };

    $scope.alerts = [
      {
        icon: 'glyphicon-user',
        button: 'totalCustomers',
        colour: 'btn-success',
        total: $scope.customersCount.count,
        description: 'TOTAL CUSTOMERS'
      },
      {
        icon: 'glyphicon-calendar',
        button: '',
        colour: 'btn-primary',
        total: '8,382',
        description: 'UPCOMING EVENTS'
      },
      {
        icon: 'glyphicon-edit',
        button: '',
        colour: 'btn-success',
        total: '527',
        description: 'NEW CUSTOMERS IN 24H'
      },
      {
        icon: 'glyphicon-record',
        button: '',
        colour: 'btn-info',
        total: '85,000',
        description: 'EMAILS SENT'
      },
      {
        icon: 'glyphicon-eye-open',
        button: '',
        colour: 'btn-warning',
        total: '268',
        description: 'FOLLOW UP REQUIRED'
      },
      {
        icon: 'glyphicon-flag',
        button: '',
        colour: 'btn-danger',
        total: '348',
        description: 'REFERRALS TO MODERATE'
      }
    ];



  }
]);
