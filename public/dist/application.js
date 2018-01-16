'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = [
    'ngResource',
    'ngAnimate',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'smart-table',
    'angularFileUpload',
    'ui.toggle'
  ];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('customers');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'CustomersService',
  function ($scope, Authentication, Customers) {
    // This provides Authentication context.
    $scope.authentication = Authentication;


    $scope.customersCount = Customers.countCustomers(function(data) {
      $scope.customersCount = data;
      $scope.alerts[0].total = $scope.customersCount.count;
      console.log('Virtual customers ', $scope.customersCount);
    });


    $scope.alerts = [
      {
        icon: 'glyphicon-user',
        colour: 'btn-success',
        total: $scope.customersCount.count,
        description: 'TOTAL CUSTOMERS'
      },
      {
        icon: 'glyphicon-calendar',
        colour: 'btn-primary',
        total: '8,382',
        description: 'UPCOMING EVENTS'
      },
      {
        icon: 'glyphicon-edit',
        colour: 'btn-success',
        total: '527',
        description: 'NEW CUSTOMERS IN 24H'
      },
      {
        icon: 'glyphicon-record',
        colour: 'btn-info',
        total: '85,000',
        description: 'EMAILS SENT'
      },
      {
        icon: 'glyphicon-eye-open',
        colour: 'btn-warning',
        total: '268',
        description: 'FOLLOW UP REQUIRED'
      },
      {
        icon: 'glyphicon-flag',
        colour: 'btn-danger',
        total: '348',
        description: 'REFERRALS TO MODERATE'
      }
    ];

  }
]);

(function() {
  'use strict';

  angular.module('core').directive('utDropdown', ['$timeout', 'Presets',
  function($timeout, presets) {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        ngChange: '&',
        options: '=',
        ngDisabled: '='
      },
      link: function($scope, element, attrs) {
        $scope.defaultLabel = attrs.defaultLabel;
               
        $scope.getDisplayedValue = function() {
    //      console.log('ngModel:', $scope.ngModel);
     //     console.log('options:', $scope.options);
/*
          var option = {};
          _.find($scope.options, { value: $scope.ngModel });
          if (option) {
            return option.label;
          }
*/
          for (var i=0; i<$scope.options.length; i++) {
            if ($scope.options[i].value === $scope.ngModel) {
              return $scope.options[i].label;
            }
          }          

          return $scope.defaultLabel || $scope.ngModel;
        };

        $scope.changeItem = function(value) {
          if (value !== $scope.ngModel) {
          //  if (value === 'divider') value = '';
            $scope.ngModel = value;
            $timeout(function() {
              $scope.ngChange();
            });
          }
        };
      },
      templateUrl: 'modules/core/client/templates/dropdown.directive.template.html'
    };
  }]);
})();
'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

(function () {
  'use strict';

  angular
    .module('core')
    .service('Presets', PresetsService);

  PresetsService.$inject = [/*'gettext'*/];

  function PresetsService(/*gettext*/) {

    var vm = {};

    vm.channels = [
      {
        label: 'Choose Channel',
        value: 'no'
      },     
      {
        value: false
      },     
      {
        label: 'Facebook',
        value: 'facebook'
      }, 
      {
        label: 'Twitter',
        value: 'twitter'
      }, 
      {
        label: 'Email',
        value: 'email'
      }
    ];

    vm.filterList = [
      {
        label: 'Facebook',
        value: 'facebook'
      }, 
      {
        label: 'Twitter',
        value: 'twitter'
      }, 
      {
        label: 'Email',
        value: 'email'
      },
      { 
        value: false
      }, 
      { 
        label: 'Show all',
        value: 'all'
      }
    ];


    return vm;

  }
})();

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

// Configuring the Customers module
angular.module('customers').run(['Menus',
  function (Menus) {
    // Add the customers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Customers',
      state: 'customers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'List Customers',
      state: 'customers.list'
    });

    // Add the dropdown icons list item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'List Customers (Icons)',
      state: 'customers.listicon'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'customers', {
      title: 'Create Customers',
      state: 'customers.create',
      roles: ['user']
    });
  }
]);

(function () {
  'use strict';

  angular
    .module('customers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('customers', {
        abstract: true,
        url: '/customers',
        template: '<ui-view/>'
      })
      .state('customers.list', {
        url: '',
        templateUrl: 'modules/customers/client/views/list-customers.client.view.html',
        controller: 'CustomersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customers List'
        }
      })
      .state('customers.listicon', {
        url: '',
        templateUrl: 'modules/customers/client/views/listicon-customers.client.view.html',
        controller: 'CustomersListIconController',
//        controllerAs: 'vm',
        data: {
          pageTitle: 'Customers List (Icons)'
        }
      })
      .state('customers.create', {
        url: '/create',
        templateUrl: 'modules/customers/client/views/form-customer.client.view.html',
        controller: 'CustomersController',
//        controllerAs: 'vm',
        resolve: {
          customerResolve: newCustomer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Customers Create'
        }
      })
      .state('customers.edit', {
        url: '/:customerId/edit',
        templateUrl: 'modules/customers/client/views/form-customer.client.view.html',
        controller: 'CustomersController',
//        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Customer {{ customerResolve.name }}'
        }
      })
      .state('customers.view', {
        url: '/:customerId',
        templateUrl: 'modules/customers/client/views/form-customer.client.view.html',
        controller: 'CustomersController',
//        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer
        },
        data: {
          pageTitle: 'Customer {{ customerResolve.name }}'
        }
      });
  }

  getCustomer.$inject = ['$stateParams', 'CustomersService'];

  function getCustomer($stateParams, CustomersService) {
    return CustomersService.get({
      customerId: $stateParams.customerId
    }).$promise;
  }

  newCustomer.$inject = ['CustomersService'];

  function newCustomer(CustomersService) {
    return new CustomersService();
  }
}());

(function () {
  'use strict';

  // Customers controller
  angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'CustomersService', 'Notify', 'Presets'];

  function CustomersController ($scope, $state, $stateParams, $location, Authentication, Customers, Notify, presets) {

    //var vm = this;
//    vm.customer = {};
//    vm.customer.firstName = 'sdfsd';
    $scope.authentication = Authentication;
    $scope.customers = Customers.query();
    $scope.presets = presets;

    
    $scope.changeChannel = function(){

    };


//    $scope.customers = angular.copy(Customers);

    // Create new customer
//    $scope.create = function (isValid) {
    $scope.create = function (isValid, listMode) {
      $scope.error = null;

      if($scope.customer._id) {
        return $scope.update(isValid);
      }
     
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'customerForm');

        return false;
      }
      // Create new customer object

      var customer = new Customers({
        firstName: this.customer.firstName,
        surname: this.customer.surname,
        suburb: this.customer.suburb,
        country: this.customer.country,
        industry: this.customer.industry,
        email: this.customer.email,
        phone: this.customer.phone,
        referred: this.customer.referred,
        channel: this.customer.channel
      });
      
      // Redirect after save
      customer.$save(function (response) {
        Notify.sendMsg('NewCustomer', { 'id': response._id });
        if(listMode === 'icon') {
          $state.go('customers.listicon');
        }
        else {
          $state.go('customers.list');
        }
        

        $scope.ok();
//        $location.path('customers/' + response._id);

        // Clear form fields
        $scope.customer.firstName = '';
        $scope.customer.surname = '';
        $scope.customer.suburb = '';
        $scope.customer.country = '';
        $scope.customer.industry = '';
        $scope.customer.email = '';
        $scope.customer.phone = '';
        $scope.customer.referred = '';
        $scope.customer.channel = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing customer
    $scope.remove = function (customer) {
      if (customer) {
        customer.$remove();

        for (var i in $scope.customers) {
          if ($scope.customers[i] === customer) {
            $scope.customers.splice(i, 1);
          }
        }
      } else {
        $scope.customer.$remove(function () {
          $location.path('customers');
        });
      }
    };

    // Update existing customer
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'customerForm');
        return false;
      }

      var customer = $scope.customer;

      customer.$update(function () {
        $scope.ok();
 //       $state.go('customers.listicon');
//        $location.path('customers/' + customer._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    $scope.close = function () {
      $scope.update('true');
    };


    // Find existing Article
    $scope.findOne = function () {
      $scope.customer = Customers.get({
        customerId: $stateParams.customerId
      });
    };

  }
}());

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
    ["$filter", function($filter) {
      return function(input, predicate) {
        var strict = true;
        if (predicate) { // some conditional if I want strict
          strict = true;
        }
        strict = false;
        return $filter('filter')(input, predicate, strict);
      };
    }]
  );

})();

(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListIconController', CustomersListIconController);


  CustomersListIconController.$inject = ['$scope', '$state', 'CustomersService', '$uibModal', '$log', 'CustomerModal'];

  function CustomersListIconController($scope, $state, customers, $modal, $log, customerModal) {
//    var vm = this;

    $scope.customers = customers.query();
    $scope.listMode = 'icon';

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


'use strict';
angular
.module('customers')
.directive('customerList',['CustomersService', 'Notify', function(customers, notify) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/customers/client/views/list-customer.template.html',
    link: function(scope, element, attr) {
      notify.getMsg('NewCustomer', function(event, data) {
        scope.customers = customers.query();
      });
    }
  };
}]);

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
        controller: ["$scope", "$modalInstance", "customer", function ($scope, $modalInstance, customer) {
          $scope.customer = customer;

          $scope.ok = function () {
            $modalInstance.close($scope.customer);
   //         $scope.customers.push($scope.customer);

          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        }],
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

// Customers service used to communicate Customers REST endpoints
(function () {
  'use strict';

  angular.module('customers')
    .factory('CustomersService', CustomersService);


  CustomersService.$inject = ['$resource'];

  function CustomersService($resource) {
    return $resource('api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      countCustomers: {
        method: 'GET',
        url: '/api/customers/custCount',
        isArray: false
      },
      query: {
        method: 'GET',
        url: 'api/customers?start=:start&number=:number&search=:search&sort=:sort&group&show',
        params: {
          start: '@start', 
          number: '@number',
          search: '@search',
          sort: '@sort'
        },
        isArray: true
      }
      
    });


  }

}());



// Customers service used to communicate Customers REST endpoints
(function () {
  'use strict';

  angular.module('customers').factory('Notify', Notify);

  Notify.$inject = ['$rootScope'];

  function Notify($rootScope) {
    var notify = [];
    
    notify.sendMsg = function(msg, data) {
      data = data || {};
      $rootScope.$emit(msg, data);
      console.log('message sent');
    };

    notify.getMsg = function(msg, func, scope) {
      var unbind = $rootScope.$on(msg, func);
      if(scope) {
        scope.$on('destroy', unbind);
      }
    };

    return notify;
  }

}());

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
