'use strict';

angular.module('core').directive('utUpload', ['$parse',
  function($parse) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var parsedFile = $parse(attrs.utUpload);
        var parsedFileSetter = parsedFile.assign;
        var reader = new FileReader();
        reader.onload = function (e) {
          $scope.image = e.target.result;
          $scope.$apply();
          console.log('image src', $scope.image);
        };

        element.on('change', function() {
          reader.readAsDataURL(element[0].files[0]);
          $scope.$apply(function() {
            parsedFileSetter($scope, element[0].files[0]);
          });

        });

      }
    };

  }]);