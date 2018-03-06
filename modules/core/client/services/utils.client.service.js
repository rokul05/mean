'use strict';

var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

// Utility functions ervice
angular.module('core').service('utils', [ '$timeout', '$filter'/*, 'gettextCatalog', 'desktopMode'*/,
  function($timeout, $filter /*, gettextCatalog, desktopMode*/) {
    var self = this;

    this.convertDateStringsToDates = function(input) {
      // Ignore things that aren't objects.
      if (typeof input !== 'object') return input;

      for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if (typeof value === 'string' && (match = value.match(regexIso8601))) {
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if (typeof value === 'object') {
          // Recurse into object
          self.convertDateStringsToDates(value);
        }
      }
    };

    this.getDate = function(input, format) {
      var res = $filter('date')(input, format);
      return res;
    };


  }]);
