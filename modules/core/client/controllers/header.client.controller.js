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
/*
    $scope.exitApp = function() {
      DesktopApplication.closeApplication();
    };
*/
    $scope.getMenuTitle = function(item) {
      var menuText = item.title;
      var shortcutKeyIndex = menuText.indexOf('\tCtrl');
      if (shortcutKeyIndex !== -1) {
        menuText = menuText.substring(0, shortcutKeyIndex);
      }
      return menuText;
    };

  }
]);
