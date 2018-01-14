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