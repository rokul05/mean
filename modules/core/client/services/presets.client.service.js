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
        value: ''
      },     
      {
        label: '',
        value: 'divider'
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


/*
    vm.pageSides = [
      {
        label: gettext('Front'),
        value: 'front'
      }, 
      {
        label: gettext('Back'),
        value: 'back'
      }
    ];


    vm.trimPageSizes = [
      { label: gettext('US_Letter 8.5 11 Inch'), 
        value: {
          width: units.create(8.5, 'in'),
          height: units.create(11, 'in')        
        }
      },
      { label: gettext('A4 210 297 mm'), 
        value: {
          width: units.create(210, 'mm'),
          height: units.create(297, 'mm')        
        }
      },
    ];

    vm.pressTypes = [
      { label: gettext('Sheet-fed'),
        value: 'sheetFed'
      },
      { label: gettext('Fractional Webs'),
        value: 'web'
      }      
    ];
*/


    return vm;

  }
})();
